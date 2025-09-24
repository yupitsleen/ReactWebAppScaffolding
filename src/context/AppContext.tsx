import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AppState, AppContextValue } from '../types/app'
import type { AuthUser } from '../types/portal'
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/helpers'
import { todosService, discussionsService, documentsService } from '../services'

const getInitialState = (): AppState => {
  return {
    user: getFromStorage<AuthUser | null>('user', null),
    theme: getFromStorage<'light' | 'dark'>('theme', 'light'),
    loading: false,
    todos: getFromStorage('app_todos', []),
    discussions: getFromStorage('app_discussions', []),
    documents: getFromStorage('app_documents', []),
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>(getInitialState)

  const loadAllData = useCallback(async () => {
    try {
      // Only load from services if no persisted data exists
      const persistedTodos = getFromStorage('app_todos', [])
      const persistedDiscussions = getFromStorage('app_discussions', [])
      const persistedDocuments = getFromStorage('app_documents', [])

      if (persistedTodos.length === 0 && persistedDiscussions.length === 0 && persistedDocuments.length === 0) {
        // First time load - get fresh data from services
        const [todos, discussions, documents] = await Promise.all([
          todosService.getAll(),
          discussionsService.getAll(),
          documentsService.getAll(),
        ])

        setState(prev => ({
          ...prev,
          todos,
          discussions,
          documents
        }))

        // Persist the initial data
        setToStorage('app_todos', todos)
        setToStorage('app_discussions', discussions)
        setToStorage('app_documents', documents)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }, [])

  // Initialize user and load all data on mount
  useEffect(() => {
    const storedUser = getFromStorage<AuthUser | null>('auth_user', null)
    if (storedUser && storedUser.isAuthenticated) {
      setState(prev => ({ ...prev, user: storedUser }))
    }

    // Load all data from services
    loadAllData()
  }, [loadAllData])

  // Memoize callbacks to prevent recreation on every render
  const setUser = useCallback((user: AuthUser | null) => {
    setState(prev => ({ ...prev, user }))
    if (user) {
      setToStorage('user', user)
    } else {
      removeFromStorage('user')
    }
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }))
    setToStorage('theme', theme)
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const updateTodoStatus = useCallback(async (todoId: string, status: string) => {
    try {
      const updatedTodo = await todosService.update(todoId, { status })
      const updatedTodos = state.todos.map(todo => todo.id === todoId ? updatedTodo : todo)

      setState(prev => ({
        ...prev,
        todos: updatedTodos
      }))

      // Persist the updated todos
      setToStorage('app_todos', updatedTodos)
    } catch (error) {
      console.error('Failed to update todo status:', error)
    }
  }, [state.todos])

  const updateDiscussionStatus = useCallback(async (discussionId: string, resolved: boolean) => {
    try {
      const updatedDiscussion = await discussionsService.update(discussionId, { resolved })
      const updatedDiscussions = state.discussions.map(discussion =>
        discussion.id === discussionId ? updatedDiscussion : discussion
      )

      setState(prev => ({
        ...prev,
        discussions: updatedDiscussions
      }))

      // Persist the updated discussions
      setToStorage('app_discussions', updatedDiscussions)
    } catch (error) {
      console.error('Failed to update discussion status:', error)
    }
  }, [state.discussions])

  const updateDocumentSharing = useCallback(async (documentId: string, shared: boolean) => {
    try {
      const updatedDocument = await documentsService.update(documentId, { shared })
      const updatedDocuments = state.documents.map(document =>
        document.id === documentId ? updatedDocument : document
      )

      setState(prev => ({
        ...prev,
        documents: updatedDocuments
      }))

      // Persist the updated documents
      setToStorage('app_documents', updatedDocuments)
    } catch (error) {
      console.error('Failed to update document sharing:', error)
    }
  }, [state.documents])

  const refreshData = useCallback(async () => {
    await loadAllData()
  }, [loadAllData])

  const clearPersistedData = useCallback(() => {
    removeFromStorage('app_todos')
    removeFromStorage('app_discussions')
    removeFromStorage('app_documents')
    setState(prev => ({
      ...prev,
      todos: [],
      discussions: [],
      documents: [],
    }))
  }, [])

  // Make clearPersistedData available globally for console testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).clearPersistedData = clearPersistedData
    }
  }, [clearPersistedData])

  const value = useMemo<AppContextValue>(() => ({
    state,
    setUser,
    setTheme,
    setLoading,
    updateTodoStatus,
    updateDiscussionStatus,
    updateDocumentSharing,
    refreshData,
    clearPersistedData,
  }), [state, setUser, setTheme, setLoading, updateTodoStatus, updateDiscussionStatus, updateDocumentSharing, refreshData, clearPersistedData])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}