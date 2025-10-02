import { memo, useState, useMemo, useEffect } from 'react'
import { Typography, Card, CardContent, Box, Checkbox, FormControlLabel, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import { Add as AddIcon, Sort as SortIcon, FilterList as FilterListIcon } from '@mui/icons-material'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import FieldRenderer from '../components/FieldRenderer'
import { usePageLoading } from '../hooks/usePageLoading'
import { useData } from '../context/ContextProvider'
import CreateTodoDialog from '../components/CreateTodoDialog'
import { getFromStorage, setToStorage } from '../utils/helpers'

const Tasks = memo(() => {
  const [loading] = usePageLoading(false)
  const { todos, updateTodoStatus } = useData()
  const { statusConfig, fieldConfig } = appConfig
  const todoFields = fieldConfig.todoItem
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>('dueDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [hideCompleted, setHideCompleted] = useState<boolean>(() =>
    getFromStorage('tasks_hideCompleted', false)
  )

  useEffect(() => {
    setToStorage('tasks_hideCompleted', hideCompleted)
  }, [hideCompleted])

  const sortedTodos = useMemo(() => {
    let todosList = [...todos]

    if (hideCompleted) {
      todosList = todosList.filter(todo => todo.status !== 'completed')
    }

    return todosList.sort((a, b) => {
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
          const statusValues: Record<string, number> = {
            'pending': 1,
            'in-progress': 2,
            'completed': 3
          }
          aValue = statusValues[a.status] ?? 0
          bValue = statusValues[b.status] ?? 0
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
  }, [todos, sortBy, sortDirection, hideCompleted])

  const handleTaskToggle = (taskId: string) => {
    const currentTodo = todos.find(todo => todo.id === taskId)
    if (currentTodo) {
      const newStatus = currentTodo.status === 'completed' ? 'pending' : 'completed'
      updateTodoStatus(taskId, newStatus)
    }
  }

  return (
    <PageLayout loading={loading}>
      <Box sx={{ mt: 3 }}>
        {/* Sort and Filter Controls */}
        {todos.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
            <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
              <Button
                variant={hideCompleted ? "contained" : "outlined"}
                size="small"
                startIcon={<FilterListIcon />}
                onClick={() => setHideCompleted(!hideCompleted)}
              >
                {hideCompleted ? "Show Completed" : "Hide Completed"}
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                color="primary"
              >
                Add Task
              </Button>
            </Box>
          </Box>
        )}

        {todos.length === 0 ? (
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