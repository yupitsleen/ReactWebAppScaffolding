import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from '@mui/material'
import {
  AssignmentTurnedIn,
  Payment,
  Description,
  Forum,
  Warning,
  CheckCircle
} from '@mui/icons-material'
import { dashboardSummary, todoItems, payments, discussions, serviceInfo } from '../data/mockData'

function Home() {
  const urgentTodos = todoItems.filter(todo => todo.priority === 'high' && todo.status !== 'completed')
  const overduePayments = payments.filter(payment => payment.status === 'overdue')
  const openDiscussions = discussions.filter(discussion => !discussion.resolved)
  const completionRate = Math.round((dashboardSummary.completedTodos / dashboardSummary.totalTodos) * 100)

  // Get unique categories dynamically from data
  const todoCategories = [...new Set(todoItems.map(todo => todo.category))]
  const paymentCategories = [...new Set(payments.map(payment => payment.category))]
  const documentTypes = [...new Set(discussions.map(discussion => discussion.authorRole))]

  const summaryCards = [
    {
      title: todoCategories.length > 1 ? 'Tasks' : todoCategories[0] || 'Tasks',
      value: `${dashboardSummary.completedTodos}/${dashboardSummary.totalTodos}`,
      subtitle: 'Completed',
      icon: <AssignmentTurnedIn />,
      color: 'primary'
    },
    {
      title: paymentCategories.length > 1 ? 'Payments' : paymentCategories[0] || 'Payments',
      value: dashboardSummary.pendingPayments,
      subtitle: 'Outstanding',
      icon: <Payment />,
      color: 'warning'
    },
    {
      title: 'Documents',
      value: dashboardSummary.totalDocuments,
      subtitle: 'Available',
      icon: <Description />,
      color: 'info'
    },
    {
      title: 'Discussions',
      value: dashboardSummary.unreadDiscussions,
      subtitle: 'Need attention',
      icon: <Forum />,
      color: 'secondary'
    }
  ]

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to {serviceInfo.name} - {serviceInfo.tagline}
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: `${card.color}.main`, mr: 1 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {card.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Overall Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" value={completionRate} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {completionRate}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {dashboardSummary.completedTodos} of {dashboardSummary.totalTodos} tasks completed
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Priority Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Priority Tasks
              </Typography>
              {urgentTodos.length > 0 ? (
                <List dense>
                  {urgentTodos.slice(0, 5).map(todo => (
                    <ListItem key={todo.id}>
                      <Warning color="error" sx={{ mr: 1 }} />
                      <ListItemText
                        primary={todo.title}
                        secondary={`Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                      />
                      <Chip
                        label={todo.priority}
                        size="small"
                        color="error"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No urgent tasks at this time
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Discussions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Discussions
              </Typography>
              {openDiscussions.length > 0 ? (
                <List dense>
                  {openDiscussions.slice(0, 5).map(discussion => (
                    <ListItem key={discussion.id}>
                      <ListItemText
                        primary={discussion.title}
                        secondary={`${discussion.author} · ${new Date(discussion.createdAt).toLocaleDateString()}`}
                      />
                      <Chip
                        label={discussion.priority}
                        size="small"
                        color={discussion.priority === 'urgent' ? 'error' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    All discussions resolved
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home