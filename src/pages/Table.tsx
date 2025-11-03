import { memo } from 'react'
import { Box } from '@mui/material'
import PageLayout from '../components/PageLayout'
import DataTable, { type DataTableColumn } from '../components/DataTable'
import FieldRenderer from '../components/FieldRenderer'
import { usePageLoading } from '../hooks/usePageLoading'
import { useData } from '../context/ContextProvider'
import { appConfig } from '../data/configurableData'
import type { TodoItem } from '../types/portal'

const Table = memo(() => {
  const [loading] = usePageLoading(false)
  const { todos } = useData()
  const { statusConfig } = appConfig

  const columns: DataTableColumn<TodoItem>[] = [
    {
      field: 'title',
      header: 'Task Title',
      width: '30%',
    },
    {
      field: 'priority',
      header: 'Priority',
      width: '15%',
      render: (value, row) => (
        <FieldRenderer
          field="priority"
          value={value}
          entity={row}
          statusConfig={statusConfig}
          variant="chip"
        />
      ),
    },
    {
      field: 'status',
      header: 'Status',
      width: '15%',
      render: (value, row) => (
        <FieldRenderer
          field="status"
          value={value}
          entity={row}
          statusConfig={statusConfig}
          variant="chip"
        />
      ),
    },
    {
      field: 'assignedTo',
      header: 'Assigned To',
      width: '20%',
    },
    {
      field: 'dueDate',
      header: 'Due Date',
      width: '20%',
      render: (value) => (
        <FieldRenderer
          field="dueDate"
          value={value}
          entity={{} as TodoItem}
          variant="secondary"
        />
      ),
    },
  ]

  return (
    <PageLayout loading={loading}>
      <Box className="spacing-top-lg">
        <DataTable
          data={todos}
          columns={columns}
          sortable
          filterable
          paginated
          defaultRowsPerPage={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="No tasks found"
        />
      </Box>
    </PageLayout>
  )
})

Table.displayName = 'Table'

export default Table
