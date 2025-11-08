import { useFeature } from './useFeature'
import type { FeatureFlags } from '../types/portal'

/**
 * Hook for CRUD-specific feature flag operations
 *
 * @example
 * ```tsx
 * const { canPerformCrud } = useCrudFeatures()
 *
 * if (canPerformCrud('create')) {
 *   // Show create button
 * }
 *
 * if (canPerformCrud('delete')) {
 *   // Show delete action
 * }
 * ```
 */
export function useCrudFeatures() {
  const { isEnabled } = useFeature()

  /**
   * Check if a specific CRUD operation is enabled
   *
   * @param operation - CRUD operation ('create', 'edit', 'delete', 'export', 'import')
   * @returns true if operation is enabled, false otherwise
   */
  const canPerformCrud = (operation: keyof FeatureFlags['crud']): boolean => {
    return isEnabled(`crud.${operation}`)
  }

  return {
    canPerformCrud,
  }
}
