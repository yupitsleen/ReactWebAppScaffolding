import { memo } from 'react'
import { Typography, Card, CardContent, Chip, Box } from '@mui/material'
import { payments } from '../data/sampleData'
import PageLayout from '../components/PageLayout'

const Payments = memo(() => {
  return (
    <PageLayout>
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
    </PageLayout>
  )
})

export default Payments