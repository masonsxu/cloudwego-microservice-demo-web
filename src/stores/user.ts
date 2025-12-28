import { defineStore } from 'pinia'
import { getCurrentUserApi, updateCurrentUserApi } from '@/api/user'
import type { UserProfile } from '@/types'

interface UserState {
  currentUser: UserProfile | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    loading: false
  }),

  actions: {
    async fetchCurrentUser() {
      this.loading = true
      try {
        const res = await getCurrentUserApi()
        this.currentUser = res
        return res
      } catch (error) {
        console.error('Failed to fetch current user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCurrentUser(data: any) {
      this.loading = true
      try {
        const res = await updateCurrentUserApi(data)
        this.currentUser = res
        return res
      } catch (error) {
        console.error('Failed to update current user:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})