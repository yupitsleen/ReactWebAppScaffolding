import { memo } from 'react'
import { Typography, Card, CardContent, Box, Chip } from '@mui/material'
import { useUser } from '../context/ContextProvider'
import PageLayout from '../components/PageLayout'

const MyAccount = memo(() => {
  const { user } = useUser()

  if (!user) {
    return (
      <PageLayout>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            Please log in to view your account information.
          </Typography>
        </Box>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              My Account
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {user.email}
              </Typography>
              {user.phone && (
                <Typography variant="body1" gutterBottom>
                  <strong>Phone:</strong> {user.phone}
                </Typography>
              )}
              <Typography variant="body1" gutterBottom>
                <strong>Role:</strong> {user.role}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={user.userType}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Status
              </Typography>
              <Chip
                label={user.isAuthenticated ? "Active" : "Inactive"}
                color={user.isAuthenticated ? "success" : "error"}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Account management features coming soon...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  )
})

export default MyAccount