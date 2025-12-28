import type { BaseResponse, TokenInfo } from './api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse extends BaseResponse {
  token_info: TokenInfo
  user_profile: UserProfile
  memberships: UserMembership[]
  menu_tree: MenuNode[]
  role_ids: string[]
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

// Import other types that are referenced
import type { UserProfile } from './user'
import type { UserMembership } from './user'
import type { MenuNode } from './menu'