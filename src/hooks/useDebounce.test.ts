import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    )

    expect(result.current).toBe('first')

    // Update value
    rerender({ value: 'second', delay: 500 })
    expect(result.current).toBe('first') // Still old value

    // Advance past delay
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('second')
  })

  it('cancels previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    )

    // Rapid changes
    rerender({ value: 'second', delay: 500 })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'third', delay: 500 })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'fourth', delay: 500 })

    // Only the last value should be set after full delay
    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('fourth')
  })

  it('handles different delay values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 100 } }
    )

    rerender({ value: 'updated', delay: 100 })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('updated')
  })

  it('works with different value types', async () => {
    // Test with numbers
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 500 } }
    )

    numberRerender({ value: 42, delay: 500 })

    await act(async () => {
      vi.advanceTimersByTime(500)
    })

    expect(numberResult.current).toBe(42)
  })
})
