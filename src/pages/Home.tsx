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
import { dashboardSummary, todoItems, payments, discussions, serviceInfo, appConfig } from '../data/mockData'

function Home() {
  const completionRate = Math.round((dashboardSummary.completedTodos / dashboardSummary.totalTodos) * 100)

  // Icon mapping
  const iconMap = {
    AssignmentTurnedIn: <AssignmentTurnedIn />,
    Payment: <Payment />,
    Description: <Description />,
    Forum: <Forum />,
    Warning: <Warning />,
    CheckCircle: <CheckCircle />
  }

  // Calculate card values dynamically
  const getCardValue = (card: any) => {
    switch (card.dataSource) {
      case 'todoItems':
        return card.valueType === 'ratio'
          ? `${dashboardSummary.completedTodos}/${dashboardSummary.totalTodos}`
          : dashboardSummary.totalTodos
      case 'payments':
        return dashboardSummary.pendingPayments
      case 'documents':
        return dashboardSummary.totalDocuments
      case 'discussions':
        return dashboardSummary.unreadDiscussions
      default:
        return 0
    }
  }

  // Get filtered data for sections
  const getSectionData = (section: any) => {
    const { dataSource, filterCriteria, maxItems } = section
    let data: any[] = []

    switch (dataSource) {
      case 'todoItems':
        data = todoItems.filter(item => {
          if (filterCriteria?.priority && item.priority !== filterCriteria.priority) return false
          if (filterCriteria?.status === '!completed' && item.status === 'completed') return false
          return true
        })
        break
      case 'discussions':
        data = discussions.filter(item => {
          if (filterCriteria?.resolved !== undefined && item.resolved !== filterCriteria.resolved) return false
          return true
        })
        break
      default:
        data = []
    }

    return maxItems ? data.slice(0, maxItems) : data
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {appConfig.pageTitle}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to {serviceInfo.name} - {serviceInfo.tagline}
      </Typography>

      {/* Dynamic Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {appConfig.dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: `${card.color}.main`, mr: 1 }}>
                    {card.icon && iconMap[card.icon as keyof typeof iconMap]}
                  </Box>
                  <Typography variant="h6" component="div">
                    {getCardValue(card)}
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

      {/* Dynamic Sections */}
      <Grid container spacing={3}>
        {appConfig.dashboardSections
          .filter(section => section.enabled)
          .map((section, index) => {
            const sectionData = getSectionData(section)
            return (
              <Grid item xs={12} md={6} key={section.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    {sectionData.length > 0 ? (
                      <List dense>
                        {sectionData.map((item: any) => (
                          <ListItem key={item.id}>
                            {section.dataSource === 'todoItems' && (
                              <>
                                <Warning color="error" sx={{ mr: 1 }} />
                                <ListItemText
                                  primary={item.title}
                                  secondary={`Due: ${new Date(item.dueDate).toLocaleDateString()}`}
                                />
                                <Chip
                                  label={item.priority}
                                  size="small"
                                  color="error"
                                />
                              </>
                            )}
                            {section.dataSource === 'discussions' && (
                              <>
                                <ListItemText
                                  primary={item.title}
                                  secondary={`${item.author} · ${new Date(item.createdAt).toLocaleDateString()}`}
                                />
                                <Chip
                                  label={item.priority}
                                  size="small"
                                  color={item.priority === 'urgent' ? 'error' : 'default'}
                                />
                              </>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                        <CheckCircle color="success" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {section.dataSource === 'todoItems' ? 'No urgent tasks at this time' : 'All discussions resolved'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
      </Grid>
    </Container>
  )
}

export default Home