import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { usePageLoading, useAsyncLoading } from './usePageLoading'

describe('usePageLoading', () => {
  it('returns false when initialLoading is false', () => {
    const { result } = renderHook(() => usePageLoading(false))
    const [loading] = result.current

    expect(loading).toBe(false)
  })

  it('starts with true and becomes false after delay', async () => {
    const { result } = renderHook(() => usePageLoading(true, 100))
    const [loading] = result.current

    expect(loading).toBe(true)

    await waitFor(() => {
      const [updatedLoading] = result.current
      expect(updatedLoading).toBe(false)
    }, { timeout: 200 })
  })

  it('allows manual control of loading state', () => {
    const { result } = renderHook(() => usePageLoading(false))
    const [initialLoading, setLoading] = result.current

    expect(initialLoading).toBe(false)
    expect(typeof setLoading).toBe('function')
  })
})

describe('useAsyncLoading', () => {
  it('starts in loading state', () => {
    const mockAsyncFn = vi.fn(() => Promise.resolve('data'))
    const { result } = renderHook(() => useAsyncLoading(mockAsyncFn))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('handles successful async operation', async () => {
    const mockData = 'test data'
    const mockAsyncFn = vi.fn(() => Promise.resolve(mockData))
    const { result } = renderHook(() => useAsyncLoading(mockAsyncFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(mockData)
    expect(result.current.error).toBe(null)
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  it('handles async operation errors', async () => {
    const mockError = new Error('Test error')
    const mockAsyncFn = vi.fn(() => Promise.reject(mockError))
    const { result } = renderHook(() => useAsyncLoading(mockAsyncFn))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(mockError)
  })
})