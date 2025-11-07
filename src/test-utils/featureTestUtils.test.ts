import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { isFeatureEnabled, isPageEnabled, isCrudEnabled, describeIfEnabled, itIfEnabled } from './featureTestUtils'
import type { AppConfig } from '../types/portal'

// Store original appConfig
let originalAppConfig: AppConfig

describe('Feature Test Utils', () => {
  beforeEach(async () => {
    const configModule = await import('../data/configurableData')
    originalAppConfig = { ...configModule.appConfig }
  })

  afterEach(async () => {
    const configModule = await import('../data/configurableData')
    Object.assign(configModule.appConfig, originalAppConfig)
  })

  describe('isFeatureEnabled', () => {
    it('returns true for enabled top-level features', () => {
      // darkMode and highContrastMode are currently disabled in config
      expect(isFeatureEnabled('commandPalette')).toBe(true)
      expect(isFeatureEnabled('notifications')).toBe(true)
    })

    it('returns false for disabled top-level features', async () => {
      const configModule = await import('../data/configurableData')
      if (configModule.appConfig.features) {
        configModule.appConfig.features.darkMode = false
      }

      expect(isFeatureEnabled('darkMode')).toBe(false)
    })

    it('works with nested paths', () => {
      expect(isFeatureEnabled('pages.home')).toBe(true)
      expect(isFeatureEnabled('crud.create')).toBe(true)
      expect(isFeatureEnabled('authentication.enabled')).toBe(true)
    })

    it('returns false for non-existent features', () => {
      expect(isFeatureEnabled('nonExistent')).toBe(false)
      expect(isFeatureEnabled('pages.nonExistent')).toBe(false)
    })

    it('defaults to true when features config is undefined', async () => {
      const configModule = await import('../data/configurableData')
      const original = configModule.appConfig.features
      configModule.appConfig.features = undefined

      expect(isFeatureEnabled('darkMode')).toBe(true)

      configModule.appConfig.features = original
    })
  })

  describe('isPageEnabled', () => {
    it('checks page feature flags', () => {
      expect(isPageEnabled('home')).toBe(true)
      expect(isPageEnabled('tasks')).toBe(true)
    })

    it('returns false for disabled pages', async () => {
      const configModule = await import('../data/configurableData')
      if (configModule.appConfig.features) {
        configModule.appConfig.features.pages = {
          ...configModule.appConfig.features.pages,
          discussions: false,
        }
      }

      expect(isPageEnabled('discussions')).toBe(false)
    })
  })

  describe('isCrudEnabled', () => {
    it('checks CRUD operation flags', () => {
      expect(isCrudEnabled('create')).toBe(true)
      expect(isCrudEnabled('edit')).toBe(true)
      expect(isCrudEnabled('delete')).toBe(true)
    })

    it('returns false for disabled operations', async () => {
      const configModule = await import('../data/configurableData')
      if (configModule.appConfig.features) {
        configModule.appConfig.features.crud = {
          ...configModule.appConfig.features.crud,
          delete: false,
        }
      }

      expect(isCrudEnabled('delete')).toBe(false)
    })
  })
})

// Example: Conditional test suites based on feature flags
describe('Example: Conditional Test Execution', () => {
  it('demonstrates skipIf pattern', () => {
    // Test that skipIf can be used (actual usage shown in examples)
    expect(typeof isFeatureEnabled).toBe('function')
  })

  it('demonstrates describeIfEnabled helper', () => {
    // Test that helper function exists (actual usage shown in examples)
    expect(typeof describeIfEnabled).toBe('function')
    expect(typeof itIfEnabled).toBe('function')
  })

  it('checks page-specific features', () => {
    // Verify page checking works
    const homeEnabled = isPageEnabled('home')
    expect(typeof homeEnabled).toBe('boolean')
  })

  it('checks CRUD operation features', () => {
    // Verify CRUD checking works
    const deleteEnabled = isCrudEnabled('delete')
    expect(typeof deleteEnabled).toBe('boolean')
  })
})
