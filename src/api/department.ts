import request from './request'
import type {
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DeleteDepartmentRequest,
  Department,
  GetDepartmentResponse
} from '@/types/department'

export const createDepartmentApi = (data: CreateDepartmentRequest) =>
  request.post<Department>('/v1/identity/departments', data)

export const getDepartmentApi = (departmentId: string) =>
  request.get<GetDepartmentResponse>(`/v1/identity/departments/${departmentId}`)

export const updateDepartmentApi = (departmentId: string, data: UpdateDepartmentRequest) =>
  request.put<Department>(`/v1/identity/departments/${departmentId}`, data)

export const deleteDepartmentApi = (departmentId: string, data: DeleteDepartmentRequest) =>
  request.delete(`/v1/identity/departments/${departmentId}`, { data })

export const getOrganizationDepartmentsApi = (organizationId: string, params: {
  page?: number
  limit?: number
  search?: string
  filter?: string
  sort?: string
  fields?: string
  include_total?: boolean
}) =>
  request.get(`/v1/identity/organizations/${organizationId}/departments`, { params })