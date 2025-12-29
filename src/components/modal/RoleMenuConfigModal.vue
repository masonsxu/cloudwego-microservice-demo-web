<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ t('role.configureMenuPermissions') }}: {{ role?.name }}
        </h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="loading" class="text-center py-8">
          <div class="text-gray-500 dark:text-gray-400">{{ t('common.loading') }}...</div>
        </div>
        <div v-else-if="menuTree.length === 0" class="text-center py-8">
          <div class="text-gray-500 dark:text-gray-400">{{ t('common.noData') }}</div>
        </div>
        <div v-else class="space-y-2">
          <MenuPermissionNode
            v-for="menu in menuTree"
            :key="menu.id"
            :menu="menu"
            :menu-configs="menuConfigs"
            @update="updateMenuConfig"
          />
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          @click="handleSave"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {{ saving ? t('common.saving') : t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRoleMenuTreeApi, configureRoleMenusApi, getMenuTreeApi } from '@/api/menu'
import type { MenuNode, MenuConfig, PermissionLevel } from '@/types/menu'
import type { RoleDefinition } from '@/types/role'
import MenuPermissionNode from './MenuPermissionNode.vue'

const props = defineProps<{
  role: RoleDefinition | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const menuTree = ref<MenuNode[]>([])
const menuConfigs = ref<Map<string, PermissionLevel>>(new Map())

const loadMenuTree = async () => {
  if (!props.role) return

  loading.value = true
  try {
    // 获取完整菜单树
    const fullTreeRes = await getMenuTreeApi()
    menuTree.value = fullTreeRes.menu_tree || []

    // 获取角色的菜单权限
    const roleTreeRes = await getRoleMenuTreeApi(props.role.id)
    const roleMenuTree = roleTreeRes.menu_tree || []

    // 构建权限映射
    menuConfigs.value = new Map()
    buildMenuConfigsFromTree(roleMenuTree)
  } catch (error) {
    console.error('Failed to load menu tree:', error)
  } finally {
    loading.value = false
  }
}

const buildMenuConfigsFromTree = (menus: MenuNode[]) => {
  menus.forEach(menu => {
    menuConfigs.value.set(menu.id, menu.permission_level)
    if (menu.children && menu.children.length > 0) {
      buildMenuConfigsFromTree(menu.children)
    }
  })
}

const updateMenuConfig = (menuId: string, level: PermissionLevel) => {
  menuConfigs.value.set(menuId, level)
}

const handleSave = async () => {
  if (!props.role) return

  saving.value = true
  try {
    const configs: MenuConfig[] = []
    menuConfigs.value.forEach((permission, menu_id) => {
      configs.push({ menu_id, permission })
    })

    await configureRoleMenusApi(props.role.id, { menu_configs: configs })
    emit('saved')
  } catch (error) {
    console.error('Failed to save menu configs:', error)
  } finally {
    saving.value = false
  }
}

watch(() => props.role, (newRole) => {
  if (newRole) {
    loadMenuTree()
  }
}, { immediate: true })
</script>
