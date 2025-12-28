import { defineStore } from 'pinia'
import { loginApi, logoutApi, refreshTokenApi } from '@/api/auth'
import type { UserProfile, UserMembership, MenuNode } from '@/types'

interface AuthState {
  token: string
  refreshToken: string
  user: UserProfile | null
  memberships: UserMembership[]
  menuTree: MenuNode[]
  roleIds: string[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: '',
    refreshToken: '',
    user: null,
    memberships: [],
    menuTree: [],
    roleIds: []
  }),
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
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }
      const res = await refreshTokenApi({ refresh_token: this.refreshToken })
      this.token = res.token_info.access_token
      localStorage.setItem('access_token', this.token)
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