import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useDataOperations, type FilterCriteria, type SortConfig } from './useDataOperations'

describe('useDataOperations', () => {
  const sampleData = [
    { id: '1', title: 'Task A', priority: 'high', status: 'pending', dueDate: '2024-01-15', category: 'work' },
    { id: '2', title: 'Task B', priority: 'low', status: 'completed', dueDate: '2024-01-10', category: 'personal' },
    { id: '3', title: 'Task C', priority: 'medium', status: 'in-progress', dueDate: '2024-01-20', category: 'work' },
    { id: '4', title: 'Task D', priority: 'urgent', status: 'pending', dueDate: '2024-01-12', category: 'work' }
  ]

  describe('processData', () => {
    it('returns original data when no operations specified', () => {
      const { result } = renderHook(() => useDataOperations())
      const processed = result.current.processData({ data: sampleData })

      expect(processed.processedData).toEqual(sampleData)
      expect(processed.totalCount).toBe(4)
      expect(processed.filteredCount).toBe(4)
    })

    it('applies filtering correctly', () => {
      const { result } = renderHook(() => useDataOperations())
      const filterCriteria: FilterCriteria = { category: 'work', status: 'pending' }
      const processed = result.current.processData({ data: sampleData, filterCriteria })

      expect(processed.processedData).toHaveLength(2)
      expect(processed.processedData.map(item => item.id)).toEqual(['1', '4'])
      expect(processed.totalCount).toBe(4)
      expect(processed.filteredCount).toBe(2)
    })

    it('applies negation filtering with ! prefix', () => {
      const { result } = renderHook(() => useDataOperations())
      const filterCriteria: FilterCriteria = { status: '!completed' }
      const processed = result.current.processData({ data: sampleData, filterCriteria })

      expect(processed.processedData).toHaveLength(3)
      expect(processed.processedData.every(item => item.status !== 'completed')).toBe(true)
    })

    it('applies maxItems limitation', () => {
      const { result } = renderHook(() => useDataOperations())
      const processed = result.current.processData({ data: sampleData, maxItems: 2 })

      expect(processed.processedData).toHaveLength(2)
      expect(processed.processedData.map(item => item.id)).toEqual(['1', '2'])
    })

    it('combines filtering and maxItems', () => {
      const { result } = renderHook(() => useDataOperations())
      const filterCriteria: FilterCriteria = { category: 'work' }
      const processed = result.current.processData({
        data: sampleData,
        filterCriteria,
        maxItems: 2
      })

      expect(processed.processedData).toHaveLength(2)
      expect(processed.processedData.every(item => item.category === 'work')).toBe(true)
    })
  })

  describe('applyFilters', () => {
    it('returns original data when no criteria provided', () => {
      const { result } = renderHook(() => useDataOperations())
      const filtered = result.current.applyFilters(sampleData)

      expect(filtered).toEqual(sampleData)
    })

    it('filters by single criterion', () => {
      const { result } = renderHook(() => useDataOperations())
      const filtered = result.current.applyFilters(sampleData, { priority: 'high' })

      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('1')
    })

    it('filters by multiple criteria (AND logic)', () => {
      const { result } = renderHook(() => useDataOperations())
      const filtered = result.current.applyFilters(sampleData, {
        category: 'work',
        status: 'pending'
      })

      expect(filtered).toHaveLength(2)
      expect(filtered.map(item => item.id)).toEqual(['1', '4'])
    })

    it('handles negation filters correctly', () => {
      const { result } = renderHook(() => useDataOperations())
      const filtered = result.current.applyFilters(sampleData, { priority: '!low' })

      expect(filtered).toHaveLength(3)
      expect(filtered.every(item => item.priority !== 'low')).toBe(true)
    })
  })

  describe('applySorting', () => {
    it('returns original order when no sort config provided', () => {
      const { result } = renderHook(() => useDataOperations())
      const sorted = result.current.applySorting(sampleData)

      expect(sorted.map(item => item.id)).toEqual(['1', '2', '3', '4'])
    })

    it('sorts by string field ascending', () => {
      const { result } = renderHook(() => useDataOperations())
      const sortConfig: SortConfig = { field: 'title', direction: 'asc' }
      const sorted = result.current.applySorting(sampleData, sortConfig)

      expect(sorted.map(item => item.title)).toEqual(['Task A', 'Task B', 'Task C', 'Task D'])
    })

    it('sorts by string field descending', () => {
      const { result } = renderHook(() => useDataOperations())
      const sortConfig: SortConfig = { field: 'title', direction: 'desc' }
      const sorted = result.current.applySorting(sampleData, sortConfig)

      expect(sorted.map(item => item.title)).toEqual(['Task D', 'Task C', 'Task B', 'Task A'])
    })

    it('sorts by priority with custom priority order', () => {
      const { result } = renderHook(() => useDataOperations())
      const sortConfig: SortConfig = { field: 'priority', direction: 'desc' }
      const sorted = result.current.applySorting(sampleData, sortConfig)

      expect(sorted.map(item => item.priority)).toEqual(['urgent', 'high', 'medium', 'low'])
    })

    it('sorts by status with custom status order', () => {
      const { result } = renderHook(() => useDataOperations())
      const sortConfig: SortConfig = { field: 'status', direction: 'asc' }
      const sorted = result.current.applySorting(sampleData, sortConfig)

      expect(sorted.map(item => item.status)).toEqual(['pending', 'pending', 'in-progress', 'completed'])
    })

    it('sorts by date field', () => {
      const { result } = renderHook(() => useDataOperations())
      const sortConfig: SortConfig = { field: 'dueDate', direction: 'asc' }
      const sorted = result.current.applySorting(sampleData, sortConfig)

      expect(sorted.map(item => item.dueDate)).toEqual(['2024-01-10', '2024-01-12', '2024-01-15', '2024-01-20'])
    })
  })

  describe('applyPagination', () => {
    it('returns original data when no maxItems specified', () => {
      const { result } = renderHook(() => useDataOperations())
      const paginated = result.current.applyPagination(sampleData)

      expect(paginated).toEqual(sampleData)
    })

    it('limits data to specified maxItems', () => {
      const { result } = renderHook(() => useDataOperations())
      const paginated = result.current.applyPagination(sampleData, 2)

      expect(paginated).toHaveLength(2)
      expect(paginated.map(item => item.id)).toEqual(['1', '2'])
    })

    it('returns all data when maxItems exceeds data length', () => {
      const { result } = renderHook(() => useDataOperations())
      const paginated = result.current.applyPagination(sampleData, 10)

      expect(paginated).toEqual(sampleData)
    })
  })
})