import { appConfig } from '../data/configurableData'

/**
 * Utility to check if a feature is enabled for conditional test execution
 *
 * @example
 * ```typescript
 * import { isFeatureEnabled } from '../test-utils/featureTestUtils'
 *
 * describe.skipIf(!isFeatureEnabled('darkMode'))('Dark Mode', () => {
 *   it('toggles dark mode', () => {
 *     // Only runs if darkMode feature is enabled
 *   })
 * })
 * ```
 */
export function isFeatureEnabled(featurePath: string): boolean {
  if (!appConfig.features) {
    return true // Default to enabled if no feature config
  }

  const parts = featurePath.split('.')
  let current: any = appConfig.features

  for (const part of parts) {
    if (current === undefined || current === null) {
      return false
    }
    current = current[part]
  }

  return current === true
}

/**
 * Check if a specific page is enabled
 */
export function isPageEnabled(pageId: string): boolean {
  return isFeatureEnabled(`pages.${pageId}`)
}

/**
 * Check if a CRUD operation is enabled
 */
export function isCrudEnabled(operation: 'create' | 'edit' | 'delete' | 'export' | 'import'): boolean {
  return isFeatureEnabled(`crud.${operation}`)
}

/**
 * Get list of enabled features (useful for debugging which tests will run)
 */
export function getEnabledFeatures(): string[] {
  const features: string[] = []

  if (!appConfig.features) {
    return ['all features (no config)']
  }

  const checkFeatures = (obj: any, prefix = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'boolean') {
        if (value) {
          features.push(path)
        }
      } else if (typeof value === 'object' && value !== null) {
        checkFeatures(value, path)
      }
    }
  }

  checkFeatures(appConfig.features)
  return features
}

/**
 * Helper to run tests only when feature is enabled
 * More readable than describe.skipIf
 *
 * @example
 * ```typescript
 * describeIfEnabled('darkMode', 'Dark Mode Tests', () => {
 *   it('works', () => { ... })
 * })
 * ```
 */
export function describeIfEnabled(featurePath: string, name: string, fn: () => void) {
  const enabled = isFeatureEnabled(featurePath)
  if (enabled) {
    describe(name, fn)
  } else {
    describe.skip(`${name} (feature disabled: ${featurePath})`, fn)
  }
}

/**
 * Helper to run individual test only when feature is enabled
 */
export function itIfEnabled(featurePath: string, name: string, fn: () => void | Promise<void>) {
  const enabled = isFeatureEnabled(featurePath)
  if (enabled) {
    it(name, fn)
  } else {
    it.skip(`${name} (feature disabled: ${featurePath})`, fn)
  }
}
