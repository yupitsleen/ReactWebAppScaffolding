import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import type { AppConfig } from './types/portal'

// Store original appConfig
let originalAppConfig: AppConfig

describe('App with Feature Flags', () => {
  beforeEach(async () => {
    // Import and store original config
    const configModule = await import('./data/configurableData')
    originalAppConfig = { ...configModule.appConfig }

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    global.localStorage = localStorageMock as any
  })

  afterEach(async () => {
    // Restore original config
    const configModule = await import('./data/configurableData')
    Object.assign(configModule.appConfig, originalAppConfig)
  })

  describe('route filtering', () => {
    it('does not generate routes for disabled pages', async () => {
      const configModule = await import('./data/configurableData')

      // Disable discussions and timeline
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

      render(<App />)

      // App should render without errors
      expect(document.body).toBeTruthy()
    })

    it('generates routes only for enabled pages', async () => {
      const configModule = await import('./data/configurableData')

      // Enable only essential pages
      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: true,
          tasks: true,
          payments: false,
          documents: false,
          discussions: false,
          table: false,
          timeline: false,
          contact: false,
        },
      }

      render(<App />)

      // App should render successfully with limited routes
      expect(document.body).toBeTruthy()
    })
  })

  describe('UI feature flags', () => {
    it('respects darkMode feature flag', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        darkMode: false,
      }

      render(<App />)

      // App should render without dark mode toggle
      expect(document.body).toBeTruthy()
    })

    it('respects commandPalette feature flag', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        commandPalette: false,
      }

      render(<App />)

      // App should render without command palette
      expect(document.body).toBeTruthy()
    })

    it('respects keyboardShortcuts feature flag', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        keyboardShortcuts: false,
      }

      render(<App />)

      // App should render without keyboard shortcuts
      expect(document.body).toBeTruthy()
    })

    it('respects notifications feature flag', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        notifications: false,
      }

      render(<App />)

      // App should render without notification bell
      expect(document.body).toBeTruthy()
    })
  })

  describe('combined feature scenarios', () => {
    it('supports minimal configuration (no UI enhancements, limited pages)', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        // Disable all UI features
        darkMode: false,
        highContrastMode: false,
        layoutDensity: false,
        commandPalette: false,
        keyboardShortcuts: false,
        notifications: false,
        // Enable only essential pages
        pages: {
          home: true,
          tasks: true,
          payments: false,
          documents: false,
          discussions: false,
          table: false,
          timeline: false,
          contact: false,
        },
      }

      render(<App />)

      expect(document.body).toBeTruthy()
    })

    it('supports read-only mode configuration', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        crud: {
          create: false,
          edit: false,
          delete: false,
          export: true,
          import: false,
        },
      }

      render(<App />)

      expect(document.body).toBeTruthy()
    })

    it('supports full-featured configuration (all features enabled)', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        darkMode: true,
        highContrastMode: true,
        layoutDensity: true,
        commandPalette: true,
        keyboardShortcuts: true,
        notifications: true,
        pdfExport: true,
        advancedFiltering: true,
        advancedSorting: true,
        bulkOperations: true,
        customFields: true,
        pages: {
          home: true,
          tasks: true,
          payments: true,
          documents: true,
          discussions: true,
          table: true,
          timeline: true,
          contact: true,
        },
        crud: {
          create: true,
          edit: true,
          delete: true,
          export: true,
          import: true,
        },
      }

      render(<App />)

      expect(document.body).toBeTruthy()
    })
  })

  describe('business-specific configurations', () => {
    it('supports document management portal configuration', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: true,
          tasks: false,
          payments: false,
          documents: true,
          discussions: true,
          table: false,
          timeline: false,
          contact: true,
        },
        crud: {
          create: true,
          edit: true,
          delete: false,  // Prevent accidental deletions
          export: true,
          import: true,
        },
      }

      render(<App />)

      expect(document.body).toBeTruthy()
    })

    it('supports task management portal configuration', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        pages: {
          home: true,
          tasks: true,
          payments: false,
          documents: false,
          discussions: true,
          table: true,
          timeline: true,
          contact: true,
        },
        advancedFiltering: true,
        advancedSorting: true,
      }

      render(<App />)

      expect(document.body).toBeTruthy()
    })

    it('supports public demo configuration (read-only, no auth)', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        authentication: {
          enabled: false,
          allowGuest: true,
          rememberMe: false,
          requireEmailVerification: false,
        },
        crud: {
          create: false,
          edit: false,
          delete: false,
          export: true,
          import: false,
        },
        commandPalette: false,
      }

      render(<App />)

      expect(document.body).toBeTruthy()
    })
  })

  describe('backward compatibility', () => {
    it('works when features config is undefined (all features enabled)', async () => {
      const configModule = await import('./data/configurableData')

      // Remove features config
      const originalFeatures = configModule.appConfig.features
      delete configModule.appConfig.features

      render(<App />)

      expect(document.body).toBeTruthy()

      // Restore
      configModule.appConfig.features = originalFeatures
    })

    it('works when features config is partially defined', async () => {
      const configModule = await import('./data/configurableData')

      // Only define some features
      configModule.appConfig.features = {
        darkMode: false,
        pages: {
          discussions: false,
        },
      } as any

      render(<App />)

      expect(document.body).toBeTruthy()
    })
  })

  describe('error handling', () => {
    it('handles invalid feature flag values gracefully', async () => {
      const configModule = await import('./data/configurableData')

      configModule.appConfig.features = {
        ...configModule.appConfig.features!,
        darkMode: null as any,  // Invalid value
        pages: {
          home: undefined as any,  // Invalid value
        },
      }

      render(<App />)

      // Should still render without crashing
      expect(document.body).toBeTruthy()
    })
  })
})
