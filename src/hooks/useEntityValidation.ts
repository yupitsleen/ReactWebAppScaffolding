/**
 * useEntityValidation - Hook for entity validation
 *
 * Provides a simple interface for validating entities in forms.
 * Manages validation errors state and provides helpers for
 * real-time and submit-time validation.
 *
 * @example
 * ```typescript
 * const { errors, validate, validateField, clearErrors, hasErrors } = useEntityValidation<TodoItem>('todoItem')
 *
 * const handleSubmit = () => {
 *   if (!validate(formData)) {
 *     return // Errors are already set
 *   }
 *   // Submit the form
 * }
 *
 * const handleFieldBlur = (field: keyof TodoItem, value: any) => {
 *   validateField(field, value, formData)
 * }
 * ```
 */

import { useState, useCallback } from 'react'
import { validator, type ValidationErrors } from '../validation/EntityValidator'

export interface UseEntityValidationResult {
  errors: ValidationErrors
  validate: <T>(data: Partial<T>) => boolean
  validateField: <T>(fieldName: keyof T, value: any, entity: Partial<T>) => void
  clearErrors: () => void
  clearFieldError: <T>(fieldName: keyof T) => void
  hasErrors: boolean
  getFieldError: <T>(fieldName: keyof T) => string | undefined
}

/**
 * Hook for entity validation
 *
 * @param entityKey - The entity key (must have a registered schema)
 * @returns Validation utilities
 *
 * @example
 * ```typescript
 * function CreateTodoDialog() {
 *   const [formData, setFormData] = useState<Partial<TodoItem>>({})
 *   const { errors, validate, validateField } = useEntityValidation<TodoItem>('todoItem')
 *
 *   const handleFieldChange = (field: keyof TodoItem, value: any) => {
 *     const updated = { ...formData, [field]: value }
 *     setFormData(updated)
 *     // Real-time validation on change
 *     validateField(field, value, updated)
 *   }
 *
 *   const handleSubmit = async () => {
 *     if (!validate(formData)) {
 *       return // Errors are displayed
 *     }
 *     await createEntity('todoItem', formData)
 *   }
 *
 *   return (
 *     <TextField
 *       label="Title"
 *       value={formData.title || ''}
 *       onChange={(e) => handleFieldChange('title', e.target.value)}
 *       error={!!errors.title}
 *       helperText={errors.title}
 *     />
 *   )
 * }
 * ```
 */
export function useEntityValidation(entityKey: string): UseEntityValidationResult {
  const [errors, setErrors] = useState<ValidationErrors>({})

  /**
   * Validate entire entity
   * @returns True if valid, false if has errors
   */
  const validate = useCallback(<T,>(data: Partial<T>): boolean => {
    const validationErrors = validator.validate<T>(entityKey, data)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [entityKey])

  /**
   * Validate a single field
   */
  const validateField = useCallback(<T,>(
    fieldName: keyof T,
    value: any,
    entity: Partial<T>
  ): void => {
    const error = validator.validateField<T>(entityKey, fieldName, value, entity)
    setErrors(prev => {
      const next = { ...prev }
      if (error) {
        next[String(fieldName)] = error
      } else {
        delete next[String(fieldName)]
      }
      return next
    })
  }, [entityKey])

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback(<T,>(fieldName: keyof T) => {
    setErrors(prev => {
      const next = { ...prev }
      delete next[String(fieldName)]
      return next
    })
  }, [])

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback(<T,>(fieldName: keyof T): string | undefined => {
    return errors[String(fieldName)]
  }, [errors])

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
    getFieldError
  }
}
