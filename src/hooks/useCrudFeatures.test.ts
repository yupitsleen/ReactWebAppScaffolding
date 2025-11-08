import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCrudFeatures } from './useCrudFeatures'
import type { AppConfig } from '../types/portal'

// Store original appConfig
let originalAppConfig: AppConfig

describe('useCrudFeatures', () => {
  beforeEach(async () => {
    // Import and store original config
    const configModule = await import('../data/configurableData')
    originalAppConfig = { ...configModule.appConfig }
  })

  afterEach(async () => {
    // Restore original config
    const configModule = await import('../data/configurableData')
    Object.assign(configModule.appConfig, originalAppConfig)
  })

  describe('canPerformCrud', () => {
    it('returns true for enabled CRUD operations', () => {
      const { result } = renderHook(() => useCrudFeatures())

      expect(result.current.canPerformCrud('create')).toBe(true)
      expect(result.current.canPerformCrud('edit')).toBe(true)
      expect(result.current.canPerformCrud('delete')).toBe(true)
      expect(result.current.canPerformCrud('export')).toBe(true)
    })

    it('returns false for disabled CRUD operations', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        crud: {
          create: false,
          edit: false,
          delete: false,
          export: false,
          import: false,
        },
      }

      const { result } = renderHook(() => useCrudFeatures())

      expect(result.current.canPerformCrud('create')).toBe(false)
      expect(result.current.canPerformCrud('edit')).toBe(false)
      expect(result.current.canPerformCrud('delete')).toBe(false)
      expect(result.current.canPerformCrud('export')).toBe(false)
    })

    it('handles import operation (disabled by default)', () => {
      const { result } = renderHook(() => useCrudFeatures())

      expect(result.current.canPerformCrud('import')).toBe(false)
    })
  })

  describe('read-only mode scenario', () => {
    it('disables all write operations while keeping read operations', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        crud: {
          create: false,
          edit: false,
          delete: false,
          export: true,  // Allow export in read-only mode
          import: false,
        },
      }

      const { result } = renderHook(() => useCrudFeatures())

      expect(result.current.canPerformCrud('create')).toBe(false)
      expect(result.current.canPerformCrud('edit')).toBe(false)
      expect(result.current.canPerformCrud('delete')).toBe(false)
      expect(result.current.canPerformCrud('export')).toBe(true)
    })
  })
})
