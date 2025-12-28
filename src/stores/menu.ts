import { defineStore } from 'pinia'
import { getUserMenuTreeApi } from '@/api/menu'
import { useAuthStore } from './auth'
import type { MenuNode } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

interface MenuState {
  menuTree: MenuNode[]
  routes: RouteRecordRaw[]
  loading: boolean
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuTree: [],
    routes: [],
    loading: false
  }),

  actions: {
    async fetchUserMenuTree(userId: string) {
      this.loading = true
      try {
        const res = await getUserMenuTreeApi(userId)
        this.menuTree = res.menu_tree
        this.routes = this.convertMenuToRoutes(res.menu_tree)
        return res
      } catch (error) {
        console.error('Failed to fetch user menu tree:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    convertMenuToRoutes(menuTree: MenuNode[]): RouteRecordRaw[] {
      const routes: RouteRecordRaw[] = []

      const traverse = (menus: MenuNode[]) => {
        menus.forEach(menu => {
          if (menu.permission_level !== 'none' && menu.component) {
            const route: RouteRecordRaw = {
              path: menu.path,
              name: menu.name,
              component: () => import(`@/views/${menu.component}.vue`),
              meta: {
                title: menu.name,
                icon: menu.icon
              }
            }

            if (menu.children && menu.children.length > 0) {
              route.children = this.convertMenuToRoutes(menu.children)
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
    }
  }
})