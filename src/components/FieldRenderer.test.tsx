import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ThemeProvider } from '@mui/material/styles'
import { portalTheme } from '../theme/portalTheme'
import FieldRenderer from './FieldRenderer'
import { appConfig } from '../data/configurableData'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={portalTheme}>
      {component}
    </ThemeProvider>
  )
}

describe('FieldRenderer', () => {
  const mockStatusConfig = appConfig.statusConfig

  describe('Field type handling', () => {
    it('renders different field types correctly', () => {
      const { rerender } = renderWithTheme(
        <FieldRenderer field="priority" value="high" entityType="todoItem" statusConfig={mockStatusConfig} />
      )

      // Priority field with icon
      expect(screen.getByText(/🔥.*High Priority/)).toBeInTheDocument()

      // Status field with icon
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="status" value="completed" entityType="todoItem" statusConfig={mockStatusConfig} />
        </ThemeProvider>
      )
      expect(screen.getByText(/✅.*Completed/)).toBeInTheDocument()

      // Date field - use regex to handle timezone differences
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="dueDate" value="2024-01-15T00:00:00Z" />
        </ThemeProvider>
      )
      expect(screen.getByText(/1\/(14|15)\/2024/)).toBeInTheDocument()

      // Amount field
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="amount" value={299.99} />
        </ThemeProvider>
      )
      expect(screen.getByText('$299.99')).toBeInTheDocument()

      // Shared field with icon
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="shared" value={true} entityType="document" statusConfig={mockStatusConfig} />
        </ThemeProvider>
      )
      expect(screen.getByText(/👥.*Shared/)).toBeInTheDocument()
    })

    it('handles unknown and invalid values gracefully', () => {
      const { rerender } = renderWithTheme(
        <FieldRenderer field="priority" value="unknown" entityType="todoItem" statusConfig={mockStatusConfig} />
      )

      expect(screen.getByText('unknown')).toBeInTheDocument()

      // Non-string priority
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="priority" value={123} entityType="todoItem" statusConfig={mockStatusConfig} />
        </ThemeProvider>
      )
      expect(screen.getByText('123')).toBeInTheDocument()

      // Non-number amount
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="amount" value="not-a-number" />
        </ThemeProvider>
      )
      expect(screen.getByText('not-a-number')).toBeInTheDocument()

      // Null value
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="nullField" value={null} />
        </ThemeProvider>
      )
      expect(screen.getByText('null')).toBeInTheDocument()
    })
  })

  describe('Variant rendering', () => {
    it('renders all variants correctly', () => {
      const { rerender } = renderWithTheme(
        <FieldRenderer field="title" value="Test Title" variant="primary" />
      )

      // Primary variant (h6)
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Title')

      // Secondary variant (body text)
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="description" value="Test description" variant="secondary" />
        </ThemeProvider>
      )
      expect(screen.getByText('Test description')).toBeInTheDocument()

      // Chip variant
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="customField" value="Custom Value" variant="chip" />
        </ThemeProvider>
      )
      expect(screen.getByText('Custom Value')).toBeInTheDocument()
    })
  })

  describe('Completed state styling', () => {
    it('applies completed styling to all variants', () => {
      const { rerender } = renderWithTheme(
        <FieldRenderer field="title" value="Completed Task" variant="primary" isCompleted={true} />
      )

      // Primary with line-through
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveStyle({ textDecoration: 'line-through' })

      // Secondary with line-through
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="description" value="Completed description" variant="secondary" isCompleted={true} />
        </ThemeProvider>
      )
      const text = screen.getByText('Completed description')
      expect(text).toHaveStyle({ textDecoration: 'line-through' })

      // Status chip with completion state
      rerender(
        <ThemeProvider theme={portalTheme}>
          <FieldRenderer field="priority" value="high" entityType="todoItem" statusConfig={mockStatusConfig} isCompleted={true} />
        </ThemeProvider>
      )
      expect(screen.getByText(/🔥.*High Priority/)).toBeInTheDocument()
    })
  })

  describe('Children and edge cases', () => {
    it('renders children and handles edge cases', () => {
      renderWithTheme(
        <FieldRenderer field="title" value="Test Title" variant="primary">
          <span data-testid="child-element">Child Content</span>
        </FieldRenderer>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByTestId('child-element')).toBeInTheDocument()
    })
  })
})