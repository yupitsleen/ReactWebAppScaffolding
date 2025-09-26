import { createContext, useContext, useMemo, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TodoItem, Discussion, Document } from '../types/portal'
import { todosService, discussionsService, documentsService } from '../services'
import { useEntityState } from '../hooks/useEntityState'

interface DataContextValue {
  // Todos
  todos: TodoItem[]
  todosLoading: boolean
  createTodo: (todoData: Omit<TodoItem, 'id'>) => Promise<TodoItem>
  updateTodoStatus: (todoId: string, status: 'pending' | 'in-progress' | 'completed') => Promise<void>

  // Discussions
  discussions: Discussion[]
  discussionsLoading: boolean
  updateDiscussionStatus: (discussionId: string, resolved: boolean) => Promise<void>

  // Documents
  documents: Document[]
  documentsLoading: boolean
  updateDocumentSharing: (documentId: string, shared: boolean) => Promise<void>

  // Global actions
  loading: boolean
  setLoading: (loading: boolean) => void
  refreshData: () => Promise<void>
  clearPersistedData: () => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  // Use the reusable entity state hook for each entity type
  const todosState = useEntityState({
    service: todosService,
    storageKey: 'app_todos',
  })

  const discussionsState = useEntityState({
    service: discussionsService,
    storageKey: 'app_discussions',
  })

  const documentsState = useEntityState({
    service: documentsService,
    storageKey: 'app_documents',
  })

  // Global loading state (true if any entity is loading)
  const loading = useMemo(() =>
    todosState.loading || discussionsState.loading || documentsState.loading,
    [todosState.loading, discussionsState.loading, documentsState.loading]
  )

  // Global loading setter (affects all entities)
  const setLoading = useCallback((isLoading: boolean) => {
    todosState.setLoading(isLoading)
    discussionsState.setLoading(isLoading)
    documentsState.setLoading(isLoading)
  }, [todosState.setLoading, discussionsState.setLoading, documentsState.setLoading])

  // Specialized update methods that maintain backward compatibility
  const updateTodoStatus = useCallback(async (todoId: string, status: 'pending' | 'in-progress' | 'completed') => {
    await todosState.updateEntity(todoId, { status })
  }, [todosState.updateEntity])

  const updateDiscussionStatus = useCallback(async (discussionId: string, resolved: boolean) => {
    await discussionsState.updateEntity(discussionId, { resolved })
  }, [discussionsState.updateEntity])

  const updateDocumentSharing = useCallback(async (documentId: string, shared: boolean) => {
    await documentsState.updateEntity(documentId, { shared })
  }, [documentsState.updateEntity])

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      todosState.refreshEntities(),
      discussionsState.refreshEntities(),
      documentsState.refreshEntities(),
    ])
  }, [todosState.refreshEntities, discussionsState.refreshEntities, documentsState.refreshEntities])

  // Clear all persisted data
  const clearPersistedData = useCallback(() => {
    todosState.clearEntities()
    discussionsState.clearEntities()
    documentsState.clearEntities()
  }, [todosState.clearEntities, discussionsState.clearEntities, documentsState.clearEntities])

  const value = useMemo<DataContextValue>(() => ({
    // Todos
    todos: todosState.entities,
    todosLoading: todosState.loading,
    createTodo: todosState.createEntity,
    updateTodoStatus,

    // Discussions
    discussions: discussionsState.entities,
    discussionsLoading: discussionsState.loading,
    updateDiscussionStatus,

    // Documents
    documents: documentsState.entities,
    documentsLoading: documentsState.loading,
    updateDocumentSharing,

    // Global
    loading,
    setLoading,
    refreshData,
    clearPersistedData,
  }), [
    // Todos
    todosState.entities,
    todosState.loading,
    todosState.createEntity,
    updateTodoStatus,

    // Discussions
    discussionsState.entities,
    discussionsState.loading,
    updateDiscussionStatus,

    // Documents
    documentsState.entities,
    documentsState.loading,
    updateDocumentSharing,

    // Global
    loading,
    setLoading,
    refreshData,
    clearPersistedData,
  ])

  // Make clearPersistedData available globally for console testing (dev only)
  useEffect(() => {
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      if (!window.__APP_DEBUG__) {
        window.__APP_DEBUG__ = {}
      }
      window.__APP_DEBUG__.clearPersistedData = clearPersistedData
    }
  }, [clearPersistedData])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}