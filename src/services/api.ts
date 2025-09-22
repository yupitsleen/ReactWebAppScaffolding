import { env } from '../utils/env'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
}

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = env.API_BASE_URL
    this.timeout = env.API_TIMEOUT
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const controller = new AbortController()

    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        data,
        success: true,
        message: data.message,
      }
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }

      throw {
        message: 'An unknown error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
      } as ApiError
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  setAuthToken(token: string) {
    // This will be used for authentication headers when Azure auth is implemented
  }

  clearAuthToken() {
    // This will clear authentication when user logs out
  }
}

export const apiClient = new ApiClient()
export default apiClient