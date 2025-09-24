export { apiClient, type ApiResponse, type ApiError } from './api'
export { authService, type AuthTokens, type LoginCredentials } from './auth'

import { ServiceFactory } from './serviceFactory'
import { discussions, documents, todoItems } from '../data/sampleData'
import type { Discussion, Document, TodoItem } from '../types/portal'

export const discussionsService = ServiceFactory.createService<Discussion>('discussions', discussions)
export const documentsService = ServiceFactory.createService<Document>('documents', documents)
export const todosService = ServiceFactory.createService<TodoItem>('tasks', todoItems)

export { ServiceFactory } from './serviceFactory'
export { BaseEntityService } from './baseService'
export { MockEntityService } from './mockService'

export const isUsingMockData = () => ServiceFactory.isUsingMockData()