import { Box, Typography, Container } from '@mui/material'
import { appConfig, serviceInfo } from '../data/mockData'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        py: 2,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {currentYear} {appConfig.appName}. {serviceInfo.description}
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer