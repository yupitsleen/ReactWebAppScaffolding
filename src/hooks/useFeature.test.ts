import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFeature } from './useFeature'
import type { AppConfig } from '../types/portal'

// Store original appConfig
let originalAppConfig: AppConfig

describe('useFeature', () => {
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

  describe('isEnabled', () => {
    it('returns true for enabled top-level features', () => {
      const { result } = renderHook(() => useFeature())

      // darkMode, highContrastMode, and layoutDensity are currently disabled in config
      expect(result.current.isEnabled('commandPalette')).toBe(true)
      expect(result.current.isEnabled('notifications')).toBe(true)
      expect(result.current.isEnabled('keyboardShortcuts')).toBe(true)
    })

    it('returns false for disabled top-level features', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        darkMode: false,
        commandPalette: false,
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('darkMode')).toBe(false)
      expect(result.current.isEnabled('commandPalette')).toBe(false)
    })

    it('returns true for enabled nested features using dot notation', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('pages.home')).toBe(true)
      expect(result.current.isEnabled('crud.create')).toBe(true)
      expect(result.current.isEnabled('authentication.enabled')).toBe(true)
      expect(result.current.isEnabled('dashboard.cards')).toBe(true)
    })

    it('returns false for disabled nested features using dot notation', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          ...configModule.appConfig.features!.pages,
          discussions: false,
          timeline: false,
        },
        crud: {
          ...configModule.appConfig.features!.crud,
          delete: false,
        },
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('pages.discussions')).toBe(false)
      expect(result.current.isEnabled('pages.timeline')).toBe(false)
      expect(result.current.isEnabled('crud.delete')).toBe(false)
    })

    it('returns false for non-existent features', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('nonExistentFeature')).toBe(false)
      expect(result.current.isEnabled('pages.nonExistentPage')).toBe(false)
    })

    it('handles deeply nested paths', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('authentication.rememberMe')).toBe(true)
      expect(result.current.isEnabled('authentication.requireEmailVerification')).toBe(false)
    })

    it('returns false for undefined/null values in path', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('some.deeply.nested.path.that.does.not.exist')).toBe(false)
    })
  })

  describe('error handling', () => {
    it('handles invalid paths gracefully', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('')).toBe(false)
      expect(result.current.isEnabled('.')).toBe(false)
      expect(result.current.isEnabled('..')).toBe(false)
    })

    it('handles null/undefined values in path', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('some.deeply.nested.path.that.does.not.exist')).toBe(false)
    })

    it('handles features with null values', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        // @ts-expect-error - Testing runtime null handling
        darkMode: null,
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('darkMode')).toBe(false)
    })

    it('handles features with undefined values', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        // @ts-expect-error - Testing runtime undefined handling
        darkMode: undefined,
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('darkMode')).toBe(false)
    })

    it('handles non-boolean leaf values', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        // @ts-expect-error - Testing runtime type checking
        darkMode: 'yes',
      }

      const { result } = renderHook(() => useFeature())

      // Should return false for non-boolean values
      expect(result.current.isEnabled('darkMode')).toBe(false)
    })

    it('handles circular references gracefully', () => {
      const { result } = renderHook(() => useFeature())

      // This shouldn't throw, just return false
      expect(() => result.current.isEnabled('circular.ref.test')).not.toThrow()
      expect(result.current.isEnabled('circular.ref.test')).toBe(false)
    })
  })

  describe('features object', () => {
    it('exposes the full features configuration', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.features).toBeDefined()
      expect(result.current.features.darkMode).toBeDefined()
      expect(result.current.features.pages).toBeDefined()
      expect(result.current.features.crud).toBeDefined()
      expect(result.current.features.authentication).toBeDefined()
    })

    it('returns default features when config.features is undefined', async () => {
      const configModule = await import('../data/configurableData')

      // Remove features config
      const originalFeatures = configModule.appConfig.features
      delete configModule.appConfig.features

      const { result } = renderHook(() => useFeature())

      // Should have defaults (all enabled)
      expect(result.current.features.darkMode).toBe(true)
      expect(result.current.features.commandPalette).toBe(true)
      expect(result.current.features.crud.create).toBe(true)

      // Restore
      configModule.appConfig.features = originalFeatures
    })
  })

  describe('minimal UI scenario', () => {
    it('disables all UI enhancements', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        darkMode: false,
        highContrastMode: false,
        layoutDensity: false,
        commandPalette: false,
        keyboardShortcuts: false,
        notifications: false,
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isEnabled('darkMode')).toBe(false)
      expect(result.current.isEnabled('highContrastMode')).toBe(false)
      expect(result.current.isEnabled('layoutDensity')).toBe(false)
      expect(result.current.isEnabled('commandPalette')).toBe(false)
      expect(result.current.isEnabled('keyboardShortcuts')).toBe(false)
      expect(result.current.isEnabled('notifications')).toBe(false)
    })
  })
})
