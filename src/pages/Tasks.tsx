import { memo } from 'react'
import { Typography, Card, CardContent, Chip, Box } from '@mui/material'
import { todoItems } from '../data/sampleData'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import { usePageLoading } from '../hooks/usePageLoading'

const Tasks = memo(() => {
  const [loading] = usePageLoading(false)
  const { statusConfig, fieldConfig } = appConfig
  const todoFields = fieldConfig.todoItem

  return (
    <PageLayout loading={loading}>
      <Box sx={{ mt: 3 }}>
        {todoItems.map(todo => (
          <Card key={todo.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {todo[todoFields.primary as keyof typeof todo] as string}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
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
                      />
                    )
                  }

                  return (
                    <Chip
                      key={field}
                      label={`${field}: ${todo[field as keyof typeof todo]}`}
                      size="small"
                      variant="outlined"
                    />
                  )
                })}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageLayout>
  )
})

export default Tasks