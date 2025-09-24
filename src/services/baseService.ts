import { apiClient } from './api'
import type { ApiResponse } from './api'
import { appConfig } from '../data/configurableData'

/**
 * Base service class for real API operations
 * Uses configurable navigation paths for API endpoints
 */
export class BaseEntityService<T extends { id: string }> {
  protected entityName: string
  protected navigationId: string

  constructor(navigationId: string) {
    this.navigationId = navigationId

    // Get entity name from navigation config
    const navItem = appConfig.navigation.find(nav => nav.id === navigationId)
    this.entityName = navItem?.label || navigationId
  }

  /**
   * Get API endpoint from navigation configuration
   */
  protected getApiEndpoint(additionalPath: string = ''): string {
    const navItem = appConfig.navigation.find(nav => nav.id === this.navigationId)
    if (!navItem) {
      throw new Error(`Navigation item '${this.navigationId}' not found in configuration`)
    }

    // Convert frontend path to API path (e.g., '/discussions' -> '/api/discussions')
    const basePath = navItem.path === '/' ? '' : navItem.path
    return `/api${basePath}${additionalPath}`
  }

  /**
   * Execute API call using dynamic endpoint from navigation configuration
   */
  protected async executeApiCall<R>(
    endpointPath: string = '',
    apiMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    apiData?: unknown
  ): Promise<R> {
    const dynamicEndpoint = this.getApiEndpoint(endpointPath)
    let apiResponse: ApiResponse<R>

    switch (apiMethod) {
      case 'GET':
        apiResponse = await apiClient.get<R>(dynamicEndpoint)
        break
      case 'POST':
        apiResponse = await apiClient.post<R>(dynamicEndpoint, apiData)
        break
      case 'PUT':
        apiResponse = await apiClient.put<R>(dynamicEndpoint, apiData)
        break
      case 'DELETE':
        apiResponse = await apiClient.delete<R>(dynamicEndpoint)
        break
    }

    if (!apiResponse.success) {
      throw new Error(`${this.entityName} API error: ${apiResponse.message}`)
    }

    return apiResponse.data
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<T[]> {
    return this.executeApiCall<T[]>()
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<T | null> {
    return this.executeApiCall<T>(`/${id}`)
  }

  /**
   * Update entity
   */
  async update(id: string, updates: Partial<T>): Promise<T> {
    return this.executeApiCall<T>(`/${id}`, 'PUT', updates)
  }

  /**
   * Create new entity
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    return this.executeApiCall<T>('', 'POST', data)
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<boolean> {
    await this.executeApiCall(`/${id}`, 'DELETE')
    return true
  }
}