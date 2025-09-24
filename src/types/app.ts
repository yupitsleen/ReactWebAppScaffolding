import type { AuthUser, TodoItem, Discussion, Document } from './portal'

export interface AppState {
  user: AuthUser | null
  theme: 'light' | 'dark'
  loading: boolean
  todos: TodoItem[]
  discussions: Discussion[]
  documents: Document[]
}

export interface AppContextValue {
  state: AppState
  setUser: (user: AuthUser | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
  updateTodoStatus: (todoId: string, status: string) => void
  updateDiscussionStatus: (discussionId: string, resolved: boolean) => void
  updateDocumentSharing: (documentId: string, shared: boolean) => void
  refreshData: () => Promise<void>
}