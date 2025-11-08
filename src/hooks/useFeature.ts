import { useMemo } from 'react'
import { appConfig, DEFAULT_FEATURES } from '../data/configurableData'

/**
 * Core hook for feature flag checking
 *
 * Single Responsibility: Generic feature path resolution only
 * For domain-specific feature logic, use:
 * - usePageFeatures() for page-related flags
 * - useCrudFeatures() for CRUD operation flags
 *
 * @example
 * ```tsx
 * const { isEnabled, features } = useFeature()
 *
 * // Check any feature using dot notation
 * if (isEnabled('darkMode')) {
 *   // Render dark mode toggle
 * }
 *
 * if (isEnabled('pages.discussions')) {
 *   // Show discussions navigation
 * }
 *
 * if (isEnabled('crud.create')) {
 *   // Show create button
 * }
 * ```
 */
export function useFeature() {
  const features = useMemo(() => {
    return appConfig.features || DEFAULT_FEATURES
  }, [appConfig.features])

  /**
   * Check if a feature is enabled using dot notation
   *
   * @param featurePath - Dot-separated path to feature (e.g., 'darkMode', 'pages.discussions', 'crud.create')
   * @returns true if feature is enabled, false otherwise
   */
  const isEnabled = (featurePath: string): boolean => {
    const keys = featurePath.split('.')
    let value: unknown = features
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key]
      if (value === undefined || value === null) {
        return false
      }
    }
    return value === true
  }

  return {
    features,
    isEnabled,
  }
}
