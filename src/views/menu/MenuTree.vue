<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('menu.menuTree') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('menu.menuTreeSubtitle') || '管理您的菜单权限配置' }}
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-4 flex gap-4">
      <button
        @click="openUploadModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        {{ t('menuConfig.uploadConfig') }}
      </button>
      <button
        @click="loadMenuTree"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
        </svg>
        {{ t('common.refresh') }}
      </button>
    </div>

    <!-- 菜单树 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <!-- 标题栏 -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
          {{ t('menu.menuTree') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ t('menu.menuTreeDesc') || '查看您的菜单权限配置' }}
        </p>
      </div>

      <!-- 内容区域 -->
      <div class="p-6">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ t('common.loading') }}...</span>
          </div>
        </div>
        <div v-else-if="menuTree.length === 0" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div class="text-gray-500 dark:text-gray-400 font-medium">{{ t('common.noData') }}</div>
        </div>
        <div v-else class="space-y-3">
          <MenuTreeNode
            v-for="menu in menuTree"
            :key="menu.id"
            :menu="menu"
          />
        </div>
      </div>
    </div>

    <!-- 上传配置弹窗 -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ t('menuConfig.uploadConfig') }}
          </h2>
          <button @click="closeUploadModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('menuConfig.selectFile') }}
            </label>
            <input
              type="file"
              accept=".json,.yaml,.yml"
              @change="handleFileChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ t('menuConfig.fileFormatHint') }}
            </p>
          </div>
          <div v-if="uploadError" class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {{ uploadError }}
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            @click="closeUploadModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="handleUpload"
            :disabled="!selectedFile || uploading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ uploading ? t('common.uploading') : t('common.upload') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUserMenuTreeApi, getMenuTreeApi, uploadMenuConfigApi } from '@/api/menu'
import type { MenuNode } from '@/types/menu'
import MenuTreeNode from '@/components/tree/MenuTreeNode.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const menuTree = ref<MenuNode[]>([])
const loading = ref(false)
const showUploadModal = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const uploadError = ref('')

// 构建权限映射
const buildPermissionMap = (menus: MenuNode[], map: Map<string, string>) => {
  menus.forEach(menu => {
    map.set(menu.id, menu.permission_level)
    if (menu.children && menu.children.length > 0) {
      buildPermissionMap(menu.children, map)
    }
  })
}

// 收集菜单ID
const collectMenuIds = (menus: MenuNode[], ids: Set<string>) => {
  menus.forEach(menu => {
    ids.add(menu.id)
    if (menu.children && menu.children.length > 0) {
      collectMenuIds(menu.children, ids)
    }
  })
}

// 合并权限到完整菜单树
const mergePermissions = (fullTree: MenuNode[], permissionMap: Map<string, string>, userMenuIds: Set<string>) => {
  fullTree.forEach(menu => {
    // 如果用户菜单树中有这个菜单，使用用户菜单树的权限
    if (permissionMap.has(menu.id)) {
      menu.permission_level = permissionMap.get(menu.id) as any
    } else if (!userMenuIds.has(menu.id)) {
      // 如果用户菜单树中没有这个菜单，设置为无权限
      menu.permission_level = 'none'
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length > 0) {
      mergePermissions(menu.children, permissionMap, userMenuIds)
    }
  })
}

const loadMenuTree = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')
    return
  }

  loading.value = true
  try {
    // 获取用户菜单树（包含用户有权限的菜单）
    const userTreeRes = await getUserMenuTreeApi(authStore.user.id)
    const userMenuTree = userTreeRes.menu_tree || []
    console.log('用户菜单树:', userMenuTree)

    // 构建权限映射
    const permissionMap = new Map<string, string>()
    buildPermissionMap(userMenuTree, permissionMap)

    // 收集用户菜单ID
    const userMenuIds = new Set<string>()
    collectMenuIds(userMenuTree, userMenuIds)

    // 获取完整菜单树（所有菜单项）
    const fullTreeRes = await getMenuTreeApi()
    const fullMenuTree = fullTreeRes.menu_tree || []
    console.log('完整菜单树:', fullMenuTree)

    // 合并权限信息
    mergePermissions(fullMenuTree, permissionMap, userMenuIds)

    menuTree.value = fullMenuTree

    // 打印权限信息用于调试
    if (fullMenuTree.length > 0) {
      console.log('合并后的第一个菜单权限:', fullMenuTree[0].permission_level)
    }
  } catch (error) {
    console.error('Failed to load menu tree:', error)
  } finally {
    loading.value = false
  }
}

const openUploadModal = () => {
  showUploadModal.value = true
  selectedFile.value = null
  uploadError.value = ''
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  uploadError.value = ''
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    uploadError.value = ''
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  uploadError.value = ''

  try {
    await uploadMenuConfigApi(selectedFile.value)
    closeUploadModal()
    loadMenuTree()
  } catch (error: any) {
    uploadError.value = error.response?.data?.base_resp?.message || t('menuConfig.uploadFailed')
  } finally {
    uploading.value = false
  }
}

onMounted(() => {
  loadMenuTree()
})
</script>
