<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.roleList') }}
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
        {{ t('role.createRole') }}
      </button>
    </div>

    <!-- 角色列表表格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('role.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('role.description') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('role.isSystemRole') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('role.permissions') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.loading') }}...
              </td>
            </tr>
            <tr v-else-if="roles.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.noData') }}
              </td>
            </tr>
            <tr v-else v-for="role in roles" :key="role.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ role.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {{ role.description || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    role.is_system_role
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ role.is_system_role ? t('common.yes') : t('common.no') }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                {{ role.permissions?.length || 0 }} {{ t('role.permissions') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(role)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ t('common.edit') }}
                  </button>
                  <button
                    @click="openPermissionsModal(role)"
                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                  >
                    {{ t('role.configurePermissions') }}
                  </button>
                  <button
                    @click="openDeleteModal(role)"
                    :disabled="role.is_system_role"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- 创建/编辑角色弹窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? t('role.editRole') : t('role.createRole') }}
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
              {{ t('role.name') }} *
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
              {{ t('role.description') }}
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
          <div v-if="!isEditMode">
            <label class="flex items-center gap-2">
              <input
                v-model="formData.is_system_role"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('role.isSystemRole') }}</span>
            </label>
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

    <!-- 权限配置弹窗 -->
    <div v-if="showPermissionsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ t('role.configurePermissions') }}: {{ currentRole?.name }}
          </h2>
          <button @click="closePermissionsModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <div v-if="currentRole?.permissions && currentRole.permissions.length > 0" class="space-y-2">
            <div v-for="(perm, index) in currentRole.permissions" :key="index" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span class="font-medium text-gray-900 dark:text-white">{{ perm.resource }}</span>
              <span class="text-gray-500 dark:text-gray-400">:</span>
              <span class="text-blue-600 dark:text-blue-400">{{ perm.action }}</span>
              <span v-if="perm.description" class="text-gray-500 dark:text-gray-400 text-sm">- {{ perm.description }}</span>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            {{ t('common.noData') }}
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            @click="closePermissionsModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ t('common.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t('role.confirmDelete') }}
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ t('role.deleteWarning') }}: {{ roleToDelete?.name }}
          </p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('role.deleteReason') }}
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
  listRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  getRoleApi
} from '@/api/role'
import type { RoleDefinition, CreateRoleRequest, UpdateRoleRequest } from '@/types/role'

const { t } = useI18n()

const roles = ref<RoleDefinition[]>([])
const loading = ref(false)
const showModal = ref(false)
const showPermissionsModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const roleToDelete = ref<RoleDefinition | null>(null)
const deleteReason = ref('')
const currentRole = ref<RoleDefinition | null>(null)

const formData = ref<CreateRoleRequest | UpdateRoleRequest>({
  name: '',
  description: '',
  is_system_role: false,
  permissions: []
})

const loadRoles = async () => {
  loading.value = true
  try {
    const res = await listRolesApi({ fetch_all: true })
    roles.value = res.roles
  } catch (error) {
    console.error('Failed to load roles:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    description: '',
    is_system_role: false,
    permissions: []
  }
  showModal.value = true
}

const openEditModal = async (role: RoleDefinition) => {
  isEditMode.value = true
  currentRole.value = role
  formData.value = {
    name: role.name,
    description: role.description,
    permissions: role.permissions || []
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  currentRole.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditMode.value && currentRole.value) {
      await updateRoleApi(currentRole.value.id, formData.value as UpdateRoleRequest)
    } else {
      await createRoleApi(formData.value as CreateRoleRequest)
    }
    closeModal()
    loadRoles()
  } catch (error) {
    console.error('Failed to save role:', error)
  } finally {
    submitting.value = false
  }
}

const openPermissionsModal = async (role: RoleDefinition) => {
  try {
    const res = await getRoleApi(role.id)
    currentRole.value = res.role
    showPermissionsModal.value = true
  } catch (error) {
    console.error('Failed to load role permissions:', error)
  }
}

const closePermissionsModal = () => {
  showPermissionsModal.value = false
  currentRole.value = null
}

const openDeleteModal = (role: RoleDefinition) => {
  if (role.is_system_role) {
    alert(t('role.cannotDeleteSystemRole'))
    return
  }
  roleToDelete.value = role
  deleteReason.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  roleToDelete.value = null
  deleteReason.value = ''
}

const handleDelete = async () => {
  if (!roleToDelete.value) return
  deleting.value = true
  try {
    await deleteRoleApi(roleToDelete.value.id, { reason: deleteReason.value })
    closeDeleteModal()
    loadRoles()
  } catch (error) {
    console.error('Failed to delete role:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadRoles()
})
</script>