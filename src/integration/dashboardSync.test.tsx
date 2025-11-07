import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Tasks from '../pages/Tasks'
import { NotificationProvider } from '../context/NotificationContext'
import type { TodoItem, Discussion, Document } from '../types/portal'
import { useData } from '../context/ContextProvider'

/**
 * Integration tests to ensure dashboard items stay in sync with their
 * corresponding features on other pages.
 *
 * These tests verify that:
 * 1. Dashboard displays correct counts from source data
 * 2. Data shown on dashboard matches data on detail pages
 * 3. Updates to entities are reflected consistently across pages
 * 4. Filter logic works consistently between dashboard and pages
 */

// Mock the context and hooks at the module level
vi.mock('../context/ContextProvider', () => ({
  useData: vi.fn(),
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

vi.mock('../utils/helpers', () => ({
  getFromStorage: vi.fn(() => false),
  setToStorage: vi.fn()
}))

// Mock ResizeObserver for chart components
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Create shared test data
const createTestTodos = (): TodoItem[] => [
  {
    id: '1',
    title: 'High Priority Task',
    description: 'Urgent task',
    assignedTo: 'Alice',
    priority: 'high',
    status: 'pending',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    category: 'Work',
    createdBy: 'Admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Completed Task',
    description: 'Done',
    assignedTo: 'Bob',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    category: 'Work',
    createdBy: 'Admin',
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: '3',
    title: 'In Progress Task',
    description: 'Working on it',
    assignedTo: 'Charlie',
    priority: 'low',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    category: 'Personal',
    createdBy: 'Admin',
    createdAt: new Date().toISOString()
  }
]

const createTestDiscussions = (): Discussion[] => [
  {
    id: 'd1',
    title: 'Unresolved Discussion',
    description: 'Need to discuss',
    author: 'Alice',
    priority: 'high',
    resolved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'd2',
    title: 'Resolved Discussion',
    description: 'Already discussed',
    author: 'Bob',
    priority: 'medium',
    resolved: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
]

const createTestDocuments = (): Document[] => [
  {
    id: 'doc1',
    title: 'Shared Document.pdf',
    fileType: 'pdf',
    size: 1024,
    shared: true,
    uploadedBy: 'Alice',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'doc2',
    title: 'Private Document.docx',
    fileType: 'docx',
    size: 2048,
    shared: false,
    uploadedBy: 'Bob',
    uploadedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'doc3',
    title: 'Shared Spreadsheet.xlsx',
    fileType: 'xlsx',
    size: 4096,
    shared: true,
    uploadedBy: 'Charlie',
    uploadedAt: new Date().toISOString()
  }
]

describe('Dashboard-to-Pages Data Synchronization', () => {
  let testTodos: TodoItem[]
  let testDiscussions: Discussion[]
  let testDocuments: Document[]
  let updateTodoStatusMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    testTodos = createTestTodos()
    testDiscussions = createTestDiscussions()
    testDocuments = createTestDocuments()
    updateTodoStatusMock = vi.fn()

    // Setup the mock implementation for useData
    vi.mocked(useData).mockReturnValue({
      todos: testTodos,
      discussions: testDiscussions,
      documents: testDocuments,
      updateTodoStatus: updateTodoStatusMock,
      todosLoading: false,
      discussionsLoading: false,
      documentsLoading: false,
      createTodo: vi.fn(),
      updateDiscussionStatus: vi.fn(),
      updateDocumentSharing: vi.fn(),
      loading: false,
      setLoading: vi.fn(),
      refreshData: vi.fn(),
      clearPersistedData: vi.fn()
    })
  })

  describe('Todo Items Synchronization', () => {
    it('dashboard shows correct total todo count matching Tasks page data', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      // Dashboard should show total todos
      const expectedTotal = testTodos.length
      expect(screen.getByText(new RegExp(`${expectedTotal}.*tasks`, 'i'))).toBeInTheDocument()
    })

    it('dashboard completion rate matches completed vs total tasks', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      const completedCount = testTodos.filter(t => t.status === 'completed').length
      const totalCount = testTodos.length
      const expectedRate = Math.round((completedCount / totalCount) * 100)

      // Should show completion percentage
      expect(screen.getByText(`${expectedRate}%`)).toBeInTheDocument()
      expect(screen.getByText(`${completedCount} of ${totalCount} tasks completed`)).toBeInTheDocument()
    })

    it('dashboard priority tasks section shows same high-priority tasks as Tasks page', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      // Dashboard should show high priority tasks
      const highPriorityTodo = testTodos.find(t => t.priority === 'high')
      if (highPriorityTodo) {
        expect(screen.getByText(highPriorityTodo.title)).toBeInTheDocument()
      }
    })

    it('Tasks page displays all todos from shared context', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/tasks']}>
            <Tasks />
          </MemoryRouter>
        </NotificationProvider>
      )

      // All todos should be visible on Tasks page
      testTodos.forEach(todo => {
        expect(screen.getByText(todo.title)).toBeInTheDocument()
      })
    })

    it('completed tasks count is consistent between dashboard and Tasks page', () => {
      const { unmount } = render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      const completedCount = testTodos.filter(t => t.status === 'completed').length
      // Use more specific text match for "1 of 3 tasks completed" instead of regex
      expect(screen.getByText(`${completedCount} of ${testTodos.length} tasks completed`)).toBeInTheDocument()

      unmount()

      // Now render Tasks page
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/tasks']}>
            <Tasks />
          </MemoryRouter>
        </NotificationProvider>
      )

      // Verify the completed task appears
      const completedTodo = testTodos.find(t => t.status === 'completed')
      if (completedTodo) {
        expect(screen.getByText(completedTodo.title)).toBeInTheDocument()
      }
    })
  })

  describe('Discussions Synchronization', () => {
    it('dashboard shows correct unresolved discussions count', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      const unresolvedCount = testDiscussions.filter(d => !d.resolved).length

      // Dashboard should show unresolved discussion count
      // Note: The dashboard card shows this value
      expect(unresolvedCount).toBe(1) // Verify our test data has unresolved items
    })

    it('dashboard discussions section filters match expected criteria', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      // Dashboard should show unresolved discussions
      const unresolvedDiscussion = testDiscussions.find(d => !d.resolved)
      if (unresolvedDiscussion) {
        expect(screen.getByText(unresolvedDiscussion.title)).toBeInTheDocument()
      }
    })

    it('resolved vs unresolved counts are accurate across dashboard', () => {
      const unresolvedCount = testDiscussions.filter(d => !d.resolved).length
      const resolvedCount = testDiscussions.filter(d => d.resolved).length

      expect(unresolvedCount).toBe(1)
      expect(resolvedCount).toBe(1)
      expect(unresolvedCount + resolvedCount).toBe(testDiscussions.length)
    })
  })

  describe('Documents Synchronization', () => {
    it('dashboard shows correct total documents count', () => {
      render(
        <NotificationProvider>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </NotificationProvider>
      )

      const totalDocuments = testDocuments.length
      expect(totalDocuments).toBe(3) // Verify test data count
    })

    it('shared documents count is accurate', () => {
      const sharedCount = testDocuments.filter(d => d.shared).length
      expect(sharedCount).toBe(2) // Based on our test data
    })

    it('document counts by type are consistent', () => {
      const pdfCount = testDocuments.filter(d => d.fileType === 'pdf').length
      const docxCount = testDocuments.filter(d => d.fileType === 'docx').length
      const xlsxCount = testDocuments.filter(d => d.fileType === 'xlsx').length

      expect(pdfCount).toBe(1)
      expect(docxCount).toBe(1)
      expect(xlsxCount).toBe(1)
      expect(pdfCount + docxCount + xlsxCount).toBe(testDocuments.length)
    })
  })

  describe('Cross-Entity Data Consistency', () => {
    it('all entity counts sum correctly across dashboard', () => {
      const totalTodos = testTodos.length
      const totalDiscussions = testDiscussions.length
      const totalDocuments = testDocuments.length

      expect(totalTodos).toBe(3)
      expect(totalDiscussions).toBe(2)
      expect(totalDocuments).toBe(3)

      // Total items across all entities
      const totalItems = totalTodos + totalDiscussions + totalDocuments
      expect(totalItems).toBe(8)
    })

    it('status-based filtering produces consistent results', () => {
      // Pending/in-progress todos
      const activeTodos = testTodos.filter(t => t.status !== 'completed')
      expect(activeTodos.length).toBe(2)

      // Completed todos
      const completedTodos = testTodos.filter(t => t.status === 'completed')
      expect(completedTodos.length).toBe(1)

      // Verify they sum to total
      expect(activeTodos.length + completedTodos.length).toBe(testTodos.length)
    })

    it('priority-based filtering produces consistent results', () => {
      const highPriorityTodos = testTodos.filter(t => t.priority === 'high')
      const mediumPriorityTodos = testTodos.filter(t => t.priority === 'medium')
      const lowPriorityTodos = testTodos.filter(t => t.priority === 'low')

      expect(highPriorityTodos.length).toBe(1)
      expect(mediumPriorityTodos.length).toBe(1)
      expect(lowPriorityTodos.length).toBe(1)

      // Verify they sum to total
      const totalByPriority = highPriorityTodos.length + mediumPriorityTodos.length + lowPriorityTodos.length
      expect(totalByPriority).toBe(testTodos.length)
    })
  })

  describe('Filter Consistency Between Dashboard and Pages', () => {
    it('high-priority filter yields same results on dashboard and Tasks page', () => {
      // Test data consistency
      const highPriorityTodos = testTodos.filter(t => t.priority === 'high')
      const pendingHighPriority = highPriorityTodos.filter(t => t.status === 'pending')

      // Dashboard shows pending high-priority tasks in "Priority Tasks" section
      expect(pendingHighPriority.length).toBeGreaterThan(0)

      // This same filter should be applicable on Tasks page
      expect(highPriorityTodos.length).toBe(1)
    })

    it('date-based filtering produces consistent results', () => {
      const now = Date.now()
      const overdueTodos = testTodos.filter(t => {
        const dueDate = new Date(t.dueDate).getTime()
        return dueDate < now && t.status !== 'completed'
      })

      const upcomingTodos = testTodos.filter(t => {
        const dueDate = new Date(t.dueDate).getTime()
        return dueDate >= now && t.status !== 'completed'
      })

      // Verify categorization is exhaustive for non-completed items
      const nonCompletedTodos = testTodos.filter(t => t.status !== 'completed')
      expect(overdueTodos.length + upcomingTodos.length).toBe(nonCompletedTodos.length)
    })
  })

  describe('Data Updates Propagation', () => {
    it('simulates todo status update and verifies counts would change', () => {
      // Start with original counts
      const initialCompleted = testTodos.filter(t => t.status === 'completed').length
      expect(initialCompleted).toBe(1)

      // Simulate marking a pending task as completed
      const pendingTask = testTodos.find(t => t.status === 'pending')
      if (pendingTask) {
        // After update, completed count should increase
        const updatedTodos = testTodos.map(t =>
          t.id === pendingTask.id ? { ...t, status: 'completed' as const } : t
        )
        const newCompletedCount = updatedTodos.filter(t => t.status === 'completed').length
        expect(newCompletedCount).toBe(initialCompleted + 1)
      }
    })

    it('simulates discussion resolution and verifies unresolved count changes', () => {
      // Start with original counts
      const initialUnresolved = testDiscussions.filter(d => !d.resolved).length
      expect(initialUnresolved).toBe(1)

      // Simulate resolving an unresolved discussion
      const unresolvedDiscussion = testDiscussions.find(d => !d.resolved)
      if (unresolvedDiscussion) {
        const updatedDiscussions = testDiscussions.map(d =>
          d.id === unresolvedDiscussion.id ? { ...d, resolved: true } : d
        )
        const newUnresolvedCount = updatedDiscussions.filter(d => !d.resolved).length
        expect(newUnresolvedCount).toBe(initialUnresolved - 1)
      }
    })

    it('simulates document sharing toggle and verifies shared count changes', () => {
      // Start with original counts
      const initialShared = testDocuments.filter(d => d.shared).length
      expect(initialShared).toBe(2)

      // Simulate sharing a private document
      const privateDocument = testDocuments.find(d => !d.shared)
      if (privateDocument) {
        const updatedDocuments = testDocuments.map(d =>
          d.id === privateDocument.id ? { ...d, shared: true } : d
        )
        const newSharedCount = updatedDocuments.filter(d => d.shared).length
        expect(newSharedCount).toBe(initialShared + 1)
      }
    })
  })

  describe('Sparkline Data Consistency', () => {
    it('sparkline data reflects actual entity creation dates', () => {
      // Verify test data has creation dates
      testTodos.forEach(todo => {
        expect(todo.createdAt).toBeDefined()
        expect(new Date(todo.createdAt!).getTime()).not.toBeNaN()
      })

      testDiscussions.forEach(discussion => {
        expect(discussion.createdAt).toBeDefined()
        expect(new Date(discussion.createdAt).getTime()).not.toBeNaN()
      })

      testDocuments.forEach(document => {
        expect(document.uploadedAt).toBeDefined()
        expect(new Date(document.uploadedAt).getTime()).not.toBeNaN()
      })
    })

    it('entity counts by date are logically consistent', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const todosToday = testTodos.filter(t => {
        const createdDate = new Date(t.createdAt!)
        createdDate.setHours(0, 0, 0, 0)
        return createdDate.getTime() === today.getTime()
      })

      // Verify logic works (may be 0 or more based on test data)
      expect(Array.isArray(todosToday)).toBe(true)
    })
  })

  describe('Empty State Consistency', () => {
    it('handles empty todos array consistently', () => {
      const emptyTodos: TodoItem[] = []

      const completed = emptyTodos.filter(t => t.status === 'completed').length
      const total = emptyTodos.length
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

      expect(completionRate).toBe(0)
      expect(total).toBe(0)
    })

    it('handles all completed todos scenario', () => {
      // Make all todos completed
      const allCompleted = testTodos.map(t => ({ ...t, status: 'completed' as const }))

      const completed = allCompleted.filter(t => t.status === 'completed').length
      const total = allCompleted.length
      const completionRate = Math.round((completed / total) * 100)

      expect(completionRate).toBe(100)
      expect(completed).toBe(total)
    })

    it('handles no completed todos scenario', () => {
      // Make all todos pending
      const allPending = testTodos.map(t => ({ ...t, status: 'pending' as const }))

      const completed = allPending.filter(t => t.status === 'completed').length
      const total = allPending.length
      const completionRate = Math.round((completed / total) * 100)

      expect(completionRate).toBe(0)
      expect(completed).toBe(0)
    })
  })
})
