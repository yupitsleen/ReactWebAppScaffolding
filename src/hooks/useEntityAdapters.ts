/**
 * Entity Adapter Hooks - Backward compatibility layer
 *
 * These hooks wrap the generic data context to provide the same API
 * as the old entity-specific methods. This allows existing pages to
 * continue working without modifications while we gradually migrate
 * to the new generic API.
 *
 * @deprecated These hooks are provided for backward compatibility.
 * New code should use useGenericData() directly.
 */

import { useCallback } from 'react'
import { useGenericData } from '../context/GenericDataContext'
import type { TodoItem, Discussion, Document } from '../types/portal'

/**
 * Adapter hook for TodoItem entities
 * @deprecated Use useGenericData() directly
 */
export function useTodos() {
  const { getEntities, getLoading, createEntity, updateEntity, deleteEntity, refreshEntities } = useGenericData()

  const updateTodoStatus = useCallback(
    async (todoId: string, status: 'pending' | 'in-progress' | 'completed') => {
      await updateEntity<TodoItem>('todoItems', todoId, { status })
    },
    [updateEntity]
  )

  return {
    todos: getEntities<TodoItem>('todoItems'),
    todosLoading: getLoading('todoItems'),
    createTodo: useCallback(
      (data: Omit<TodoItem, 'id'>) => createEntity<TodoItem>('todoItems', data),
      [createEntity]
    ),
    updateTodo: useCallback(
      (id: string, data: Partial<TodoItem>) => updateEntity<TodoItem>('todoItems', id, data),
      [updateEntity]
    ),
    updateTodoStatus,
    deleteTodo: useCallback(
      (id: string) => deleteEntity('todoItems', id),
      [deleteEntity]
    ),
    refreshTodos: useCallback(
      () => refreshEntities('todoItems'),
      [refreshEntities]
    )
  }
}

/**
 * Adapter hook for Discussion entities
 * @deprecated Use useGenericData() directly
 */
export function useDiscussions() {
  const { getEntities, getLoading, createEntity, updateEntity, deleteEntity, refreshEntities } = useGenericData()

  const updateDiscussionStatus = useCallback(
    async (discussionId: string, resolved: boolean) => {
      await updateEntity<Discussion>('discussions', discussionId, { resolved })
    },
    [updateEntity]
  )

  return {
    discussions: getEntities<Discussion>('discussions'),
    discussionsLoading: getLoading('discussions'),
    createDiscussion: useCallback(
      (data: Omit<Discussion, 'id'>) => createEntity<Discussion>('discussions', data),
      [createEntity]
    ),
    updateDiscussion: useCallback(
      (id: string, data: Partial<Discussion>) => updateEntity<Discussion>('discussions', id, data),
      [updateEntity]
    ),
    updateDiscussionStatus,
    deleteDiscussion: useCallback(
      (id: string) => deleteEntity('discussions', id),
      [deleteEntity]
    ),
    refreshDiscussions: useCallback(
      () => refreshEntities('discussions'),
      [refreshEntities]
    )
  }
}

/**
 * Adapter hook for Document entities
 * @deprecated Use useGenericData() directly
 */
export function useDocuments() {
  const { getEntities, getLoading, createEntity, updateEntity, deleteEntity, refreshEntities } = useGenericData()

  const updateDocumentSharing = useCallback(
    async (documentId: string, shared: boolean) => {
      await updateEntity<Document>('documents', documentId, { shared })
    },
    [updateEntity]
  )

  return {
    documents: getEntities<Document>('documents'),
    documentsLoading: getLoading('documents'),
    createDocument: useCallback(
      (data: Omit<Document, 'id'>) => createEntity<Document>('documents', data),
      [createEntity]
    ),
    updateDocument: useCallback(
      (id: string, data: Partial<Document>) => updateEntity<Document>('documents', id, data),
      [updateEntity]
    ),
    updateDocumentSharing,
    deleteDocument: useCallback(
      (id: string) => deleteEntity('documents', id),
      [deleteEntity]
    ),
    refreshDocuments: useCallback(
      () => refreshEntities('documents'),
      [refreshEntities]
    )
  }
}

/**
 * Combined hook that mimics the old useData() API
 * @deprecated Use useGenericData() directly
 */
export function useDataAdapter() {
  const genericData = useGenericData()
  const todos = useTodos()
  const discussions = useDiscussions()
  const documents = useDocuments()

  return {
    // Todos
    todos: todos.todos,
    todosLoading: todos.todosLoading,
    createTodo: todos.createTodo,
    updateTodoStatus: todos.updateTodoStatus,

    // Discussions
    discussions: discussions.discussions,
    discussionsLoading: discussions.discussionsLoading,
    updateDiscussionStatus: discussions.updateDiscussionStatus,

    // Documents
    documents: documents.documents,
    documentsLoading: documents.documentsLoading,
    updateDocumentSharing: documents.updateDocumentSharing,

    // Global
    loading: genericData.isAnyLoading,
    setLoading: () => {
      console.warn('setLoading is deprecated - loading state is now automatic')
    },
    refreshData: genericData.refreshAll,
    clearPersistedData: () => {
      console.warn('clearPersistedData not yet implemented in generic context')
    }
  }
}
