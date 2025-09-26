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

  describe('processData operations', () => {
    it('handles all data processing scenarios', () => {
      const { result } = renderHook(() => useDataOperations())

      // No operations - returns original data
      let processed = result.current.processData({ data: sampleData })
      expect(processed.processedData).toEqual(sampleData)
      expect(processed.totalCount).toBe(4)
      expect(processed.filteredCount).toBe(4)

      // Basic filtering
      processed = result.current.processData({
        data: sampleData,
        filterCriteria: { category: 'work', status: 'pending' }
      })
      expect(processed.processedData).toHaveLength(2)
      expect(processed.processedData.map(item => item.id)).toEqual(['1', '4'])

      // Negation filtering
      processed = result.current.processData({
        data: sampleData,
        filterCriteria: { status: '!completed' }
      })
      expect(processed.processedData).toHaveLength(3)
      expect(processed.processedData.every(item => item.status !== 'completed')).toBe(true)

      // MaxItems limitation
      processed = result.current.processData({ data: sampleData, maxItems: 2 })
      expect(processed.processedData).toHaveLength(2)
      expect(processed.processedData.map(item => item.id)).toEqual(['1', '2'])

      // Combined filtering and maxItems
      processed = result.current.processData({
        data: sampleData,
        filterCriteria: { category: 'work' },
        maxItems: 2
      })
      expect(processed.processedData).toHaveLength(2)
      expect(processed.processedData.every(item => item.category === 'work')).toBe(true)
    })
  })

  describe('individual operations', () => {
    it('tests filtering, sorting, and pagination functions', () => {
      const { result } = renderHook(() => useDataOperations())

      // Filtering tests
      expect(result.current.applyFilters(sampleData)).toEqual(sampleData)
      expect(result.current.applyFilters(sampleData, { priority: 'high' })).toHaveLength(1)
      expect(result.current.applyFilters(sampleData, { priority: '!low' })).toHaveLength(3)

      // Sorting tests
      expect(result.current.applySorting(sampleData).map(item => item.id)).toEqual(['1', '2', '3', '4'])
      expect(result.current.applySorting(sampleData, { field: 'priority', direction: 'desc' })
        .map(item => item.priority)).toEqual(['urgent', 'high', 'medium', 'low'])
      expect(result.current.applySorting(sampleData, { field: 'dueDate', direction: 'asc' })
        .map(item => item.dueDate)).toEqual(['2024-01-10', '2024-01-12', '2024-01-15', '2024-01-20'])

      // Pagination tests
      expect(result.current.applyPagination(sampleData)).toEqual(sampleData)
      expect(result.current.applyPagination(sampleData, 2)).toHaveLength(2)
      expect(result.current.applyPagination(sampleData, 10)).toEqual(sampleData)
    })
  })
})