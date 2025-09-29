import { BaseEntityService } from './baseService'
import { MockEntityService } from './mockService'
import { env } from '../utils/env'

/**
 * Service factory that creates either Mock or Real services based on environment
 */
export class ServiceFactory {
  /**
   * Determine if should use mock data based on current environment
   */
  private static shouldUseMockData(): boolean {
    // Check for forced mode first
    if (this.forcedMode === 'mock') return true
    if (this.forcedMode === 'api') return false

    return env.APP_ENV === 'development' || !env.API_BASE_URL.includes('http')
  }

  /**
   * Create service instance (Mock or Real) based on environment configuration
   */
  static createService<T extends { id: string }>(
    entityName: string,
    apiEndpoint: string,
    initialMockData: T[]
  ): BaseEntityService<T> {
    if (this.shouldUseMockData()) {
      return new MockEntityService<T>(entityName, initialMockData)
    }

    return new BaseEntityService<T>(entityName, apiEndpoint)
  }

  /**
   * Check if currently using mock data
   */
  static isUsingMockData(): boolean {
    return this.shouldUseMockData()
  }

  private static forcedMode: 'mock' | 'api' | null = null

  /**
   * Force switch to mock mode (for testing)
   */
  static forceMockMode(): void {
    this.forcedMode = 'mock'
  }

  /**
   * Force switch to API mode (for testing)
   */
  static forceApiMode(): void {
    this.forcedMode = 'api'
  }
}