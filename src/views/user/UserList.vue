<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.userList') }}
    </h1>

    <!-- 搜索和筛选 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('user.search') }}
          </label>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('user.searchPlaceholder')"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @keyup.enter="loadUsers"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('user.status') }}
          </label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @change="loadUsers"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="1">{{ t('user.statusActive') }}</option>
            <option value="0">{{ t('user.statusInactive') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ t('user.organization') }}
          </label>
          <select
            v-model="organizationFilter"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            @change="loadUsers"
          >
            <option value="">{{ t('common.all') }}</option>
            <option v-for="org in organizations" :key="org.id" :value="org.id">
              {{ org.name }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadUsers"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ t('common.search') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-4 flex justify-end">
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {{ t('user.addUser') }}
      </button>
    </div>

    <!-- 用户列表表格 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('user.username') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('user.realName') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('user.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('user.phone') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('user.organization') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('user.status') }}
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
            <tr v-else-if="users.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                {{ t('common.noData') }}
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ user.username }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ user.real_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ user.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getOrganizationName(user.organization_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    user.status === 1
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]"
                >
                  {{ user.status === 1 ? t('user.statusActive') : t('user.statusInactive') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(user)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ t('common.edit') }}
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="[
                      user.status === 1 ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                    ]"
                  >
                    {{ user.status === 1 ? t('user.disable') : t('user.enable') }}
                  </button>
                  <button
                    @click="openDeleteModal(user)"
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

      <!-- 分页 -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          {{ t('common.showing') }} {{ users.length }} {{ t('common.entries') }}
        </div>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
          >
            {{ t('common.previous') }}
          </button>
          <span class="px-3 py-1 dark:text-white">{{ currentPage }}</span>
          <button
            @click="nextPage"
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          >
            {{ t('common.next') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑用户弹窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? t('user.editUser') : t('user.addUser') }}
          </h2>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('user.username') }} *
              </label>
              <input
                v-model="formData.username"
                type="text"
                required
                :disabled="isEditMode"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div v-if="!isEditMode">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('user.password') }} *
              </label>
              <input
                v-model="formData.password"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                {{ t('user.organization') }} *
              </label>
              <select
                v-model="formData.organization_id"
                required
                :disabled="isEditMode"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">{{ t('common.select') }}</option>
                <option v-for="org in organizations" :key="org.id" :value="org.id">
                  {{ org.name }}
                </option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('user.roles') }} *
              </label>
              <div class="grid grid-cols-2 gap-2">
                <label v-for="role in roles" :key="role.id" class="flex items-center gap-2">
                  <input
                    v-model="formData.role_ids"
                    type="checkbox"
                    :value="role.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ role.name }}</span>
                </label>
              </div>
            </div>
            <div v-if="!isEditMode">
              <label class="flex items-center gap-2">
                <input
                  v-model="formData.must_change_password"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('user.forceChangePassword') }}</span>
              </label>
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
            {{ t('user.confirmDelete') }}
          </h2>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ t('user.deleteWarning') }}: {{ userToDelete?.username }}
          </p>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('user.deleteReason') }}
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
  listUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  changeUserStatusApi
} from '@/api/user'
import { listOrganizationsApi } from '@/api/organization'
import { listRolesApi } from '@/api/role'
import type { UserProfile, CreateUserRequest, UpdateUserRequest } from '@/types/user'
import type { Organization } from '@/types/organization'
import type { RoleDefinition } from '@/types/role'

const { t } = useI18n()

const users = ref<UserProfile[]>([])
const organizations = ref<Organization[]>([])
const roles = ref<RoleDefinition[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const statusFilter = ref('')
const organizationFilter = ref('')

const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const userToDelete = ref<UserProfile | null>(null)
const deleteReason = ref('')

const formData = ref<CreateUserRequest | UpdateUserRequest>({
  username: '',
  password: '',
  real_name: '',
  email: '',
  phone: '',
  organization_id: '',
  role_ids: [],
  must_change_password: false
})

const loadUsers = async () => {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value,
      limit: pageSize.value
    }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    if (statusFilter.value) {
      params.status = parseInt(statusFilter.value)
    }
    if (organizationFilter.value) {
      params.organization_id = organizationFilter.value
    }
    const res = await listUsersApi(params)
    users.value = res.users
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const loadOrganizations = async () => {
  try {
    const res = await listOrganizationsApi({ fetch_all: true })
    organizations.value = res.organizations
  } catch (error) {
    console.error('Failed to load organizations:', error)
  }
}

const loadRoles = async () => {
  try {
    const res = await listRolesApi({ fetch_all: true })
    roles.value = res.roles
  } catch (error) {
    console.error('Failed to load roles:', error)
  }
}

const getOrganizationName = (orgId: string) => {
  const org = organizations.value.find(o => o.id === orgId)
  return org?.name || '-'
}

const openCreateModal = () => {
  isEditMode.value = false
  formData.value = {
    username: '',
    password: '',
    real_name: '',
    email: '',
    phone: '',
    organization_id: '',
    role_ids: [],
    must_change_password: false
  }
  showModal.value = true
}

const openEditModal = (user: UserProfile) => {
  isEditMode.value = true
  formData.value = {
    real_name: user.real_name,
    email: user.email,
    phone: user.phone,
    organization_id: user.organization_id,
    role_ids: user.role_ids
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditMode.value) {
      const user = users.value.find(u => u.username === formData.value.username)
      if (user) {
        await updateUserApi(user.id, formData.value as UpdateUserRequest)
      }
    } else {
      await createUserApi(formData.value as CreateUserRequest)
    }
    closeModal()
    loadUsers()
  } catch (error) {
    console.error('Failed to save user:', error)
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (user: UserProfile) => {
  userToDelete.value = user
  deleteReason.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
  deleteReason.value = ''
}

const handleDelete = async () => {
  if (!userToDelete.value) return
  deleting.value = true
  try {
    await deleteUserApi(userToDelete.value.id, { reason: deleteReason.value })
    closeDeleteModal()
    loadUsers()
  } catch (error) {
    console.error('Failed to delete user:', error)
  } finally {
    deleting.value = false
  }
}

const toggleUserStatus = async (user: UserProfile) => {
  const newStatus = user.status === 1 ? 0 : 1
  try {
    await changeUserStatusApi(user.id, {
      new_status: newStatus,
      reason: newStatus === 0 ? t('user.disableReason') : t('user.enableReason')
    })
    loadUsers()
  } catch (error) {
    console.error('Failed to change user status:', error)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}

const nextPage = () => {
  currentPage.value++
  loadUsers()
}

onMounted(() => {
  loadUsers()
  loadOrganizations()
  loadRoles()
})
</script>