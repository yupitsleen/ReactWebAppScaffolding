import { memo } from 'react'
import { Chip, Tooltip } from '@mui/material'
import type { StatusConfig, LegacyStatusConfig } from '../types/portal'
import { getStatusConfig } from '../utils/statusHelpers'

interface StatusChipProps {
  // New entity-scoped props
  entityType?: string
  fieldName?: string
  value: string | boolean
  statusConfig: StatusConfig | LegacyStatusConfig

  // Legacy props for backward compatibility
  type?: 'priority' | 'status' | 'paymentStatus' | 'documentShared'

  // Display props
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
  showLabel?: boolean
  sx?: Record<string, unknown>
}

const StatusChip = memo<StatusChipProps>(({
  entityType,
  fieldName,
  type,
  value,
  statusConfig,
  size = 'small',
  variant,
  showLabel = false,
  sx = {}
}) => {
  const mappingKey = String(value)

  // Determine entity type and field name (support both new and legacy APIs)
  let resolvedEntityType = entityType
  let resolvedFieldName = fieldName

  // Legacy API support: map old 'type' prop to entity/field
  if (type && !entityType && !fieldName) {
    switch (type) {
      case 'priority':
        resolvedEntityType = 'todoItem' // Default to todoItem for priority
        resolvedFieldName = 'priority'
        break
      case 'status':
        resolvedEntityType = 'todoItem' // Default to todoItem for status
        resolvedFieldName = 'status'
        break
      case 'paymentStatus':
        resolvedEntityType = 'payment'
        resolvedFieldName = 'status'
        break
      case 'documentShared':
        resolvedEntityType = 'document'
        resolvedFieldName = 'shared'
        break
    }
  }

  // Get status configuration using helper
  const statusInfo = resolvedEntityType && resolvedFieldName
    ? getStatusConfig(statusConfig, resolvedEntityType, resolvedFieldName, mappingKey)
    : undefined

  if (!statusInfo) {
    // Fallback for unmapped values
    const fallbackLabel = showLabel && (type || resolvedFieldName)
      ? `${type || resolvedFieldName}: ${mappingKey}`
      : mappingKey

    return (
      <Chip
        label={fallbackLabel}
        size={size}
        variant={variant || 'filled'}
        sx={sx}
      />
    )
  }

  // Build display label with optional icon
  const iconPrefix = statusInfo.icon ? `${statusInfo.icon} ` : ''
  const label = showLabel && (type || resolvedFieldName)
    ? `${type || resolvedFieldName}: ${iconPrefix}${statusInfo.label}`
    : `${iconPrefix}${statusInfo.label}`

  const chip = (
    <Chip
      label={label}
      size={size}
      color={statusInfo.color}
      variant={variant || statusInfo.variant || 'filled'}
      sx={sx}
    />
  )

  // Wrap in tooltip if description is provided
  if (statusInfo.description) {
    return (
      <Tooltip title={statusInfo.description} arrow>
        {chip}
      </Tooltip>
    )
  }

  return chip
})

StatusChip.displayName = 'StatusChip'

export default StatusChip