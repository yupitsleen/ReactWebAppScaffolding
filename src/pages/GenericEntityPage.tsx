import { memo, useState, useMemo, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  Add,
  Refresh,
  FileDownload,
  TableChart,
  ViewModule,
  Sort as SortIcon
} from '@mui/icons-material'
import PageLayout from '../components/PageLayout'
import { DataTable } from '../components/DataTable'
import { CardGrid } from '../components/CardGrid'
import { FilterBar } from '../components/FilterBar'
import { EntityCreateDialog } from '../components/EntityCreateDialog'
import { EntityEditDialog } from '../components/EntityEditDialog'
import { useGenericData } from '../context/GenericDataContext'
import { useNotifications } from '../context/NotificationContext'
import { appConfig } from '../data/configurableData'
import { usePageLoading } from '../hooks/usePageLoading'
import FieldRenderer from '../components/FieldRenderer'
import { getFromStorage, setToStorage } from '../utils/helpers'

export const GenericEntityPage = memo(() => {
  const location = useLocation()
  const pageId = location.pathname.split('/')[1] || 'home'
  const [loading] = usePageLoading(false)

  // Get page config from appConfig
  const config = appConfig.entityPages?.[pageId]

  const { getEntities, getLoading, refreshEntities } = useGenericData()
  const { addNotification } = useNotifications()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [sortBy, setSortBy] = useState<string>(
    config?.defaultSort?.field || 'createdAt'
  )
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    config?.defaultSort?.direction || 'desc'
  )
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => {
    const stored = getFromStorage(`${pageId}_viewMode`, null)
    return stored || config?.defaultView || 'table'
  })

  // Persist view mode preference
  useEffect(() => {
    setToStorage(`${pageId}_viewMode`, viewMode)
  }, [pageId, viewMode])

  // If no config found, show error
  if (!config) {
    return (
      <PageLayout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Page Configuration Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No entity page configuration found for: {pageId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Please add configuration in <code>appConfig.entityPages</code>
          </Typography>
        </Box>
      </PageLayout>
    )
  }

  const entities = getEntities(config.entityKey)
  const entitiesLoading = getLoading(config.entityKey)

  // Apply filters and sorting
  const processedData = useMemo(() => {
    let result = [...entities]

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value === undefined || value === null || value === '') return

      if (Array.isArray(value)) {
        // Multiselect filter
        if (value.length > 0) {
          result = result.filter((item: any) => value.includes(item[field]))
        }
      } else if (typeof value === 'object' && value.from !== undefined) {
        // Date range filter
        result = result.filter((item: any) => {
          const itemDate = new Date(item[field])
          const fromDate = value.from ? new Date(value.from) : null
          const toDate = value.to ? new Date(value.to) : null

          if (fromDate && itemDate < fromDate) return false
          if (toDate && itemDate > toDate) return false
          return true
        })
      } else {
        // Simple equality filter or text search
        result = result.filter((item: any) => {
          const itemValue = String(item[field] || '').toLowerCase()
          const filterValue = String(value).toLowerCase()
          return itemValue.includes(filterValue)
        })
      }
    })

    // Apply sorting
    result.sort((a: any, b: any) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      let comparison = 0

      // Handle different types
      if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        // Fallback to string comparison
        comparison = String(aValue).localeCompare(String(bValue))
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })

    return result
  }, [entities, filters, sortBy, sortDirection, config.entityKey])

  const handleRefresh = useCallback(async () => {
    try {
      await refreshEntities(config.entityKey)
      addNotification({
        type: 'success',
        title: 'Refreshed',
        message: 'Data has been refreshed',
        autoHide: true
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh data',
        autoHide: true
      })
    }
  }, [config.entityKey, refreshEntities, addNotification])

  const handleExport = useCallback(() => {
    // Simple CSV export
    const csvContent = [
      // Header row
      Object.keys(processedData[0] || {}).join(','),
      // Data rows
      ...processedData.map((item: any) =>
        Object.values(item)
          .map((val: any) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${pageId}-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)

    addNotification({
      type: 'success',
      title: 'Exported',
      message: 'Data exported successfully',
      autoHide: true
    })
  }, [processedData, pageId, addNotification])

  const handleCardClick = useCallback(
    (item: any) => {
      setSelectedEntity(item)
      setEditDialogOpen(true)
    },
    []
  )

  // Generate table columns from config or use default
  const tableColumns = useMemo(() => {
    if (config.tableColumns) {
      return config.tableColumns.map((col) => ({
        field: col.field,
        header: col.header,
        sortable: col.sortable ?? true,
        render: col.render
          ? col.render
          : (value: any, row: any) => (
              <FieldRenderer
                field={col.field}
                value={value}
                entity={row}
                entityType={config.entityKey}
                statusConfig={appConfig.statusConfig}
                variant="chip"
              />
            )
      }))
    }

    // Default: use fieldConfig
    const fieldCfg = appConfig.fieldConfig[config.entityKey]
    if (!fieldCfg) return []

    return [
      {
        field: fieldCfg.primary,
        header: fieldCfg.primary,
        sortable: true
      },
      ...fieldCfg.secondary.map((field) => ({
        field,
        header: field,
        sortable: true,
        render: (value: any, row: any) => (
          <FieldRenderer
            field={field}
            value={value}
            entity={row}
            entityType={config.entityKey}
            statusConfig={appConfig.statusConfig}
            variant="chip"
          />
        )
      }))
    ]
  }, [config])

  const sortOptions = useMemo(() => {
    if (config.sortOptions) return config.sortOptions

    // Default: generate from tableColumns
    return tableColumns.map((col) => ({
      value: col.field,
      label: col.header
    }))
  }, [config.sortOptions, tableColumns])

  return (
    <PageLayout loading={loading || entitiesLoading}>
      <Box sx={{ mt: 3 }}>
        {/* Header with title and subtitle */}
        {(config.title || config.subtitle) && (
          <Box sx={{ mb: 3 }}>
            {config.title && (
              <Typography variant="h4" gutterBottom>
                {config.title}
              </Typography>
            )}
            {config.subtitle && (
              <Typography variant="body1" color="text.secondary">
                {config.subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          {/* Sort Controls */}
          {config.showSort !== false && processedData.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <SortIcon color="action" />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortDirection}
                  label="Order"
                  onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            {config.showRefresh !== false && (
              <Tooltip title="Refresh">
                <Button onClick={handleRefresh} startIcon={<Refresh />} size="small">
                  Refresh
                </Button>
              </Tooltip>
            )}

            {config.showExport && processedData.length > 0 && (
              <Tooltip title="Export to CSV">
                <Button onClick={handleExport} startIcon={<FileDownload />} size="small">
                  Export
                </Button>
              </Tooltip>
            )}

            {config.viewMode === 'both' && (
              <ButtonGroup size="small">
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                >
                  <TableChart />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('cards')}
                >
                  <ViewModule />
                </Button>
              </ButtonGroup>
            )}

            {config.showCreate !== false && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
                size="small"
              >
                Create
              </Button>
            )}
          </Box>
        </Box>

        {/* Filters */}
        {config.showFilters && config.filters && (
          <FilterBar filters={config.filters} values={filters} onChange={setFilters} />
        )}

        {/* Content based on view mode */}
        {processedData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Object.keys(filters).length > 0
                ? 'Try adjusting your filters'
                : 'Create your first item to get started!'}
            </Typography>
          </Box>
        ) : (
          <>
            {(config.viewMode === 'table' || viewMode === 'table') && (
              <DataTable data={processedData} columns={tableColumns} sortable filterable paginated />
            )}

            {(config.viewMode === 'cards' || viewMode === 'cards') && (
              <CardGrid
                data={processedData}
                entityType={config.entityKey}
                onCardClick={handleCardClick}
              />
            )}
          </>
        )}

        {/* Create Dialog */}
        <EntityCreateDialog
          entityKey={config.entityKey}
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSuccess={() => {
            addNotification({
              type: 'success',
              title: 'Created!',
              message: 'Item created successfully',
              autoHide: true
            })
          }}
        />

        {/* Edit Dialog */}
        {selectedEntity && (
          <EntityEditDialog
            entityKey={config.entityKey}
            entity={selectedEntity}
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false)
              setSelectedEntity(null)
            }}
            onSuccess={() => {
              addNotification({
                type: 'success',
                title: 'Updated!',
                message: 'Item updated successfully',
                autoHide: true
              })
            }}
          />
        )}
      </Box>
    </PageLayout>
  )
})

GenericEntityPage.displayName = 'GenericEntityPage'

export default GenericEntityPage
