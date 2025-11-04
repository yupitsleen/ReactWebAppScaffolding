/**
 * ServiceRegistry - Centralized registry for entity services
 *
 * Enables dynamic service registration without modifying core files.
 * Users can register new entity services purely through configuration.
 *
 * @example
 * ```typescript
 * // In configurableData.ts
 * serviceRegistry.register('orders', {
 *   entityName: 'Orders',
 *   endpoint: '/api/orders',
 *   mockData: sampleOrders,
 *   mode: 'fallback'
 * })
 * ```
 */

import { BaseEntityService } from './baseService'
import { FallbackEntityService } from './fallbackService'
import { MockEntityService } from './mockService'

export type ServiceMode = 'fallback' | 'mock' | 'api'

export interface ServiceConfig<T extends { id: string }> {
  entityName: string
  endpoint?: string
  mockData: T[]
  mode?: ServiceMode
}

class ServiceRegistry {
  private services = new Map<string, BaseEntityService<any>>()

  /**
   * Register a new entity service
   *
   * @param key - Unique identifier for the entity (e.g., 'orders', 'customers')
   * @param config - Service configuration
   * @returns The created service instance
   *
   * @example
   * ```typescript
   * serviceRegistry.register('orders', {
   *   entityName: 'Orders',
   *   endpoint: '/api/orders',
   *   mockData: sampleOrders,
   *   mode: 'fallback'
   * })
   * ```
   */
  register<T extends { id: string }>(
    key: string,
    config: ServiceConfig<T>
  ): BaseEntityService<T> {
    const mode = config.mode || 'fallback'

    let service: BaseEntityService<T>

    if (mode === 'mock') {
      service = new MockEntityService<T>(config.entityName, config.mockData)
    } else if (mode === 'api') {
      if (!config.endpoint) {
        throw new Error(`API mode requires endpoint for service: ${key}`)
      }
      service = new BaseEntityService<T>(config.entityName, config.endpoint)
    } else {
      // Default: fallback mode
      if (!config.endpoint) {
        throw new Error(`Fallback mode requires endpoint for service: ${key}`)
      }
      service = new FallbackEntityService<T>(
        config.entityName,
        config.endpoint,
        config.mockData
      )
    }

    this.services.set(key, service)
    return service
  }

  /**
   * Get a registered service by key
   *
   * @param key - The entity key
   * @returns The service instance or undefined if not found
   *
   * @example
   * ```typescript
   * const orderService = serviceRegistry.get<Order>('orders')
   * if (orderService) {
   *   const orders = await orderService.getAll()
   * }
   * ```
   */
  get<T extends { id: string }>(key: string): BaseEntityService<T> | undefined {
    return this.services.get(key)
  }

  /**
   * Get all registered services
   *
   * @returns Array of [key, service] tuples
   */
  getAll(): Array<[string, BaseEntityService<any>]> {
    return Array.from(this.services.entries())
  }

  /**
   * Check if a service is registered
   *
   * @param key - The entity key
   * @returns True if service exists
   */
  has(key: string): boolean {
    return this.services.has(key)
  }

  /**
   * Unregister a service (useful for testing)
   *
   * @param key - The entity key
   * @returns True if service was removed
   */
  unregister(key: string): boolean {
    return this.services.delete(key)
  }

  /**
   * Clear all registered services (useful for testing)
   */
  clear(): void {
    this.services.clear()
  }

  /**
   * Get all registered entity keys
   *
   * @returns Array of entity keys
   */
  getKeys(): string[] {
    return Array.from(this.services.keys())
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistry()
