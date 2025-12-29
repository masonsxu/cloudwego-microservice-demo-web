import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// 创建自定义的 axios 实例类型
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance