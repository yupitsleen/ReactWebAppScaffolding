import { CircularProgress, Box, Typography } from '@mui/material'

interface LoadingProps {
  text?: string
}

export default function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        gap: 2
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  )
}