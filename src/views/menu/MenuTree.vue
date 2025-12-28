<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ t('menu.menuTree') }}
    </h1>

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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">{{ t('common.loading') }}...</div>
      </div>
      <div v-else-if="menuTree.length === 0" class="text-center py-8">
        <div class="text-gray-500 dark:text-gray-400">{{ t('common.noData') }}</div>
      </div>
      <div v-else>
        <div v-for="menu in menuTree" :key="menu.id" class="mb-2">
          <MenuTreeNode :menu="menu" />
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
import { getMenuTreeApi, uploadMenuConfigApi } from '@/api/menu'
import type { MenuNode } from '@/types/menu'
import MenuTreeNode from '@/components/tree/MenuTreeNode.vue'

const { t } = useI18n()

const menuTree = ref<MenuNode[]>([])
const loading = ref(false)
const showUploadModal = ref(false)
const uploading = ref(false)
const selectedFile = ref<File | null>(null)
const uploadError = ref('')

const loadMenuTree = async () => {
  loading.value = true
  try {
    const res = await getMenuTreeApi()
    menuTree.value = res.menu_tree || []
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