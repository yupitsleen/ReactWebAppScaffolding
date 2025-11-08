import { BaseEntityFactory } from './BaseEntityFactory'
import type { TodoItem } from '../../types/portal'

/**
 * Factory for creating TodoItem test data.
 *
 * **Usage Examples:**
 *
 * ```typescript
 * // Create single todo with defaults
 * const todo = todoItemFactory.create()
 *
 * // Create high-priority todo due tomorrow
 * const urgentTodo = todoItemFactory.create({
 *   priority: 'high',
 *   dueDate: new Date(Date.now() + 86400000).toISOString()
 * })
 *
 * // Create 10 todos for testing
 * const todos = todoItemFactory.createMany(10)
 *
 * // Create 5 completed todos
 * const completed = todoItemFactory.createMany(5, { status: 'completed' })
 *
 * // Create varied todos (different priorities)
 * const varied = [0, 1, 2].map(i => todoItemFactory.createVariant(i))
 * ```
 */
export class TodoItemFactory extends BaseEntityFactory<TodoItem> {
  private priorities: TodoItem['priority'][] = ['low', 'medium', 'high']
  private statuses: TodoItem['status'][] = ['pending', 'in-progress', 'completed']
  private categories = ['Development', 'Design', 'Testing', 'Documentation', 'Meeting']
  private titles = [
    'Review pull request',
    'Update documentation',
    'Fix bug in production',
    'Implement new feature',
    'Conduct user interview',
    'Write unit tests',
    'Deploy to staging',
    'Refactor legacy code',
    'Design new component',
    'Analyze performance metrics'
  ]

  create(overrides?: Partial<TodoItem>): TodoItem {
    return {
      id: overrides?.id || this.generateId(),
      title: overrides?.title || this.getRandomTitle(),
      description: overrides?.description || 'Sample todo item for testing and development',
      assignedTo: overrides?.assignedTo || 'user@example.com',
      priority: overrides?.priority || 'medium',
      status: overrides?.status || 'pending',
      dueDate: overrides?.dueDate || this.dateFuture(7), // Dynamic: 7 days from today
      category: overrides?.category || this.getRandomCategory(),
      createdBy: overrides?.createdBy || 'System',
      createdAt: overrides?.createdAt || this.now(), // Dynamic: current timestamp
      ...overrides
    }
  }

  protected getPrefix(): string {
    return 'todo'
  }

  /**
   * Creates a todo variant with index-based variation.
   * Cycles through priorities, statuses, and other fields.
   */
  createVariant(index: number, overrides?: Partial<TodoItem>): TodoItem {
    const priority = this.priorities[index % this.priorities.length]
    const status = this.statuses[index % this.statuses.length]
    const category = this.categories[index % this.categories.length]
    const title = this.titles[index % this.titles.length]

    return this.create({
      priority,
      status,
      category,
      title,
      ...overrides
    })
  }

  /**
   * Creates a todo that's overdue (due date in the past)
   */
  createOverdue(overrides?: Partial<TodoItem>): TodoItem {
    return this.create({
      dueDate: this.dateAgo(7), // Dynamic: 7 days ago
      priority: 'high',
      status: 'pending',
      ...overrides
    })
  }

  /**
   * Creates a completed todo
   */
  createCompleted(overrides?: Partial<TodoItem>): TodoItem {
    return this.create({
      status: 'completed',
      ...overrides
    })
  }

  /**
   * Creates a high-priority todo
   */
  createHighPriority(overrides?: Partial<TodoItem>): TodoItem {
    return this.create({
      priority: 'high',
      ...overrides
    })
  }

  private getRandomTitle(): string {
    return this.titles[Math.floor(Math.random() * this.titles.length)]
  }

  private getRandomCategory(): string {
    return this.categories[Math.floor(Math.random() * this.categories.length)]
  }
}

/**
 * Singleton instance for convenient usage throughout the app
 */
export const todoItemFactory = new TodoItemFactory()
