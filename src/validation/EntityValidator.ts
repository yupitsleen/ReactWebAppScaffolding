/**
 * EntityValidator - Schema-based validation system
 *
 * Provides a centralized, reusable validation framework for all entities.
 * Validation rules are defined once in configuration and can be reused
 * across all forms and components.
 *
 * @example
 * ```typescript
 * // Register validation schema
 * validator.registerSchema<TodoItem>('todoItem', {
 *   rules: [
 *     { field: 'title', required: true, min: 3, max: 100 },
 *     { field: 'dueDate', required: true, custom: (date) => {
 *       return new Date(date) < new Date() ? 'Due date cannot be in the past' : null
 *     }}
 *   ]
 * })
 *
 * // Use in component
 * const errors = validator.validate('todoItem', formData)
 * if (Object.keys(errors).length === 0) {
 *   // Form is valid
 * }
 * ```
 */

export interface ValidationRule<T = any> {
  field: keyof T
  required?: boolean
  pattern?: RegExp
  patternMessage?: string
  min?: number
  max?: number
  minMessage?: string
  maxMessage?: string
  custom?: (value: any, entity: Partial<T>) => string | null
}

export interface EntitySchema<T = any> {
  rules: ValidationRule<T>[]
}

export type ValidationErrors = Record<string, string>

class EntityValidator {
  private schemas = new Map<string, EntitySchema>()

  /**
   * Register a validation schema for an entity
   *
   * @param entityKey - Unique identifier for the entity (e.g., 'todoItem', 'order')
   * @param schema - Validation schema with rules
   *
   * @example
   * ```typescript
   * validator.registerSchema<TodoItem>('todoItem', {
   *   rules: [
   *     {
   *       field: 'title',
   *       required: true,
   *       min: 3,
   *       max: 100,
   *       minMessage: 'Title must be at least 3 characters',
   *       maxMessage: 'Title cannot exceed 100 characters'
   *     },
   *     {
   *       field: 'email',
   *       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
   *       patternMessage: 'Please enter a valid email address'
   *     }
   *   ]
   * })
   * ```
   */
  registerSchema<T>(entityKey: string, schema: EntitySchema<T>): void {
    this.schemas.set(entityKey, schema)
  }

  /**
   * Get registered schema for an entity
   *
   * @param entityKey - The entity key
   * @returns The validation schema or undefined if not found
   */
  getSchema<T>(entityKey: string): EntitySchema<T> | undefined {
    return this.schemas.get(entityKey)
  }

  /**
   * Validate an entire entity against its schema
   *
   * @param entityKey - The entity key
   * @param data - The entity data to validate
   * @returns Object with field names as keys and error messages as values
   *
   * @example
   * ```typescript
   * const errors = validator.validate('todoItem', {
   *   title: 'A',  // Too short
   *   email: 'invalid'  // Invalid format
   * })
   * // Returns: { title: 'Title must be at least 3 characters', email: 'Please enter a valid email' }
   * ```
   */
  validate<T>(entityKey: string, data: Partial<T>): ValidationErrors {
    const schema = this.schemas.get(entityKey)
    if (!schema) return {}

    const errors: ValidationErrors = {}

    for (const rule of schema.rules) {
      const fieldName = String(rule.field)
      const value = data[rule.field as keyof typeof data]

      // Required validation
      if (rule.required && (value === null || value === undefined || value === '')) {
        errors[fieldName] = `${this.formatFieldName(fieldName)} is required`
        continue
      }

      // Skip other validations if value is empty and not required
      if ((value === null || value === undefined || value === '') && !rule.required) {
        continue
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors[fieldName] = rule.patternMessage || `Invalid format for ${this.formatFieldName(fieldName)}`
        continue
      }

      // Min length/value validation
      if (rule.min !== undefined) {
        if (typeof value === 'string' && value.length < rule.min) {
          errors[fieldName] = rule.minMessage || `Must be at least ${rule.min} characters`
          continue
        }
        if (typeof value === 'number' && value < rule.min) {
          errors[fieldName] = rule.minMessage || `Must be at least ${rule.min}`
          continue
        }
      }

      // Max length/value validation
      if (rule.max !== undefined) {
        if (typeof value === 'string' && value.length > rule.max) {
          errors[fieldName] = rule.maxMessage || `Must be no more than ${rule.max} characters`
          continue
        }
        if (typeof value === 'number' && value > rule.max) {
          errors[fieldName] = rule.maxMessage || `Must be no more than ${rule.max}`
          continue
        }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value, data)
        if (customError) {
          errors[fieldName] = customError
          continue
        }
      }
    }

    return errors
  }

  /**
   * Validate a single field
   *
   * @param entityKey - The entity key
   * @param fieldName - The field to validate
   * @param value - The field value
   * @param entity - The full entity (for context in custom validators)
   * @returns Error message or null if valid
   *
   * @example
   * ```typescript
   * const error = validator.validateField('todoItem', 'title', 'A', formData)
   * // Returns: 'Title must be at least 3 characters'
   * ```
   */
  validateField<T>(
    entityKey: string,
    fieldName: keyof T,
    value: any,
    entity: Partial<T>
  ): string | null {
    const schema = this.schemas.get(entityKey)
    if (!schema) return null

    const rule = schema.rules.find(r => r.field === fieldName)
    if (!rule) return null

    const errors = this.validate(entityKey, { ...entity, [fieldName]: value } as Partial<T>)
    return errors[String(fieldName)] || null
  }

  /**
   * Check if an entity is valid
   *
   * @param entityKey - The entity key
   * @param data - The entity data
   * @returns True if valid, false if has errors
   */
  isValid<T>(entityKey: string, data: Partial<T>): boolean {
    const errors = this.validate(entityKey, data)
    return Object.keys(errors).length === 0
  }

  /**
   * Unregister a schema (useful for testing)
   *
   * @param entityKey - The entity key
   */
  unregister(entityKey: string): void {
    this.schemas.delete(entityKey)
  }

  /**
   * Clear all schemas (useful for testing)
   */
  clear(): void {
    this.schemas.clear()
  }

  /**
   * Get all registered entity keys
   *
   * @returns Array of entity keys
   */
  getRegisteredKeys(): string[] {
    return Array.from(this.schemas.keys())
  }

  /**
   * Format field name for error messages (camelCase → Title Case)
   * @private
   */
  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }
}

// Export singleton instance
export const validator = new EntityValidator()
