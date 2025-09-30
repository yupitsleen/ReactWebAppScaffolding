import { memo } from 'react'
import { Card, CardContent, Box } from '@mui/material'
import { documents } from '../data/sampleData'
import { appConfig } from '../data/configurableData'
import PageLayout from '../components/PageLayout'
import ActionMenu from '../components/ActionMenu'
import FieldRenderer from '../components/FieldRenderer'
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
              <FieldRenderer
                field={documentFields.primary}
                value={document[documentFields.primary as keyof typeof document]}
                entity={document}
                variant="primary"
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5, justifyContent: 'center' }}>
                {documentFields.secondary.map(field => (
                  <FieldRenderer
                    key={field}
                    field={field}
                    value={document[field as keyof typeof document]}
                    entity={document}
                    statusConfig={statusConfig}
                    variant="chip"
                  />
                ))}
              </Box>
              <ActionMenu
                actions={documentActions}
                entity={document}
                justifyContent="center"
                spacing={1}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </PageLayout>
  )
})

export default Documents