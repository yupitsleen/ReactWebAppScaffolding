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
    todos: [],
    discussions: [],
    documents: [],
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
      setState(prev => ({
        ...prev,
        todos: prev.todos.map(todo => todo.id === todoId ? updatedTodo : todo)
      }))
    } catch (error) {
      console.error('Failed to update todo status:', error)
    }
  }, [])

  const updateDiscussionStatus = useCallback(async (discussionId: string, resolved: boolean) => {
    try {
      const updatedDiscussion = await discussionsService.update(discussionId, { resolved })
      setState(prev => ({
        ...prev,
        discussions: prev.discussions.map(discussion =>
          discussion.id === discussionId ? updatedDiscussion : discussion
        )
      }))
    } catch (error) {
      console.error('Failed to update discussion status:', error)
    }
  }, [])

  const updateDocumentSharing = useCallback(async (documentId: string, shared: boolean) => {
    try {
      const updatedDocument = await documentsService.update(documentId, { shared })
      setState(prev => ({
        ...prev,
        documents: prev.documents.map(document =>
          document.id === documentId ? updatedDocument : document
        )
      }))
    } catch (error) {
      console.error('Failed to update document sharing:', error)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await loadAllData()
  }, [loadAllData])

  const value = useMemo<AppContextValue>(() => ({
    state,
    setUser,
    setTheme,
    setLoading,
    updateTodoStatus,
    updateDiscussionStatus,
    updateDocumentSharing,
    refreshData,
  }), [state, setUser, setTheme, setLoading, updateTodoStatus, updateDiscussionStatus, updateDocumentSharing, refreshData])

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