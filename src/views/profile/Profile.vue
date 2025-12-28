<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.profileInfo') }}
    </h1>

    <div class="max-w-2xl">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="text-gray-500 dark:text-gray-400">{{ t('common.loading') }}...</div>
        </div>
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.username') }}
            </label>
            <input
              :value="userProfile?.username"
              type="text"
              disabled
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.realName') }} *
            </label>
            <input
              v-model="formData.real_name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.email') }} *
            </label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.phone') }} *
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.gender') }}
            </label>
            <select
              v-model="formData.gender"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option :value="undefined">{{ t('common.select') }}</option>
              <option :value="1">{{ t('user.genderMale') }}</option>
              <option :value="2">{{ t('user.genderFemale') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.employeeId') }}
            </label>
            <input
              v-model="formData.employee_id"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.professionalTitle') }}
            </label>
            <input
              v-model="formData.professional_title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.licenseNumber') }}
            </label>
            <input
              v-model="formData.license_number"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
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
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ submitting ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { getCurrentUserApi, updateCurrentUserApi } from '@/api/user'
import type { UpdateMeRequest } from '@/types/user'

const { t } = useI18n()
const authStore = useAuthStore()

const userProfile = ref(authStore.user)
const loading = ref(false)
const submitting = ref(false)

const formData = ref<UpdateMeRequest>({
  real_name: '',
  email: '',
  phone: '',
  gender: undefined,
  employee_id: '',
  professional_title: '',
  license_number: '',
  specialties: []
})

const loadProfile = async () => {
  loading.value = true
  try {
    const res = await getCurrentUserApi()
    userProfile.value = res
    formData.value = {
      real_name: res.real_name,
      email: res.email,
      phone: res.phone,
      gender: res.gender,
      employee_id: res.employee_id,
      professional_title: res.professional_title,
      license_number: res.license_number,
      specialties: res.specialties || []
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (userProfile.value) {
    formData.value = {
      real_name: userProfile.value.real_name,
      email: userProfile.value.email,
      phone: userProfile.value.phone,
      gender: userProfile.value.gender,
      employee_id: userProfile.value.employee_id,
      professional_title: userProfile.value.professional_title,
      license_number: userProfile.value.license_number,
      specialties: userProfile.value.specialties || []
    }
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const res = await updateCurrentUserApi(formData.value)
    userProfile.value = res
    authStore.user = res
    alert(t('profile.updateSuccess'))
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>