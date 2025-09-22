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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {title || pageConfig?.label || 'Page'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {description || pageConfig?.description}
      </Typography>

      <LoadingWrapper loading={loading} minHeight={minHeight}>
        {children}
      </LoadingWrapper>
    </Container>
  )
})

export default PageLayout