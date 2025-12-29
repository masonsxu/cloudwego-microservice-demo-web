import type { BaseResponse } from './api'

export interface Organization {
  id: string
  name: string
  code: string
  parent_id?: string
  facility_type: string
  accreditation_status: string
  province_city: string[]
  logo?: string
  logo_id?: string
  member_count: number
  children?: Organization[]
  created_at: number
  updated_at: number
}

export interface CreateOrganizationRequest {
  name: string
  parent_id?: string
  facility_type: string
  accreditation_status: string
  province_city: string[]
}

export interface UpdateOrganizationRequest {
  name?: string
  facility_type?: string
  accreditation_status?: string
  province_city?: string[]
}

export interface DeleteOrganizationRequest {
  reason?: string
}

export interface ListOrganizationsRequest {
  page?: number
  limit?: number
  fetch_all?: boolean
  parent_id?: string
}

export interface OrganizationLogo {
  id: string
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
  organization_id?: string
  status: 'temporary' | 'permanent'
  expires_at?: number
  created_at: number
}

export interface UploadLogoRequest {
  file_name: string
  file_content: string
  mime_type: string
}

export interface BindLogoRequest {
  logo_id: string
}

export interface ListOrganizationsResponse extends BaseResponse {
  organizations: Organization[]
  page?: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface GetOrganizationResponse extends BaseResponse {
  organization: Organization
}

export interface OrganizationLogoResponse extends BaseResponse {
  logo: OrganizationLogo
}