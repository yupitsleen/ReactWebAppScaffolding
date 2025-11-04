import { memo, type ReactNode } from 'react'
import { Typography, Chip } from '@mui/material'
import type { StatusConfig, LegacyStatusConfig } from '../types/portal'
import StatusChip from './StatusChip'

interface FieldRendererProps {
  field: string
  value: unknown
  entity?: Record<string, unknown>
  entityType?: string // Entity type for entity-scoped status lookup
  statusConfig?: StatusConfig | LegacyStatusConfig
  variant?: 'primary' | 'secondary' | 'chip'
  isCompleted?: boolean
  children?: ReactNode
}

const FieldRenderer = memo<FieldRendererProps>(({
  field,
  value,
  entityType,
  statusConfig,
  variant = 'secondary',
  isCompleted = false,
  children
}) => {
  const opacity = isCompleted ? 0.7 : 1

  const renderFieldValue = (): ReactNode => {
    switch (field) {
      case 'priority':
        if (statusConfig && typeof value === 'string') {
          return (
            <StatusChip
              entityType={entityType}
              fieldName="priority"
              type={entityType ? undefined : "priority"} // Legacy fallback
              value={value}
              statusConfig={statusConfig}
              size="small"
              showLabel={false}
              sx={{ opacity }}
            />
          )
        }
        break

      case 'status':
        if (statusConfig && typeof value === 'string') {
          return (
            <StatusChip
              entityType={entityType}
              fieldName="status"
              type={entityType ? undefined : "status"} // Legacy fallback
              value={value}
              statusConfig={statusConfig}
              size="small"
              showLabel={false}
              sx={{ opacity }}
            />
          )
        }
        break

      case 'dueDate':
      case 'createdAt':
      case 'paidDate':
        if (typeof value === 'string') {
          return (
            <Chip
              label={new Date(value).toLocaleDateString()}
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
              label={`$${value.toFixed(2)}`}
              size="small"
              variant="outlined"
              sx={{ opacity }}
            />
          )
        }
        break

      case 'shared':
        if (statusConfig && typeof value === 'boolean') {
          return (
            <StatusChip
              entityType={entityType}
              fieldName="shared"
              type={entityType ? undefined : "documentShared"} // Legacy fallback
              value={value}
              statusConfig={statusConfig}
              size="small"
              sx={{ opacity }}
            />
          )
        }
        break

      case 'resolved':
        if (statusConfig && typeof value === 'boolean') {
          return (
            <StatusChip
              entityType={entityType}
              fieldName="resolved"
              value={value}
              statusConfig={statusConfig}
              size="small"
              sx={{ opacity }}
            />
          )
        }
        break

      default:
        if (variant === 'chip') {
          return (
            <Chip
              label={String(value)}
              size="small"
              variant="outlined"
              sx={{ opacity }}
            />
          )
        }
        break
    }

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