import { defineStore } from 'pinia'
import { listOrganizationsApi, createOrganizationApi, updateOrganizationApi, deleteOrganizationApi } from '@/api/organization'
import type { Organization, CreateOrganizationRequest, UpdateOrganizationRequest, DeleteOrganizationRequest, ListOrganizationsRequest } from '@/types'

interface OrganizationState {
  organizations: Organization[]
  currentOrganization: Organization | null
  loading: boolean
}

export const useOrganizationStore = defineStore('organization', {
  state: (): OrganizationState => ({
    organizations: [],
    currentOrganization: null,
    loading: false
  }),

  actions: {
    async fetchOrganizations(params?: ListOrganizationsRequest) {
      this.loading = true
      try {
        const res = await listOrganizationsApi(params || {})
        this.organizations = res.organizations
        return res
      } catch (error) {
        console.error('Failed to fetch organizations:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createOrganization(data: CreateOrganizationRequest) {
      this.loading = true
      try {
        const res = await createOrganizationApi(data)
        this.organizations.push(res.organization)
        return res.organization
      } catch (error) {
        console.error('Failed to create organization:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateOrganization(organizationId: string, data: UpdateOrganizationRequest) {
      this.loading = true
      try {
        const res = await updateOrganizationApi(organizationId, data)
        const index = this.organizations.findIndex(org => org.id === organizationId)
        if (index !== -1) {
          this.organizations[index] = res.organization
        }
        return res.organization
      } catch (error) {
        console.error('Failed to update organization:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrganization(organizationId: string, data?: DeleteOrganizationRequest) {
      this.loading = true
      try {
        await deleteOrganizationApi(organizationId, data || {})
        this.organizations = this.organizations.filter(org => org.id !== organizationId)
      } catch (error) {
        console.error('Failed to delete organization:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})