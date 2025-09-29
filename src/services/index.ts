export { apiClient, type ApiResponse, type ApiError } from './api'
export { authService, type AuthTokens, type LoginCredentials } from './auth'

import { ServiceFactory } from './serviceFactory'
import { discussions, documents, todoItems } from '../data/sampleData'
import type { Discussion, Document, TodoItem } from '../types/portal'

export const discussionsService = ServiceFactory.createService<Discussion>('Discussions', '/api/discussions', discussions)
export const documentsService = ServiceFactory.createService<Document>('Documents', '/api/documents', documents)
export const todosService = ServiceFactory.createService<TodoItem>('Tasks', '/api/todo', todoItems)

export { ServiceFactory } from './serviceFactory'
export { BaseEntityService } from './baseService'
export { MockEntityService } from './mockService'

export const isUsingMockData = () => ServiceFactory.isUsingMockData()