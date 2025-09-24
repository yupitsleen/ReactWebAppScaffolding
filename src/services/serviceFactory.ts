import { BaseEntityService } from './baseService'
import { MockEntityService } from './mockService'
import { env } from '../utils/env'

/**
 * Service factory that creates either Mock or Real services based on environment
 */
export class ServiceFactory {
  private static useMockData = env.APP_ENV === 'development' || !env.API_BASE_URL.includes('http')

  /**
   * Create service instance (Mock or Real) based on environment configuration
   */
  static createService<T extends { id: string }>(
    navigationId: string,
    initialMockData: T[]
  ): BaseEntityService<T> {
    if (this.useMockData) {
      return new MockEntityService<T>(navigationId, initialMockData)
    }

    return new BaseEntityService<T>(navigationId)
  }

  /**
   * Check if currently using mock data
   */
  static isUsingMockData(): boolean {
    return this.useMockData
  }

  /**
   * Force switch to mock mode (for testing)
   */
  static forceMockMode(): void {
    this.useMockData = true
  }

  /**
   * Force switch to API mode (for testing)
   */
  static forceApiMode(): void {
    this.useMockData = false
  }
}