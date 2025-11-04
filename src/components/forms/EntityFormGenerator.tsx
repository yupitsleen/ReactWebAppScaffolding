import { memo, useState, useCallback, useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { FormField } from './FormField'
import type { EntityFormSchema } from '../../types/portal'
import { useEntityValidation } from '../../hooks/useEntityValidation'

interface EntityFormGeneratorProps<T> {
  entityKey: string
  schema: EntityFormSchema<T>
  initialData?: Partial<T>
  onChange?: (data: Partial<T>) => void
  onValidate?: (isValid: boolean) => void
}

/**
 * EntityFormGenerator Component
 *
 * Schema-driven form generator that integrates with EntityValidator.
 * Renders forms based on configuration without writing custom form code.
 *
 * Features:
 * - Automatic field rendering based on type
 * - Real-time validation
 * - Grid layout support
 * - Error display integration
 *
 * @example
 * ```tsx
 * <EntityFormGenerator
 *   entityKey="todoItem"
 *   schema={todoItemSchema}
 *   initialData={editData}
 *   onChange={setFormData}
 *   onValidate={setIsValid}
 * />
 * ```
 */
function EntityFormGeneratorInner<T extends Record<string, any>>({
  entityKey,
  schema,
  initialData = {},
  onChange,
  onValidate
}: EntityFormGeneratorProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const { errors, validateField, validate } = useEntityValidation(entityKey)

  // Initialize form data with default values from schema
  useEffect(() => {
    const defaultData: Partial<T> = {}

    schema.fields.forEach(field => {
      if (field.defaultValue !== undefined && formData[field.name] === undefined) {
        defaultData[field.name] = field.defaultValue
      }
    })

    if (Object.keys(defaultData).length > 0) {
      const mergedData = { ...defaultData, ...formData }
      setFormData(mergedData)
      onChange?.(mergedData)
    }
  }, []) // Only run on mount

  // Validate form on data changes
  useEffect(() => {
    const isValid = validate(formData as Partial<T>)
    onValidate?.(isValid)
  }, [formData, validate, onValidate])

  // Notify parent of data changes
  useEffect(() => {
    onChange?.(formData)
  }, [formData, onChange])

  const handleFieldChange = useCallback((fieldName: keyof T, value: any) => {
    const updatedData = { ...formData, [fieldName]: value }
    setFormData(updatedData)

    // Validate field if it has been touched
    if (touchedFields.has(String(fieldName))) {
      validateField(fieldName, value, updatedData)
    }
  }, [formData, touchedFields, validateField])

  const handleFieldBlur = useCallback((fieldName: keyof T) => {
    setTouchedFields(prev => new Set(prev).add(String(fieldName)))

    // Validate on blur
    const value = formData[fieldName]
    validateField(fieldName, value, formData)
  }, [formData, validateField])

  return (
    <Box component="form" noValidate>
      <Grid container spacing={2}>
        {schema.fields.map((field) => (
          <FormField
            key={String(field.name)}
            schema={field}
            value={formData[field.name]}
            error={touchedFields.has(String(field.name)) ? errors[String(field.name)] : undefined}
            onChange={(value) => handleFieldChange(field.name, value)}
            onBlur={() => handleFieldBlur(field.name)}
          />
        ))}
      </Grid>
    </Box>
  )
}

export const EntityFormGenerator = memo(EntityFormGeneratorInner) as typeof EntityFormGeneratorInner
