import { describe, it, expect, beforeEach } from 'vitest'
import { ServiceFactory } from './serviceFactory'
import { BaseEntityService } from './baseService'
import { MockEntityService } from './mockService'

interface TestEntity {
  id: string
  name: string
}

const mockData: TestEntity[] = [
  { id: 'test-1', name: 'Test Item 1' },
  { id: 'test-2', name: 'Test Item 2' }
]

describe('ServiceFactory', () => {
  beforeEach(() => {
    ServiceFactory.forceMockMode()
  })

  it('creates MockEntityService when in mock mode', () => {
    ServiceFactory.forceMockMode()
    const service = ServiceFactory.createService('test', mockData)
    expect(service).toBeInstanceOf(MockEntityService)
    expect(ServiceFactory.isUsingMockData()).toBe(true)
  })

  it('creates BaseEntityService when in API mode', () => {
    ServiceFactory.forceApiMode()
    const service = ServiceFactory.createService('test', mockData)
    expect(service).toBeInstanceOf(BaseEntityService)
    expect(ServiceFactory.isUsingMockData()).toBe(false)
  })

  it('can switch between modes', () => {
    ServiceFactory.forceMockMode()
    expect(ServiceFactory.isUsingMockData()).toBe(true)

    ServiceFactory.forceApiMode()
    expect(ServiceFactory.isUsingMockData()).toBe(false)

    ServiceFactory.forceMockMode()
    expect(ServiceFactory.isUsingMockData()).toBe(true)
  })
})