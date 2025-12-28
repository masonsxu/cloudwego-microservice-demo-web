import instance from './index'
import { useAuthStore } from '@/stores/auth'

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
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
    if (data.base_resp?.code === 0) {
      return data
    }
    // 如果有错误，抛出错误
    const error = new Error(data.base_resp?.message || '请求失败')
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

export default instance