<template>
  <div class="organization-node">
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

      <img
        v-if="organization.logo"
        :src="organization.logo"
        class="h-8 w-8 rounded-full"
        alt="Logo"
      />
      <div v-else class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
        <span class="text-xs text-gray-600 dark:text-gray-300">
          {{ organization.name.charAt(0) }}
        </span>
      </div>

      <div class="flex-1">
        <div class="text-sm font-medium text-gray-900 dark:text-white">
          {{ organization.name }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ organization.code }} | {{ organization.facility_type }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ organization.member_count }} {{ $t('organization.memberCount') }}
        </span>
        <button
          @click.stop="$emit('edit', organization)"
          class="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click.stop="$emit('delete', organization)"
          class="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isExpanded && hasChildren" class="ml-6 mt-2">
      <OrganizationTreeNode
        v-for="child in children"
        :key="child.id"
        :organization="child"
        :all-organizations="allOrganizations"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Organization } from '@/types/organization'

const props = defineProps<{
  organization: Organization
  allOrganizations: Organization[]
}>()

defineEmits<{
  edit: [organization: Organization]
  delete: [organization: Organization]
}>()

const isExpanded = ref(true)

const hasChildren = computed(() => {
  return props.allOrganizations.some(org => org.parent_id === props.organization.id)
})

const children = computed(() => {
  return props.allOrganizations.filter(org => org.parent_id === props.organization.id)
})

const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}
</script>