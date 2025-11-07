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

      // darkMode and highContrastMode are currently disabled in config
      expect(result.current.isEnabled('commandPalette')).toBe(true)
      expect(result.current.isEnabled('notifications')).toBe(true)
      expect(result.current.isEnabled('layoutDensity')).toBe(true)
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

  describe('isPageEnabled', () => {
    it('returns true for enabled pages', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isPageEnabled('home')).toBe(true)
      expect(result.current.isPageEnabled('tasks')).toBe(true)
      expect(result.current.isPageEnabled('documents')).toBe(true)
    })

    it('returns false for disabled pages', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          ...configModule.appConfig.features!.pages,
          discussions: false,
          timeline: false,
        },
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isPageEnabled('discussions')).toBe(false)
      expect(result.current.isPageEnabled('timeline')).toBe(false)
    })

    it('returns false for non-existent pages', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.isPageEnabled('nonExistentPage')).toBe(false)
    })
  })

  describe('canPerformCrud', () => {
    it('returns true for enabled CRUD operations', () => {
      const { result } = renderHook(() => useFeature())

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

      const { result } = renderHook(() => useFeature())

      expect(result.current.canPerformCrud('create')).toBe(false)
      expect(result.current.canPerformCrud('edit')).toBe(false)
      expect(result.current.canPerformCrud('delete')).toBe(false)
      expect(result.current.canPerformCrud('export')).toBe(false)
    })

    it('handles import operation (disabled by default)', () => {
      const { result } = renderHook(() => useFeature())

      expect(result.current.canPerformCrud('import')).toBe(false)
    })
  })

  describe('getEnabledPages', () => {
    it('returns all enabled pages from navigation', () => {
      const { result } = renderHook(() => useFeature())

      const enabledPages = result.current.getEnabledPages()

      expect(enabledPages).toContain('home')
      expect(enabledPages).toContain('tasks')
      expect(enabledPages).toContain('documents')
      expect(enabledPages.length).toBeGreaterThan(0)
    })

    it('filters out disabled pages', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: true,
          tasks: true,
          payments: true,
          documents: true,
          discussions: false,  // Disabled
          table: true,
          timeline: false,     // Disabled
          contact: true,
        },
      }

      const { result } = renderHook(() => useFeature())

      const enabledPages = result.current.getEnabledPages()

      expect(enabledPages).not.toContain('discussions')
      expect(enabledPages).not.toContain('timeline')
      expect(enabledPages).toContain('home')
      expect(enabledPages).toContain('tasks')
    })

    it('respects navigation.enabled flag as well', async () => {
      const configModule = await import('../data/configurableData')

      // Disable a page in navigation config
      const homeNav = configModule.appConfig.navigation.find(n => n.id === 'home')
      if (homeNav) {
        homeNav.enabled = false
      }

      const { result } = renderHook(() => useFeature())

      const enabledPages = result.current.getEnabledPages()

      // Home should not appear even if feature flag is true
      expect(enabledPages).not.toContain('home')
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

      const { result } = renderHook(() => useFeature())

      expect(result.current.canPerformCrud('create')).toBe(false)
      expect(result.current.canPerformCrud('edit')).toBe(false)
      expect(result.current.canPerformCrud('delete')).toBe(false)
      expect(result.current.canPerformCrud('export')).toBe(true)
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

  describe('custom page configuration', () => {
    it('allows selective page enabling for different business domains', async () => {
      const configModule = await import('../data/configurableData')
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: true,
          tasks: true,
          payments: false,    // Not needed for this business
          documents: true,
          discussions: false, // Not needed for this business
          table: false,       // Demo page disabled
          timeline: true,
          contact: true,
        },
      }

      const { result } = renderHook(() => useFeature())

      expect(result.current.isPageEnabled('tasks')).toBe(true)
      expect(result.current.isPageEnabled('documents')).toBe(true)
      expect(result.current.isPageEnabled('payments')).toBe(false)
      expect(result.current.isPageEnabled('discussions')).toBe(false)
      expect(result.current.isPageEnabled('table')).toBe(false)
    })
  })
})
