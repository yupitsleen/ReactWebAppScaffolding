import { memo } from 'react'
import { Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useCurrentPage } from '../hooks/useCurrentPage'
import LoadingWrapper from './LoadingWrapper'

interface PageLayoutProps {
  children: ReactNode
  loading?: boolean
  minHeight?: string
  title?: string
  description?: string
}

const PageLayout = memo(({ children, loading = false, minHeight = "400px", title, description }: PageLayoutProps) => {
  const pageConfig = useCurrentPage()

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
          fontWeight: 700,
          mb: { xs: 1, sm: 1.5, md: 2 }
        }}
      >
        {title || pageConfig?.label || 'Page'}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        paragraph
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem' },
          mb: { xs: 2, sm: 3, md: 4 }
        }}
      >
        {description || pageConfig?.description}
      </Typography>

      <LoadingWrapper loading={loading} minHeight={minHeight}>
        {children}
      </LoadingWrapper>
    </Container>
  )
})

export default PageLayout