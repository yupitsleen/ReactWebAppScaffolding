import { Box, Typography, Container } from '@mui/material'
import { appConfig, serviceInfo } from '../data/mockData'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 0.5,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText'
      }}
    >
      <Typography variant="caption" align="center" display="block">
        © {currentYear} {appConfig.appName}
      </Typography>
    </Box>
  )
}

export default Footer