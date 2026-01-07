import { useAuthStore } from '@/stores/auth'
import { ofetch, type FetchOptions } from 'ofetch'

// 用于标记是否正在刷新 token
let isRefreshing = false
// 用于存储等待刷新完成的请求
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

// 用于存储每个 URL 的 Etag 值
const etagCache = new Map<string, string>()
// 用于存储每个 URL 的缓存响应数据（用于 304 响应）
const responseCache = new Map<string, any>()

// 处理等待队列中的请求
const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// 获取请求的唯一标识（URL + 查询参数）
const getRequestKey = (url: string, options?: any): string => {
  if (!url) return ''

  // 如果 URL 中已经有查询参数，直接返回
  if (url.includes('?')) {
    return url
  }

  // 处理查询参数
  const params = options?.query || options?.params
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString()
    return `${url}?${queryString}`
  }

  return url
}

// 创建 ofetch 实例
const $fetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  credentials: 'include', // 等同于 withCredentials: true
  headers: {
    'Content-Type': 'application/json'
  },
  // 请求拦截器
  onRequest({ request, options }) {
    const authStore = useAuthStore()
    const url = typeof request === 'string' ? request : request.url

    // 如果是刷新 token 的请求，跳过添加 Authorization header，使用 Cookie
    if (url.includes('/v1/identity/auth/refresh')) {
      return
    }

    // 确保 headers 是 Headers 对象
    const headers = new Headers(options.headers as HeadersInit)

    // 添加 Authorization header
    if (authStore.token) {
      headers.set('Authorization', `Bearer ${authStore.token}`)
    }

    // 为 GET 请求添加 If-None-Match 请求头（支持 Etag 缓存）
    if (options.method?.toUpperCase() === 'GET' || !options.method) {
      const requestKey = getRequestKey(url, options)
      if (requestKey) {
        const etag = etagCache.get(requestKey)
        if (etag) {
          headers.set('If-None-Match', etag)
        }
      }
    }

    // 更新 options.headers
    options.headers = headers
  },
  // 响应拦截器
  onResponse({ response, request, options }) {
    const url = typeof request === 'string' ? request : request.url
    const requestKey = getRequestKey(url, options)
    const method = (options.method?.toUpperCase() || 'GET')

    // 处理 304 Not Modified 响应
    if (response.status === 304) {
      // 从缓存中返回之前的数据，修改 response._data
      const cachedData = responseCache.get(requestKey)
      if (cachedData) {
        response._data = cachedData
        return
      }
    }

    // 保存 Etag（仅对 GET 请求）
    if (method === 'GET' && response.headers.get('etag') && requestKey) {
      const etag = response.headers.get('etag')
      if (etag) {
        etagCache.set(requestKey, etag)
      }
    }

    const data = response._data
    // 检查基础响应状态
    if (!data?.base_resp) {
      const error = new Error('响应格式错误：缺少 base_resp')
      error.name = 'APIError'
      throw error
    }

    if (data.base_resp.code === 0) {
      // 缓存响应数据（仅对 GET 请求）
      if (method === 'GET' && requestKey) {
        responseCache.set(requestKey, data)
      }
      // ofetch 会自动返回 response._data，无需显式 return
      return
    }

    // 如果有错误，抛出错误
    const errorMessage = data.base_resp.message || `请求失败 (code: ${data.base_resp.code})`
    const error = new Error(errorMessage)
    error.name = 'APIError'
    throw error
  },
  // 响应错误拦截器
  async onResponseError({ response, request, options }) {
    const url = typeof request === 'string' ? request : request.url
    // 使用 options 对象存储重试标记
    const originalRequest = options as FetchOptions & { _retry?: boolean }

    // 处理401未授权错误
    if (response.status === 401 && !originalRequest._retry) {
      // 如果是刷新 token 的请求返回 401，直接跳转登录
      if (url.includes('/v1/identity/auth/refresh')) {
        const authStore = useAuthStore()
        authStore.clearAuth()
        window.location.href = '/login'
        throw new Error('认证失败，请重新登录')
      }

      // 如果正在刷新 token，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(async () => {
            // 从 authStore 获取最新的 token
            const authStore = useAuthStore()
            const headers = new Headers(options.headers as HeadersInit)
            headers.set('Authorization', `Bearer ${authStore.token}`)
            // 重新发送请求
            return $fetch(url, { ...options, headers })
          })
          .catch((err) => {
            throw err
          })
      }

      // 标记正在刷新 token
      originalRequest._retry = true
      isRefreshing = true

      const authStore = useAuthStore()
      try {
        // 尝试刷新token
        await authStore.refreshAccessToken()
        const newToken = authStore.token
        // 处理等待队列
        processQueue(null)
        // 更新原始请求的 header
        const headers = new Headers(options.headers as HeadersInit)
        headers.set('Authorization', `Bearer ${newToken}`)
        // 重新发送原始请求
        return await $fetch(url, { ...options, headers })
      } catch (refreshError) {
        // 刷新失败，处理等待队列
        processQueue(refreshError)
        // 清除认证信息并跳转到登录页
        authStore.clearAuth()
        window.location.href = '/login'
        throw refreshError
      } finally {
        isRefreshing = false
      }
    }

    // 其他错误
    const data = response._data
    const message = data?.base_resp?.message || response.statusText || '网络请求失败'
    const apiError = new Error(message)
    apiError.name = 'NetworkError'
    throw apiError
  }
})

// 创建兼容 Axios API 的客户端接口
interface RequestConfig {
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
  [key: string]: any
}

const apiClient = {
  get: <T = any>(url: string, config?: RequestConfig): Promise<T> => {
    return $fetch<T>(url, {
      method: 'GET',
      query: config?.params,
      headers: config?.headers
    })
  },
  post: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
    return $fetch<T>(url, {
      method: 'POST',
      body: data,
      headers: config?.headers
    })
  },
  put: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
    return $fetch<T>(url, {
      method: 'PUT',
      body: data,
      headers: config?.headers
    })
  },
  delete: <T = any>(url: string, config?: RequestConfig): Promise<T> => {
    return $fetch<T>(url, {
      method: 'DELETE',
      body: config?.data,
      headers: config?.headers
    })
  },
  patch: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> => {
    return $fetch<T>(url, {
      method: 'PATCH',
      body: data,
      headers: config?.headers
    })
  }
}

export default apiClient
