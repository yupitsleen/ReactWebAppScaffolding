import React, { type ReactNode } from 'react'
import { Typography, Chip } from '@mui/material'
import StatusChip from '../components/StatusChip'
import type { StatusConfig } from '../types/portal'

export interface FieldRendererConfig {
  value: unknown
  statusConfig?: StatusConfig
  isCompleted?: boolean
  variant?: 'primary' | 'secondary' | 'chip'
  sx?: Record<string, unknown>
}

export type FieldTypeRenderer = (config: FieldRendererConfig) => ReactNode

const priorityRenderer: FieldTypeRenderer = ({ value, statusConfig, isCompleted, sx }) => {
  if (!statusConfig || typeof value !== 'string') return null

  return (
    <StatusChip
      type="priority"
      value={value}
      statusConfig={statusConfig}
      size="small"
      showLabel={true}
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const statusRenderer: FieldTypeRenderer = ({ value, statusConfig, isCompleted, sx }) => {
  if (!statusConfig || typeof value !== 'string') return null

  return (
    <StatusChip
      type="status"
      value={value}
      statusConfig={statusConfig}
      size="small"
      showLabel={true}
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const dateRenderer: FieldTypeRenderer = ({ value, isCompleted, sx }) => {
  if (typeof value !== 'string') return null

  return (
    <Chip
      label={`${new Date(value).toLocaleDateString()}`}
      size="small"
      variant="outlined"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const dueDateRenderer: FieldTypeRenderer = ({ value, isCompleted, sx }) => {
  if (typeof value !== 'string') return null

  return (
    <Chip
      label={`Due: ${new Date(value).toLocaleDateString()}`}
      size="small"
      variant="outlined"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const createdAtRenderer: FieldTypeRenderer = ({ value, isCompleted, sx }) => {
  if (typeof value !== 'string') return null

  return (
    <Chip
      label={`Created: ${new Date(value).toLocaleDateString()}`}
      size="small"
      variant="outlined"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const paidDateRenderer: FieldTypeRenderer = ({ value, isCompleted, sx }) => {
  if (typeof value !== 'string') return null

  return (
    <Chip
      label={`Paid: ${new Date(value).toLocaleDateString()}`}
      size="small"
      variant="outlined"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const amountRenderer: FieldTypeRenderer = ({ value, isCompleted, sx }) => {
  if (typeof value !== 'number') return null

  return (
    <Chip
      label={`Amount: $${value.toFixed(2)}`}
      size="small"
      variant="outlined"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const sharedRenderer: FieldTypeRenderer = ({ value, statusConfig, isCompleted, sx }) => {
  if (!statusConfig || typeof value !== 'boolean') return null

  return (
    <StatusChip
      type="documentShared"
      value={value}
      statusConfig={statusConfig}
      size="small"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

const primaryRenderer: FieldTypeRenderer = ({ value, isCompleted }) => {
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

const secondaryRenderer: FieldTypeRenderer = ({ value, isCompleted }) => {
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

const chipRenderer: FieldTypeRenderer = ({ value, isCompleted, sx }) => {
  return (
    <Chip
      label={String(value)}
      size="small"
      variant="outlined"
      sx={{ opacity: isCompleted ? 0.7 : 1, ...sx }}
    />
  )
}

export const fieldTypeRegistry: Record<string, FieldTypeRenderer> = {
  priority: priorityRenderer,
  status: statusRenderer,
  dueDate: dueDateRenderer,
  createdAt: createdAtRenderer,
  paidDate: paidDateRenderer,
  amount: amountRenderer,
  shared: sharedRenderer,
  primary: primaryRenderer,
  secondary: secondaryRenderer,
  chip: chipRenderer,
  date: dateRenderer,
}

export const registerFieldType = (fieldName: string, renderer: FieldTypeRenderer): void => {
  fieldTypeRegistry[fieldName] = renderer
}

export const getFieldRenderer = (fieldName: string, variant?: string): FieldTypeRenderer | null => {
  if (fieldTypeRegistry[fieldName]) {
    return fieldTypeRegistry[fieldName]
  }

  if (variant && fieldTypeRegistry[variant]) {
    return fieldTypeRegistry[variant]
  }

  return fieldTypeRegistry.chip
}