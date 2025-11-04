import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { ErrorOutline as ErrorIcon } from '@mui/icons-material'
import EmptyState from '../components/EmptyState'

const NotFound = memo(() => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <EmptyState
        variant="custom"
        icon={ErrorIcon}
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        action={{
          label: 'Go to Home',
          onClick: () => navigate('/'),
        }}
      />
    </Box>
  )
})

NotFound.displayName = 'NotFound'

export default NotFound