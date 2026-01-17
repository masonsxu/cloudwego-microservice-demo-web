<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
    <div class="p-6 lg:p-8 max-w-7xl mx-auto">
      <!-- 页面头部 -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-3">
          <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {{ t('menu.menuTree') }}
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              {{ t('menu.menuTreeSubtitle') || '管理您的菜单权限配置' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="mb-6 flex flex-wrap gap-3">
        <button
          @click="openUploadModal"
          class="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          {{ t('menuConfig.uploadConfig') }}
        </button>
        <button
          @click="loadMenuTree"
          class="group px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 shadow-md border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500 transition-transform group-hover:rotate-180 duration-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          {{ t('common.refresh') }}
        </button>
      </div>

      <!-- 权限图例 -->
      <div class="mb-6 flex flex-wrap items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('menuConfig.permissionLegend') || '权限图例' }}:</span>
        <div class="flex flex-wrap gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            {{ t('menuConfig.full') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
            {{ t('menuConfig.write') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
            {{ t('menuConfig.read') }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shadow-sm">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/></svg>
            {{ t('menuConfig.none') }}
          </span>
        </div>
      </div>

      <!-- 菜单树卡片 -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <!-- 标题栏 -->
        <div class="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ t('menu.menuTree') }}
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('menu.menuTreeDesc') || '查看您的菜单权限配置' }}
                </p>
              </div>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ menuTree.length }} {{ t('menu.totalMenus') || '个菜单' }}
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-16">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p class="mt-4 text-gray-500 dark:text-gray-400 font-medium">{{ t('common.loading') }}...</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="menuTree.length === 0" class="flex flex-col items-center justify-center py-16">
            <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('common.noData') }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('menu.noMenuHint') || '暂无菜单数据，请上传配置文件' }}</p>
          </div>

          <!-- 菜单树列表 -->
          <div v-else class="space-y-4">
            <MenuTreeNode
              v-for="menu in menuTree"
              :key="menu.id"
              :menu="menu"
              :depth="0"
            />
          </div>
        </div>
      </div>

      <!-- 上传配置弹窗 -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showUploadModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-4"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-4"
            >
              <div v-if="showUploadModal" class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                <!-- 弹窗头部 -->
                <div class="px-6 py-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                      <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                        {{ t('menuConfig.uploadConfig') }}
                      </h2>
                    </div>
                    <button
                      @click="closeUploadModal"
                      class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 弹窗内容 -->
                <div class="px-6 py-6">
                  <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {{ t('menuConfig.selectFile') }}
                    </label>
                    <!-- 拖拽上传区域 -->
                    <div
                      class="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50/50 dark:bg-gray-700/50"
                      @click="triggerFileInput"
                      @dragover.prevent
                      @drop.prevent="handleDrop"
                    >
                      <input
                        ref="fileInputRef"
                        type="file"
                        accept=".json,.yaml,.yml"
                        @change="handleFileChange"
                        class="hidden"
                      />
                      <div class="flex flex-col items-center">
                        <div class="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {{ selectedFile ? selectedFile.name : (t('menuConfig.dragOrClick') || '拖拽文件到此处或点击上传') }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ t('menuConfig.fileFormatHint') }}
                        </p>
                      </div>
                      <!-- 已选文件显示 -->
                      <div v-if="selectedFile" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center gap-3">
                        <div class="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ selectedFile.name }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile.size) }}</p>
                        </div>
                        <button
                          @click.stop="clearSelectedFile"
                          class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 错误提示 -->
                  <Transition
                    enter-active-class="transition-all duration-200"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition-all duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div v-if="uploadError" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm">{{ uploadError }}</span>
                    </div>
                  </Transition>
                </div>

                <!-- 弹窗底部 -->
                <div class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end gap-3">
                  <button
                    @click="closeUploadModal"
                    class="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium"
                  >
                    {{ t('common.cancel') }}
                  </button>
                  <button
                    @click="handleUpload"
                    :disabled="!selectedFile || uploading"
                    class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                  >
                    <svg v-if="uploading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ uploading ? t('common.uploading') : t('common.upload') }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMenuTreeApi, getUserMenuTreeApi, uploadMenuConfigApi } from '@/api/menu'
import MenuTreeNode from '@/components/tree/MenuTreeNode.vue'
import { useAuthStore } from '@/stores/auth'
import type { MenuNode } from '@/types/menu'
import { PermissionUtils } from '@/utils/permission'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()

