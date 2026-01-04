import type { BaseResponse } from './api'

export interface UserProfile {
  id: string
  username: string
  real_name: string
  first_name?: string
  last_name?: string
  email: string
  phone: string
  employee_id?: string
  organization_id: string
  primary_organization_id?: string
  status: number
  role_ids: string[]
  gender?: number
  license_number?: string
  professional_title?: string
  specialties?: string[]
  must_change_password?: boolean
  account_expiry?: number
  created_at: number
  updated_at: number
}

export interface UserMembership {
  id: string
  user_id: string
  organization_id: string
  department_id?: string
  is_primary: boolean
  role_ids: string[]
  organization_name?: string
  department_name?: string
}

export interface CreateUserRequest {
  username: string
  password: string
  real_name: string
  first_name?: string
  last_name?: string
  email: string
  phone: string
  employee_id?: string
  organization_id: string
  role_ids: string[]
  must_change_password?: boolean
  account_expiry?: number
  gender?: number
  license_number?: string
  professional_title?: string
  specialties?: string[]
}

export interface UpdateUserRequest {
  username?: string
  password?: string
  real_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  employee_id?: string
  organization_id?: string
  role_ids?: string[]
  must_change_password?: boolean
  gender?: number
  license_number?: string
  professional_title?: string
  specialties?: string[]
}

export interface UpdateMeRequest {
  real_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  gender?: number
  license_number?: string
  professional_title?: string
  specialties?: string[]
}

export interface DeleteUserRequest {
  reason?: string
}

export interface ChangeUserStatusRequest {
  new_status: number
  reason: string
}

export interface UnlockUserRequest {
  reason?: string
}

export interface ListUsersResponse extends BaseResponse {
  users: UserProfile[]
  page?: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface SearchUsersResponse extends BaseResponse {
  users: UserProfile[]
}

export interface GetUserResponse extends BaseResponse {
  user: UserProfile
}

export interface GetUserMembershipsResponse extends BaseResponse {
  memberships: UserMembership[]
}

export interface GetUserPrimaryMembershipResponse extends BaseResponse {
  membership: UserMembership
}
