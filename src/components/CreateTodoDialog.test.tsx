import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { portalTheme } from '../theme/portalTheme'
import CreateTodoDialog from './CreateTodoDialog'
import type { TodoItem } from '../types/portal'

const mockCreateTodo = vi.fn()
const mockOnClose = vi.fn()
const mockOnSuccess = vi.fn()

vi.mock('../context/ContextProvider', () => ({
  useData: () => ({
    createTodo: mockCreateTodo
  }),
  useUser: () => ({
    user: {
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      role: 'Admin',
      userType: 'Admin'
    }
  })
}))

const renderDialog = (open = true) => {
  return render(
    <ThemeProvider theme={portalTheme}>
      <CreateTodoDialog
        open={open}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    </ThemeProvider>
  )
}

describe('CreateTodoDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields before submission', async () => {
    renderDialog()

    const createButton = screen.getByText('Create Task')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })

    expect(mockCreateTodo).not.toHaveBeenCalled()
  })

  it('validates assignedTo field', async () => {
    renderDialog()

    // Fill only title
    const titleInput = screen.getByLabelText(/Task Title/i)
    fireEvent.change(titleInput, { target: { value: 'Test Task' } })

    const createButton = screen.getByText('Create Task')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Assigned to is required')).toBeInTheDocument()
    })

    expect(mockCreateTodo).not.toHaveBeenCalled()
  })

  it('successfully creates todo with valid data', async () => {
    const newTodo: TodoItem = {
      id: 'new-1',
      title: 'New Task',
      description: 'Task description',
      assignedTo: 'John Doe',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-10-10',
      category: 'Work',
      createdBy: 'Test User',
      createdAt: new Date().toISOString()
    }

    mockCreateTodo.mockResolvedValue(newTodo)

    renderDialog()

    // Fill form
    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'New Task' }
    })
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: 'Task description' }
    })
    fireEvent.change(screen.getByLabelText(/Assigned To/i), {
      target: { value: 'John Doe' }
    })

    // Submit
    const createButton = screen.getByText('Create Task')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          description: 'Task description',
          assignedTo: 'John Doe',
          createdBy: 'Test User'
        })
      )
    })

    expect(mockOnSuccess).toHaveBeenCalledWith(newTodo)
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('displays error message when creation fails', async () => {
    mockCreateTodo.mockRejectedValue(new Error('Network error'))

    renderDialog()

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'Test Task' }
    })
    fireEvent.change(screen.getByLabelText(/Assigned To/i), {
      target: { value: 'John Doe' }
    })

    // Submit
    const createButton = screen.getByText('Create Task')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('clears error when user starts typing', async () => {
    renderDialog()

    // Trigger validation error
    const createButton = screen.getByText('Create Task')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })

    // Start typing
    const titleInput = screen.getByLabelText(/Task Title/i)
    fireEvent.change(titleInput, { target: { value: 'T' } })

    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument()
    })
  })

  it('disables form during submission', async () => {
    let resolvePromise: () => void
    const promise = new Promise<TodoItem>((resolve) => {
      resolvePromise = () => resolve({
        id: 'new-1',
        title: 'Test',
        assignedTo: 'John',
        priority: 'medium',
        status: 'pending',
        category: 'Work',
        createdBy: 'Test User',
        createdAt: new Date().toISOString()
      })
    })

    mockCreateTodo.mockReturnValue(promise)

    renderDialog()

    // Fill form
    fireEvent.change(screen.getByLabelText(/Task Title/i), {
      target: { value: 'Test' }
    })
    fireEvent.change(screen.getByLabelText(/Assigned To/i), {
      target: { value: 'John' }
    })

    // Submit
    const createButton = screen.getByText('Create Task')
    fireEvent.click(createButton)

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument()
    })

    const titleInput = screen.getByLabelText(/Task Title/i)
    expect(titleInput).toBeDisabled()

    // Resolve the promise to allow cleanup
    resolvePromise!()
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})
