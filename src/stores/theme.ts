import { defineStore } from 'pinia'

interface ThemeState {
  isDark: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    setTheme(isDark: boolean) {
      this.isDark = isDark
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', isDark)
    },

    initTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
    }
  }
})