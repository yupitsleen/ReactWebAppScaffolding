import { BaseEntityService } from './baseService'
import { MockEntityService } from './mockService'

/**
 * Service that automatically falls back to mock data when API is unavailable
 * Tries API first, falls back to mock on network errors
 */
export class FallbackEntityService<T extends { id: string }> extends BaseEntityService<T> {
  private mockService: MockEntityService<T>
  private isApiAvailable: boolean = true
  private lastApiCheck: number = 0
  private readonly API_CHECK_INTERVAL = 30000 // Re-check API every 30 seconds

  constructor(entityName: string, apiEndpoint: string, mockData: T[]) {
    super(entityName, apiEndpoint)
    this.mockService = new MockEntityService(entityName, mockData)
  }

  /**
   * Check if we should attempt API call or use mock
   */
  private shouldTryApi(): boolean {
    const now = Date.now()
    if (!this.isApiAvailable && now - this.lastApiCheck < this.API_CHECK_INTERVAL) {
      return false
    }
    return true
  }

  /**
   * Execute with fallback to mock on API failure
   */
  private async executeWithFallback<R>(
    apiCall: () => Promise<R>,
    mockCall: () => Promise<R>
  ): Promise<R> {
    if (!this.shouldTryApi()) {
      return mockCall()
    }

    try {
      const result = await apiCall()
      this.isApiAvailable = true
      this.lastApiCheck = Date.now()
      return result
    } catch (error) {
      this.isApiAvailable = false
      this.lastApiCheck = Date.now()
      console.warn(`${this.entityName} API unavailable, using mock data`)
      return mockCall()
    }
  }

  async getAll(): Promise<T[]> {
    return this.executeWithFallback(
      () => super.getAll(),
      () => this.mockService.getAll()
    )
  }

  async getById(id: string): Promise<T | null> {
    return this.executeWithFallback(
      () => super.getById(id),
      () => this.mockService.getById(id)
    )
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    return this.executeWithFallback(
      () => super.update(id, updates),
      () => this.mockService.update(id, updates)
    )
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    return this.executeWithFallback(
      () => super.create(data),
      () => this.mockService.create(data)
    )
  }

  async delete(id: string): Promise<boolean> {
    return this.executeWithFallback(
      () => super.delete(id),
      () => this.mockService.delete(id)
    )
  }

  /**
   * Check if currently using mock data
   */
  isUsingMockData(): boolean {
    return !this.isApiAvailable
  }
}
