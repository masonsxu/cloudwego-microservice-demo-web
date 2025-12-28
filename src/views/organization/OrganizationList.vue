<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.organizationList') }}
    </h1>

    <!-- 操作按钮 -->
    <div class="mb-4 flex justify-end">
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ t('organization.createOrganization') }}
      </button>
    </div>

    <!-- 组织列表表格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('organization.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('organization.code') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('organization.facilityType') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('organization.accreditationStatus') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('organization.provinceCity') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('organization.memberCount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.loading') }}...
              </td>
            </tr>
            <tr v-else-if="organizations.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.noData') }}
              </td>
            </tr>
            <tr v-else v-for="org in organizations" :key="org.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    v-if="org.logo"
                    :src="org.logo"
                    class="h-10 w-10 rounded-full mr-3"
                    alt="Logo"
                  />
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ org.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ org.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ org.facility_type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ org.accreditation_status }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ org.province_city.join(', ') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ org.member_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(org)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ t('common.edit') }}
                  </button>
                  <button
                    @click="openDeleteModal(org)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {{ t('common.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 创建/编辑组织弹窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? t('organization.editOrganization') : t('organization.createOrganization') }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('organization.name') }} *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('organization.facilityType') }} *
            </label>
            <input
              v-model="formData.facility_type"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('organization.accreditationStatus') }} *
            </label>
            <input
              v-model="formData.accreditation_status"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('organization.provinceCity') }} *
            </label>
            <input
              v-model="provinceCityInput"
              type="text"
              required
              :placeholder="t('organization.provinceCityPlaceholder')"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div v-if="isEditMode && currentOrganization?.logo">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('organization.logo') }}
            </label>
            <div class="flex items-center gap-4">
              <img :src="currentOrganization.logo" class="h-20 w-20 rounded-full" alt="Logo" />
              <button
                @click="deleteLogo"
                type="button"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {{ t('organization.deleteLogo') }}
              </button>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              {{ t('common.cancel') }}
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

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t('organization.confirmDelete') }}
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ t('organization.deleteWarning') }}: {{ orgToDelete?.name }}
          </p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('organization.deleteReason') }}
            </label>
            <textarea
              v-model="deleteReason"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              {{ t('common.cancel') }}
            </button>
            <button
              @click="handleDelete"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleting ? t('common.deleting') : t('common.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  listOrganizationsApi,
  createOrganizationApi,
  updateOrganizationApi,
  deleteOrganizationApi
} from '@/api/organization'
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest } from '@/types/organization'

const { t } = useI18n()

const organizations = ref<Organization[]>([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const orgToDelete = ref<Organization | null>(null)
const deleteReason = ref('')
const currentOrganization = ref<Organization | null>(null)

const formData = ref<CreateOrganizationRequest | UpdateOrganizationRequest>({
  name: '',
  facility_type: '',
  accreditation_status: '',
  province_city: []
})

const provinceCityInput = computed({
  get: () => formData.value.province_city?.join(', ') || '',
  set: (value: string) => {
    formData.value.province_city = value.split(',').map(s => s.trim()).filter(s => s)
  }
})

const loadOrganizations = async () => {
  loading.value = true
  try {
    const res = await listOrganizationsApi({ fetch_all: true })
    organizations.value = res.organizations
  } catch (error) {
    console.error('Failed to load organizations:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  currentOrganization.value = null
  formData.value = {
    name: '',
    facility_type: '',
    accreditation_status: '',
    province_city: []
  }
  showModal.value = true
}

const openEditModal = (org: Organization) => {
  isEditMode.value = true
  currentOrganization.value = org
  formData.value = {
    name: org.name,
    facility_type: org.facility_type,
    accreditation_status: org.accreditation_status,
    province_city: [...org.province_city]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  currentOrganization.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditMode.value && currentOrganization.value) {
      await updateOrganizationApi(currentOrganization.value.id, formData.value as UpdateOrganizationRequest)
    } else {
      await createOrganizationApi(formData.value as CreateOrganizationRequest)
    }
    closeModal()
    loadOrganizations()
  } catch (error) {
    console.error('Failed to save organization:', error)
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (org: Organization) => {
  orgToDelete.value = org
  deleteReason.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  orgToDelete.value = null
  deleteReason.value = ''
}

const handleDelete = async () => {
  if (!orgToDelete.value) return
  deleting.value = true
  try {
    await deleteOrganizationApi(orgToDelete.value.id, { reason: deleteReason.value })
    closeDeleteModal()
    loadOrganizations()
  } catch (error) {
    console.error('Failed to delete organization:', error)
  } finally {
    deleting.value = false
  }
}

const deleteLogo = async () => {
  if (!currentOrganization.value?.logo_id) return
  try {
    const { deleteLogoApi } = await import('@/api/organization')
    await deleteLogoApi(currentOrganization.value.logo_id)
    currentOrganization.value.logo = undefined
    currentOrganization.value.logo_id = undefined
  } catch (error) {
    console.error('Failed to delete logo:', error)
  }
}

onMounted(() => {
  loadOrganizations()
})
</script>