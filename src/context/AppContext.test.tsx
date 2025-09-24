import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AppProvider, useAppContext } from './AppContext'

vi.mock('../services', () => ({
  todosService: { getAll: vi.fn(() => Promise.resolve([])) },
  discussionsService: { getAll: vi.fn(() => Promise.resolve([])) },
  documentsService: { getAll: vi.fn(() => Promise.resolve([])) }
}))

describe('AppContext', () => {
  it('provides initial state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any

    await act(async () => {
      const hookResult = renderHook(() => useAppContext(), {
        wrapper: AppProvider
      })
      result = hookResult.result
    })

    expect(result.current.state.todos).toEqual([])
    expect(result.current.state.discussions).toEqual([])
    expect(result.current.state.documents).toEqual([])
    expect(result.current.state.loading).toBe(false)
  })

  it('has required context methods', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any

    await act(async () => {
      const hookResult = renderHook(() => useAppContext(), {
        wrapper: AppProvider
      })
      result = hookResult.result
    })

    expect(typeof result.current.updateTodoStatus).toBe('function')
    expect(typeof result.current.updateDiscussionStatus).toBe('function')
    expect(typeof result.current.updateDocumentSharing).toBe('function')
    expect(typeof result.current.setTheme).toBe('function')
  })

  it('toggles theme state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any

    await act(async () => {
      const hookResult = renderHook(() => useAppContext(), {
        wrapper: AppProvider
      })
      result = hookResult.result
    })

    const initialTheme = result.current.state.theme

    await act(async () => {
      result.current.setTheme(initialTheme === 'light' ? 'dark' : 'light')
    })

    expect(result.current.state.theme).toBe(initialTheme === 'light' ? 'dark' : 'light')
  })
})