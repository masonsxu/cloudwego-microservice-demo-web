export interface BaseResponse {
  base_resp: {
    code: number
    message: string
  }
}

export interface PageResponse {
  page: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface TokenInfo {
  access_token: string
  expires_in: number
  token_type: string
}

export interface OperationStatusResponseDTO extends BaseResponse {
  success: boolean
}