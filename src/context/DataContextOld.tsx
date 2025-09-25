import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TodoItem, Discussion, Document } from '../types/portal'
import { getFromStorage, setToStorage } from '../utils/helpers'
import { todosService, discussionsService, documentsService } from '../services'

interface DataState {
  todos: TodoItem[]
  discussions: Discussion[]
  documents: Document[]
  loading: boolean
}

interface DataContextValue {
  // State
  todos: TodoItem[]
  discussions: Discussion[]
  documents: Document[]
  loading: boolean

  // Actions
  setLoading: (loading: boolean) => void
  createTodo: (todoData: Omit<TodoItem, 'id'>) => Promise<TodoItem>
  updateTodoStatus: (todoId: string, status: 'pending' | 'in-progress' | 'completed') => Promise<void>
  updateDiscussionStatus: (discussionId: string, resolved: boolean) => Promise<void>
  updateDocumentSharing: (documentId: string, shared: boolean) => Promise<void>
  refreshData: () => Promise<void>
  clearPersistedData: () => void
}

const getInitialDataState = (): DataState => ({
  todos: getFromStorage('app_todos', []),
  discussions: getFromStorage('app_discussions', []),
  documents: getFromStorage('app_documents', []),
  loading: false,
})

const DataContext = createContext<DataContextValue | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [state, setState] = useState<DataState>(getInitialDataState)

  const loadAllData = useCallback(async () => {
    try {
      // Only load from services if no persisted data exists
      if (state.todos.length === 0 && state.discussions.length === 0 && state.documents.length === 0) {
        setState(prev => ({ ...prev, loading: true }))

        const [todosData, discussionsData, documentsData] = await Promise.all([
          todosService.getAll(),
          discussionsService.getAll(),
          documentsService.getAll(),
        ])

        setState(prev => ({
          ...prev,
          todos: todosData,
          discussions: discussionsData,
          documents: documentsData,
          loading: false,
        }))

        // Persist the loaded data
        setToStorage('app_todos', todosData)
        setToStorage('app_discussions', discussionsData)
        setToStorage('app_documents', documentsData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [state.todos.length, state.discussions.length, state.documents.length])

  useEffect(() => {
    loadAllData()
  }, []) // Only run once on mount

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const createTodo = useCallback(async (todoData: Omit<TodoItem, 'id'>): Promise<TodoItem> => {
    try {
      const newTodo = await todosService.create(todoData)

      setState(prev => {
        const updatedTodos = [...prev.todos, newTodo]
        setToStorage('app_todos', updatedTodos)
        return {
          ...prev,
          todos: updatedTodos
        }
      })

      return newTodo
    } catch (error) {
      console.error('Failed to create todo:', error)
      throw error
    }
  }, [])

  const updateTodoStatus = useCallback(async (todoId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const updatedTodo = await todosService.update(todoId, { status })

      setState(prev => {
        const updatedTodos = prev.todos.map(todo => todo.id === todoId ? updatedTodo : todo)
        setToStorage('app_todos', updatedTodos)
        return {
          ...prev,
          todos: updatedTodos
        }
      })
    } catch (error) {
      console.error('Failed to update todo status:', error)
    }
  }, [])

  const updateDiscussionStatus = useCallback(async (discussionId: string, resolved: boolean) => {
    try {
      const updatedDiscussion = await discussionsService.update(discussionId, { resolved })

      setState(prev => {
        const updatedDiscussions = prev.discussions.map(discussion =>
          discussion.id === discussionId ? updatedDiscussion : discussion
        )
        setToStorage('app_discussions', updatedDiscussions)
        return {
          ...prev,
          discussions: updatedDiscussions
        }
      })
    } catch (error) {
      console.error('Failed to update discussion status:', error)
    }
  }, [])

  const updateDocumentSharing = useCallback(async (documentId: string, shared: boolean) => {
    try {
      const updatedDocument = await documentsService.update(documentId, { shared })

      setState(prev => {
        const updatedDocuments = prev.documents.map(document =>
          document.id === documentId ? updatedDocument : document
        )
        setToStorage('app_documents', updatedDocuments)
        return {
          ...prev,
          documents: updatedDocuments
        }
      })
    } catch (error) {
      console.error('Failed to update document sharing:', error)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await loadAllData()
  }, [loadAllData])

  const clearPersistedData = useCallback(() => {
    setToStorage('app_todos', [])
    setToStorage('app_discussions', [])
    setToStorage('app_documents', [])

    setState({
      todos: [],
      discussions: [],
      documents: [],
      loading: false,
    })
  }, [])

  const value = useMemo<DataContextValue>(() => ({
    // State
    todos: state.todos,
    discussions: state.discussions,
    documents: state.documents,
    loading: state.loading,

    // Actions
    setLoading,
    createTodo,
    updateTodoStatus,
    updateDiscussionStatus,
    updateDocumentSharing,
    refreshData,
    clearPersistedData,
  }), [
    state.todos,
    state.discussions,
    state.documents,
    state.loading,
    setLoading,
    createTodo,
    updateTodoStatus,
    updateDiscussionStatus,
    updateDocumentSharing,
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