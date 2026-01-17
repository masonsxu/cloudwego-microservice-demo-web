/**
 * 权限级别枚举常量
 * 确保全局权限值的一致性
 */
export enum PermissionLevel {
  NONE = 'none',
  READ = 'read',
  WRITE = 'write',
  FULL = 'full'
}

/**
 * 权限级别数组（按优先级排序）
 */
export const PERMISSION_LEVELS = [
  PermissionLevel.NONE,
  PermissionLevel.READ,
  PermissionLevel.WRITE,
  PermissionLevel.FULL
] as const

/**
 * 权限级别显示标签映射（用于国际化）
 */
export const PERMISSION_LABEL_KEYS = {
  [PermissionLevel.NONE]: 'menuConfig.none',
  [PermissionLevel.READ]: 'menuConfig.read',
  [PermissionLevel.WRITE]: 'menuConfig.write',
  [PermissionLevel.FULL]: 'menuConfig.full'
} as const
