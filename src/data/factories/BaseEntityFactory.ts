/**
 * Base factory class for generating entity test data.
 *
 * **Purpose:**
 * - Provides a consistent pattern for creating sample/test entities
 * - Reduces boilerplate in test files and sample data
 * - Ensures type-safe entity creation with sensible defaults
 * - Supports easy customization via overrides
 *
 * **Pattern:**
 * Each entity type gets its own factory (TodoItemFactory, DocumentFactory, etc.)
 * that extends this base class and implements the abstract methods.
 *
 * @example
 * ```typescript
 * // Create a single entity with defaults
 * const todo = todoFactory.create()
 *
 * // Create with custom overrides
 * const urgentTodo = todoFactory.create({
 *   priority: 'high',
 *   dueDate: '2024-12-31'
 * })
 *
 * // Create multiple entities
 * const todos = todoFactory.createMany(10)
 *
 * // Create multiple with shared overrides
 * const highPriorityTodos = todoFactory.createMany(5, { priority: 'high' })
 * ```
 */
export abstract class BaseEntityFactory<T extends { id: string }> {
  private counter = 0

  /**
   * Creates a single entity with optional field overrides.
   * Subclasses must implement this to provide entity-specific defaults.
   *
   * @param overrides - Partial entity to override default values
   * @returns A complete entity with defaults + overrides
   */
  abstract create(overrides?: Partial<T>): T

  /**
   * Returns the entity prefix used for auto-generated IDs.
   * Used to generate unique IDs like: "todo-1234567890-0", "todo-1234567890-1", etc.
   *
   * @example
   * ```typescript
   * protected getPrefix(): string {
   *   return 'todo'
   * }
   * ```
   */
  protected abstract getPrefix(): string

  /**
   * Creates multiple entities with optional shared overrides.
   * Each entity gets a unique auto-generated ID.
   *
   * @param count - Number of entities to create
   * @param overrides - Partial entity to apply to all created entities
   * @returns Array of entities
   *
   * @example
   * ```typescript
   * // Create 10 todos with default values
   * const todos = todoFactory.createMany(10)
   *
   * // Create 5 high-priority todos
   * const urgentTodos = todoFactory.createMany(5, { priority: 'high' })
   * ```
   */
  createMany(count: number, overrides?: Partial<T>): T[] {
    return Array.from({ length: count }, (_, i) => {
      const id = this.generateId(i)
      return this.create({ ...overrides, id } as Partial<T>)
    })
  }

  /**
   * Generates a unique ID for an entity.
   * Format: {prefix}-{timestamp}-{index}
   *
   * @param index - Index in the batch (for uniqueness within the same timestamp)
   * @returns Unique entity ID
   *
   * @example
   * "todo-1234567890-0", "todo-1234567890-1", "document-1234567891-0"
   */
  protected generateId(index?: number): string {
    const idx = index !== undefined ? index : this.counter++
    return `${this.getPrefix()}-${Date.now()}-${idx}`
  }

  /**
   * Resets the internal counter. Useful for testing to ensure predictable IDs.
   *
   * @example
   * ```typescript
   * beforeEach(() => {
   *   todoFactory.resetCounter()
   * })
   * ```
   */
  resetCounter(): void {
    this.counter = 0
  }

  /**
   * Creates an entity with sequential variation.
   * Useful for creating diverse test data sets.
   *
   * @param index - Index to vary the data
   * @param overrides - Additional overrides
   * @returns Entity with index-based variation
   *
   * @example
   * ```typescript
   * // Create 3 todos with varied priorities
   * const todos = [0, 1, 2].map(i => todoFactory.createVariant(i))
   * // Result: priorities will be ['low', 'medium', 'high']
   * ```
   */
  createVariant(index: number, overrides?: Partial<T>): T {
    // Default implementation just creates with index-based ID
    // Subclasses can override to add more variation
    const id = this.generateId(index)
    return this.create({ ...overrides, id } as Partial<T>)
  }
}

/**
 * Utility type for extracting the entity type from a factory
 */
export type FactoryEntity<F extends BaseEntityFactory<any>> =
  F extends BaseEntityFactory<infer T> ? T : never