const menuTree = ref<MenuNode[]>([])
const loading = ref(false)
const showUploadModal = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const uploadError = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const loadMenuTree = async () => {
  if (!authStore.user?.id) {
    console.error('User ID not found')
    return
  }

  loading.value = true
  try {
    // 获取用户菜单树（后端返回的用户可访问的菜单树和权限信息）
    const userTreeRes = await getUserMenuTreeApi(authStore.user.id)
    const userMenuTree = userTreeRes.menu_tree || []
    // 优先使用 API 返回的权限数据，如果为空则使用 authStore 中存储的权限数据
    const permissions = userTreeRes.permissions && userTreeRes.permissions.length > 0
      ? userTreeRes.permissions
      : (authStore.permissions || [])

    console.log('用户菜单树（后端返回）:', userTreeRes)
    console.log('用户菜单树数据:', userMenuTree)
    console.log('API 返回的权限数据:', userTreeRes.permissions)
    console.log('AuthStore 中的权限数据:', authStore.permissions)
    console.log('最终使用的权限数据:', permissions)

    // 获取完整菜单树（所有菜单项）
    const fullTreeRes = await getMenuTreeApi()
    const fullMenuTree = fullTreeRes.menu_tree || []
    console.log('完整菜单树:', fullTreeRes)

    // 构建权限映射表
    const permissionMap = PermissionUtils.buildPermissionMap(permissions)
    console.log('权限映射表内容:', Object.fromEntries(permissionMap))

    // 打印菜单树中的所有 ID，用于调试
    const collectMenuIds = (menus: MenuNode[], ids: string[] = []): string[] => {
      menus.forEach(menu => {
        ids.push(menu.id)
        if (menu.children && menu.children.length > 0) {
          collectMenuIds(menu.children, ids)
        }
      })
      return ids
    }
    const userMenuIds = collectMenuIds(userMenuTree)
    const fullMenuIds = collectMenuIds(fullMenuTree)
    console.log('用户菜单树中的所有 ID:', userMenuIds)
    console.log('完整菜单树中的所有 ID:', fullMenuIds)
    console.log('权限数据中的所有 menu_id:', permissions.map(p => p.menu_id))

    // 如果用户菜单树已经包含了所有菜单，直接使用并合并权限
    const countMenus = (menus: MenuNode[]): number => {
      let count = menus.length
      menus.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          count += countMenus(menu.children)
        }
      })
      return count
    }

    const userMenuCount = countMenus(userMenuTree)
    const fullMenuCount = countMenus(fullMenuTree)
    console.log(`用户菜单数量: ${userMenuCount}, 完整菜单数量: ${fullMenuCount}`)

    // 如果用户菜单树已经包含了所有菜单，直接使用并合并权限
    if (userMenuCount >= fullMenuCount && userMenuTree.length > 0) {
      console.log('使用后端返回的完整菜单树，合并权限信息')
      // 始终使用权限映射表来合并权限，确保权限信息正确
      PermissionUtils.mergePermissionsToMenuTree(userMenuTree, permissionMap)
      menuTree.value = userMenuTree
    } else {
      // 如果用户菜单树不完整，使用完整菜单树并合并权限
      console.log('用户菜单树不完整，使用完整菜单树并合并权限...')
      PermissionUtils.mergePermissionsToMenuTree(fullMenuTree, permissionMap)
      menuTree.value = fullMenuTree
    }

    // 打印权限信息用于调试
    if (fullMenuTree.length > 0) {
      console.log('合并后的第一个菜单权限:', fullMenuTree[0].permission_level)
      console.log('合并后的菜单树:', fullMenuTree)
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

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理拖拽放置
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    // 检查文件类型
    const validExtensions = ['.json', '.yaml', '.yml']
    const fileName = file.name.toLowerCase()
    const isValid = validExtensions.some(ext => fileName.endsWith(ext))

    if (isValid) {
      selectedFile.value = file
      uploadError.value = ''
    } else {
      uploadError.value = t('menuConfig.invalidFileType') || '不支持的文件类型，请上传 .json、.yaml 或 .yml 文件'
    }
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// 清除选中的文件
const clearSelectedFile = () => {
  selectedFile.value = null
  uploadError.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

onMounted(() => {
  loadMenuTree()
})
</script>
