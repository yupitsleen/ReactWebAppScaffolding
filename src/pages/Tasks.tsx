import { Container, Typography, Card, CardContent, Chip, Box } from '@mui/material'
import { todoItems } from '../data/mockData'

function Tasks() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Tasks
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your project tasks and deadlines.
      </Typography>

      <Box sx={{ mt: 3 }}>
        {todoItems.map(todo => (
          <Card key={todo.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {todo.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {todo.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Priority: ${todo.priority}`}
                  size="small"
                  color={todo.priority === 'high' ? 'error' : todo.priority === 'medium' ? 'warning' : 'default'}
                />
                <Chip
                  label={`Status: ${todo.status}`}
                  size="small"
                  color={todo.status === 'completed' ? 'success' : todo.status === 'in-progress' ? 'info' : 'default'}
                />
                <Chip
                  label={`Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}

export default Tasks