/**
 * FieldRenderer - Registry-based field rendering
 *
 * This component uses the FieldRendererRegistry to render fields.
 * Custom renderers can be registered without modifying this file.
 *
 * Falls back to default rendering if no custom renderer is found.
 */

import { memo, type ReactNode } from 'react'
import { Typography } from '@mui/material'
import { fieldRenderers } from './fieldRenderers/FieldRendererRegistry'
import './fieldRenderers/defaultRenderers' // Register default renderers

interface FieldRendererNewProps {
  fieldName: string
  value: unknown
  entityType?: string
  entity?: Record<string, unknown>
}

const FieldRendererNew = memo<FieldRendererNewProps>(({
  fieldName,
  value,
  entityType,
  entity
}) => {
  // Try to get custom renderer from registry
  const customRenderer = fieldRenderers.get(fieldName, entityType)

  if (customRenderer) {
    return <>{customRenderer({ fieldName, value, entityType, entity })}</>
  }

  // Fallback to default rendering
  return renderDefault(value)
})

/**
 * Default fallback renderer
 */
function renderDefault(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return <Typography variant="body2" color="text.secondary">-</Typography>
  }

  if (typeof value === 'boolean') {
    return <Typography variant="body2">{value ? 'Yes' : 'No'}</Typography>
  }

  if (Array.isArray(value)) {
    return <Typography variant="body2">{value.join(', ')}</Typography>
  }

  if (typeof value === 'object') {
    return <Typography variant="body2">{JSON.stringify(value)}</Typography>
  }

  return <Typography variant="body2">{String(value)}</Typography>
}

FieldRendererNew.displayName = 'FieldRendererNew'

export default FieldRendererNew
