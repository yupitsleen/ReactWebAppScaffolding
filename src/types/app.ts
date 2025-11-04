import type { AuthUser, TodoItem, Discussion, Document } from './portal'

// Generic entity state for dynamic entity management
export interface EntityState<T = any> {
  data: T[]
  loading: boolean
  error: string | null
}

export interface AppState {
  user: AuthUser | null
  theme: 'light' | 'dark'
  loading: boolean
  todos: TodoItem[]
  discussions: Discussion[]
  documents: Document[]
  // Generic entities registry (for extensibility)
  entities: Record<string, EntityState>
}

export interface AppContextValue {
  state: AppState
  setUser: (user: AuthUser | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  createTodo: (todoData: Omit<TodoItem, 'id'>) => Promise<TodoItem>
  updateTodoStatus: (todoId: string, status: 'pending' | 'in-progress' | 'completed') => void
  updateDiscussionStatus: (discussionId: string, resolved: boolean) => void
  updateDocumentSharing: (documentId: string, shared: boolean) => void
  refreshData: () => Promise<void>
  clearPersistedData: () => void
}