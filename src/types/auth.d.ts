import type { BaseResponse, TokenInfo } from './api'
import type { UserProfile } from './user'
import type { MenuNode, MenuPermission } from './menu'

// 登录响应中的角色信息
export interface LoginRole {
  id: string
  code: string | null
  name: string
  data_scope: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse extends BaseResponse {
  token_info: TokenInfo
  user_profile: UserProfile
  menu_tree: MenuNode[]
  role_ids: string[]
  permissions: MenuPermission[]
  roles: LoginRole[]
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse extends BaseResponse {
  token_info: TokenInfo
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface ResetPasswordRequest {
  user_id: string
  new_password?: string
  reset_reason: string
}

export interface ForceChangePasswordRequest {
  user_id: string
  reason: string
}

export interface LogoutRequest {
  refresh_token?: string
}
