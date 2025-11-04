export { apiClient, type ApiResponse, type ApiError } from './api'
export { authService, type AuthTokens, type LoginCredentials } from './auth'

import { MockEntityService } from './mockService'
import { FallbackEntityService } from './fallbackService'
import { ServiceFactory } from './serviceFactory'
import { discussions, documents, todoItems } from '../data/sampleData'
import type { Discussion, Document, TodoItem } from '../types/portal'

// Always use mock data for entities without backend implementation
export const discussionsService = new MockEntityService<Discussion>('Discussions', discussions)
export const documentsService = new MockEntityService<Document>('Documents', documents)

// Use fallback service for Tasks - tries API first, falls back to mock if unavailable
export const todosService = new FallbackEntityService<TodoItem>('Tasks', '/api/todo', todoItems)

export { ServiceFactory } from './serviceFactory'
export { BaseEntityService } from './baseService'
export { MockEntityService } from './mockService'
export { FallbackEntityService } from './fallbackService'

export const isUsingMockData = () => ServiceFactory.isUsingMockData()

// Export ServiceRegistry for extensibility
export { serviceRegistry, type ServiceConfig, type ServiceMode } from './ServiceRegistry'

// Register existing services in the registry (for new generic context)
import { serviceRegistry } from './ServiceRegistry'

serviceRegistry.register<TodoItem>('todoItems', {
  entityName: 'Tasks',
  endpoint: '/api/todo',
  mockData: todoItems,
  mode: 'fallback'
})

serviceRegistry.register<Discussion>('discussions', {
  entityName: 'Discussions',
  mockData: discussions,
  mode: 'mock'
})

serviceRegistry.register<Document>('documents', {
  entityName: 'Documents',
  mockData: documents,
  mode: 'mock'
})