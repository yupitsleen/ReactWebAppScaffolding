import { memo, useState, useMemo } from 'react'
import { Typography, Card, CardContent, Chip, Box, Checkbox, FormControlLabel, Fab, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Add as AddIcon, Sort as SortIcon } from '@mui/icons-material'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import FieldRenderer from '../components/FieldRenderer'
import { usePageLoading } from '../hooks/usePageLoading'
import { useAppContext } from '../context/AppContext'
import CreateTodoDialog from '../components/CreateTodoDialog'

const Tasks = memo(() => {
  const [loading] = usePageLoading(false)
  const { state, updateTodoStatus } = useAppContext()
  const { statusConfig, fieldConfig } = appConfig
  const todoFields = fieldConfig.todoItem
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>('dueDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const sortedTodos = useMemo(() => {
    const todos = [...state.todos]

    return todos.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (sortBy) {
        case 'dueDate':
        case 'createdAt':
          aValue = new Date(a[sortBy as keyof typeof a] as string)
          bValue = new Date(b[sortBy as keyof typeof b] as string)
          break
        case 'priority': {
          // Convert priority to numeric for sorting (high=3, medium=2, low=1)
          const priorityValues = { high: 3, medium: 2, low: 1 }
          aValue = priorityValues[a.priority]
          bValue = priorityValues[b.priority]
          break
        }
        case 'status': {
          // Convert status to numeric for sorting (pending=1, in-progress=2, completed=3)
          const statusValues = { pending: 1, 'in-progress': 2, completed: 3 }
          aValue = statusValues[a.status]
          bValue = statusValues[b.status]
          break
        }
        default:
          aValue = String(a[sortBy as keyof typeof a] || '').toLowerCase()
          bValue = String(b[sortBy as keyof typeof b] || '').toLowerCase()
      }

      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [state.todos, sortBy, sortDirection])

  const handleTaskToggle = (taskId: string) => {
    const currentTodo = state.todos.find(todo => todo.id === taskId)
    if (currentTodo) {
      const newStatus = currentTodo.status === 'completed' ? 'pending' : 'completed'
      updateTodoStatus(taskId, newStatus)
    }
  }

  return (
    <PageLayout loading={loading}>
      <Box sx={{ mt: 3 }}>
        {/* Sort Controls */}
        {state.todos.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SortIcon color="action" />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="assignedTo">Assigned To</MenuItem>
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

        {state.todos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first task to get started!
            </Typography>
          </Box>
        ) : (
          sortedTodos.map(todo => {
          const isCompleted = todo.status === 'completed'

          return (
            <Card key={todo.id} sx={{
              mb: 2,
              opacity: isCompleted ? 0.6 : 1,
              transition: 'opacity 0.3s ease'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isCompleted}
                        onChange={() => handleTaskToggle(todo.id)}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ m: 0, alignSelf: 'flex-start' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <FieldRenderer
                      field={todoFields.primary}
                      value={todo[todoFields.primary as keyof typeof todo]}
                      entity={todo}
                      variant="primary"
                      isCompleted={isCompleted}
                    />
                    <FieldRenderer
                      field="description"
                      value={todo.description}
                      entity={todo}
                      variant="secondary"
                      isCompleted={isCompleted}
                    />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {todoFields.secondary.map(field => (
                        <FieldRenderer
                          key={field}
                          field={field}
                          value={todo[field as keyof typeof todo]}
                          entity={todo}
                          statusConfig={statusConfig}
                          variant="chip"
                          isCompleted={isCompleted}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        }))}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: { xs: 24, sm: 16 },
          right: { xs: 20, sm: 16 },
          zIndex: 1000,
        }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Create Task Dialog */}
      <CreateTodoDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          // Optional: Show success message or scroll to new task
        }}
      />
      </Box>
    </PageLayout>
  )
})

export default Tasks