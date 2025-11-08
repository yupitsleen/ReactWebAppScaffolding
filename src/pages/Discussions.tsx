import { memo, useState } from 'react'
import { Typography, Card, CardContent, Chip, Box, Avatar, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { discussions as initialDiscussions } from '../data/sampleData'
import PageLayout from '../components/PageLayout'
import { usePageLoading } from '../hooks/usePageLoading'
import { useDiscussionReplies } from '../hooks/useDiscussionReplies'
import type { Discussion, Reply } from '../types/portal'

const Discussions = memo(() => {
  const [loading] = usePageLoading(false)
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions)
  const replyManager = useDiscussionReplies()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    priority: 'normal' as 'normal' | 'urgent'
  })

  const handleToggleResolved = (discussionId: string, currentStatus: boolean) => {
    setDiscussions(prev =>
      prev.map(discussion =>
        discussion.id === discussionId
          ? { ...discussion, resolved: !currentStatus }
          : discussion
      )
    )
  }

  const handleAddReply = (discussionId: string) => {
    const text = replyManager.getReplyText(discussionId).trim()
    if (!text) return

    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      author: 'Current User',
      authorRole: 'Client',
      content: text,
      createdAt: new Date().toISOString()
    }

    setDiscussions(prev =>
      prev.map(discussion =>
        discussion.id === discussionId
          ? { ...discussion, replies: [...discussion.replies, newReply] }
          : discussion
      )
    )

    replyManager.clearReply(discussionId)
  }

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    const newDiscussion: Discussion = {
      id: `discussion-${Date.now()}`,
      title: newPost.title,
      author: 'Current User',
      authorRole: 'Client',
      content: newPost.content,
      createdAt: new Date().toISOString(),
      priority: newPost.priority,
      resolved: false,
      replies: []
    }

    setDiscussions(prev => [newDiscussion, ...prev])
    setNewPost({ title: '', content: '', priority: 'normal' })
    setCreateDialogOpen(false)
  }

  return (
    <PageLayout
      loading={loading}
      action={
        <Button
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create New Post
        </Button>
      }
    >
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
                  <Button
                    size="small"
                    variant="outlined"
                    color={discussion.resolved ? 'warning' : 'success'}
                    onClick={() => handleToggleResolved(discussion.id, discussion.resolved)}
                  >
                    {discussion.resolved ? 'Reopen' : 'Resolve'}
                  </Button>
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

              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                {!replyManager.isReplyBoxVisible(discussion.id) ? (
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => replyManager.showReply(discussion.id)}
                  >
                    Reply
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      label="Reply"
                      placeholder="Write your reply..."
                      value={replyManager.getReplyText(discussion.id)}
                      onChange={(e) => replyManager.updateReplyText(discussion.id, e.target.value)}
                      size="small"
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        onClick={() => replyManager.clearReply(discussion.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleAddReply(discussion.id)}
                        disabled={!replyManager.getReplyText(discussion.id).trim()}
                      >
                        Post Reply
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Discussion</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Content"
              multiline
              rows={6}
              fullWidth
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Priority
              </Typography>
              <ToggleButtonGroup
                value={newPost.priority}
                exclusive
                onChange={(_, value) => value && setNewPost(prev => ({ ...prev, priority: value as 'normal' | 'urgent' }))}
                aria-label="post priority"
                size="small"
              >
                <ToggleButton value="normal" aria-label="normal priority">
                  Normal
                </ToggleButton>
                <ToggleButton value="urgent" aria-label="urgent priority">
                  Urgent
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreatePost}
            disabled={!newPost.title.trim() || !newPost.content.trim()}
          >
            Create Post
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  )
})

export default Discussions