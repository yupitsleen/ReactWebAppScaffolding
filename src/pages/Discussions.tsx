import { Container, Typography, Card, CardContent, Chip, Box, Avatar } from '@mui/material'
import { discussions } from '../data/sampleData'
import { appConfig } from '../data/configurableData'

function Discussions() {
  const pageConfig = appConfig.navigation.find(nav => nav.path === '/discussions')

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {pageConfig?.label || 'Discussions'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {pageConfig?.description}
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {discussions.map(discussion => (
          <Card key={discussion.id} sx={{ mb: 2, width: '100%', maxWidth: '600px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" component="h3">
                  {discussion.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={discussion.priority}
                    size="small"
                    color={discussion.priority === 'urgent' ? 'error' : 'default'}
                  />
                  <Chip
                    label={discussion.resolved ? 'Resolved' : 'Open'}
                    size="small"
                    color={discussion.resolved ? 'success' : 'warning'}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: 'center' }}>
                <Avatar sx={{ width: 32, height: 32 }}>{discussion.author[0]}</Avatar>
                <Typography variant="body2" color="text.secondary">
                  {discussion.author} ({discussion.authorRole}) · {new Date(discussion.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Typography variant="body2" paragraph sx={{ textAlign: 'left' }}>
                {discussion.content}
              </Typography>

              {discussion.replies.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                    Replies ({discussion.replies.length})
                  </Typography>
                  {discussion.replies.map(reply => (
                    <Box key={reply.id} sx={{ mt: 1, p: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24 }}>{reply.author[0]}</Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {reply.author} ({reply.authorRole}) · {new Date(reply.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ textAlign: 'left' }}>
                        {reply.content}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}

export default Discussions