import type { BaseResponse } from './api'

export interface Permission {
  resource: string
  action: string
  description?: string
}

export interface RoleDefinition {
  id: string
  name: string
  description?: string
  is_system_role: boolean
  permissions: Permission[]
  user_count?: number
  created_at: number
  updated_at: number
}

export interface CreateRoleRequest {
  name: string
  description?: string
  is_system_role: boolean
  permissions: Permission[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: Permission[]
}

export interface DeleteRoleRequest {
  reason?: string
}

export interface UserRoleAssignment {
  id: string
  user_id: string
  role_id: string
  assigned_at: number
  assigned_by: string
  user_name?: string
  role_name?: string
}

export interface BatchBindUsersRequest {
  user_ids: string[]
}

export interface ListRolesResponse extends BaseResponse {
  roles: RoleDefinition[]
}

export interface GetRoleResponse extends BaseResponse {
  role: RoleDefinition
}

export interface GetUsersByRoleResponse extends BaseResponse {
  users: UserProfile[]
}

export interface ListUserRolesResponse extends BaseResponse {
  user_roles: UserRoleAssignment[]
}

export interface AssignRoleToUserResponse extends BaseResponse {
  role_assignment: UserRoleAssignment
}

import type { UserProfile } from './user'