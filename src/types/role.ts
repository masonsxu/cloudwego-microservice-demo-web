// 角色状态枚举（运行时常量）
export enum RoleStatus {
  Active = 1,      // 活跃
  Inactive = 2,    // 未激活
  Deprecated = 3,  // 已弃用
}

// 重新导出 role.d.ts 中的所有类型定义
export type {
  Permission,
  RoleDefinition,
  CreateRoleRequest,
  UpdateRoleRequest,
  DeleteRoleRequest,
  UserRoleAssignment,
  BatchBindUsersRequest,
  ListRolesResponse,
  GetRoleResponse,
  GetUsersByRoleResponse,
  ListUserRolesResponse,
  AssignRoleToUserResponse
} from './role.d'
