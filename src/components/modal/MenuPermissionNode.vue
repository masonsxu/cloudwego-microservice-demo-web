<template>
  <div class="menu-permission-node">
    <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
      <!-- 展开/折叠按钮 -->
      <button
        v-if="hasChildren"
        @click="toggleExpand"
        class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform"
          :class="{ 'rotate-90': isExpanded }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <div v-else class="w-6"></div>

      <!-- 菜单信息 -->
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
          {{ menu.name }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ menu.path }}
        </div>
      </div>

      <!-- 权限选择 -->
      <div class="flex items-center gap-1">
        <button
          v-for="level in permissionLevels"
          :key="level.value"
          @click="selectPermission(level.value)"
          :class="[
            'px-2 py-1 text-xs font-medium rounded transition-colors',
            currentPermission === level.value
              ? level.activeClass
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ level.label }}
        </button>
      </div>
    </div>

    <!-- 子菜单 -->
    <div v-if="isExpanded && hasChildren" class="ml-6 border-l-2 border-gray-200 dark:border-gray-700">
      <MenuPermissionNode
        v-for="child in children"
        :key="child.id"
        :menu="child"
        :menu-configs="menuConfigs"
        @update="(menuId, level) => $emit('update', menuId, level)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MenuNode, PermissionLevel } from '@/types/menu'

const props = defineProps<{
  menu: MenuNode
  menuConfigs: Map<string, PermissionLevel>
}>()

const emit = defineEmits<{
  update: [menuId: string, level: PermissionLevel]
}>()

const { t } = useI18n()

const isExpanded = ref(true)

const hasChildren = computed(() => {
  return props.menu.children && props.menu.children.length > 0
})

const children = computed(() => {
  return props.menu.children || []
})

const currentPermission = computed(() => {
  return props.menuConfigs.get(props.menu.id) || 'none'
})

const permissionLevels = computed(() => [
  {
    value: 'none' as PermissionLevel,
    label: t('menuConfig.none'),
    activeClass: 'bg-gray-500 text-white'
  },
  {
    value: 'read' as PermissionLevel,
    label: t('menuConfig.read'),
    activeClass: 'bg-yellow-500 text-white'
  },
  {
    value: 'write' as PermissionLevel,
    label: t('menuConfig.write'),
    activeClass: 'bg-blue-500 text-white'
  },
  {
    value: 'full' as PermissionLevel,
    label: t('menuConfig.full'),
    activeClass: 'bg-green-500 text-white'
  }
])

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const selectPermission = (level: PermissionLevel) => {
  emit('update', props.menu.id, level)
}
</script>
