import request from './request'
import type {
  ConfigureRoleMenusRequest,
  MenuNode,
  GetMenuTreeResponse,
  GetRoleMenuTreeResponse,
  GetUserMenuTreeResponse
} from '@/types/menu'

export const getMenuTreeApi = () =>
  request.get<GetMenuTreeResponse>('/v1/permission/menu/tree')

export const uploadMenuConfigApi = (file: File) => {
  const formData = new FormData()
  formData.append('menu_file', file)
  return request.post<GetMenuTreeResponse>('/v1/permission/menu/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getRoleMenuTreeApi = (roleId: string) =>
  request.get<GetRoleMenuTreeResponse>(`/v1/permission/roles/${roleId}/menu-tree`)

export const configureRoleMenusApi = (roleId: string, data: ConfigureRoleMenusRequest) =>
  request.post(`/v1/permission/roles/${roleId}/menus`, data)

export const getUserMenuTreeApi = (userId: string) =>
  request.get<GetUserMenuTreeResponse>(`/v1/permission/users/${userId}/menu-tree`)