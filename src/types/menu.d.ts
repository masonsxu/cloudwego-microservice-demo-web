import type { BaseResponse } from './api'

export type PermissionLevel = 'read' | 'write' | 'full' | 'none'

export interface MenuNode {
  id: string
  name: string
  path: string
  component: string
  icon?: string
  permission_level: PermissionLevel
  parent_id?: string
  sort_order?: number
  children?: MenuNode[]
  created_at: number
  updated_at: number
}

export interface MenuConfig {
  menu_id: string
  permission: PermissionLevel
}

export interface ConfigureRoleMenusRequest {
  menu_configs: MenuConfig[]
}

export interface GetMenuTreeResponse extends BaseResponse {
  menu_tree: MenuNode[]
}

export interface GetRoleMenuTreeResponse extends BaseResponse {
  menu_tree: MenuNode[]
}

export interface GetUserMenuTreeResponse extends BaseResponse {
  menu_tree: MenuNode[]
}

export interface ConfigureRoleMenusResponse extends BaseResponse {
  success: boolean
}