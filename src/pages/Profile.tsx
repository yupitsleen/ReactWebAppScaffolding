import { useState, useEffect } from 'react'
import { Container, Paper, TextField, Button, Typography, Box, Alert, Avatar, Divider } from '@mui/material'
import { useUser } from '../context/ContextProvider'
import type { AuthUser } from '../services/auth'

function Profile() {
  const { user } = useUser()
  const [formData, setFormData] = useState<Partial<AuthUser>>({
    name: '',
    email: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      })
    }
  }, [user])

  const handleInputChange = (field: keyof AuthUser) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // TODO: Implement profile update when backend is ready
      throw new Error('Profile update not yet implemented - backend API required')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setError('')
    setMessage('')

    try {
      // TODO: Implement password change when backend is ready
      throw new Error('Password change not yet implemented - backend API required')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed')
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setError('')
    setMessage('')

    try {
      // TODO: Implement account deletion when backend is ready
      throw new Error('Account deletion not yet implemented - backend API required')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account deletion failed')
    }
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    )
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {user.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange('name')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange('email')}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom>
            Security
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handlePasswordChange}
              sx={{ mr: 2, mb: 2 }}
            >
              Change Password
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom color="error">
            Danger Zone
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
              This action cannot be undone and will permanently delete your account and all associated data.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Profile