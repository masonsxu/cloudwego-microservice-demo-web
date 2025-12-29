<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.dashboard') }}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- 用户统计 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('dashboard.totalUsers') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              <span v-if="loading.users" class="animate-pulse">--</span>
              <span v-else>{{ stats.userCount }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 组织统计 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('dashboard.totalOrganizations') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              <span v-if="loading.organizations" class="animate-pulse">--</span>
              <span v-else>{{ stats.organizationCount }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 角色统计 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('dashboard.totalRoles') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              <span v-if="loading.roles" class="animate-pulse">--</span>
              <span v-else>{{ stats.roleCount }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 部门统计 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('dashboard.totalDepartments') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              <span v-if="loading.departments" class="animate-pulse">--</span>
              <span v-else>{{ stats.departmentCount }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 欢迎卡片 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('dashboard.welcome') }}, {{ authStore.realName }}!
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('dashboard.welcomeMessage') }}
      </p>
    </div>

    <!-- 快捷操作 -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link
        to="/user/list"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ t('dashboard.manageUsers') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ t('dashboard.manageUsersDesc') }}
        </p>
      </router-link>

      <router-link
        to="/organization/list"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ t('dashboard.manageOrganizations') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ t('dashboard.manageOrganizationsDesc') }}
        </p>
      </router-link>

      <router-link
        to="/role/list"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {{ t('dashboard.manageRoles') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          {{ t('dashboard.manageRolesDesc') }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { listUsersApi } from '@/api/user'
import { listOrganizationsApi } from '@/api/organization'
import { listRolesApi } from '@/api/role'
import { listDepartmentsApi } from '@/api/department'

const { t } = useI18n()
const authStore = useAuthStore()

const stats = reactive({
  userCount: 0,
  organizationCount: 0,
  roleCount: 0,
  departmentCount: 0
})

const loading = reactive({
  users: true,
  organizations: true,
  roles: true,
  departments: true
})

const fetchStats = async () => {
  // 并行获取所有统计数据
  const [usersRes, orgsRes, rolesRes, deptsRes] = await Promise.allSettled([
    listUsersApi({ page: 1, limit: 1, include_total: true }),
    listOrganizationsApi({ page: 1, limit: 1 }),
    listRolesApi({ page: 1, limit: 1 }),
    listDepartmentsApi({ page: 1, limit: 1 })
  ])

  // 处理用户统计
  if (usersRes.status === 'fulfilled' && usersRes.value?.page) {
    stats.userCount = usersRes.value.page.total || 0
  }
  loading.users = false

  // 处理组织统计
  if (orgsRes.status === 'fulfilled') {
    if (orgsRes.value?.page) {
      stats.organizationCount = orgsRes.value.page.total || 0
    } else if (orgsRes.value?.organizations) {
      stats.organizationCount = orgsRes.value.organizations.length
    }
  }
  loading.organizations = false

  // 处理角色统计
  if (rolesRes.status === 'fulfilled') {
    if (rolesRes.value?.page) {
      stats.roleCount = rolesRes.value.page.total || 0
    } else if (rolesRes.value?.roles) {
      stats.roleCount = rolesRes.value.roles.length
    }
  }
  loading.roles = false

  // 处理部门统计
  if (deptsRes.status === 'fulfilled') {
    if (deptsRes.value?.page) {
      stats.departmentCount = deptsRes.value.page.total || 0
    } else if (deptsRes.value?.departments) {
      stats.departmentCount = deptsRes.value.departments.length
    }
  }
  loading.departments = false
}

onMounted(() => {
  fetchStats()
})
</script>
