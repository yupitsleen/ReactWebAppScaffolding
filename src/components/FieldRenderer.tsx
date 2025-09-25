import { memo, type ReactNode } from 'react'
import { Typography, Chip } from '@mui/material'
import type { StatusConfig } from '../types/portal'

interface FieldRendererProps {
  field: string
  value: unknown
  entity: Record<string, unknown>
  statusConfig?: StatusConfig
  variant?: 'primary' | 'secondary' | 'chip'
  isCompleted?: boolean
  children?: ReactNode
}

const FieldRenderer = memo<FieldRendererProps>(({
  field,
  value,
  entity,
  statusConfig,
  variant = 'secondary',
  isCompleted = false,
  children
}) => {
  const opacity = isCompleted ? 0.7 : 1

  // Handle different field types
  const renderFieldValue = (): ReactNode => {
    switch (field) {
      case 'priority':
        if (statusConfig?.priority && typeof value === 'string') {
          const priorityStatus = statusConfig.priority[value]
          if (priorityStatus) {
            return (
              <Chip
                label={`Priority: ${priorityStatus.label}`}
                size="small"
                color={priorityStatus.color}
                sx={{ opacity }}
              />
            )
          }
        }
        break

      case 'status':
        if (statusConfig?.status && typeof value === 'string') {
          const taskStatus = statusConfig.status[value]
          if (taskStatus) {
            return (
              <Chip
                label={`Status: ${taskStatus.label}`}
                size="small"
                color={taskStatus.color}
                sx={{ opacity }}
              />
            )
          }
        }
        break

      case 'dueDate':
      case 'createdAt':
      case 'paidDate':
        if (typeof value === 'string') {
          const label = field === 'dueDate' ? 'Due' :
                       field === 'createdAt' ? 'Created' :
                       field === 'paidDate' ? 'Paid' : 'Date'
          return (
            <Chip
              label={`${label}: ${new Date(value).toLocaleDateString()}`}
              size="small"
              variant="outlined"
              sx={{ opacity }}
            />
          )
        }
        break

      case 'amount':
        if (typeof value === 'number') {
          return (
            <Chip
              label={`Amount: $${value.toFixed(2)}`}
              size="small"
              variant="outlined"
              sx={{ opacity }}
            />
          )
        }
        break

      case 'shared':
        if (typeof value === 'boolean') {
          return (
            <Chip
              label={value ? 'Shared' : 'Private'}
              size="small"
              color={value ? 'success' : 'default'}
              variant="outlined"
              sx={{ opacity }}
            />
          )
        }
        break

      default:
        // Generic field display
        if (variant === 'chip') {
          return (
            <Chip
              label={`${field}: ${String(value)}`}
              size="small"
              variant="outlined"
              sx={{ opacity }}
            />
          )
        }
        break
    }

    // Fallback for non-chip variants
    if (variant === 'primary') {
      return (
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? 'text.disabled' : 'text.primary'
          }}
        >
          {String(value)}
        </Typography>
      )
    }

    if (variant === 'secondary') {
      return (
        <Typography
          variant="body2"
          color={isCompleted ? 'text.disabled' : 'text.secondary'}
          paragraph
          sx={{
            textDecoration: isCompleted ? 'line-through' : 'none'
          }}
        >
          {String(value)}
        </Typography>
      )
    }

    return <span>{String(value)}</span>
  }

  const renderedValue = renderFieldValue()

  return (
    <>
      {renderedValue}
      {children}
    </>
  )
})

FieldRenderer.displayName = 'FieldRenderer'

export default FieldRenderer