import { Container, Typography, Card, CardContent, Chip, Box, Button } from '@mui/material'
import { Download as DownloadIcon, Share as ShareIcon } from '@mui/icons-material'
import { documents } from '../data/mockData'

function Documents() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Documents
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Access and manage your shared documents.
      </Typography>

      <Box sx={{ mt: 3 }}>
        {documents.map(document => (
          <Card key={document.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {document.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={document.type}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={document.size}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Uploaded by ${document.uploadedBy}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={new Date(document.uploadedAt).toLocaleDateString()}
                  size="small"
                  variant="outlined"
                />
                {document.shared && (
                  <Chip
                    label="Shared"
                    size="small"
                    color="success"
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShareIcon />}
                >
                  Share
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}

export default Documents