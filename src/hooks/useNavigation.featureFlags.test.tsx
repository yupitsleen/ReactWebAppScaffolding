import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useNavigation } from './useNavigation'
import type { AppConfig } from '../types/portal'

// Wrapper component for Router context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

// Store original appConfig
let originalAppConfig: AppConfig

describe('useNavigation with Feature Flags', () => {
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

  describe('getEnabledPages', () => {
    it('returns only pages that are both navigation.enabled=true and feature flag enabled', async () => {
      const configModule = await import('../data/configurableData')

      // Set up feature flags
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: true,
          tasks: true,
          payments: true,
          documents: true,
          discussions: false,  // Disabled via feature flag
          table: true,
          timeline: false,     // Disabled via feature flag
          contact: true,
        },
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      // Should include enabled pages
      expect(enabledPages.some(p => p.id === 'home')).toBe(true)
      expect(enabledPages.some(p => p.id === 'tasks')).toBe(true)
      expect(enabledPages.some(p => p.id === 'documents')).toBe(true)

      // Should NOT include disabled pages
      expect(enabledPages.some(p => p.id === 'discussions')).toBe(false)
      expect(enabledPages.some(p => p.id === 'timeline')).toBe(false)
    })

    it('respects navigation.enabled flag even when feature flag is true', async () => {
      const configModule = await import('../data/configurableData')

      // Disable a page in navigation config
      const homeNav = configModule.appConfig.navigation.find(n => n.id === 'home')
      if (homeNav) {
        homeNav.enabled = false
      }

      // Feature flag says true
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          ...configModule.appConfig.features!.pages,
          home: true,
        },
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      // Home should NOT appear (navigation.enabled = false takes precedence)
      expect(enabledPages.some(p => p.id === 'home')).toBe(false)
    })

    it('filters out pages when both navigation.enabled=false and feature flag=false', async () => {
      const configModule = await import('../data/configurableData')

      // Disable in both places
      const discussionsNav = configModule.appConfig.navigation.find(n => n.id === 'discussions')
      if (discussionsNav) {
        discussionsNav.enabled = false
      }

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          ...configModule.appConfig.features!.pages,
          discussions: false,
        },
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      expect(enabledPages.some(p => p.id === 'discussions')).toBe(false)
    })
  })

  describe('getAllPages', () => {
    it('returns all pages regardless of feature flags', async () => {
      const configModule = await import('../data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: false,
          tasks: false,
          payments: false,
          documents: false,
          discussions: false,
          table: false,
          timeline: false,
          contact: false,
        },
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const allPages = result.current.getAllPages()

      // getAllPages should return all pages, ignoring feature flags
      expect(allPages.length).toBe(configModule.appConfig.navigation.length)
      expect(allPages.some(p => p.id === 'home')).toBe(true)
      expect(allPages.some(p => p.id === 'discussions')).toBe(true)
    })
  })

  describe('getPageById', () => {
    it('returns page even if disabled by feature flag', async () => {
      const configModule = await import('../data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          ...configModule.appConfig.features!.pages,
          discussions: false,
        },
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const discussionsPage = result.current.getPageById('discussions')

      // Should still find the page
      expect(discussionsPage).not.toBeNull()
      expect(discussionsPage?.id).toBe('discussions')
    })
  })

  describe('real-world scenarios', () => {
    it('correctly filters pages when some are disabled', async () => {
      const configModule = await import('../data/configurableData')

      // Disable a couple of pages
      if (configModule.appConfig.features) {
        configModule.appConfig.features.pages = {
          ...configModule.appConfig.features.pages,
          discussions: false,
          timeline: false,
        }
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      // Disabled pages should not appear
      expect(enabledPages.some(p => p.id === 'discussions')).toBe(false)
      expect(enabledPages.some(p => p.id === 'timeline')).toBe(false)

      // Enabled pages should appear (if they're in navigation)
      const allPages = result.current.getAllPages()
      const homePage = allPages.find(p => p.id === 'home')
      if (homePage?.enabled) {
        expect(enabledPages.some(p => p.id === 'home')).toBe(true)
      }
    })

    it('supports selective page enabling for different business domains', async () => {
      const configModule = await import('../data/configurableData')

      // Enable documents, disable discussions
      if (configModule.appConfig.features) {
        configModule.appConfig.features.pages = {
          ...configModule.appConfig.features.pages,
          documents: true,
          discussions: false,
        }
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      // Verify specific pages are enabled/disabled as configured
      const documentsNav = configModule.appConfig.navigation.find(n => n.id === 'documents')
      if (documentsNav?.enabled) {
        expect(enabledPages.some(p => p.id === 'documents')).toBe(true)
      }
      expect(enabledPages.some(p => p.id === 'discussions')).toBe(false)
    })

    it('respects feature flags across multiple page toggles', async () => {
      const configModule = await import('../data/configurableData')

      // Test multiple page toggles
      if (configModule.appConfig.features) {
        configModule.appConfig.features.pages = {
          ...configModule.appConfig.features.pages,
          tasks: true,
          payments: false,
          timeline: false,
        }
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      expect(enabledPages.some(p => p.id === 'payments')).toBe(false)
      expect(enabledPages.some(p => p.id === 'timeline')).toBe(false)
    })
  })

  describe('navigation consistency', () => {
    it('ensures getEnabledPages matches actual enabled pages', async () => {
      const configModule = await import('../data/configurableData')

      if (configModule.appConfig.features) {
        configModule.appConfig.features.pages = {
          home: true,
          tasks: true,
          payments: false,
          documents: true,
          discussions: false,
          table: true,
          timeline: false,
          contact: true,
        }
      }

      const { result } = renderHook(() => useNavigation(), { wrapper })
      const enabledPages = result.current.getEnabledPages()

      // Every enabled page should pass both checks
      for (const page of enabledPages) {
        const navItem = configModule.appConfig.navigation.find(n => n.id === page.id)
        expect(navItem?.enabled).toBe(true)
        expect(configModule.appConfig.features?.pages[page.id]).toBe(true)
      }
    })
  })
})
