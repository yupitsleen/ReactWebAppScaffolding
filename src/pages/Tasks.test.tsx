import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { NotificationProvider } from '../context/NotificationContext'
import Tasks from './Tasks'
import * as helpers from '../utils/helpers'

// Mock the context and hooks
vi.mock('../context/ContextProvider', () => ({
  useData: () => ({
    todos: [
      {
        id: '1',
        title: 'Test Task 1',
        description: 'Description 1',
        assignedTo: 'User 1',
        priority: 'high',
        status: 'pending',
        dueDate: '2025-10-10',
        category: 'Test',
        createdBy: 'Test User',
        createdAt: '2025-10-01'
      },
      {
        id: '2',
        title: 'Test Task 2',
        description: 'Description 2',
        assignedTo: 'User 2',
        priority: 'medium',
        status: 'completed',
        dueDate: '2025-10-15',
        category: 'Test',
        createdBy: 'Test User',
        createdAt: '2025-10-02'
      }
    ],
    updateTodoStatus: vi.fn()
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

vi.mock('../hooks/usePageLoading', () => ({
  usePageLoading: () => [false]
}))

vi.mock('../context/GenericDataContext', () => ({
  useGenericData: () => ({
    getEntities: vi.fn(() => []),
    getLoading: vi.fn(() => false),
    createEntity: vi.fn(),
    updateEntity: vi.fn(),
    deleteEntity: vi.fn(),
    refreshEntities: vi.fn()
  })
}))

// Spy on localStorage helpers
const getFromStorageSpy = vi.spyOn(helpers, 'getFromStorage')
const setToStorageSpy = vi.spyOn(helpers, 'setToStorage')

describe('Tasks Page - State Persistence', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes hideCompleted from localStorage', () => {
    getFromStorageSpy.mockReturnValue(true)

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Tasks />
        </MemoryRouter>
      </NotificationProvider>
    )

    expect(getFromStorageSpy).toHaveBeenCalledWith('tasks_hideCompleted', false)
    expect(screen.getByText('Show Completed')).toBeInTheDocument()
  })

  it('saves hideCompleted to localStorage when toggled', async () => {
    getFromStorageSpy.mockReturnValue(false)

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Tasks />
        </MemoryRouter>
      </NotificationProvider>
    )

    const filterButton = screen.getByText('Hide Completed')
    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(setToStorageSpy).toHaveBeenCalledWith('tasks_hideCompleted', true)
    })
  })

  it('filters out completed tasks when hideCompleted is true', () => {
    getFromStorageSpy.mockReturnValue(true)

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Tasks />
        </MemoryRouter>
      </NotificationProvider>
    )

    // Should show only pending task
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    // Should NOT show completed task
    expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument()
  })

  it('shows all tasks when hideCompleted is false', () => {
    getFromStorageSpy.mockReturnValue(false)

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Tasks />
        </MemoryRouter>
      </NotificationProvider>
    )

    // Should show both tasks
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })

  it('toggles filter state and updates display', async () => {
    getFromStorageSpy.mockReturnValue(false)

    render(
      <NotificationProvider>
        <MemoryRouter initialEntries={['/tasks']}>
          <Tasks />
        </MemoryRouter>
      </NotificationProvider>
    )

    // Initially shows both tasks
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()

    // Click to hide completed
    const filterButton = screen.getByText('Hide Completed')
    fireEvent.click(filterButton)

    await waitFor(() => {
      // Button text changes
      expect(screen.getByText('Show Completed')).toBeInTheDocument()
      // Completed task is hidden
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument()
      // Pending task still visible
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    })
  })
})
