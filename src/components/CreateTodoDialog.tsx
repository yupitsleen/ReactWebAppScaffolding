import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material'
import { useAppContext } from '../context/AppContext'
import type { TodoItem } from '../types/portal'

interface CreateTodoDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: (newTodo: TodoItem) => void
}

type TodoFormData = Omit<TodoItem, 'id' | 'createdAt' | 'createdBy'>

const CreateTodoDialog = ({ open, onClose, onSuccess }: CreateTodoDialogProps) => {
  const { createTodo, state } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default: 1 week from now
    category: 'General',
  })

  const handleInputChange = (field: keyof TodoFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    setError('') // Clear error when user types
  }

  const handleSelectChange = (field: keyof TodoFormData) => (
    event: { target: { value: string } }
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    if (!formData.assignedTo.trim()) {
      setError('Assigned to is required')
      return
    }

    setLoading(true)

    try {
      const todoData: Omit<TodoItem, 'id'> = {
        ...formData,
        createdBy: state.user?.name || 'Current User',
        createdAt: new Date().toISOString(),
      }

      const newTodo = await createTodo(todoData)

      // Reset form
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'General',
      })

      onSuccess?.(newTodo)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError('')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange('title')}
            disabled={loading}
          />

          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange('description')}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="assignedTo"
            label="Assigned To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange('assignedTo')}
            disabled={loading}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                id="priority"
                value={formData.priority}
                label="Priority"
                onChange={handleSelectChange('priority')}
                disabled={loading}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={formData.status}
                label="Status"
                onChange={handleSelectChange('status')}
                disabled={loading}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="dueDate"
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange('dueDate')}
              disabled={loading}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              id="category"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange('category')}
              disabled={loading}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTodoDialog