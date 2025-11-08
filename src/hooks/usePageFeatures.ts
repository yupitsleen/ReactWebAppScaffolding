import { useMemo } from 'react'
import { appConfig } from '../data/configurableData'
import { useFeature } from './useFeature'

/**
 * Hook for page-specific feature flag operations
 *
 * @example
 * ```tsx
 * const { isPageEnabled, getEnabledPages } = usePageFeatures()
 *
 * if (isPageEnabled('discussions')) {
 *   // Show discussions page
 * }
 *
 * const pages = getEnabledPages() // ['home', 'tasks', 'discussions']
 * ```
 */
export function usePageFeatures() {
  const { isEnabled } = useFeature()

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
   * Get all enabled pages from the navigation
   * Respects both navigation.enabled AND features.pages settings
   */
  const getEnabledPages = useMemo((): string[] => {
    return appConfig.navigation
      .filter(nav => nav.enabled && isPageEnabled(nav.id))
      .map(nav => nav.id)
  }, [appConfig.navigation, isPageEnabled])

  return {
    isPageEnabled,
    getEnabledPages,
  }
}
