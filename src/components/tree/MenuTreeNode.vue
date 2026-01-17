<template>
  <div class="menu-node">
    <div
      class="menu-node-item group relative flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 cursor-pointer"
      :class="{ 'mb-2': hasChildren }"
      @click="toggleExpand"
    >
      <!-- 展开/收起图标 -->
      <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        <svg
          v-if="hasChildren"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 dark:text-gray-500 transition-all duration-200"
          :class="{ 'rotate-90 text-blue-500 dark:text-blue-400': isExpanded }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        <div v-else class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>

      <!-- 菜单图标 -->
      <div v-if="menu.icon && isIconHtml(menu.icon)" class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg text-gray-600 dark:text-gray-300" v-html="menu.icon"></div>
      <div v-else class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      <!-- 菜单信息 -->
      <div class="flex-1 min-w-0">
        <div class="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {{ menu.name }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
          {{ menu.path }}
        </div>
      </div>

      <!-- 权限标识 -->
      <div class="flex-shrink-0 flex items-center gap-2">
        <span
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm',
            getPermissionLevelClass(menu.permission_level)
          ]"
        >
          {{ getPermissionLevelText(menu.permission_level) }}
        </span>
      </div>
    </div>

    <!-- 子菜单 -->
    <div v-if="isExpanded && hasChildren" class="ml-8 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <MenuTreeNode
        v-for="child in children"
        :key="child.id"
        :menu="child"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MenuNode } from '@/types/menu'
import { PermissionLevel, PERMISSION_LABEL_KEYS } from '@/constants/permission'

const props = defineProps<{
  menu: MenuNode
}>()

const { t } = useI18n()

const isExpanded = ref(true)

const hasChildren = computed(() => {
  return props.menu.children && props.menu.children.length > 0
})

const children = computed(() => {
  return props.menu.children || []
})

const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const getPermissionLevelClass = (level?: PermissionLevel | string) => {
  switch (level) {
    case PermissionLevel.FULL:
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-200 dark:shadow-green-900'
    case PermissionLevel.WRITE:
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200 dark:shadow-blue-900'
    case PermissionLevel.READ:
      return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-200 dark:shadow-amber-900'
    default:
      return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPermissionLevelText = (level?: PermissionLevel | string) => {
  if (!level) {
    return t(PERMISSION_LABEL_KEYS[PermissionLevel.NONE])
  }
  const labelKey = PERMISSION_LABEL_KEYS[level as PermissionLevel]
  return labelKey ? t(labelKey) : t(PERMISSION_LABEL_KEYS[PermissionLevel.NONE])
}

// 检查图标是否是HTML字符串（包含标签）
const isIconHtml = (icon: string): boolean => {
  if (!icon) return false
  // 如果包含HTML标签，则认为是HTML
  return /<[^>]+>/.test(icon)
}
</script>
