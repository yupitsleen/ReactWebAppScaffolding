import { memo, useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  Box
} from '@mui/material'
import { EntityFormGenerator } from './forms/EntityFormGenerator'
import { useGenericData } from '../context/GenericDataContext'
import { appConfig } from '../data/configurableData'

interface EntityEditDialogProps<T extends { id: string }> {
  entityKey: string
  entity: T | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * EntityEditDialog Component
 *
 * Generic, reusable dialog for editing existing entities.
 * Works with any entity type through configuration.
 *
 * Features:
 * - Pre-populated form with entity data
 * - Schema-driven form rendering
 * - Automatic validation
 * - Error handling
 * - Success callbacks
 *
 * @example
 * ```tsx
 * <EntityEditDialog
 *   entityKey="todoItem"
 *   entity={selectedTodo}
 *   open={editDialogOpen}
 *   onClose={() => setEditDialogOpen(false)}
 *   onSuccess={() => showSuccessMessage()}
 * />
 * ```
 */
function EntityEditDialogInner<T extends { id: string }>({
  entityKey,
  entity,
  open,
  onClose,
  onSuccess
}: EntityEditDialogProps<T>) {
  const { updateEntity } = useGenericData()
  const [formData, setFormData] = useState<Partial<T>>({})
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get form schema from config
  const schema = appConfig.formSchemas?.[entityKey]

  // Initialize form with entity data
  useEffect(() => {
    if (entity && open) {
      setFormData(entity)
      setError(null)
    }
  }, [entity, open])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setFormData({})
      setError(null)
      onClose()
    }
  }, [isSubmitting, onClose])

  const handleSubmit = useCallback(async () => {
    if (!isValid || isSubmitting || !entity) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Extract id and submit the rest
      const { id, ...dataToUpdate } = formData

      await updateEntity(entityKey, entity.id, dataToUpdate)

      // Success
      setFormData({})
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update entity')
    } finally {
      setIsSubmitting(false)
    }
  }, [entityKey, entity, formData, isValid, isSubmitting, updateEntity, onSuccess, onClose])

  if (!schema) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Alert severity="error">
            No form schema configured for entity: {entityKey}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: (e: React.FormEvent) => {
          e.preventDefault()
          handleSubmit()
        }
      }}
    >
      <DialogTitle>
        {schema.title ? `Edit ${schema.title}` : `Edit ${entityKey}`}
      </DialogTitle>

      <DialogContent>
        {schema.description && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {schema.description}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <EntityFormGenerator
          entityKey={entityKey}
          schema={schema}
          initialData={formData}
          onChange={setFormData}
          onValidate={setIsValid}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {schema.cancelLabel || 'Cancel'}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (schema.submitLabel || 'Save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const EntityEditDialog = memo(EntityEditDialogInner) as typeof EntityEditDialogInner
