import type { BaseResponse } from './api'

export interface Department {
  id: string
  name: string
  code: string
  organization_id: string
  department_type: string
  parent_id?: string
  member_count: number
  children?: Department[]
  created_at: number
  updated_at: number
}

export interface CreateDepartmentRequest {
  name: string
  organization_id: string
  department_type: string
}

export interface UpdateDepartmentRequest {
  name?: string
  department_type?: string
}

export interface DeleteDepartmentRequest {
  reason?: string
}

export interface GetDepartmentResponse extends BaseResponse {
  department: Department
}

export interface ListDepartmentsResponse extends BaseResponse {
  departments: Department[]
}