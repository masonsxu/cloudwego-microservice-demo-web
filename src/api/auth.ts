import request from './request'
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  ForceChangePasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse
} from '@/types/auth'

export const loginApi = (data: LoginRequest) =>
  request.post<LoginResponse>('/v1/identity/auth/login', data)

export const logoutApi = (data: LogoutRequest) =>
  request.post('/v1/identity/auth/logout', data)

export const changePasswordApi = (data: ChangePasswordRequest) =>
  request.put('/v1/identity/auth/password', data)

export const forceChangePasswordApi = (data: ForceChangePasswordRequest) =>
  request.put('/v1/identity/auth/password/force-change', data)

export const resetPasswordApi = (userId: string, data: ResetPasswordRequest) =>
  request.post(`/v1/identity/auth/password/reset/${userId}`, data)

export const refreshTokenApi = (data: RefreshTokenRequest) =>
  request.post<RefreshTokenResponse>('/v1/identity/auth/refresh', data)