import { defineStore } from 'pinia'
import { getUserMenuTreeApi } from '@/api/menu'
import { useAuthStore } from './auth'
import type { MenuNode } from '@/types'
import type { RouteRecordRaw } from 'vue-router'
import { PermissionLevel } from '@/constants/permission'
import { PermissionUtils } from '@/utils/permission'

interface MenuState {
  menuTree: MenuNode[]
  routes: RouteRecordRaw[]
  loading: boolean
  routesLoaded: boolean // 标记路由是否已加载（即使为空）
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuTree: [],
    routes: [],
    loading: false,
    routesLoaded: false
  }),

  actions: {
    async fetchUserMenuTree(userId: string) {
      this.loading = true
      try {
        const res = await getUserMenuTreeApi(userId)
        this.menuTree = res.menu_tree
        this.routes = this.convertMenuToRoutes(res.menu_tree)
        this.routesLoaded = true // 标记为已加载，即使 routes 为空
        return res
      } catch (error) {
        console.error('Failed to fetch user menu tree:', error)
        this.routesLoaded = true // 即使失败也标记为已加载，避免无限循环
        throw error
      } finally {
        this.loading = false
      }
    },

    convertMenuToRoutes(menuTree: MenuNode[]): RouteRecordRaw[] {
      const routes: RouteRecordRaw[] = []

      const traverse = (menus: MenuNode[]) => {
        menus.forEach(menu => {
          // permission_level 可选，如果不存在或不是 NONE 则允许访问
          if (PermissionUtils.canAccess(menu.permission_level) && menu.component) {
            const route: RouteRecordRaw = {
              path: menu.path,
              name: menu.name,
              component: () => import(`@/views/${menu.component}.vue`),
              meta: {
                title: menu.name,
                icon: menu.icon
              },
              children: menu.children && menu.children.length > 0
                ? this.convertMenuToRoutes(menu.children)
                : undefined
            }

            routes.push(route)
          }
        })
      }

      traverse(menuTree)
      return routes
    },

    async generateRoutes() {
      const authStore = useAuthStore()
      if (authStore.user) {
        await this.fetchUserMenuTree(authStore.user.id)
      }
    },

    reset() {
      // 重置菜单 store 状态，用于登出或切换用户时
      this.menuTree = []
      this.routes = []
      this.loading = false
      this.routesLoaded = false
    }
  }
})
