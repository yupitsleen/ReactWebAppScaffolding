import { memo, useState } from 'react'
import { Typography, Card, CardContent, Chip, Box, Checkbox, FormControlLabel, Fab } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import { usePageLoading } from '../hooks/usePageLoading'
import { useAppContext } from '../context/AppContext'
import CreateTodoDialog from '../components/CreateTodoDialog'

const Tasks = memo(() => {
  const [loading] = usePageLoading(false)
  const { state, updateTodoStatus } = useAppContext()
  const { statusConfig, fieldConfig } = appConfig
  const todoFields = fieldConfig.todoItem
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

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
          state.todos.map(todo => {
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
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        color: isCompleted ? 'text.disabled' : 'text.primary'
                      }}
                    >
                      {todo[todoFields.primary as keyof typeof todo] as string}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={isCompleted ? 'text.disabled' : 'text.secondary'}
                      paragraph
                      sx={{
                        textDecoration: isCompleted ? 'line-through' : 'none'
                      }}
                    >
                      {todo.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {todoFields.secondary.map(field => {
                        if (field === 'priority') {
                          const priorityStatus = statusConfig.priority[todo.priority]
                          return (
                            <Chip
                              key={field}
                              label={`Priority: ${priorityStatus.label}`}
                              size="small"
                              color={priorityStatus.color}
                              sx={{ opacity: isCompleted ? 0.7 : 1 }}
                            />
                          )
                        }

                        if (field === 'status') {
                          const taskStatus = statusConfig.status[todo.status]
                          return (
                            <Chip
                              key={field}
                              label={`Status: ${taskStatus.label}`}
                              size="small"
                              color={taskStatus.color}
                              sx={{ opacity: isCompleted ? 0.7 : 1 }}
                            />
                          )
                        }

                        if (field === 'dueDate') {
                          return (
                            <Chip
                              key={field}
                              label={`Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                              size="small"
                              variant="outlined"
                              sx={{ opacity: isCompleted ? 0.7 : 1 }}
                            />
                          )
                        }

                        return (
                          <Chip
                            key={field}
                            label={`${field}: ${todo[field as keyof typeof todo]}`}
                            size="small"
                            variant="outlined"
                            sx={{ opacity: isCompleted ? 0.7 : 1 }}
                          />
                        )
                      })}
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
          bottom: 16,
          right: 16,
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