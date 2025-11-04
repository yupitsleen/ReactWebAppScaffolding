import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { portalTheme } from '../theme/portalTheme'
import DataTable, { type DataTableColumn } from './DataTable'

interface TestData {
  id: string
  name: string
  value: number
  status: string
}

const mockData: TestData[] = [
  { id: '1', name: 'Item A', value: 100, status: 'active' },
  { id: '2', name: 'Item B', value: 200, status: 'pending' },
  { id: '3', name: 'Item C', value: 150, status: 'active' },
]

const columns: DataTableColumn<TestData>[] = [
  { field: 'name', header: 'Name' },
  { field: 'value', header: 'Value' },
  { field: 'status', header: 'Status' },
]

const renderTable = (props = {}) => {
  return render(
    <ThemeProvider theme={portalTheme}>
      <DataTable data={mockData} columns={columns} {...props} />
    </ThemeProvider>
  )
}

describe('DataTable', () => {
  it('renders table with data', () => {
    renderTable()

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.getByText('Item B')).toBeInTheDocument()
  })

  it('displays empty message when no data', () => {
    render(
      <ThemeProvider theme={portalTheme}>
        <DataTable data={[]} columns={columns} emptyMessage="No items found" />
      </ThemeProvider>
    )

    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('filters data based on search text', () => {
    renderTable()

    const searchInput = screen.getByPlaceholderText('Search across all columns...')
    fireEvent.change(searchInput, { target: { value: 'Item A' } })

    expect(screen.getByText('Item A')).toBeInTheDocument()
    expect(screen.queryByText('Item B')).not.toBeInTheDocument()
    expect(screen.queryByText('Item C')).not.toBeInTheDocument()
  })

  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn()
    renderTable({ onRowClick: handleRowClick })

    const row = screen.getByText('Item A').closest('tr')
    if (row) {
      fireEvent.click(row)
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0])
    }
  })

  it('uses custom render function for columns', () => {
    const customColumns: DataTableColumn<TestData>[] = [
      {
        field: 'name',
        header: 'Name',
        render: (value) => <span data-testid="custom-cell">{value.toUpperCase()}</span>,
      },
    ]

    render(
      <ThemeProvider theme={portalTheme}>
        <DataTable data={mockData} columns={customColumns} />
      </ThemeProvider>
    )

    expect(screen.getByText('ITEM A')).toBeInTheDocument()
  })
})
