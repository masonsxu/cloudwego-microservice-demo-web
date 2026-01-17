import { PermissionLevel } from '@/constants/permission'
import type { MenuNode, MenuPermission } from '@/types/menu'

/**
 * 权限工具类
 * 统一管理权限相关的工具函数
 */
export class PermissionUtils {
  /**
   * 将权限数组转换为映射表
   * @param permissions 权限数组
   * @returns 权限映射表 (menu_id -> permission_level)
   */
  static buildPermissionMap(permissions: MenuPermission[]): Map<string, PermissionLevel> {
    const map = new Map<string, PermissionLevel>()
    permissions.forEach(perm => {
      map.set(perm.menu_id, perm.permission as PermissionLevel)
    })
    console.log('构建权限映射表:', Object.fromEntries(map))
    return map
  }

  /**
   * 递归合并权限到菜单树
   * @param menus 菜单树
   * @param permissionMap 权限映射表
   */
  static mergePermissionsToMenuTree(
    menus: MenuNode[],
    permissionMap: Map<string, PermissionLevel>
  ): void {
    menus.forEach(menu => {
      // 从权限映射中获取权限级别
      if (permissionMap.has(menu.id)) {
        menu.permission_level = permissionMap.get(menu.id) as PermissionLevel
        console.log(`菜单 ${menu.name} (${menu.id}) 权限匹配成功: ${menu.permission_level}`)
      } else {
        // 如果没有找到权限，默认为无权限
        menu.permission_level = PermissionLevel.NONE
        console.warn(`菜单 ${menu.name} (${menu.id}) 在权限映射表中未找到，设置为无权限`)
        console.log('权限映射表中的所有 key:', Array.from(permissionMap.keys()))
      }

      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        this.mergePermissionsToMenuTree(menu.children, permissionMap)
      }
    })
  }

  /**
   * 检查权限级别是否允许访问
   * @param permissionLevel 权限级别
   * @returns 是否允许访问
   */
  static canAccess(permissionLevel?: PermissionLevel | string): boolean {
    if (!permissionLevel) return false
    return permissionLevel !== PermissionLevel.NONE
  }

  /**
   * 检查权限级别是否包含读取权限
   * @param permissionLevel 权限级别
   * @returns 是否包含读取权限
   */
  static canRead(permissionLevel?: PermissionLevel | string): boolean {
    if (!permissionLevel) return false
    return [
      PermissionLevel.READ,
      PermissionLevel.WRITE,
      PermissionLevel.FULL
    ].includes(permissionLevel as PermissionLevel)
  }

  /**
   * 检查权限级别是否包含写入权限
   * @param permissionLevel 权限级别
   * @returns 是否包含写入权限
   */
  static canWrite(permissionLevel?: PermissionLevel | string): boolean {
    if (!permissionLevel) return false
    return [
      PermissionLevel.WRITE,
      PermissionLevel.FULL
    ].includes(permissionLevel as PermissionLevel)
  }

  /**
   * 检查权限级别是否为完全权限
   * @param permissionLevel 权限级别
   * @returns 是否为完全权限
   */
  static isFull(permissionLevel?: PermissionLevel | string): boolean {
    if (!permissionLevel) return false
    return permissionLevel === PermissionLevel.FULL
  }

  /**
   * 比较两个权限级别，返回较高的权限级别
   * @param level1 权限级别1
   * @param level2 权限级别2
   * @returns 较高的权限级别
   */
  static getHigherLevel(
    level1: PermissionLevel | string,
    level2: PermissionLevel | string
  ): PermissionLevel {
    const levels = [PermissionLevel.NONE, PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.FULL]
    const index1 = levels.indexOf(level1 as PermissionLevel)
    const index2 = levels.indexOf(level2 as PermissionLevel)
    return levels[Math.max(index1, index2)] || PermissionLevel.NONE
  }

  /**
   * 验证权限级别是否有效
   * @param level 权限级别
   * @returns 是否有效
   */
  static isValidLevel(level: string): level is PermissionLevel {
    return Object.values(PermissionLevel).includes(level as PermissionLevel)
  }

  /**
   * 获取权限级别的默认值
   * @returns 默认权限级别（NONE）
   */
  static getDefaultLevel(): PermissionLevel {
    return PermissionLevel.NONE
  }
}
