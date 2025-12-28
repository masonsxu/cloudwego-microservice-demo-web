import request from './request'
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  DeleteRoleRequest,
  BatchBindUsersRequest,
  RoleDefinition,
  ListRolesResponse,
  GetUsersByRoleResponse,
  ListUserRolesResponse,
  AssignRoleToUserResponse
} from '@/types/role'

export const listRolesApi = (params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
  name?: string
  status?: number
  is_system_role?: boolean
  fetch_all?: boolean
}) =>
  request.get<ListRolesResponse>('/v1/permission/roles', { params })

export const createRoleApi = (data: CreateRoleRequest) =>
  request.post<RoleDefinition>('/v1/permission/roles', data)

export const getRoleApi = (roleId: string) =>
  request.get<RoleDefinition>(`/v1/permission/roles/${roleId}`)

export const updateRoleApi = (roleDefinitionId: string, data: UpdateRoleRequest) =>
  request.put<RoleDefinition>(`/v1/permission/roles/${roleDefinitionId}`, data)

export const deleteRoleApi = (roleId: string, data: DeleteRoleRequest) =>
  request.delete(`/v1/permission/roles/${roleId}`, { data })

export const getUsersByRoleApi = (roleId: string) =>
  request.get<GetUsersByRoleResponse>(`/v1/permission/roles/${roleId}/users`)

export const batchBindUsersToRoleApi = (roleId: string, data: BatchBindUsersRequest) =>
  request.post(`/v1/permission/roles/${roleId}/users/batch-bind`, data)

export const listUserRolesApi = (params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
  user_id?: string
  role_id?: string
}) =>
  request.get<ListUserRolesResponse>('/v1/permission/user-roles', { params })

export const getUserLatestRoleApi = (userId: string) =>
  request.get<AssignRoleToUserResponse>(`/v1/permission/users/${userId}/roles/latest`)