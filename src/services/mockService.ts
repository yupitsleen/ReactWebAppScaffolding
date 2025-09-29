import { BaseEntityService } from './baseService'
import { env } from '../utils/env'

/**
 * Mock service that inherits from BaseEntityService but overrides methods
 * to use local data instead of making API calls
 */
export class MockEntityService<T extends { id: string }> extends BaseEntityService<T> {
  private mockData: T[]

  constructor(entityName: string, initialMockData: T[]) {
    super(entityName, '/mock') // Call parent constructor with dummy endpoint
    this.mockData = [...initialMockData]
  }

  /**
   * Simulate API delay for realistic UX during development
   */
  private async simulateDelay(ms: number = 500): Promise<void> {
    if (env.isDevelopment) {
      await new Promise(resolve => setTimeout(resolve, ms))
    }
  }

  /**
   * Override: Get all entities from mock data
   */
  async getAll(): Promise<T[]> {
    await this.simulateDelay()
    return [...this.mockData]
  }

  /**
   * Override: Get entity by ID from mock data
   */
  async getById(id: string): Promise<T | null> {
    await this.simulateDelay()
    return this.mockData.find(item => item.id === id) || null
  }

  /**
   * Override: Update entity in mock data
   */
  async update(id: string, updates: Partial<T>): Promise<T> {
    await this.simulateDelay(200)

    const index = this.mockData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error(`${this.entityName} with id ${id} not found`)
    }

    this.mockData[index] = { ...this.mockData[index], ...updates }
    return this.mockData[index]
  }

  /**
   * Override: Create new entity in mock data
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    await this.simulateDelay(300)

    const newEntity = {
      ...data,
      id: `${this.entityName}-${Date.now()}`,
    } as T

    this.mockData.push(newEntity)
    return newEntity
  }

  /**
   * Override: Delete entity from mock data
   */
  async delete(id: string): Promise<boolean> {
    await this.simulateDelay(200)

    const index = this.mockData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error(`${this.entityName} with id ${id} not found`)
    }

    this.mockData.splice(index, 1)
    return true
  }

  /**
   * Get current mock data (for debugging/testing)
   */
  getCurrentData(): T[] {
    return [...this.mockData]
  }
}