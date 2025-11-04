import { useState, useCallback, useEffect } from 'react'
import { getFromStorage, setToStorage } from '../utils/helpers'

interface EntityService<T> {
  getAll: () => Promise<T[]>
  create: (data: Omit<T, 'id'>) => Promise<T>
  update: (id: string, data: Partial<T>) => Promise<T>
  delete?: (id: string) => Promise<boolean>
}

interface UseEntityStateOptions<T> {
  service: EntityService<T>
  storageKey: string
  initialData?: T[]
}

interface UseEntityStateReturn<T> {
  entities: T[]
  loading: boolean
  error: Error | null
  setLoading: (loading: boolean) => void
  loadEntities: () => Promise<void>
  createEntity: (data: Omit<T, 'id'>) => Promise<T>
  updateEntity: (id: string, data: Partial<T>) => Promise<void>
  deleteEntity?: (id: string) => Promise<void>
  clearEntities: () => void
  refreshEntities: () => Promise<void>
}

/**
 * Generic hook for managing entity state with persistence and service integration
 * Eliminates repeated patterns across todos, discussions, documents, etc.
 */
export function useEntityState<T extends { id: string }>({
  service,
  storageKey,
  initialData = []
}: UseEntityStateOptions<T>): UseEntityStateReturn<T> {
  const [entities, setEntities] = useState<T[]>(() =>
    getFromStorage(storageKey, initialData)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Persist entities to storage whenever they change
  const persistEntities = useCallback((newEntities: T[]) => {
    setToStorage(storageKey, newEntities)
  }, [storageKey])

  // Load all entities from service
  const loadEntities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await service.getAll()
      setEntities(data)
      persistEntities(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load entities'))
      console.error(`Failed to load entities from ${storageKey}:`, err)
    } finally {
      setLoading(false)
    }
  }, [service, storageKey, persistEntities])

  // Create new entity
  const createEntity = useCallback(async (data: Omit<T, 'id'>): Promise<T> => {
    try {
      const newEntity = await service.create(data)

      setEntities(prev => {
        const updated = [...prev, newEntity]
        persistEntities(updated)
        return updated
      })

      return newEntity
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create entity')
      setError(error)
      throw error
    }
  }, [service, persistEntities])

  // Update existing entity
  const updateEntity = useCallback(async (id: string, data: Partial<T>) => {
    try {
      const updatedEntity = await service.update(id, data)

      setEntities(prev => {
        const updated = prev.map(entity =>
          entity.id === id ? updatedEntity : entity
        )
        persistEntities(updated)
        return updated
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update entity')
      setError(error)
      console.error(`Failed to update entity ${id}:`, err)
    }
  }, [service, persistEntities])

  // Delete entity (if service supports it)
  const deleteEntity = service.delete ? useCallback(async (id: string) => {
    try {
      await service.delete!(id)

      setEntities(prev => {
        const updated = prev.filter(entity => entity.id !== id)
        persistEntities(updated)
        return updated
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete entity')
      setError(error)
      console.error(`Failed to delete entity ${id}:`, err)
    }
  }, [service, persistEntities]) : undefined

  // Clear all entities
  const clearEntities = useCallback(() => {
    setEntities([])
    persistEntities([])
  }, [persistEntities])

  // Refresh entities (reload from service)
  const refreshEntities = useCallback(async () => {
    await loadEntities()
  }, [loadEntities])

  // Auto-load entities on mount to ensure fresh data from API
  useEffect(() => {
    loadEntities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return {
    entities,
    loading,
    error,
    setLoading,
    loadEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    clearEntities,
    refreshEntities,
  }
}