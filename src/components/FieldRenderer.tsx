import { memo, type ReactNode } from 'react'
import type { StatusConfig } from '../types/portal'
import { getFieldRenderer } from '../config/fieldTypes'

interface FieldRendererProps {
  field: string
  value: unknown
  entity?: Record<string, unknown>
  statusConfig?: StatusConfig
  variant?: 'primary' | 'secondary' | 'chip'
  isCompleted?: boolean
  children?: ReactNode
}

const FieldRenderer = memo<FieldRendererProps>(({
  field,
  value,
  statusConfig,
  variant = 'secondary',
  isCompleted = false,
  children
}) => {
  const opacity = isCompleted ? 0.7 : 1

  const renderFieldValue = (): ReactNode => {
    const renderer = getFieldRenderer(field, variant)

    if (renderer) {
      return renderer({
        value,
        statusConfig,
        isCompleted,
        variant,
        sx: { opacity }
      })
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