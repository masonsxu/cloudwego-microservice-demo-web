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
import { PermissionLevel as PermissionLevelEnum } from '@/constants/permission'
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
    // 先获取角色的菜单权限（实时配置，来自 /menu-tree 接口）
    const roleTreeRes = await getRoleMenuTreeApi(props.role.id)
    console.log('角色菜单树响应:', roleTreeRes)
    const roleMenuTree = roleTreeRes.menu_tree || []
    console.log('角色菜单树:', roleMenuTree)

    // 构建权限映射（使用角色菜单树的实时配置）
    menuConfigs.value = new Map()
    buildMenuConfigsFromTree(roleMenuTree)
    console.log('权限配置 Map:', Object.fromEntries(menuConfigs.value))

    // 获取完整菜单树（用于确保显示所有菜单项，包括权限为 none 的）
    const fullTreeRes = await getMenuTreeApi()
    console.log('完整菜单树响应:', fullTreeRes)
    const fullMenuTree = fullTreeRes.menu_tree || []

    // 对于完整菜单树中但角色菜单树中没有的菜单项，设置为 none
    const roleMenuIds = new Set<string>()
    collectMenuIds(roleMenuTree, roleMenuIds)
    setMissingMenusToNone(fullMenuTree, roleMenuIds)

    // 使用完整菜单树作为显示结构，但权限配置来自角色菜单树（实时配置）
    menuTree.value = fullMenuTree
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

const collectMenuIds = (menus: MenuNode[], ids: Set<string>) => {
  menus.forEach(menu => {
    ids.add(menu.id)
    if (menu.children && menu.children.length > 0) {
      collectMenuIds(menu.children, ids)
    }
  })
}

const setMissingMenusToNone = (menus: MenuNode[], roleMenuIds: Set<string>) => {
  menus.forEach(menu => {
    if (!roleMenuIds.has(menu.id) && !menuConfigs.value.has(menu.id)) {
      menuConfigs.value.set(menu.id, PermissionLevelEnum.NONE)
    }
    if (menu.children && menu.children.length > 0) {
      setMissingMenusToNone(menu.children, roleMenuIds)
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
