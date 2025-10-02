export { apiClient, type ApiResponse, type ApiError } from './api'
export { authService, type AuthTokens, type LoginCredentials } from './auth'

import { BaseEntityService } from './baseService'
import { MockEntityService } from './mockService'
import { discussions, documents, todoItems } from '../data/sampleData'
import type { Discussion, Document, TodoItem } from '../types/portal'

// Always use mock data for entities without backend implementation
export const discussionsService = new MockEntityService<Discussion>('Discussions', discussions)
export const documentsService = new MockEntityService<Document>('Documents', documents)

// Always use real API for Tasks (backend implemented and tested)
export const todosService = new BaseEntityService<TodoItem>('Tasks', '/api/todo')

export { ServiceFactory } from './serviceFactory'
export { BaseEntityService } from './baseService'
export { MockEntityService } from './mockService'

export const isUsingMockData = () => ServiceFactory.isUsingMockData()