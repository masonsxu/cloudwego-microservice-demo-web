import request from './request'
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  DeleteOrganizationRequest,
  UploadLogoRequest,
  BindLogoRequest,
  Organization,
  ListOrganizationsResponse,
  GetOrganizationResponse
} from '@/types/organization'

export const listOrganizationsApi = (params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
  parent_id?: string
  fetch_all?: boolean
}) =>
  request.get<ListOrganizationsResponse>('/v1/identity/organizations', { params })

export const createOrganizationApi = (data: CreateOrganizationRequest) =>
  request.post<GetOrganizationResponse>('/v1/identity/organizations', data)

export const getOrganizationApi = (organizationId: string) =>
  request.get<GetOrganizationResponse>(`/v1/identity/organizations/${organizationId}`)

export const updateOrganizationApi = (organizationId: string, data: UpdateOrganizationRequest) =>
  request.put<GetOrganizationResponse>(`/v1/identity/organizations/${organizationId}`, data)

export const deleteOrganizationApi = (organizationId: string, data: DeleteOrganizationRequest) =>
  request.delete(`/v1/identity/organizations/${organizationId}`, { data })

export const uploadLogoApi = (data: UploadLogoRequest) =>
  request.post('/v1/identity/organization-logos/temporary', data)

export const getLogoApi = (logoId: string) =>
  request.get(`/v1/identity/organization-logos/${logoId}`)

export const deleteLogoApi = (logoId: string) =>
  request.delete(`/v1/identity/organization-logos/${logoId}`)

export const bindLogoApi = (organizationId: string, data: BindLogoRequest) =>
  request.put<GetOrganizationResponse>(`/v1/identity/organizations/${organizationId}/logo`, data)