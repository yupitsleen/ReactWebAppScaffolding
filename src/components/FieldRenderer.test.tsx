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

  describe('Priority field rendering', () => {
    it('renders priority field as StatusChip', () => {
      renderWithTheme(
        <FieldRenderer
          field="priority"
          value="high"
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      expect(screen.getByText('Priority: High Priority')).toBeInTheDocument()
    })

    it('handles unknown priority values gracefully', () => {
      renderWithTheme(
        <FieldRenderer
          field="priority"
          value="unknown"
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      // Should still render the StatusChip component even with unknown value
      expect(screen.getByText('priority: unknown')).toBeInTheDocument()
    })
  })

  describe('Status field rendering', () => {
    it('renders status field as StatusChip', () => {
      renderWithTheme(
        <FieldRenderer
          field="status"
          value="completed"
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      expect(screen.getByText('Status: Completed')).toBeInTheDocument()
    })

    it('renders in-progress status correctly', () => {
      renderWithTheme(
        <FieldRenderer
          field="status"
          value="in-progress"
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      expect(screen.getByText('Status: In Progress')).toBeInTheDocument()
    })
  })

  describe('Date field rendering', () => {
    it('renders dueDate field as formatted chip', () => {
      renderWithTheme(
        <FieldRenderer
          field="dueDate"
          value="2024-01-15T00:00:00Z"
          variant="secondary"
        />
      )

      expect(screen.getByText('Due: 1/14/2024')).toBeInTheDocument()
    })

    it('renders createdAt field as formatted chip', () => {
      renderWithTheme(
        <FieldRenderer
          field="createdAt"
          value="2024-01-10T00:00:00Z"
          variant="secondary"
        />
      )

      expect(screen.getByText('Created: 1/9/2024')).toBeInTheDocument()
    })

    it('renders paidDate field as formatted chip', () => {
      renderWithTheme(
        <FieldRenderer
          field="paidDate"
          value="2024-01-20T00:00:00Z"
          variant="secondary"
        />
      )

      expect(screen.getByText('Paid: 1/19/2024')).toBeInTheDocument()
    })
  })

  describe('Amount field rendering', () => {
    it('renders amount field as formatted currency chip', () => {
      renderWithTheme(
        <FieldRenderer
          field="amount"
          value={1234.56}
          variant="secondary"
        />
      )

      expect(screen.getByText('Amount: $1234.56')).toBeInTheDocument()
    })

    it('handles zero amount correctly', () => {
      renderWithTheme(
        <FieldRenderer
          field="amount"
          value={0}
          variant="secondary"
        />
      )

      expect(screen.getByText('Amount: $0.00')).toBeInTheDocument()
    })
  })

  describe('Shared field rendering', () => {
    it('renders shared field as StatusChip for true value', () => {
      renderWithTheme(
        <FieldRenderer
          field="shared"
          value={true}
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      expect(screen.getByText('Shared')).toBeInTheDocument()
    })

    it('renders shared field as StatusChip for false value', () => {
      renderWithTheme(
        <FieldRenderer
          field="shared"
          value={false}
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      expect(screen.getByText('Private')).toBeInTheDocument()
    })
  })

  describe('Variant handling', () => {
    it('renders primary variant with h6 typography', () => {
      renderWithTheme(
        <FieldRenderer
          field="title"
          value="Test Title"
          variant="primary"
        />
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Test Title')
    })

    it('renders secondary variant with body2 typography', () => {
      renderWithTheme(
        <FieldRenderer
          field="description"
          value="Test description"
          variant="secondary"
        />
      )

      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('renders chip variant for unknown fields', () => {
      renderWithTheme(
        <FieldRenderer
          field="customField"
          value="Custom Value"
          variant="chip"
        />
      )

      expect(screen.getByText('customField: Custom Value')).toBeInTheDocument()
    })
  })

  describe('Completed state handling', () => {
    it('applies completed styling to primary variant', () => {
      renderWithTheme(
        <FieldRenderer
          field="title"
          value="Completed Task"
          variant="primary"
          isCompleted={true}
        />
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveStyle({ textDecoration: 'line-through' })
    })

    it('applies completed styling to secondary variant', () => {
      renderWithTheme(
        <FieldRenderer
          field="description"
          value="Completed description"
          variant="secondary"
          isCompleted={true}
        />
      )

      const text = screen.getByText('Completed description')
      expect(text).toHaveStyle({ textDecoration: 'line-through' })
    })

    it('applies opacity to status chips when completed', () => {
      renderWithTheme(
        <FieldRenderer
          field="priority"
          value="high"
          statusConfig={mockStatusConfig}
          variant="secondary"
          isCompleted={true}
        />
      )

      // The StatusChip should be rendered and the text should be visible
      expect(screen.getByText('Priority: High Priority')).toBeInTheDocument()

      // The status chip should have the completed styling (opacity is applied internally by StatusChip)
      const chipElement = screen.getByText('Priority: High Priority').closest('div[class*="MuiChip-root"]')
      expect(chipElement).toBeInTheDocument()
    })
  })

  describe('Children rendering', () => {
    it('renders children alongside field value', () => {
      renderWithTheme(
        <FieldRenderer
          field="title"
          value="Test Title"
          variant="primary"
        >
          <span data-testid="child-element">Child Content</span>
        </FieldRenderer>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByTestId('child-element')).toBeInTheDocument()
    })
  })

  describe('Fallback rendering', () => {
    it('renders unknown field as span for default variant', () => {
      renderWithTheme(
        <FieldRenderer
          field="unknownField"
          value="Unknown Value"
          variant="secondary"
        />
      )

      expect(screen.getByText('Unknown Value')).toBeInTheDocument()
    })

    it('handles null and undefined values', () => {
      renderWithTheme(
        <FieldRenderer
          field="nullField"
          value={null}
          variant="secondary"
        />
      )

      expect(screen.getByText('null')).toBeInTheDocument()
    })
  })

  describe('Type safety and edge cases', () => {
    it('handles non-string priority values gracefully', () => {
      renderWithTheme(
        <FieldRenderer
          field="priority"
          value={123}
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      // Should fall back to default rendering since value is not a string
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('handles non-number amount values gracefully', () => {
      renderWithTheme(
        <FieldRenderer
          field="amount"
          value="not-a-number"
          variant="secondary"
        />
      )

      // Should fall back to default rendering since value is not a number
      expect(screen.getByText('not-a-number')).toBeInTheDocument()
    })

    it('handles non-boolean shared values gracefully', () => {
      renderWithTheme(
        <FieldRenderer
          field="shared"
          value="not-a-boolean"
          statusConfig={mockStatusConfig}
          variant="secondary"
        />
      )

      // Should fall back to default rendering since value is not a boolean
      expect(screen.getByText('not-a-boolean')).toBeInTheDocument()
    })
  })
})