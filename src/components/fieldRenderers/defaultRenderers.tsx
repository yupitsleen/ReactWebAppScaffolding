/**
 * Default Field Renderers
 *
 * Pre-configured renderers for common field types.
 * These are automatically registered when the module is imported.
 *
 * Users can override these by registering their own renderers with the same
 * field name or pattern.
 */

import { Chip, Typography } from '@mui/material'
import { fieldRenderers, type FieldRendererProps } from './FieldRendererRegistry'

/**
 * Priority field renderer
 */
fieldRenderers.register('priority', ({ value }: FieldRendererProps) => {
  const priorityConfig: Record<string, { color: 'default' | 'error' | 'warning' | 'info' | 'success'; label: string }> = {
    high: { color: 'error', label: 'High' },
    medium: { color: 'warning', label: 'Medium' },
    low: { color: 'default', label: 'Low' }
  }

  const config = priorityConfig[value?.toLowerCase()] || { color: 'default' as const, label: String(value) }

  return <Chip label={config.label} color={config.color} size="small" />
})

/**
 * Status field renderer (generic)
 */
fieldRenderers.register('status', ({ value }: FieldRendererProps) => {
  const statusConfig: Record<string, { color: 'default' | 'error' | 'warning' | 'info' | 'success'; label: string }> = {
    pending: { color: 'warning', label: 'Pending' },
    'in-progress': { color: 'info', label: 'In Progress' },
    completed: { color: 'success', label: 'Completed' },
    cancelled: { color: 'error', label: 'Cancelled' }
  }

  const config = statusConfig[value] || { color: 'default' as const, label: String(value) }

  return <Chip label={config.label} color={config.color} size="small" />
})

/**
 * Pattern: All fields ending in "Status"
 * Priority: 10 (checked before lower priority patterns)
 */
fieldRenderers.registerPattern(/.*Status$/i, ({ value }: FieldRendererProps) => {
  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>

  // Convert camelCase/PascalCase to Title Case for label
  const label = String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()

  // Simple color mapping based on common status patterns
  let color: 'default' | 'error' | 'warning' | 'info' | 'success' = 'default'

  const valueLower = String(value).toLowerCase()
  if (valueLower.includes('complete') || valueLower.includes('done') || valueLower.includes('success')) {
    color = 'success'
  } else if (valueLower.includes('progress') || valueLower.includes('processing')) {
    color = 'info'
  } else if (valueLower.includes('pending') || valueLower.includes('waiting')) {
    color = 'warning'
  } else if (valueLower.includes('error') || valueLower.includes('failed') || valueLower.includes('cancel')) {
    color = 'error'
  }

  return <Chip label={label} color={color} size="small" />
}, 10)

/**
 * Pattern: All fields ending in "Date"
 * Priority: 10
 */
fieldRenderers.registerPattern(/.*Date$/i, ({ value }: FieldRendererProps) => {
  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return <Typography variant="body2">{String(value)}</Typography>
    }

    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    return (
      <Chip
        label={formatted}
        size="small"
        variant="outlined"
        sx={{ fontFamily: 'monospace' }}
      />
    )
  } catch {
    return <Typography variant="body2">{String(value)}</Typography>
  }
}, 10)

/**
 * Pattern: All fields ending in "At" (timestamps)
 * Priority: 9 (slightly lower than Date)
 */
fieldRenderers.registerPattern(/.*At$/i, ({ value }: FieldRendererProps) => {
  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>

  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return <Typography variant="body2">{String(value)}</Typography>
    }

    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    return (
      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {formatted}
      </Typography>
    )
  } catch {
    return <Typography variant="body2">{String(value)}</Typography>
  }
}, 9)

/**
 * Pattern: Currency/Amount fields
 * Matches: *Amount, *Price, *Cost, total, subtotal
 * Priority: 10
 */
fieldRenderers.registerPattern(/.*Amount$|.*Price$|.*Cost$|^total$|^subtotal$/i, ({ value }: FieldRendererProps) => {
  if (value === null || value === undefined) {
    return <Typography variant="body2" color="text.secondary">-</Typography>
  }

  const numValue = typeof value === 'number' ? value : parseFloat(String(value))

  if (isNaN(numValue)) {
    return <Typography variant="body2">{String(value)}</Typography>
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numValue)

  return (
    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
      {formatted}
    </Typography>
  )
}, 10)

/**
 * Pattern: Boolean fields starting with "is", "has", "can"
 * Priority: 5
 */
fieldRenderers.registerPattern(/^(is|has|can)[A-Z]/i, ({ value }: FieldRendererProps) => {
  const boolValue = Boolean(value)

  return (
    <Chip
      label={boolValue ? 'Yes' : 'No'}
      color={boolValue ? 'success' : 'default'}
      size="small"
      variant={boolValue ? 'filled' : 'outlined'}
    />
  )
}, 5)

/**
 * Pattern: Email fields
 * Priority: 10
 */
fieldRenderers.registerPattern(/.*[Ee]mail$/i, ({ value }: FieldRendererProps) => {
  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>

  return (
    <Typography
      variant="body2"
      sx={{
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        color: 'primary.main'
      }}
    >
      {String(value)}
    </Typography>
  )
}, 10)

/**
 * Pattern: URL fields
 * Priority: 10
 */
fieldRenderers.registerPattern(/.*[Uu]rl$|.*[Ll]ink$/i, ({ value }: FieldRendererProps) => {
  if (!value) return <Typography variant="body2" color="text.secondary">-</Typography>

  const url = String(value)
  const displayUrl = url.length > 40 ? url.substring(0, 37) + '...' : url

  return (
    <Typography
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variant="body2"
      sx={{
        color: 'primary.main',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      }}
    >
      {displayUrl}
    </Typography>
  )
}, 10)

/**
 * Pattern: Percentage fields
 * Priority: 10
 */
fieldRenderers.registerPattern(/.*Percent(age)?$/i, ({ value }: FieldRendererProps) => {
  if (value === null || value === undefined) {
    return <Typography variant="body2" color="text.secondary">-</Typography>
  }

  const numValue = typeof value === 'number' ? value : parseFloat(String(value))

  if (isNaN(numValue)) {
    return <Typography variant="body2">{String(value)}</Typography>
  }

  return (
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {numValue.toFixed(1)}%
    </Typography>
  )
}, 10)
