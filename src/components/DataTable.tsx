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
  TablePagination,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
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
  striped?: boolean
  dense?: boolean
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
  onRowClick,
  striped = true,
  dense = false
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

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Mobile Card View Component
  const MobileCardView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {paginatedData.length === 0 ? (
        <Card>
          <CardContent>
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: 48,
                  mb: 2,
                  opacity: 0.3,
                }}
              />
              <Typography variant="body1" fontWeight={500} gutterBottom>
                {emptyMessage}
              </Typography>
              {filterText && (
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search terms
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        paginatedData.map((row, index) => (
          <Card
            key={index}
            onClick={() => onRowClick?.(row)}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              transition: 'all 0.2s ease-in-out',
              ...(onRowClick && {
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              })
            }}
          >
            <CardContent>
              {columns.map((column, colIndex) => (
                <Box
                  key={String(column.field)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: colIndex < columns.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      minWidth: '40%',
                    }}
                  >
                    {column.header}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'right',
                      color: 'text.primary',
                      fontWeight: 500,
                      maxWidth: '55%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {column.render
                      ? column.render(getCellValue(row, column), row)
                      : String(getCellValue(row, column) ?? '')}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  )

  return (
    <Box>
      {filterable && (
        <Box className="spacing-bottom-md">
          <TextField
            size="small"
            placeholder="Search across all columns..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              maxWidth: { xs: '100%', sm: 400 },
              width: { xs: '100%', sm: 'auto' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'white',
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                },
              },
            }}
          />
        </Box>
      )}

      {/* Render mobile card view on small screens, table view on larger screens */}
      {isMobile ? (
        <MobileCardView />
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  style={{ width: column.width }}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'text.secondary',
                    borderBottom: '2px solid',
                    borderBottomColor: 'divider',
                  }}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleSort(column.field)}
                      sx={{
                        '&.Mui-active': {
                          color: 'primary.main',
                          '& .MuiTableSortLabel-icon': {
                            color: 'primary.main',
                          },
                        },
                      }}
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
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <SearchIcon
                      sx={{
                        fontSize: 48,
                        mb: 2,
                        opacity: 0.3,
                      }}
                    />
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                      {emptyMessage}
                    </Typography>
                    {filterText && (
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search terms
                      </Typography>
                    )}
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
                    backgroundColor: striped && index % 2 === 1 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: onRowClick ? 'rgba(59, 130, 246, 0.08)' : striped && index % 2 === 1 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                      transform: onRowClick ? 'translateX(4px)' : 'none',
                    },
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
      )}

      {paginated && sortedData.length > 0 && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
            '& .MuiTablePagination-toolbar': {
              minHeight: 56,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
              color: 'text.secondary',
            },
            '& .MuiTablePagination-select': {
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
              },
            },
            '& .MuiIconButton-root': {
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                transform: 'scale(1.05)',
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        />
      )}
    </Box>
  )
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner

export default DataTable
