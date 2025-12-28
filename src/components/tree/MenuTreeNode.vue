<template>
  <div class="menu-node">
    <div
      class="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      @click="toggleExpand"
    >
      <svg
        v-if="hasChildren"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform"
        :class="{ 'rotate-90': isExpanded }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
      <div v-else class="w-4"></div>

      <div v-if="menu.icon" class="text-gray-500 dark:text-gray-400">
        <span v-html="menu.icon"></span>
      </div>

      <div class="flex-1">
        <div class="text-sm font-medium text-gray-900 dark:text-white">
          {{ menu.name }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ menu.path }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getPermissionLevelClass(menu.permission_level)
          ]"
        >
          {{ getPermissionLevelText(menu.permission_level) }}
        </span>
      </div>
    </div>

    <div v-if="isExpanded && hasChildren" class="ml-6 mt-2">
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

const getPermissionLevelClass = (level: string) => {
  switch (level) {
    case 'full':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'write':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'read':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getPermissionLevelText = (level: string) => {
  switch (level) {
    case 'full':
      return t('menuConfig.full')
    case 'write':
      return t('menuConfig.write')
    case 'read':
      return t('menuConfig.read')
    default:
      return t('menuConfig.none')
  }
}
</script>