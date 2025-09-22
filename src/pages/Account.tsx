import { Container, Typography, Card, CardContent, Box, Avatar, Button } from '@mui/material'
import { users, serviceInfo } from '../data/sampleData'
import { appConfig } from '../data/configurableData'

function Account() {
  const pageConfig = appConfig.navigation.find(nav => nav.path === '/account')

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {pageConfig?.label || 'Account'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {pageConfig?.description}
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Users Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            {users.map(user => (
              <Box key={user.id} sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.name[0]}
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {user.role} · {user.email}
                </Typography>
                {user.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Service Info Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Service Information
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {serviceInfo.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {serviceInfo.tagline}
            </Typography>
            <Typography variant="body1" paragraph>
              {serviceInfo.description}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Contact Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: {serviceInfo.contact.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Phone: {serviceInfo.contact.phone}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Address: {serviceInfo.contact.address}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" sx={{ mr: 1 }}>
                Update Profile
              </Button>
              <Button variant="outlined">
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default Account