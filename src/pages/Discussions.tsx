import { Container, Typography, Card, CardContent, Chip, Box, Avatar, Divider } from '@mui/material'
import { discussions } from '../data/mockData'

function Discussions() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Discussions
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Communicate with your team and track conversations.
      </Typography>

      <Box sx={{ mt: 3 }}>
        {discussions.map(discussion => (
          <Card key={discussion.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }}>{discussion.author[0]}</Avatar>
                <Typography variant="body2" color="text.secondary">
                  {discussion.author} ({discussion.authorRole}) · {new Date(discussion.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Typography variant="body2" paragraph>
                {discussion.content}
              </Typography>

              {discussion.replies.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Replies ({discussion.replies.length})
                  </Typography>
                  {discussion.replies.map(reply => (
                    <Box key={reply.id} sx={{ ml: 2, mt: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>{reply.author[0]}</Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {reply.author} ({reply.authorRole}) · {new Date(reply.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
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