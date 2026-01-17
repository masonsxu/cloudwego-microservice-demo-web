import type { BaseResponse } from './api'
import { PermissionLevel } from '@/constants/permission'

// 导出权限级别类型（使用枚举）
export type { PermissionLevel }

// 菜单节点（permission_level 可选，登录响应中不包含该字段，但菜单管理 API 中包含）
export interface MenuNode {
  id: string
  name: string
  path: string
  component: string
  icon?: string
  permission_level?: PermissionLevel
  parent_id?: string
  sort_order?: number
  children?: MenuNode[]
  created_at?: number
  updated_at?: number
}

// 菜单权限配置（用于登录响应）
export interface MenuPermission {
  menu_id: string
  permission: PermissionLevel
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
  role_ids?: string[]
  user_id?: string
  permissions?: MenuPermission[]
}

export interface ConfigureRoleMenusResponse extends BaseResponse {
  success: boolean
}
