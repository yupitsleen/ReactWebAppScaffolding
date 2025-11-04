import { describe, it, expect, beforeEach } from 'vitest'
import { serviceRegistry } from './ServiceRegistry'
import { BaseEntityService } from './baseService'

interface TestEntity {
  id: string
  name: string
  value: number
}

describe('ServiceRegistry', () => {
  beforeEach(() => {
    // Clear all registered services before each test
    serviceRegistry.clear()
  })

  // Use the singleton instance for all tests
  const registry = serviceRegistry

  describe('register', () => {
    it('registers a service successfully', () => {
      const mockData: TestEntity[] = [
        { id: '1', name: 'Test', value: 100 }
      ]

      registry.register<TestEntity>('test', {
        entityName: 'TestEntities',
        endpoint: '/api/test',
        mockData,
        mode: 'mock'
      })

      expect(registry.has('test')).toBe(true)
    })

    it('registers service in fallback mode', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('fallback', {
        entityName: 'FallbackEntities',
        endpoint: '/api/fallback',
        mockData,
        mode: 'fallback'
      })

      const service = registry.get('fallback')
      expect(service).toBeDefined()
    })

    it('registers service in api mode', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('api', {
        entityName: 'ApiEntities',
        endpoint: '/api/entities',
        mockData,
        mode: 'api'
      })

      const service = registry.get('api')
      expect(service).toBeDefined()
    })

    it('defaults to fallback mode when mode is not specified', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('default', {
        entityName: 'DefaultEntities',
        endpoint: '/api/default',
        mockData
      })

      expect(registry.has('default')).toBe(true)
    })

    it('overwrites existing service with same key', () => {
      const mockData1: TestEntity[] = [{ id: '1', name: 'First', value: 1 }]
      const mockData2: TestEntity[] = [{ id: '2', name: 'Second', value: 2 }]

      registry.register<TestEntity>('overwrite', {
        entityName: 'First',
        endpoint: '/api/first',
        mockData: mockData1,
        mode: 'mock'
      })

      registry.register<TestEntity>('overwrite', {
        entityName: 'Second',
        endpoint: '/api/second',
        mockData: mockData2,
        mode: 'mock'
      })

      const service = registry.get('overwrite')
      expect(service).toBeDefined()
    })
  })

  describe('get', () => {
    it('returns registered service', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('exists', {
        entityName: 'ExistingEntities',
        endpoint: '/api/exists',
        mockData,
        mode: 'mock'
      })

      const service = registry.get<TestEntity>('exists')
      expect(service).toBeInstanceOf(BaseEntityService)
    })

    it('returns undefined for unregistered service', () => {
      const service = registry.get('nonexistent')
      expect(service).toBeUndefined()
    })

    it('returns service with correct type', () => {
      const mockData: TestEntity[] = [
        { id: '1', name: 'Test', value: 100 }
      ]

      registry.register<TestEntity>('typed', {
        entityName: 'TypedEntities',
        endpoint: '/api/typed',
        mockData,
        mode: 'mock'
      })

      const service = registry.get<TestEntity>('typed')
      expect(service).toBeDefined()
      // Service should have proper BaseEntityService methods
      expect(typeof service?.getAll).toBe('function')
      expect(typeof service?.getById).toBe('function')
      expect(typeof service?.create).toBe('function')
      expect(typeof service?.update).toBe('function')
      expect(typeof service?.delete).toBe('function')
    })
  })

  describe('has', () => {
    it('returns true for registered service', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('exists', {
        entityName: 'ExistingEntities',
        endpoint: '/api/exists',
        mockData,
        mode: 'mock'
      })

      expect(registry.has('exists')).toBe(true)
    })

    it('returns false for unregistered service', () => {
      expect(registry.has('nonexistent')).toBe(false)
    })
  })

  describe('getAll', () => {
    it('returns empty array when no services registered', () => {
      const services = registry.getAll()
      expect(services).toEqual([])
    })

    it('returns all registered services', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('service1', {
        entityName: 'Service1',
        endpoint: '/api/service1',
        mockData,
        mode: 'mock'
      })

      registry.register<TestEntity>('service2', {
        entityName: 'Service2',
        endpoint: '/api/service2',
        mockData,
        mode: 'mock'
      })

      const services = registry.getAll()
      expect(services).toHaveLength(2)
      expect(services.map(([key]) => key)).toContain('service1')
      expect(services.map(([key]) => key)).toContain('service2')
    })

    it('returns entries with correct structure', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('test', {
        entityName: 'TestEntities',
        endpoint: '/api/test',
        mockData,
        mode: 'mock'
      })

      const services = registry.getAll()
      const [key, service] = services[0]

      expect(key).toBe('test')
      expect(service).toBeInstanceOf(BaseEntityService)
    })
  })

  describe('unregister', () => {
    it('removes registered service', () => {
      const mockData: TestEntity[] = []

      registry.register<TestEntity>('removable', {
        entityName: 'RemovableEntities',
        endpoint: '/api/removable',
        mockData,
        mode: 'mock'
      })

      expect(registry.has('removable')).toBe(true)

      registry.unregister('removable')

      expect(registry.has('removable')).toBe(false)
    })

    it('handles unregistering nonexistent service gracefully', () => {
      expect(() => registry.unregister('nonexistent')).not.toThrow()
    })
  })

  describe('integration', () => {
    it('supports full lifecycle: register, get, unregister', () => {
      const mockData: TestEntity[] = [
        { id: '1', name: 'Test', value: 100 }
      ]

      // Register
      registry.register<TestEntity>('lifecycle', {
        entityName: 'LifecycleEntities',
        endpoint: '/api/lifecycle',
        mockData,
        mode: 'mock'
      })

      expect(registry.has('lifecycle')).toBe(true)

      // Get
      const service = registry.get<TestEntity>('lifecycle')
      expect(service).toBeDefined()

      // Unregister
      registry.unregister('lifecycle')
      expect(registry.has('lifecycle')).toBe(false)
      expect(registry.get('lifecycle')).toBeUndefined()
    })

    it('handles multiple services independently', () => {
      const mockData1: TestEntity[] = [{ id: '1', name: 'First', value: 1 }]
      const mockData2: TestEntity[] = [{ id: '2', name: 'Second', value: 2 }]

      registry.register<TestEntity>('service1', {
        entityName: 'Service1',
        endpoint: '/api/service1',
        mockData: mockData1,
        mode: 'mock'
      })

      registry.register<TestEntity>('service2', {
        entityName: 'Service2',
        endpoint: '/api/service2',
        mockData: mockData2,
        mode: 'mock'
      })

      expect(registry.has('service1')).toBe(true)
      expect(registry.has('service2')).toBe(true)

      registry.unregister('service1')

      expect(registry.has('service1')).toBe(false)
      expect(registry.has('service2')).toBe(true)
    })
  })
})
