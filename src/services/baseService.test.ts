import { describe, it, expect, vi } from 'vitest'
import { BaseEntityService } from './baseService'

vi.mock('../data/configurableData', () => ({
  appConfig: {
    navigation: [
      { id: 'discussions', path: '/discussions' },
      { id: 'documents', path: '/documents' },
      { id: 'tasks', path: '/todos' }
    ]
  }
}))

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
  it('generates correct API endpoints from navigation config', () => {
    const discussionsService = new BaseEntityService<TestEntity>('discussions')
    const documentsService = new BaseEntityService<TestEntity>('documents')
    const tasksService = new BaseEntityService<TestEntity>('tasks')

    expect(discussionsService['getApiEndpoint']()).toBe('/api/discussions')
    expect(discussionsService['getApiEndpoint']('/123')).toBe('/api/discussions/123')

    expect(documentsService['getApiEndpoint']()).toBe('/api/documents')
    expect(documentsService['getApiEndpoint']('/456')).toBe('/api/documents/456')

    expect(tasksService['getApiEndpoint']()).toBe('/api/todos')
    expect(tasksService['getApiEndpoint']('/789')).toBe('/api/todos/789')
  })

  it('throws error for invalid navigation ID when accessing API endpoint', () => {
    const service = new BaseEntityService<TestEntity>('invalid-nav-id')
    expect(() => {
      service['getApiEndpoint']()
    }).toThrow('Navigation item \'invalid-nav-id\' not found in configuration')
  })

  it('sets entity name from navigation config', () => {
    vi.doMock('../data/configurableData', () => ({
      appConfig: {
        navigation: [
          { id: 'test', path: '/test', label: 'Test Items' }
        ]
      }
    }))

    const service = new BaseEntityService<TestEntity>('discussions')
    expect(service['entityName']).toBe('discussions')
  })
})