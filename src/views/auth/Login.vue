<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ t('auth.loginTitle') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ t('auth.loginSubtitle') }}
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.username') }}
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            :placeholder="t('auth.usernamePlaceholder')"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('common.password') }}
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            :placeholder="t('auth.passwordPlaceholder')"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {{ t('auth.rememberMe') }}
            </span>
          </label>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
            {{ t('auth.forgotPassword') }}
          </a>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">{{ t('common.loading') }}</span>
          <span v-else>{{ t('auth.loginButton') }}</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          @click="toggleLanguage"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {{ t('language.switchLanguage') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    console.log('开始登录，用户名:', form.value.username)
    await authStore.login({
      username: form.value.username,
      password: form.value.password
    })
    console.log('登录成功')
    router.push('/')
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.message || t('auth.loginFailed')
  } finally {
    loading.value = false
  }
}

const toggleLanguage = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  localStorage.setItem('locale', locale.value)
}
</script>