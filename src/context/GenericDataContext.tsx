/**
 * GenericDataContext - Entity-agnostic data management
 *
 * Provides generic CRUD operations for any entity type registered
 * in the ServiceRegistry. Eliminates the need to modify context
 * for each new entity.
 *
 * @example
 * ```typescript
 * const { getEntities, createEntity } = useGenericData()
 * const orders = getEntities<Order>('orders')
 * await createEntity('orders', { customerName: 'John' })
 * ```
 */

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { serviceRegistry } from '../services/ServiceRegistry'
import type { EntityState } from '../types/app'

export interface GenericDataContextValue {
  // Generic entity accessors
  getEntities: <T>(key: string) => T[]
  getLoading: (key: string) => boolean
  getError: (key: string) => string | null

  // Generic CRUD operations
  createEntity: <T extends { id: string }>(key: string, data: Omit<T, 'id'>) => Promise<T>
  updateEntity: <T extends { id: string }>(key: string, id: string, data: Partial<T>) => Promise<void>
  deleteEntity: (key: string, id: string) => Promise<void>
  refreshEntities: (key: string) => Promise<void>
  refreshAll: () => Promise<void>

  // Global state
  isAnyLoading: boolean
  globalError: string | null
}

const GenericDataContext = createContext<GenericDataContextValue | undefined>(undefined)

interface GenericDataProviderProps {
  children: ReactNode
}

export function GenericDataProvider({ children }: GenericDataProviderProps) {
  const [entities, setEntities] = useState<Record<string, EntityState>>({})

  // Initialize all registered services on mount
  useEffect(() => {
    const initialState: Record<string, EntityState> = {}

    for (const [key] of serviceRegistry.getAll()) {
      initialState[key] = {
        data: [],
        loading: false,
        error: null
      }
    }

    setEntities(initialState)

    // Auto-load all entities on mount
    const loadAll = async () => {
      for (const [key, service] of serviceRegistry.getAll()) {
        try {
          setEntities(prev => ({
            ...prev,
            [key]: { ...prev[key], loading: true, error: null }
          }))

          const data = await service.getAll()

          setEntities(prev => ({
            ...prev,
            [key]: { data, loading: false, error: null }
          }))
        } catch (error) {
          setEntities(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              loading: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }))
        }
      }
    }

    loadAll()
  }, [])

  // Get entities by key
  const getEntities = useCallback(<T,>(key: string): T[] => {
    return (entities[key]?.data || []) as T[]
  }, [entities])

  // Get loading state by key
  const getLoading = useCallback((key: string): boolean => {
    return entities[key]?.loading || false
  }, [entities])

  // Get error by key
  const getError = useCallback((key: string): string | null => {
    return entities[key]?.error || null
  }, [entities])

  // Create entity
  const createEntity = useCallback(async <T extends { id: string }>(
    key: string,
    data: Omit<T, 'id'>
  ): Promise<T> => {
    const service = serviceRegistry.get<T>(key)
    if (!service) throw new Error(`No service registered for: ${key}`)

    setEntities(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null }
    }))

    try {
      const newEntity = await service.create(data)

      setEntities(prev => ({
        ...prev,
        [key]: {
          data: [...(prev[key]?.data || []), newEntity],
          loading: false,
          error: null
        }
      }))

      return newEntity
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Create failed'
      setEntities(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          error: errorMessage
        }
      }))
      throw error
    }
  }, [])

  // Update entity
  const updateEntity = useCallback(async <T extends { id: string }>(
    key: string,
    id: string,
    data: Partial<T>
  ): Promise<void> => {
    const service = serviceRegistry.get<T>(key)
    if (!service) throw new Error(`No service registered for: ${key}`)

    setEntities(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null }
    }))

    try {
      await service.update(id, data)

      setEntities(prev => ({
        ...prev,
        [key]: {
          data: prev[key].data.map((item: any) =>
            item.id === id ? { ...item, ...data } : item
          ),
          loading: false,
          error: null
        }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed'
      setEntities(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          error: errorMessage
        }
      }))
      throw error
    }
  }, [])

  // Delete entity
  const deleteEntity = useCallback(async (
    key: string,
    id: string
  ): Promise<void> => {
    const service = serviceRegistry.get(key)
    if (!service) throw new Error(`No service registered for: ${key}`)

    setEntities(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null }
    }))

    try {
      await service.delete(id)

      setEntities(prev => ({
        ...prev,
        [key]: {
          data: prev[key].data.filter((item: any) => item.id !== id),
          loading: false,
          error: null
        }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed'
      setEntities(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          error: errorMessage
        }
      }))
      throw error
    }
  }, [])

  // Refresh entities for a specific key
  const refreshEntities = useCallback(async (key: string): Promise<void> => {
    const service = serviceRegistry.get(key)
    if (!service) throw new Error(`No service registered for: ${key}`)

    setEntities(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null }
    }))

    try {
      const data = await service.getAll()

      setEntities(prev => ({
        ...prev,
        [key]: { data, loading: false, error: null }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Refresh failed'
      setEntities(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          error: errorMessage
        }
      }))
      throw error
    }
  }, [])

  // Refresh all entities
  const refreshAll = useCallback(async (): Promise<void> => {
    const keys = serviceRegistry.getKeys()
    await Promise.all(keys.map(key => refreshEntities(key)))
  }, [refreshEntities])

  // Check if any entity is loading
  const isAnyLoading = useMemo(() => {
    return Object.values(entities).some(state => state.loading)
  }, [entities])

  // Get first error from any entity
  const globalError = useMemo(() => {
    const errorState = Object.values(entities).find(state => state.error)
    return errorState?.error || null
  }, [entities])

  const value: GenericDataContextValue = useMemo(() => ({
    getEntities,
    getLoading,
    getError,
    createEntity,
    updateEntity,
    deleteEntity,
    refreshEntities,
    refreshAll,
    isAnyLoading,
    globalError
  }), [
    getEntities,
    getLoading,
    getError,
    createEntity,
    updateEntity,
    deleteEntity,
    refreshEntities,
    refreshAll,
    isAnyLoading,
    globalError
  ])

  return (
    <GenericDataContext.Provider value={value}>
      {children}
    </GenericDataContext.Provider>
  )
}

export function useGenericData() {
  const context = useContext(GenericDataContext)
  if (context === undefined) {
    throw new Error('useGenericData must be used within a GenericDataProvider')
  }
  return context
}
