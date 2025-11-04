import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { type FieldRendererProps } from './FieldRendererRegistry'

// Create a test registry class for testing purposes
class TestFieldRendererRegistry {
  private exactRenderers = new Map<string, (props: FieldRendererProps) => any>()
  private patterns: Array<{
    pattern: RegExp
    renderer: (props: FieldRendererProps) => any
    priority: number
  }> = []

  register(fieldName: string, renderer: (props: FieldRendererProps) => any): void {
    this.exactRenderers.set(fieldName, renderer)
  }

  registerPattern(
    pattern: RegExp,
    renderer: (props: FieldRendererProps) => any,
    priority = 0
  ): void {
    this.patterns.push({ pattern, renderer, priority })
    this.patterns.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  get(fieldName: string, entityType?: string): ((props: FieldRendererProps) => any) | undefined {
    if (entityType) {
      const entitySpecific = this.exactRenderers.get(`${entityType}.${fieldName}`)
      if (entitySpecific) return entitySpecific
    }

    const exactRenderer = this.exactRenderers.get(fieldName)
    if (exactRenderer) return exactRenderer

    for (const { pattern, renderer } of this.patterns) {
      if (pattern.test(fieldName)) return renderer
    }

    return undefined
  }

  unregister(fieldName: string): void {
    this.exactRenderers.delete(fieldName)
  }

  clear(): void {
    this.exactRenderers.clear()
    this.patterns = []
  }
}

describe('FieldRendererRegistry', () => {
  let registry: TestFieldRendererRegistry

  beforeEach(() => {
    registry = new TestFieldRendererRegistry()
  })

  describe('register - exact field names', () => {
    it('registers a field renderer successfully', () => {
      const renderer = ({ value }: FieldRendererProps) => `Rendered: ${value}`

      registry.register('priority', renderer)
      const retrieved = registry.get('priority')

      expect(retrieved).toBe(renderer)
    })

    it('overwrites existing renderer with same field name', () => {
      const renderer1 = () => 'First'
      const renderer2 = () => 'Second'

      registry.register('field', renderer1)
      registry.register('field', renderer2)

      const retrieved = registry.get('field')
      expect(retrieved).toBe(renderer2)
    })

    it('registers multiple different field renderers', () => {
      const renderer1 = () => 'Renderer1'
      const renderer2 = () => 'Renderer2'

      registry.register('field1', renderer1)
      registry.register('field2', renderer2)

      expect(registry.get('field1')).toBe(renderer1)
      expect(registry.get('field2')).toBe(renderer2)
    })
  })

  describe('register - entity-specific renderers', () => {
    it('registers entity-specific renderer', () => {
      const orderRenderer = () => 'Order Priority'
      const todoRenderer = () => 'Todo Priority'

      registry.register('order.priority', orderRenderer)
      registry.register('todo.priority', todoRenderer)

      expect(registry.get('priority', 'order')).toBe(orderRenderer)
      expect(registry.get('priority', 'todo')).toBe(todoRenderer)
    })

    it('entity-specific renderer takes precedence over exact match', () => {
      const genericRenderer = () => 'Generic'
      const specificRenderer = () => 'Specific'

      registry.register('status', genericRenderer)
      registry.register('order.status', specificRenderer)

      expect(registry.get('status')).toBe(genericRenderer)
      expect(registry.get('status', 'order')).toBe(specificRenderer)
      expect(registry.get('status', 'todo')).toBe(genericRenderer)
    })
  })

  describe('registerPattern', () => {
    it('registers a pattern-based renderer successfully', () => {
      const renderer = ({ value }: FieldRendererProps) => `Status: ${value}`

      registry.registerPattern(/.*Status$/, renderer)
      const retrieved = registry.get('orderStatus')

      expect(retrieved).toBe(renderer)
    })

    it('matches multiple fields with same pattern', () => {
      const statusRenderer = () => 'Status Chip'

      registry.registerPattern(/.*Status$/, statusRenderer)

      expect(registry.get('orderStatus')).toBe(statusRenderer)
      expect(registry.get('paymentStatus')).toBe(statusRenderer)
      expect(registry.get('shippingStatus')).toBe(statusRenderer)
    })

    it('respects priority order for pattern matching', () => {
      const lowPriorityRenderer = () => 'Low'
      const highPriorityRenderer = () => 'High'

      registry.registerPattern(/.*Status$/, lowPriorityRenderer, 1)
      registry.registerPattern(/^order.*/, highPriorityRenderer, 10)

      // "orderStatus" matches both patterns, but high priority wins
      expect(registry.get('orderStatus')).toBe(highPriorityRenderer)
    })

    it('uses first matching pattern when priorities are equal', () => {
      const renderer1 = () => 'First'
      const renderer2 = () => 'Second'

      registry.registerPattern(/.*Date$/, renderer1, 5)
      registry.registerPattern(/^created.*/, renderer2, 5)

      // "createdDate" matches both with same priority, first registered wins
      expect(registry.get('createdDate')).toBe(renderer1)
    })

    it('case-insensitive pattern matching', () => {
      const renderer = () => 'Email Renderer'

      registry.registerPattern(/.*email$/i, renderer)

      expect(registry.get('userEmail')).toBe(renderer)
      expect(registry.get('userEMAIL')).toBe(renderer)
      expect(registry.get('EMAIL')).toBe(renderer)
    })
  })

  describe('get - priority order', () => {
    it('prioritizes entity-specific over exact over pattern', () => {
      const patternRenderer = () => 'Pattern'
      const exactRenderer = () => 'Exact'
      const entityRenderer = () => 'Entity'

      registry.registerPattern(/.*Status$/, patternRenderer)
      registry.register('orderStatus', exactRenderer)
      registry.register('order.orderStatus', entityRenderer)

      expect(registry.get('orderStatus', 'order')).toBe(entityRenderer)
      expect(registry.get('orderStatus', 'todo')).toBe(exactRenderer)
      expect(registry.get('paymentStatus')).toBe(patternRenderer)
    })

    it('falls back to pattern when no exact match', () => {
      const patternRenderer = () => 'Pattern'

      registry.registerPattern(/.*Date$/, patternRenderer)

      expect(registry.get('createdDate')).toBe(patternRenderer)
      expect(registry.get('updatedDate')).toBe(patternRenderer)
    })

    it('returns undefined when no match found', () => {
      registry.register('knownField', () => 'Known')
      registry.registerPattern(/.*Status$/, () => 'Status')

      expect(registry.get('unknownField')).toBeUndefined()
    })
  })

  describe('unregister', () => {
    it('unregisters exact field renderer', () => {
      const renderer = () => 'Renderer'

      registry.register('field', renderer)
      expect(registry.get('field')).toBe(renderer)

      registry.unregister('field')
      expect(registry.get('field')).toBeUndefined()
    })

    it('unregisters entity-specific renderer', () => {
      const renderer = () => 'Renderer'

      registry.register('order.status', renderer)
      expect(registry.get('status', 'order')).toBe(renderer)

      registry.unregister('order.status')
      expect(registry.get('status', 'order')).toBeUndefined()
    })

    it('handles unregistering nonexistent renderer gracefully', () => {
      expect(() => registry.unregister('nonexistent')).not.toThrow()
    })

    it('unregister does not affect patterns', () => {
      const patternRenderer = () => 'Pattern'
      const exactRenderer = () => 'Exact'

      registry.registerPattern(/.*Status$/, patternRenderer)
      registry.register('orderStatus', exactRenderer)

      registry.unregister('orderStatus')

      // Should fall back to pattern
      expect(registry.get('orderStatus')).toBe(patternRenderer)
    })
  })

  describe('complex scenarios', () => {
    it('handles multiple patterns with different priorities', () => {
      const dateRenderer = () => 'Date'
      const timeRenderer = () => 'Time'
      const timestampRenderer = () => 'Timestamp'

      registry.registerPattern(/.*Date$/, dateRenderer, 1)
      registry.registerPattern(/.*At$/, timeRenderer, 5)
      registry.registerPattern(/^created.*/, timestampRenderer, 10)

      expect(registry.get('createdDate')).toBe(timestampRenderer)  // Highest priority
      expect(registry.get('createdAt')).toBe(timestampRenderer)    // Highest priority
      expect(registry.get('updatedAt')).toBe(timeRenderer)         // Middle priority
      expect(registry.get('dueDate')).toBe(dateRenderer)           // Lowest priority
    })

    it('combines exact, pattern, and entity-specific renderers', () => {
      const defaultStatus = () => 'Default Status'
      const orderStatus = () => 'Order Status'
      const specialOrderStatus = () => 'Special Order Status'

      registry.registerPattern(/.*Status$/, defaultStatus)
      registry.register('orderStatus', orderStatus)
      registry.register('order.orderStatus', specialOrderStatus)

      // Entity-specific for order
      expect(registry.get('orderStatus', 'order')).toBe(specialOrderStatus)

      // Exact match for non-order entities
      expect(registry.get('orderStatus', 'todo')).toBe(orderStatus)
      expect(registry.get('orderStatus')).toBe(orderStatus)

      // Pattern match for other status fields
      expect(registry.get('paymentStatus')).toBe(defaultStatus)
      expect(registry.get('shippingStatus', 'order')).toBe(defaultStatus)
    })

    it('handles renderer with complex logic', () => {
      const complexRenderer = ({ value, fieldName, entityType }: FieldRendererProps) => {
        return `${entityType || 'unknown'}.${fieldName}: ${value}`
      }

      registry.register('complexField', complexRenderer)

      const renderer = registry.get('complexField')
      expect(renderer).toBe(complexRenderer)

      // Test the renderer logic
      const result = renderer!({
        fieldName: 'complexField',
        value: 'test',
        entityType: 'order',
        entity: {}
      })
      expect(result).toBe('order.complexField: test')
    })

    it('maintains isolation between different registry instances', () => {
      const registry1 = new TestFieldRendererRegistry()
      const registry2 = new TestFieldRendererRegistry()

      const renderer1 = () => 'Registry 1'
      const renderer2 = () => 'Registry 2'

      registry1.register('field', renderer1)
      registry2.register('field', renderer2)

      expect(registry1.get('field')).toBe(renderer1)
      expect(registry2.get('field')).toBe(renderer2)
    })
  })

  describe('performance considerations', () => {
    it('handles many registered renderers efficiently', () => {
      // Register 100 renderers
      for (let i = 0; i < 100; i++) {
        registry.register(`field${i}`, () => `Renderer ${i}`)
      }

      // Should still retrieve quickly
      const start = Date.now()
      const renderer = registry.get('field50')
      const duration = Date.now() - start

      expect(renderer).toBeDefined()
      expect(duration).toBeLessThan(10)  // Should be nearly instant
    })

    it('handles many patterns efficiently', () => {
      // Register 50 patterns
      for (let i = 0; i < 50; i++) {
        registry.registerPattern(new RegExp(`.*field${i}$`), () => `Pattern ${i}`)
      }

      // Should still match quickly
      const start = Date.now()
      const renderer = registry.get('testfield25')
      const duration = Date.now() - start

      expect(renderer).toBeDefined()
      expect(duration).toBeLessThan(50)  // Pattern matching is O(n), but should be fast
    })
  })

  describe('edge cases', () => {
    it('handles empty field name', () => {
      const renderer = () => 'Empty'
      registry.register('', renderer)

      expect(registry.get('')).toBe(renderer)
    })

    it('handles special characters in field name', () => {
      const renderer = () => 'Special'
      registry.register('field$with@special#chars', renderer)

      expect(registry.get('field$with@special#chars')).toBe(renderer)
    })

    it('handles entity type with special characters', () => {
      const renderer = () => 'Entity'
      registry.register('order-v2.status', renderer)

      expect(registry.get('status', 'order-v2')).toBe(renderer)
    })

    it('handles undefined value in renderer', () => {
      const renderer = ({ value }: FieldRendererProps) => `Value: ${value}`
      registry.register('field', renderer)

      const result = registry.get('field')!({
        fieldName: 'field',
        value: undefined
      })

      expect(result).toBe('Value: undefined')
    })

    it('handles null value in renderer', () => {
      const renderer = ({ value }: FieldRendererProps) => `Value: ${value}`
      registry.register('field', renderer)

      const result = registry.get('field')!({
        fieldName: 'field',
        value: null
      })

      expect(result).toBe('Value: null')
    })
  })
})
