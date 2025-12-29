import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建自定义的 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
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
    // 处理401未授权错误
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      try {
        // 尝试刷新token
        await authStore.refreshAccessToken()
        // 重新发送原始请求
        return instance.request(error.config)
      } catch (refreshError) {
        // 刷新失败，清除认证信息并跳转到登录页
        authStore.clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
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
