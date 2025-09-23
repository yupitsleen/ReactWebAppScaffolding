import { memo, useState } from 'react'
import { Typography, Card, CardContent, Chip, Box, Checkbox, FormControlLabel } from '@mui/material'
import { todoItems } from '../data/sampleData'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import { usePageLoading } from '../hooks/usePageLoading'

const Tasks = memo(() => {
  const [loading] = usePageLoading(false)
  const { statusConfig, fieldConfig } = appConfig
  const todoFields = fieldConfig.todoItem
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>(
    todoItems.reduce((acc, todo) => ({ ...acc, [todo.id]: todo.status }), {})
  )

  const handleTaskToggle = (taskId: string) => {
    setTaskStatuses(prev => ({
      ...prev,
      [taskId]: prev[taskId] === 'completed' ? 'pending' : 'completed'
    }))
  }

  return (
    <PageLayout loading={loading}>
      <Box sx={{ mt: 3 }}>
        {todoItems.map(todo => {
          const currentStatus = taskStatuses[todo.id]
          const isCompleted = currentStatus === 'completed'

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
                          const taskStatus = statusConfig.status[currentStatus]
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
        })}
      </Box>
    </PageLayout>
  )
})

export default Tasks