import { Container, Typography, Card, CardContent, Chip, Box } from '@mui/material'
import { payments, appConfig } from '../data/mockData'

function Payments() {
  const pageConfig = appConfig.navigation.find(nav => nav.path === '/payments')

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {pageConfig?.label || 'Payments'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {pageConfig?.description}
      </Typography>

      <Box sx={{ mt: 3 }}>
        {payments.map(payment => (
          <Card key={payment.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {payment.description}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${payment.amount.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Status: ${payment.status}`}
                  size="small"
                  color={payment.status === 'paid' ? 'success' : payment.status === 'overdue' ? 'error' : 'warning'}
                />
                <Chip
                  label={`Due: ${new Date(payment.dueDate).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={payment.category}
                  size="small"
                  variant="outlined"
                />
                {payment.paidDate && (
                  <Chip
                    label={`Paid: ${new Date(payment.paidDate).toLocaleDateString()}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}

export default Payments