import { useMemo, useCallback } from 'react'

export interface FilterCriteria {
  [key: string]: unknown
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface DataOperationsConfig<T> {
  data: T[]
  filterCriteria?: FilterCriteria
  sortConfig?: SortConfig
  maxItems?: number
}

export interface DataOperationsResult<T> {
  processedData: T[]
  totalCount: number
  filteredCount: number
}

export const useDataOperations = <T extends Record<string, unknown>>() => {
  const applyFilters = useCallback((data: T[], criteria?: FilterCriteria): T[] => {
    if (!criteria || Object.keys(criteria).length === 0) return data

    return data.filter(item => {
      return Object.entries(criteria).every(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('!')) {
          return item[key] !== value.slice(1)
        }
        return item[key] === value
      })
    })
  }, [])

  const applySorting = useCallback((data: T[], sortConfig?: SortConfig): T[] => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const { field, direction } = sortConfig
      let aValue: string | number | Date = a[field] as string | number | Date
      let bValue: string | number | Date = b[field] as string | number | Date

      if (field === 'dueDate' || field === 'createdAt' || field === 'paidDate') {
        aValue = new Date(aValue as string)
        bValue = new Date(bValue as string)
      } else if (field === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1, urgent: 4 }
        aValue = priorityValues[aValue as keyof typeof priorityValues] || 0
        bValue = priorityValues[bValue as keyof typeof priorityValues] || 0
      } else if (field === 'status') {
        const statusValues = { pending: 1, 'in-progress': 2, completed: 3 }
        aValue = statusValues[aValue as keyof typeof statusValues] || 0
        bValue = statusValues[bValue as keyof typeof statusValues] || 0
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return direction === 'desc' ? -comparison : comparison
    })
  }, [])

  const applyPagination = useCallback((data: T[], maxItems?: number): T[] => {
    if (!maxItems) return data
    return data.slice(0, maxItems)
  }, [])

  const processData = useMemo(() => {
    return ({ data, filterCriteria, sortConfig, maxItems }: DataOperationsConfig<T>): DataOperationsResult<T> => {
      const totalCount = data.length

      let processedData = applyFilters(data, filterCriteria)
      const filteredCount = processedData.length

      processedData = applySorting(processedData, sortConfig)
      processedData = applyPagination(processedData, maxItems)

      return {
        processedData,
        totalCount,
        filteredCount
      }
    }
  }, [applyFilters, applySorting, applyPagination])

  return {
    processData,
    applyFilters,
    applySorting,
    applyPagination
  }
}