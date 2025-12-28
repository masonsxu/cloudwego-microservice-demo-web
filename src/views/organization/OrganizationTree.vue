<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.organizationTree') }}
    </h1>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">{{ t('common.loading') }}...</div>
      </div>
      <div v-else-if="organizations.length === 0" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">{{ t('common.noData') }}</div>
      </div>
      <div v-else>
        <div v-for="org in rootOrganizations" :key="org.id" class="mb-4">
          <OrganizationTreeNode
            :organization="org"
            :all-organizations="organizations"
            @edit="openEditModal"
            @delete="openDeleteModal"
          />
        </div>
      </div>
    </div>

    <!-- 编辑组织弹窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ t('organization.editOrganization') }}
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
  updateOrganizationApi,
  deleteOrganizationApi
} from '@/api/organization'
import type { Organization, UpdateOrganizationRequest } from '@/types/organization'
import OrganizationTreeNode from '@/components/tree/OrganizationTreeNode.vue'

const { t } = useI18n()

const organizations = ref<Organization[]>([])
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const orgToDelete = ref<Organization | null>(null)
const deleteReason = ref('')

const formData = ref<UpdateOrganizationRequest>({
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

const rootOrganizations = computed(() => {
  return organizations.value.filter(org => !org.parent_id)
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

const openEditModal = (org: Organization) => {
  formData.value = {
    name: org.name,
    facility_type: org.facility_type,
    accreditation_status: org.accreditation_status,
    province_city: [...org.province_city]
  }
  orgToDelete.value = org
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  orgToDelete.value = null
}

const handleSubmit = async () => {
  if (!orgToDelete.value) return
  submitting.value = true
  try {
    await updateOrganizationApi(orgToDelete.value.id, formData.value)
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

onMounted(() => {
  loadOrganizations()
})
</script>