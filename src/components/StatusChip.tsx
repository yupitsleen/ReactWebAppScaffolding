import { memo } from 'react'
import { Chip } from '@mui/material'
import type { StatusConfig } from '../types/portal'

interface StatusChipProps {
  type: 'priority' | 'status' | 'paymentStatus' | 'documentShared'
  value: string | boolean
  statusConfig: StatusConfig
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
  showLabel?: boolean
  sx?: Record<string, unknown>
}

const StatusChip = memo<StatusChipProps>(({
  type,
  value,
  statusConfig,
  size = 'small',
  variant,
  showLabel = false,
  sx = {}
}) => {
  // Get the appropriate status mapping
  let statusMapping
  let mappingKey: string

  switch (type) {
    case 'priority':
      statusMapping = statusConfig.priority
      mappingKey = String(value)
      break
    case 'status':
      statusMapping = statusConfig.status
      mappingKey = String(value)
      break
    case 'paymentStatus':
      statusMapping = statusConfig.paymentStatus
      mappingKey = String(value)
      break
    case 'documentShared':
      statusMapping = statusConfig.documentShared
      mappingKey = String(value)
      break
    default:
      return null
  }

  const statusInfo = statusMapping[mappingKey]

  if (!statusInfo) {
    // Fallback for unmapped values
    return (
      <Chip
        label={showLabel ? `${type}: ${String(value)}` : String(value)}
        size={size}
        variant={variant || 'filled'}
        sx={sx}
      />
    )
  }

  const label = showLabel ?
    `${type.charAt(0).toUpperCase() + type.slice(1)}: ${statusInfo.label}` :
    statusInfo.label

  return (
    <Chip
      label={label}
      size={size}
      color={statusInfo.color}
      variant={variant || statusInfo.variant || 'filled'}
      sx={sx}
    />
  )
})

StatusChip.displayName = 'StatusChip'

export default StatusChip