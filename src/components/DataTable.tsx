import { memo, useState, useMemo, type ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  TextField,
  InputAdornment,
  Typography,
  TablePagination
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

export interface DataTableColumn<T> {
  field: keyof T | string
  header: string
  width?: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  sortable?: boolean
  filterable?: boolean
  paginated?: boolean
  rowsPerPageOptions?: number[]
  defaultRowsPerPage?: number
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

function DataTableInner<T extends Record<string, any>>({
  data,
  columns,
  sortable = true,
  filterable = true,
  paginated = true,
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  emptyMessage = 'No data available',
  onRowClick
}: DataTableProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | string | null>(null)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [filterText, setFilterText] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const handleSort = (field: keyof T | string) => {
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(field)
  }

  const filteredData = useMemo(() => {
    if (!filterable || !filterText) return data

    const lowerFilter = filterText.toLowerCase()
    return data.filter(row =>
      columns.some(col => {
        if (col.filterable === false) return false
        const value = row[col.field as keyof T]
        return String(value).toLowerCase().includes(lowerFilter)
      })
    )
  }, [data, filterText, columns, filterable])

  const sortedData = useMemo(() => {
    if (!sortable || !orderBy) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[orderBy as keyof T]
      const bValue = b[orderBy as keyof T]

      if (aValue === bValue) return 0

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return order === 'desc' ? -comparison : comparison
    })
  }, [filteredData, orderBy, order, sortable])

  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData
    const start = page * rowsPerPage
    return sortedData.slice(start, start + rowsPerPage)
  }, [sortedData, page, rowsPerPage, paginated])

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getCellValue = (row: T, column: DataTableColumn<T>): any => {
    return row[column.field as keyof T]
  }

  return (
    <Box>
      {filterable && (
        <Box className="spacing-bottom-md">
          <TextField
            size="small"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  style={{ width: column.width }}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box className="empty-state">
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover={!!onRowClick}
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.field)}>
                      {column.render
                        ? column.render(getCellValue(row, column), row)
                        : String(getCellValue(row, column) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {paginated && sortedData.length > 0 && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  )
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner

export default DataTable
