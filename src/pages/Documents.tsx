import { memo } from 'react'
import { Typography, Card, CardContent, Chip, Box, Button } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { documents } from '../data/sampleData'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import { usePageLoading } from '../hooks/usePageLoading'

const Documents = memo(() => {
  const [loading] = usePageLoading(false)
  const { actions, statusConfig, fieldConfig } = appConfig
  const documentActions = actions.document
  const documentFields = fieldConfig.document

  return (
    <PageLayout loading={loading}>
      <Box sx={{ mt: 3 }}>
        {documents.map(document => (
          <Card key={document.id} sx={{ mb: 2 }}>
            <CardContent sx={{ padding: '16px !important' }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {document[documentFields.primary as keyof typeof document] as string}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5, justifyContent: 'center' }}>
                {documentFields.secondary.map(field => {
                  if (field === 'shared') {
                    const sharedStatus = statusConfig.documentShared[document.shared.toString()]
                    return (
                      <Chip
                        key={field}
                        label={sharedStatus.label}
                        size="small"
                        color={sharedStatus.color}
                        variant={sharedStatus.variant || 'filled'}
                      />
                    )
                  }

                  let value = document[field as keyof typeof document]
                  if (field === 'uploadedAt') {
                    value = new Date(value as string).toLocaleDateString()
                  } else if (field === 'uploadedBy') {
                    value = `Uploaded by ${value}`
                  }

                  return (
                    <Chip
                      key={field}
                      label={value as string}
                      size="small"
                      variant="outlined"
                      color={field === 'type' ? 'primary' : 'default'}
                    />
                  )
                })}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {documentActions.map(action => {
                  const IconComponent = Icons[action.icon as keyof typeof Icons] as React.ComponentType
                  return (
                    <Button
                      key={action.id}
                      variant={action.variant}
                      size={action.size}
                      color={action.color}
                      startIcon={<IconComponent />}
                      onClick={() => console.log(`${action.onClick} called`)}
                    >
                      {action.label}
                    </Button>
                  )
                })}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageLayout>
  )
})

export default Documents