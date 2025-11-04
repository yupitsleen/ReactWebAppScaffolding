import { describe, it, expect, beforeEach } from 'vitest'
import { validator, type EntitySchema } from './EntityValidator'

interface TestEntity {
  id: string
  name: string
  email: string
  age: number
  description?: string
  agreedToTerms: boolean
}

describe('EntityValidator', () => {
  beforeEach(() => {
    // Clear all schemas before each test
    validator.clear()
  })

  describe('registerSchema', () => {
    it('registers a schema successfully', () => {
      const schema: EntitySchema<TestEntity> = {
        rules: [
          { field: 'name', required: true }
        ]
      }

      validator.registerSchema('test', schema)
      const retrieved = validator.getSchema('test')

      expect(retrieved).toEqual(schema)
    })

    it('overwrites existing schema with same key', () => {
      const schema1: EntitySchema<TestEntity> = {
        rules: [{ field: 'name', required: true }]
      }

      const schema2: EntitySchema<TestEntity> = {
        rules: [{ field: 'email', required: true }]
      }

      validator.registerSchema('test', schema1)
      validator.registerSchema('test', schema2)

      const retrieved = validator.getSchema('test')
      expect(retrieved).toEqual(schema2)
    })
  })

  describe('getSchema', () => {
    it('returns registered schema', () => {
      const schema: EntitySchema<TestEntity> = {
        rules: [{ field: 'name', required: true }]
      }

      validator.registerSchema('test', schema)
      const retrieved = validator.getSchema('test')

      expect(retrieved).toBeDefined()
    })

    it('returns undefined for unregistered schema', () => {
      const retrieved = validator.getSchema('nonexistent')
      expect(retrieved).toBeUndefined()
    })
  })

  describe('validate - required fields', () => {
    beforeEach(() => {
      validator.registerSchema<TestEntity>('test', {
        rules: [
          { field: 'name', required: true },
          { field: 'email', required: true }
        ]
      })
    })

    it('validates required fields successfully when present', () => {
      const data: Partial<TestEntity> = {
        name: 'John Doe',
        email: 'john@example.com'
      }

      const errors = validator.validate('test', data)
      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns error for missing required field', () => {
      const data: Partial<TestEntity> = {
        email: 'john@example.com'
      }

      const errors = validator.validate('test', data)
      expect(errors.name).toBeDefined()
      expect(errors.name).toContain('required')
    })

    it('returns errors for multiple missing required fields', () => {
      const data: Partial<TestEntity> = {}

      const errors = validator.validate('test', data)
      expect(errors.name).toBeDefined()
      expect(errors.email).toBeDefined()
    })

    it('allows optional fields to be empty', () => {
      validator.registerSchema<TestEntity>('optional', {
        rules: [
          { field: 'name', required: true },
          { field: 'description', required: false }
        ]
      })

      const data: Partial<TestEntity> = {
        name: 'John Doe'
      }

      const errors = validator.validate('optional', data)
      expect(Object.keys(errors)).toHaveLength(0)
    })
  })

  describe('validate - pattern matching', () => {
    beforeEach(() => {
      validator.registerSchema<TestEntity>('test', {
        rules: [
          {
            field: 'email',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            patternMessage: 'Invalid email format'
          }
        ]
      })
    })

    it('validates pattern successfully when matches', () => {
      const data: Partial<TestEntity> = {
        email: 'valid@example.com'
      }

      const errors = validator.validate('test', data)
      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns error when pattern does not match', () => {
      const data: Partial<TestEntity> = {
        email: 'invalid-email'
      }

      const errors = validator.validate('test', data)
      expect(errors.email).toBe('Invalid email format')
    })

    it('uses default error message when patternMessage not provided', () => {
      validator.registerSchema<TestEntity>('defaultMsg', {
        rules: [
          {
            field: 'email',
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          }
        ]
      })

      const data: Partial<TestEntity> = {
        email: 'invalid'
      }

      const errors = validator.validate('defaultMsg', data)
      expect(errors.email).toContain('Invalid format')
    })
  })

  describe('validate - min/max constraints', () => {
    describe('string length', () => {
      beforeEach(() => {
        validator.registerSchema<TestEntity>('test', {
          rules: [
            {
              field: 'name',
              min: 3,
              max: 10,
              minMessage: 'Name too short',
              maxMessage: 'Name too long'
            }
          ]
        })
      })

      it('validates string within min/max bounds', () => {
        const data: Partial<TestEntity> = {
          name: 'John'
        }

        const errors = validator.validate('test', data)
        expect(Object.keys(errors)).toHaveLength(0)
      })

      it('returns error when string below minimum length', () => {
        const data: Partial<TestEntity> = {
          name: 'Jo'
        }

        const errors = validator.validate('test', data)
        expect(errors.name).toBe('Name too short')
      })

      it('returns error when string exceeds maximum length', () => {
        const data: Partial<TestEntity> = {
          name: 'VeryLongName'
        }

        const errors = validator.validate('test', data)
        expect(errors.name).toBe('Name too long')
      })

      it('uses default error messages when not provided', () => {
        validator.registerSchema<TestEntity>('defaultMsg', {
          rules: [
            { field: 'name', min: 3, max: 10 }
          ]
        })

        const data: Partial<TestEntity> = { name: 'Jo' }
        const errors = validator.validate('defaultMsg', data)
        expect(errors.name).toContain('at least 3')
      })
    })

    describe('number constraints', () => {
      beforeEach(() => {
        validator.registerSchema<TestEntity>('test', {
          rules: [
            {
              field: 'age',
              min: 18,
              max: 120,
              minMessage: 'Must be at least 18',
              maxMessage: 'Must be at most 120'
            }
          ]
        })
      })

      it('validates number within min/max bounds', () => {
        const data: Partial<TestEntity> = {
          age: 25
        }

        const errors = validator.validate('test', data)
        expect(Object.keys(errors)).toHaveLength(0)
      })

      it('returns error when number below minimum', () => {
        const data: Partial<TestEntity> = {
          age: 16
        }

        const errors = validator.validate('test', data)
        expect(errors.age).toBe('Must be at least 18')
      })

      it('returns error when number exceeds maximum', () => {
        const data: Partial<TestEntity> = {
          age: 150
        }

        const errors = validator.validate('test', data)
        expect(errors.age).toBe('Must be at most 120')
      })
    })
  })

  describe('validate - custom validation', () => {
    it('validates with custom function', () => {
      validator.registerSchema<TestEntity>('test', {
        rules: [
          {
            field: 'age',
            custom: (value) => {
              if (typeof value !== 'number') return 'Age must be a number'
              if (value < 0) return 'Age cannot be negative'
              if (value > 150) return 'Age is unrealistic'
              return null
            }
          }
        ]
      })

      const validData: Partial<TestEntity> = { age: 25 }
      const errors = validator.validate('test', validData)
      expect(Object.keys(errors)).toHaveLength(0)

      const invalidData: Partial<TestEntity> = { age: -5 }
      const invalidErrors = validator.validate('test', invalidData)
      expect(invalidErrors.age).toBe('Age cannot be negative')
    })

    it('custom validation receives entire entity for cross-field validation', () => {
      validator.registerSchema<TestEntity>('test', {
        rules: [
          {
            field: 'email',
            custom: (value, entity) => {
              if (entity.name === 'Admin' && !value.endsWith('@admin.com')) {
                return 'Admin users must use @admin.com email'
              }
              return null
            }
          }
        ]
      })

      const data: Partial<TestEntity> = {
        name: 'Admin',
        email: 'admin@example.com'
      }

      const errors = validator.validate('test', data)
      expect(errors.email).toBe('Admin users must use @admin.com email')
    })

    it('custom validation stops on first error', () => {
      validator.registerSchema<TestEntity>('test', {
        rules: [
          {
            field: 'age',
            required: true,
            custom: () => 'Custom error'
          }
        ]
      })

      const data: Partial<TestEntity> = {}

      const errors = validator.validate('test', data)
      // Should only have required error, custom not run
      expect(errors.age).toContain('required')
      expect(errors.age).not.toContain('Custom error')
    })
  })

  describe('validateField', () => {
    beforeEach(() => {
      validator.registerSchema<TestEntity>('test', {
        rules: [
          { field: 'name', required: true, min: 3 },
          { field: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
        ]
      })
    })

    it('validates single field successfully', () => {
      const entity: Partial<TestEntity> = { name: 'John Doe' }
      const error = validator.validateField('test', 'name', 'John Doe', entity)

      expect(error).toBeNull()
    })

    it('returns error for invalid single field', () => {
      const entity: Partial<TestEntity> = { name: 'Jo' }
      const error = validator.validateField('test', 'name', 'Jo', entity)

      expect(error).not.toBeNull()
      expect(error).toContain('at least 3')
    })

    it('validates field within context of entity', () => {
      const entity: Partial<TestEntity> = {
        name: 'John',
        email: 'john@example.com'
      }

      const error = validator.validateField('test', 'email', 'john@example.com', entity)
      expect(error).toBeNull()
    })

    it('returns null for unknown field', () => {
      const entity: Partial<TestEntity> = {}
      const error = validator.validateField('test', 'unknown' as keyof TestEntity, 'value', entity)

      expect(error).toBeNull()
    })

    it('returns null for unknown entity schema', () => {
      const entity: Partial<TestEntity> = {}
      const error = validator.validateField('nonexistent', 'name', 'value', entity)

      expect(error).toBeNull()
    })
  })

  describe('complex validation scenarios', () => {
    it('combines multiple validation rules', () => {
      validator.registerSchema<TestEntity>('complex', {
        rules: [
          {
            field: 'email',
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            patternMessage: 'Invalid email',
            custom: (value) => {
              if (value.includes('+')) return 'Plus signs not allowed'
              return null
            }
          }
        ]
      })

      // Valid email
      const valid: Partial<TestEntity> = { email: 'valid@example.com' }
      expect(Object.keys(validator.validate('complex', valid))).toHaveLength(0)

      // Missing (required check)
      const missing: Partial<TestEntity> = {}
      const missingErrors = validator.validate('complex', missing)
      expect(missingErrors.email).toContain('required')

      // Invalid pattern
      const invalidPattern: Partial<TestEntity> = { email: 'invalid-email' }
      const patternErrors = validator.validate('complex', invalidPattern)
      expect(patternErrors.email).toBe('Invalid email')

      // Custom validation fails
      const customFail: Partial<TestEntity> = { email: 'test+tag@example.com' }
      const customErrors = validator.validate('complex', customFail)
      expect(customErrors.email).toBe('Plus signs not allowed')
    })

    it('validates multiple fields independently', () => {
      validator.registerSchema<TestEntity>('multi', {
        rules: [
          { field: 'name', required: true, min: 3 },
          { field: 'email', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
          { field: 'age', required: true, min: 18, max: 120 }
        ]
      })

      const data: Partial<TestEntity> = {
        name: 'Jo',           // Too short
        email: 'invalid',     // Invalid pattern
        age: 15               // Below minimum
      }

      const errors = validator.validate('multi', data)
      expect(errors.name).toBeDefined()
      expect(errors.email).toBeDefined()
      expect(errors.age).toBeDefined()
      expect(Object.keys(errors)).toHaveLength(3)
    })

    it('handles empty/null/undefined values correctly', () => {
      validator.registerSchema<TestEntity>('nullable', {
        rules: [
          { field: 'description', min: 10 }  // Not required, but has min length
        ]
      })

      // Undefined - should pass (not required)
      const undefined: Partial<TestEntity> = {}
      expect(Object.keys(validator.validate('nullable', undefined))).toHaveLength(0)

      // Null - should pass (not required)
      const nullValue: Partial<TestEntity> = { description: null as any }
      expect(Object.keys(validator.validate('nullable', nullValue))).toHaveLength(0)

      // Empty string - should pass (not required)
      const empty: Partial<TestEntity> = { description: '' }
      expect(Object.keys(validator.validate('nullable', empty))).toHaveLength(0)

      // Too short - should fail
      const tooShort: Partial<TestEntity> = { description: 'Short' }
      const errors = validator.validate('nullable', tooShort)
      expect(errors.description).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('returns empty object when schema not found', () => {
      const errors = validator.validate('nonexistent', { name: 'Test' })
      expect(errors).toEqual({})
    })

    it('returns empty object when no rules defined', () => {
      validator.registerSchema('empty', { rules: [] })
      const errors = validator.validate('empty', { name: 'Test' })
      expect(errors).toEqual({})
    })

    it('handles validation without rules gracefully', () => {
      validator.registerSchema<TestEntity>('test', {
        rules: [{ field: 'name', required: true }]
      })

      const data: Partial<TestEntity> = {
        name: 'Valid',
        email: 'extra@field.com'  // Field without rules
      }

      const errors = validator.validate('test', data)
      expect(Object.keys(errors)).toHaveLength(0)
    })
  })
})
