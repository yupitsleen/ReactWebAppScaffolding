/**
 * Entity Factories
 *
 * **Purpose:**
 * Provides factory classes for generating test/sample data for all entity types.
 *
 * **Benefits:**
 * - Type-safe entity creation with sensible defaults
 * - Easy customization via overrides
 * - Consistent pattern across all entities
 * - Reduces boilerplate in tests and sample data
 *
 * **Usage:**
 * ```typescript
 * import { todoItemFactory, documentFactory } from './data/factories'
 *
 * // Create single entities
 * const todo = todoItemFactory.create()
 * const doc = documentFactory.createPDF({ name: 'Report.pdf' })
 *
 * // Create multiple entities
 * const todos = todoItemFactory.createMany(10)
 * const highPriorityTodos = todoItemFactory.createMany(5, { priority: 'high' })
 *
 * // Create variants (with automatic variation)
 * const variedTodos = [0, 1, 2].map(i => todoItemFactory.createVariant(i))
 * ```
 */

export { BaseEntityFactory, type FactoryEntity } from './BaseEntityFactory'
export { TodoItemFactory, todoItemFactory } from './TodoItemFactory'
export { DocumentFactory, documentFactory } from './DocumentFactory'
export { DiscussionFactory, discussionFactory } from './DiscussionFactory'
export { PaymentFactory, paymentFactory } from './PaymentFactory'

// Import factory instances for the factories object
import { todoItemFactory } from './TodoItemFactory'
import { documentFactory } from './DocumentFactory'
import { discussionFactory } from './DiscussionFactory'
import { paymentFactory } from './PaymentFactory'

/**
 * All factory instances for convenient access
 */
export const factories = {
  todoItem: todoItemFactory,
  document: documentFactory,
  discussion: discussionFactory,
  payment: paymentFactory
} as const

/**
 * Type for accessing factory instances
 */
export type Factories = typeof factories
