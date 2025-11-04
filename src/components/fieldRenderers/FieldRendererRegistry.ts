/**
 * FieldRendererRegistry - Plugin system for field rendering
 *
 * Allows users to register custom renderers for specific fields or field patterns
 * without modifying the core FieldRenderer component.
 *
 * Priority system:
 * 1. Entity-specific renderer (e.g., "order.priority")
 * 2. Exact field name match (e.g., "priority")
 * 3. Pattern matches (sorted by priority)
 * 4. Default fallback
 *
 * @example
 * ```typescript
 * // Register exact field renderer
 * fieldRenderers.register('priority', ({ value }) => (
 *   <Chip label={value} color={value === 'high' ? 'error' : 'default'} />
 * ))
 *
 * // Register pattern-based renderer
 * fieldRenderers.registerPattern(/.*Status$/, ({ value }) => (
 *   <StatusChip value={value} />
 * ), 10)
 *
 * // Register entity-specific override
 * fieldRenderers.register('order.priority', ({ value }) => (
 *   <Chip label={`🔥 ${value}`} />
 * ))
 * ```
 */

import type { ReactNode } from 'react'

export interface FieldRendererProps {
  fieldName: string
  value: any
  entityType?: string
  entity?: Record<string, unknown>
}

export type FieldRenderFn = (props: FieldRendererProps) => ReactNode

interface FieldPattern {
  pattern: RegExp
  renderer: FieldRenderFn
  priority: number
}

class FieldRendererRegistry {
  private exactRenderers = new Map<string, FieldRenderFn>()
  private patterns: FieldPattern[] = []

  /**
   * Register exact field name match
   *
   * @param fieldName - Exact field name or "entityType.fieldName" for entity-specific
   * @param renderer - Render function
   *
   * @example
   * ```typescript
   * // Global field renderer
   * fieldRenderers.register('priority', ({ value }) => <Chip label={value} />)
   *
   * // Entity-specific renderer (takes precedence)
   * fieldRenderers.register('order.priority', ({ value }) => <Chip label={`Order: ${value}`} />)
   * ```
   */
  register(fieldName: string, renderer: FieldRenderFn): void {
    this.exactRenderers.set(fieldName, renderer)
  }

  /**
   * Register pattern-based match (e.g., all fields ending in "Status")
   *
   * @param pattern - Regular expression to match field names
   * @param renderer - Render function
   * @param priority - Higher priority = checked first (default: 0)
   *
   * @example
   * ```typescript
   * // Match all fields ending in "Status"
   * fieldRenderers.registerPattern(/.*Status$/, ({ value }) => <StatusChip value={value} />, 10)
   *
   * // Match all fields ending in "Date"
   * fieldRenderers.registerPattern(/.*Date$/, ({ value }) => <DateChip value={value} />, 10)
   *
   * // Match boolean fields starting with "is"
   * fieldRenderers.registerPattern(/^is[A-Z]/, ({ value }) => <BooleanChip value={value} />, 5)
   * ```
   */
  registerPattern(pattern: RegExp, renderer: FieldRenderFn, priority = 0): void {
    this.patterns.push({ pattern, renderer, priority })
    // Sort by priority (higher first)
    this.patterns.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Get renderer for a field
   *
   * Priority: entity-specific > exact > pattern > undefined
   *
   * @param fieldName - The field name
   * @param entityType - Optional entity type for entity-specific renderers
   * @returns Render function or undefined if no match
   */
  get(fieldName: string, entityType?: string): FieldRenderFn | undefined {
    // 1. Check entity-specific renderer: "order.orderStatus"
    if (entityType) {
      const entitySpecific = this.exactRenderers.get(`${entityType}.${fieldName}`)
      if (entitySpecific) return entitySpecific
    }

    // 2. Check exact field name match
    const exactRenderer = this.exactRenderers.get(fieldName)
    if (exactRenderer) return exactRenderer

    // 3. Check pattern matches (sorted by priority)
    for (const { pattern, renderer } of this.patterns) {
      if (pattern.test(fieldName)) return renderer
    }

    return undefined
  }

  /**
   * Unregister a renderer (useful for testing)
   *
   * @param fieldName - The field name to unregister
   */
  unregister(fieldName: string): void {
    this.exactRenderers.delete(fieldName)
  }

  /**
   * Clear all registered renderers (useful for testing)
   */
  clear(): void {
    this.exactRenderers.clear()
    this.patterns = []
  }

  /**
   * Get all registered exact field names
   *
   * @returns Array of field names
   */
  getRegisteredFields(): string[] {
    return Array.from(this.exactRenderers.keys())
  }

  /**
   * Get all registered patterns
   *
   * @returns Array of pattern objects
   */
  getRegisteredPatterns(): Array<{ pattern: RegExp; priority: number }> {
    return this.patterns.map(p => ({ pattern: p.pattern, priority: p.priority }))
  }
}

// Export singleton instance
export const fieldRenderers = new FieldRendererRegistry()
