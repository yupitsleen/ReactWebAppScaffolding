import { Container, Typography } from '@mui/material'
import { ReactNode } from 'react'
import { appConfig } from '../data/mockData'
import LoadingWrapper from './LoadingWrapper'

interface PageLayoutProps {
  pageId: string
  children: ReactNode
  loading?: boolean
  minHeight?: string
}

export default function PageLayout({ pageId, children, loading = false, minHeight = "400px" }: PageLayoutProps) {
  const pageConfig = appConfig.navigation.find(nav => nav.id === pageId)

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {pageConfig?.label || 'Page'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {pageConfig?.description}
      </Typography>

      <LoadingWrapper loading={loading} minHeight={minHeight}>
        {children}
      </LoadingWrapper>
    </Container>
  )
}