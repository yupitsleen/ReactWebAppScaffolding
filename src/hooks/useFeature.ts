import { useMemo } from 'react'
import { appConfig, DEFAULT_FEATURES } from '../data/configurableData'
import type { FeatureFlags } from '../types/portal'

/**
 * Hook to check if a feature is enabled in the application
 *
 * @example
 * ```tsx
 * const { isEnabled, features } = useFeature()
 *
 * // Check specific features
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
  }, [])

  /**
   * Check if a feature is enabled using dot notation
   *
   * @param featurePath - Dot-separated path to feature (e.g., 'darkMode', 'pages.discussions', 'crud.create')
   * @returns true if feature is enabled, false otherwise
   */
  const isEnabled = (featurePath: string): boolean => {
    const parts = featurePath.split('.')
    let current: any = features

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
   *
   * @param pageId - Page identifier (e.g., 'discussions', 'tasks')
   * @returns true if page is enabled, false otherwise
   */
  const isPageEnabled = (pageId: string): boolean => {
    return isEnabled(`pages.${pageId}`)
  }

  /**
   * Check if a specific CRUD operation is enabled
   *
   * @param operation - CRUD operation ('create', 'edit', 'delete', 'export', 'import')
   * @returns true if operation is enabled, false otherwise
   */
  const canPerformCrud = (operation: keyof FeatureFlags['crud']): boolean => {
    return isEnabled(`crud.${operation}`)
  }

  /**
   * Get all enabled pages from the navigation
   * Respects both navigation.enabled AND features.pages settings
   */
  const getEnabledPages = (): string[] => {
    return appConfig.navigation
      .filter(nav => nav.enabled && isPageEnabled(nav.id))
      .map(nav => nav.id)
  }

  return {
    features,
    isEnabled,
    isPageEnabled,
    canPerformCrud,
    getEnabledPages,
  }
}
