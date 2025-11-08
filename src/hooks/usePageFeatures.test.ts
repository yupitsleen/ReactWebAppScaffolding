import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePageFeatures } from './usePageFeatures'
import type { AppConfig } from '../types/portal'

// Store original appConfig
let originalAppConfig: AppConfig

describe('usePageFeatures', () => {
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

  describe('isPageEnabled', () => {
    it('returns true for enabled pages', () => {
      const { result } = renderHook(() => usePageFeatures())

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

      const { result } = renderHook(() => usePageFeatures())

      expect(result.current.isPageEnabled('discussions')).toBe(false)
      expect(result.current.isPageEnabled('timeline')).toBe(false)
    })

    it('returns false for non-existent pages', () => {
      const { result } = renderHook(() => usePageFeatures())

      expect(result.current.isPageEnabled('nonExistentPage')).toBe(false)
    })
  })

  describe('getEnabledPages', () => {
    it('returns all enabled pages from navigation', () => {
      const { result } = renderHook(() => usePageFeatures())

      const enabledPages = result.current.getEnabledPages

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

      const { result } = renderHook(() => usePageFeatures())

      const enabledPages = result.current.getEnabledPages

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

      const { result } = renderHook(() => usePageFeatures())

      const enabledPages = result.current.getEnabledPages

      // Home should not appear even if feature flag is true
      expect(enabledPages).not.toContain('home')
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

      const { result } = renderHook(() => usePageFeatures())

      expect(result.current.isPageEnabled('tasks')).toBe(true)
      expect(result.current.isPageEnabled('documents')).toBe(true)
      expect(result.current.isPageEnabled('payments')).toBe(false)
      expect(result.current.isPageEnabled('discussions')).toBe(false)
      expect(result.current.isPageEnabled('table')).toBe(false)
    })
  })
})
