<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.changePassword') }}
    </h1>

    <div class="max-w-md">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('auth.oldPassword') }} *
            </label>
            <input
              v-model="formData.old_password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('auth.newPassword') }} *
            </label>
            <input
              v-model="formData.new_password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ t('auth.passwordMinLength') }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('auth.confirmPassword') }} *
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p v-if="passwordMismatch" class="mt-1 text-xs text-red-600 dark:text-red-400">
              {{ t('auth.passwordMismatch') }}
            </p>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              {{ t('common.reset') }}
            </button>
            <button
              type="submit"
              :disabled="submitting || passwordMismatch"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? t('common.saving') : t('auth.changePassword') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { changePasswordApi } from '@/api/auth'

const { t } = useI18n()

const formData = ref({
  old_password: '',
  new_password: ''
})
const confirmPassword = ref('')
const submitting = ref(false)

const passwordMismatch = computed(() => {
  return confirmPassword.value && formData.value.new_password !== confirmPassword.value
})

const resetForm = () => {
  formData.value = {
    old_password: '',
    new_password: ''
  }
  confirmPassword.value = ''
}

const handleSubmit = async () => {
  if (passwordMismatch.value) {
    return
  }

  submitting.value = true
  try {
    await changePasswordApi(formData.value)
    alert(t('auth.passwordChanged'))
    resetForm()
  } catch (error) {
    console.error('Failed to change password:', error)
    alert(t('auth.passwordChangeFailed'))
  } finally {
    submitting.value = false
  }
}
</script>