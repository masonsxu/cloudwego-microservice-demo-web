import request from './request'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UpdateMeRequest,
  DeleteUserRequest,
  ChangeUserStatusRequest,
  UnlockUserRequest,
  UserProfile,
  ListUsersResponse,
  SearchUsersResponse,
  GetUserMembershipsResponse,
  GetUserPrimaryMembershipResponse
} from '@/types/user'

export const getCurrentUserApi = () =>
  request.get<UserProfile>('/v1/identity/users/me')

export const updateCurrentUserApi = (data: UpdateMeRequest) =>
  request.put<UserProfile>('/v1/identity/users/me', data)

export const listUsersApi = (params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
  organization_id?: string
  status?: number
  fetch_all?: boolean
}) =>
  request.get<ListUsersResponse>('/v1/identity/users', { params })

export const searchUsersApi = (params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
  keyword: string
}) =>
  request.get<SearchUsersResponse>('/v1/identity/users/search', { params })

export const createUserApi = (data: CreateUserRequest) =>
  request.post<UserProfile>('/v1/identity/users', data)

export const getUserApi = (userId: string) =>
  request.get<UserProfile>(`/v1/identity/users/${userId}`)

export const updateUserApi = (userId: string, data: UpdateUserRequest) =>
  request.put<UserProfile>(`/v1/identity/users/${userId}`, data)

export const deleteUserApi = (userId: string, data: DeleteUserRequest) =>
  request.delete(`/v1/identity/users/${userId}`, { data })

export const changeUserStatusApi = (userId: string, data: ChangeUserStatusRequest) =>
  request.put(`/v1/identity/users/${userId}/status`, data)

export const unlockUserApi = (userId: string, data: UnlockUserRequest) =>
  request.put(`/v1/identity/users/${userId}/unlock`, data)

export const getUserMembershipsApi = (userId: string, params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
}) =>
  request.get<GetUserMembershipsResponse>(`/v1/identity/users/${userId}/memberships`, { params })

export const getUserPrimaryMembershipApi = (userId: string) =>
  request.get<GetUserPrimaryMembershipResponse>(`/v1/identity/users/${userId}/primary-membership`)