import { describe, it, expect, vi } from 'vitest'
import { BaseEntityService } from './baseService'

vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

interface TestEntity {
  id: string
  name: string
}

describe('BaseEntityService', () => {
  it('generates correct API endpoints with explicit endpoint configuration', () => {
    const service = new BaseEntityService<TestEntity>('testEntity', '/api/test')

    expect(service['getApiEndpoint']()).toBe('/api/test')
    expect(service['getApiEndpoint']('/123')).toBe('/api/test/123')
    expect(service['getApiEndpoint']('/nested/path')).toBe('/api/test/nested/path')
  })

  it('handles different endpoint formats correctly', () => {
    const service1 = new BaseEntityService<TestEntity>('todos', '/api/todo')
    const service2 = new BaseEntityService<TestEntity>('custom', '/api/v2/custom-endpoint')

    expect(service1['getApiEndpoint']()).toBe('/api/todo')
    expect(service2['getApiEndpoint']('/test-id')).toBe('/api/v2/custom-endpoint/test-id')
  })

  it('stores entity name and endpoint correctly', () => {
    const service = new BaseEntityService<TestEntity>('myEntity', '/api/my-endpoint')
    expect(service['entityName']).toBe('myEntity')
    expect(service['apiEndpoint']).toBe('/api/my-endpoint')
  })
})