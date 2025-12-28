<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.departmentList') }}
    </h1>

    <!-- 筛选 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('user.organization') }}
          </label>
          <select
            v-model="selectedOrganization"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @change="loadDepartments"
          >
            <option value="">{{ t('common.select') }}</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-4 flex justify-end">
      <button
        @click="openCreateModal"
        :disabled="!selectedOrganization"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ t('department.createDepartment') }}
      </button>
    </div>

    <!-- 部门列表表格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('department.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('department.code') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('department.organization') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('department.departmentType') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('department.memberCount') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.loading') }}...
              </td>
            </tr>
            <tr v-else-if="!selectedOrganization">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('department.selectOrganization') }}
              </td>
            </tr>
            <tr v-else-if="departments.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.noData') }}
              </td>
            </tr>
            <tr v-else v-for="dept in departments" :key="dept.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ dept.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ dept.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getOrganizationName(dept.organization_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ dept.department_type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ dept.member_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(dept)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ t('common.edit') }}
                  </button>
                  <button
                    @click="openDeleteModal(dept)"
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

    <!-- 创建/编辑部门弹窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? t('department.editDepartment') : t('department.createDepartment') }}
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
              {{ t('department.name') }} *
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
              {{ t('department.departmentType') }} *
            </label>
            <input
              v-model="formData.department_type"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div v-if="!isEditMode">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('department.organization') }} *
            </label>
            <select
              v-model="formData.organization_id"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">{{ t('common.select') }}</option>
              <option v-for="org in organizations" :key="org.id" :value="org.id">
                {{ org.name }}
              </option>
            </select>
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
            {{ t('department.confirmDelete') }}
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ t('department.deleteWarning') }}: {{ deptToDelete?.name }}
          </p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('department.deleteReason') }}
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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
  getOrganizationDepartmentsApi
} from '@/api/department'
import { listOrganizationsApi } from '@/api/organization'
import type { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '@/types/department'
import type { Organization } from '@/types/organization'

const { t } = useI18n()

const departments = ref<Department[]>([])
const organizations = ref<Organization[]>([])
const selectedOrganization = ref('')
const loading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const deptToDelete = ref<Department | null>(null)
const deleteReason = ref('')

const formData = ref<CreateDepartmentRequest | UpdateDepartmentRequest>({
  name: '',
  organization_id: '',
  department_type: ''
})

const loadOrganizations = async () => {
  try {
    const res = await listOrganizationsApi({ fetch_all: true })
    organizations.value = res.organizations
  } catch (error) {
    console.error('Failed to load organizations:', error)
  }
}

const loadDepartments = async () => {
  if (!selectedOrganization.value) {
    departments.value = []
    return
  }
  loading.value = true
  try {
    const res = await getOrganizationDepartmentsApi(selectedOrganization.value, { fetch_all: true })
    departments.value = (res as any).departments || []
  } catch (error) {
    console.error('Failed to load departments:', error)
  } finally {
    loading.value = false
  }
}

const getOrganizationName = (orgId: string) => {
  const org = organizations.value.find(o => o.id === orgId)
  return org?.name || '-'
}

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    organization_id: selectedOrganization.value,
    department_type: ''
  }
  showModal.value = true
}

const openEditModal = (dept: Department) => {
  isEditMode.value = true
  formData.value = {
    name: dept.name,
    department_type: dept.department_type
  }
  deptToDelete.value = dept
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  deptToDelete.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditMode.value && deptToDelete.value) {
      await updateDepartmentApi(deptToDelete.value.id, formData.value as UpdateDepartmentRequest)
    } else {
      await createDepartmentApi(formData.value as CreateDepartmentRequest)
    }
    closeModal()
    loadDepartments()
  } catch (error) {
    console.error('Failed to save department:', error)
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (dept: Department) => {
  deptToDelete.value = dept
  deleteReason.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deptToDelete.value = null
  deleteReason.value = ''
}

const handleDelete = async () => {
  if (!deptToDelete.value) return
  deleting.value = true
  try {
    await deleteDepartmentApi(deptToDelete.value.id, { reason: deleteReason.value })
    closeDeleteModal()
    loadDepartments()
  } catch (error) {
    console.error('Failed to delete department:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadOrganizations()
})
</script>