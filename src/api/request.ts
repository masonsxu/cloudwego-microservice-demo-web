import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建自定义的 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 允许发送 Cookie
})

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

// 创建自定义的 API 客户端，返回数据而不是 AxiosResponse
const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.get<any, T>(url, config)
  },
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.post<any, T>(url, data, config)
  },
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.put<any, T>(url, data, config)
  },
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return instance.delete<any, T>(url, config)
  },
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return instance.patch<any, T>(url, data, config)
  }
}

// 获取请求的唯一标识（URL，axios 会自动处理查询参数）
const getRequestKey = (config: InternalAxiosRequestConfig): string => {
  // axios 会在发送请求前将 params 序列化到 URL 中
  // 但在请求拦截器中，URL 可能还没有包含查询参数
  // 所以我们需要手动构建完整的 URL
  if (!config.url) return ''

  let url = config.url
  const params = config.params

  // 如果 URL 中已经有查询参数，或者 params 为空，直接返回 URL
  if (url.includes('?') || !params || Object.keys(params).length === 0) {
    return url
  }

  // 构建查询字符串
  const queryString = new URLSearchParams(params).toString()
  return `${url}?${queryString}`
}

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    // 如果是刷新 token 的请求，跳过添加 Authorization header，使用 Cookie
    if (config.url?.includes('/v1/identity/auth/refresh')) {
      return config
    }
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    // 为 GET 请求添加 If-None-Match 请求头（支持 Etag 缓存）
    if (config.method?.toLowerCase() === 'get') {
      const requestKey = getRequestKey(config)
      if (requestKey) {
        const etag = etagCache.get(requestKey)
        if (etag) {
          config.headers['If-None-Match'] = etag
        }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const requestKey = getRequestKey(response.config)
    const method = response.config.method?.toLowerCase() || ''

    // 处理 304 Not Modified 响应
    if (response.status === 304) {
      // 从缓存中返回之前的数据
      const cachedData = responseCache.get(requestKey)
      if (cachedData) {
        return cachedData
      }
      // 如果没有缓存数据，返回空响应（这种情况不应该发生）
      return response.data
    }

    // 保存 Etag（仅对 GET 请求）
    // 注意：ETag 值必须保留双引号，这是 HTTP 规范要求的
    if (method === 'get' && response.headers.etag && requestKey) {
      etagCache.set(requestKey, response.headers.etag)
    }

    const { data } = response
    // 检查基础响应状态
    if (!data.base_resp) {
      const error = new Error('响应格式错误：缺少 base_resp')
      error.name = 'APIError'
      return Promise.reject(error)
    }

    if (data.base_resp.code === 0) {
      // 确保返回的数据不是 undefined 或 null
      if (data === undefined || data === null) {
        const error = new Error('响应数据为空')
        error.name = 'APIError'
        return Promise.reject(error)
      }

      // 缓存响应数据（仅对 GET 请求）
      if (method === 'get' && requestKey) {
        responseCache.set(requestKey, response.data)
      }

      // 返回 response.data 以保持类型安全
      return response.data
    }

    // 如果有错误，抛出错误
    const errorMessage = data.base_resp.message || `请求失败 (code: ${data.base_resp.code})`
    const error = new Error(errorMessage)
    error.name = 'APIError'
    return Promise.reject(error)
  },
  async (error) => {
    const originalRequest = error.config

    // 处理401未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 如果是刷新 token 的请求返回 401，直接跳转登录
      if (originalRequest.url?.includes('/v1/identity/auth/refresh')) {
        const authStore = useAuthStore()
        authStore.clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // 如果正在刷新 token，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            // 从 authStore 获取最新的 token
            const authStore = useAuthStore()
            originalRequest.headers.Authorization = `Bearer ${authStore.token}`
            return instance.request(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
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
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        // 重新发送原始请求
        return instance.request(originalRequest)
      } catch (refreshError) {
        // 刷新失败，处理等待队列
        processQueue(refreshError)
        // 清除认证信息并跳转到登录页
        authStore.clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    // 其他错误
    const message = error.response?.data?.base_resp?.message || error.message || '网络请求失败'
    const apiError = new Error(message)
    apiError.name = 'NetworkError'
    return Promise.reject(apiError)
  }
)

export default apiClient
