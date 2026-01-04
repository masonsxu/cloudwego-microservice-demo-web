import { loginApi, logoutApi, refreshTokenApi } from '@/api/auth'
import type { MenuNode, UserMembership, UserProfile } from '@/types'
import { defineStore } from 'pinia'

interface AuthState {
  token: string
  refreshToken: string
  user: UserProfile | null
  memberships: UserMembership[]
  menuTree: MenuNode[]
  roleIds: string[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // 从 localStorage 恢复状态，避免页面刷新时丢失认证信息
    const token = localStorage.getItem('access_token') || ''
    const refreshToken = localStorage.getItem('refresh_token') || ''

    let user: UserProfile | null = null
    let memberships: UserMembership[] = []
    let menuTree: MenuNode[] = []
    let roleIds: string[] = []

    try {
      const userStr = localStorage.getItem('user')
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        user = JSON.parse(userStr)
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e)
      localStorage.removeItem('user')
    }

    try {
      const membershipsStr = localStorage.getItem('memberships')
      if (membershipsStr && membershipsStr !== 'undefined' && membershipsStr !== 'null') {
        memberships = JSON.parse(membershipsStr)
      }
    } catch (e) {
      console.error('Failed to parse memberships from localStorage:', e)
      localStorage.removeItem('memberships')
    }

    try {
      const menuTreeStr = localStorage.getItem('menu_tree')
      if (menuTreeStr && menuTreeStr !== 'undefined' && menuTreeStr !== 'null') {
        menuTree = JSON.parse(menuTreeStr)
      }
    } catch (e) {
      console.error('Failed to parse menu_tree from localStorage:', e)
      localStorage.removeItem('menu_tree')
    }

    try {
      const roleIdsStr = localStorage.getItem('role_ids')
      if (roleIdsStr && roleIdsStr !== 'undefined' && roleIdsStr !== 'null') {
        roleIds = JSON.parse(roleIdsStr)
      }
    } catch (e) {
      console.error('Failed to parse role_ids from localStorage:', e)
      localStorage.removeItem('role_ids')
    }

    return {
      token,
      refreshToken,
      user,
      memberships,
      menuTree,
      roleIds
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.user?.username || '',
    realName: (state) => state.user?.real_name || ''
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      const res = await loginApi(credentials)
      this.token = res.token_info.access_token
      this.refreshToken = res.token_info.access_token // 后端不返回refresh_token，暂时使用access_token
      this.user = res.user_profile
      this.memberships = res.memberships
      this.menuTree = res.menu_tree || []
      this.roleIds = res.role_ids || []
      this.saveToStorage()
    },

    async logout() {
      try {
        await logoutApi({ refresh_token: this.refreshToken })
      } catch (error) {
        console.error('Logout error:', error)
      }
      this.clearAuth()
    },

    async refreshAccessToken() {
      // 根据 API 文档，刷新 token 通过 Cookie 传递，请求体可以为空
      // 如果后端需要 refresh_token，则传递；否则传递空对象
      const res = await refreshTokenApi(this.refreshToken ? { refresh_token: this.refreshToken } : undefined)
      this.token = res.token_info.access_token
      // 更新 refreshToken（如果后端返回了新的 refresh_token，使用新的；否则保持原值）
      // 注意：根据当前实现，后端可能不返回 refresh_token，所以保持原值
      this.saveToStorage()
    },

    saveToStorage() {
      localStorage.setItem('access_token', this.token)
      localStorage.setItem('refresh_token', this.refreshToken)
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('memberships', JSON.stringify(this.memberships))
      localStorage.setItem('menu_tree', JSON.stringify(this.menuTree))
      localStorage.setItem('role_ids', JSON.stringify(this.roleIds))
    },

    clearAuth() {
      this.token = ''
      this.refreshToken = ''
      this.user = null
      this.memberships = []
      this.menuTree = []
      this.roleIds = []
      localStorage.clear()
    }
  }
})
