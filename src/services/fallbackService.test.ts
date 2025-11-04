import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FallbackEntityService } from './fallbackService'

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

const mockData: TestEntity[] = [
  { id: 'mock-1', name: 'Mock Item 1' },
  { id: 'mock-2', name: 'Mock Item 2' }
]

describe('FallbackEntityService', () => {
  let service: FallbackEntityService<TestEntity>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses API data when API is available', async () => {
    const apiData: TestEntity[] = [
      { id: 'api-1', name: 'API Item 1' },
      { id: 'api-2', name: 'API Item 2' }
    ]

    const { apiClient } = await import('./api')
    vi.mocked(apiClient.get).mockResolvedValue({ success: true, data: apiData, message: 'Success' })

    // Create service with working API
    const freshService = new FallbackEntityService('testEntity', '/api/test', mockData)
    const result = await freshService.getAll()

    expect(result).toEqual(apiData)
    expect(freshService.isUsingMockData()).toBe(false)
  })

  it('uses mock data when API is unavailable', async () => {
    // Mock API failure
    const { apiClient } = await import('./api')
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))

    service = new FallbackEntityService('testEntity', '/api/test', mockData)
    const result = await service.getAll()

    expect(result).toEqual(mockData)
    expect(service.isUsingMockData()).toBe(true)
  })

  it('falls back to mock after API failure and skips API for subsequent calls', async () => {
    const { apiClient } = await import('./api')

    // First call - API fails
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))
    service = new FallbackEntityService('cacheTest', '/api/cache', mockData)
    await service.getAll()
    expect(service.isUsingMockData()).toBe(true)
    expect(apiClient.get).toHaveBeenCalledTimes(1)

    // Second call - should use mock without trying API (within 30s window)
    vi.mocked(apiClient.get).mockClear()
    const result = await service.getAll()
    expect(result).toEqual(mockData)
    expect(apiClient.get).not.toHaveBeenCalled()
  })

  it('supports CRUD operations with fallback', async () => {
    const crudService = new FallbackEntityService('crudTest', '/api/crud', mockData)
    const { apiClient } = await import('./api')

    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'))
    vi.mocked(apiClient.put).mockRejectedValue(new Error('Network error'))
    vi.mocked(apiClient.delete).mockRejectedValue(new Error('Network error'))

    // Test getById
    const item = await crudService.getById('mock-1')
    expect(item).toEqual(mockData[0])

    // Test create
    const newItem = await crudService.create({ name: 'New Item' })
    expect(newItem.name).toBe('New Item')
    expect(newItem.id).toBeDefined()

    // Test update
    const updated = await crudService.update('mock-1', { name: 'Updated' })
    expect(updated.name).toBe('Updated')

    // Test delete
    const deleted = await crudService.delete('mock-1')
    expect(deleted).toBe(true)
  })
})
