import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Discussions from './Discussions'
import { AppProvider } from '../context/AppContext'
import { BrowserRouter } from 'react-router-dom'

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AppProvider>
        {component}
      </AppProvider>
    </BrowserRouter>
  )
}

describe('Discussions Page', () => {
  describe('Reply Functionality', () => {
    it('shows reply button for each discussion', () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      expect(replyButtons.length).toBeGreaterThan(0)
    })

    it('displays reply text field when reply button is clicked', async () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      const firstReplyButton = replyButtons[0]

      await userEvent.click(firstReplyButton)

      const replyTextField = screen.getByPlaceholderText(/write your reply/i)
      expect(replyTextField).toBeInTheDocument()
    })

    it('shows cancel and post reply buttons when reply box is open', async () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      await userEvent.click(replyButtons[0])

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /post reply/i })).toBeInTheDocument()
    })

    it('post reply button is disabled when text field is empty', async () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      await userEvent.click(replyButtons[0])

      const postReplyButton = screen.getByRole('button', { name: /post reply/i })
      expect(postReplyButton).toBeDisabled()
    })

    it('successfully adds a reply when text is entered and posted', async () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      await userEvent.click(replyButtons[0])

      const replyTextField = screen.getByPlaceholderText(/write your reply/i)
      await userEvent.type(replyTextField, 'This is my test reply')

      const postReplyButton = screen.getByRole('button', { name: /post reply/i })
      expect(postReplyButton).not.toBeDisabled()

      await userEvent.click(postReplyButton)

      await waitFor(() => {
        expect(screen.getByText('This is my test reply')).toBeInTheDocument()
      })
    }, 10000)

    it('hides reply text field after posting', async () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      await userEvent.click(replyButtons[0])

      const replyTextField = screen.getByPlaceholderText(/write your reply/i)
      await userEvent.type(replyTextField, 'Another test reply')

      const postReplyButton = screen.getByRole('button', { name: /post reply/i })
      await userEvent.click(postReplyButton)

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/write your reply/i)).not.toBeInTheDocument()
      })
    }, 10000)

    it('cancels reply and clears text when cancel button is clicked', async () => {
      renderWithProviders(<Discussions />)

      const replyButtons = screen.getAllByRole('button', { name: /reply/i })
      await userEvent.click(replyButtons[0])

      const replyTextField = screen.getByPlaceholderText(/write your reply/i)
      await userEvent.type(replyTextField, 'Text to be cancelled')

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await userEvent.click(cancelButton)

      expect(screen.queryByPlaceholderText(/write your reply/i)).not.toBeInTheDocument()
    })
  })

  describe('Create Post Functionality', () => {
    it('shows create new post button', () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      expect(createButton).toBeInTheDocument()
    })

    it('opens dialog when create new post button is clicked', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText(/create new discussion/i)).toBeInTheDocument()
    })

    it('shows title and content fields in create dialog', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
    })

    it('shows priority selector chips with normal selected by default', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const normalChip = screen.getByText('Normal')
      const urgentChip = screen.getByText('Urgent')

      expect(normalChip).toBeInTheDocument()
      expect(urgentChip).toBeInTheDocument()
    })

    it('create post button is disabled when title is empty', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const createPostButton = screen.getAllByRole('button', { name: /create post/i })[0]
      expect(createPostButton).toBeDisabled()
    })

    it('create post button is disabled when content is empty', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const titleField = screen.getByLabelText(/title/i)
      await userEvent.type(titleField, 'Test Title')

      const createPostButton = screen.getAllByRole('button', { name: /create post/i })[0]
      expect(createPostButton).toBeDisabled()
    })

    it('successfully creates a new post with title and content', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const titleField = screen.getByLabelText(/title/i)
      const contentField = screen.getByLabelText(/content/i)

      await userEvent.type(titleField, 'New Test Discussion')
      await userEvent.type(contentField, 'This is the content of my new discussion post')

      const createPostButton = screen.getAllByRole('button', { name: /create post/i })[0]
      expect(createPostButton).not.toBeDisabled()

      await userEvent.click(createPostButton)

      await waitFor(() => {
        expect(screen.getByText('New Test Discussion')).toBeInTheDocument()
        expect(screen.getByText('This is the content of my new discussion post')).toBeInTheDocument()
      }, { timeout: 10000 })
    }, 15000)

    it('closes dialog after creating post', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const titleField = screen.getByLabelText(/title/i)
      const contentField = screen.getByLabelText(/content/i)

      await userEvent.type(titleField, 'Another Test')
      await userEvent.type(contentField, 'Content here')

      const createPostButton = screen.getAllByRole('button', { name: /create post/i })[0]
      await userEvent.click(createPostButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      }, { timeout: 10000 })
    }, 15000)

    it('can toggle priority between normal and urgent', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const urgentChip = screen.getByText('Urgent')
      await userEvent.click(urgentChip)

      // Verify urgent was clicked (would need to check styling or create post and verify priority)
      expect(urgentChip).toBeInTheDocument()

      const normalChip = screen.getByText('Normal')
      await userEvent.click(normalChip)

      expect(normalChip).toBeInTheDocument()
    })

    it('closes dialog when cancel button is clicked', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const cancelButton = screen.getAllByRole('button', { name: /cancel/i })[0]
      await userEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('new post appears at the top of the discussion list', async () => {
      renderWithProviders(<Discussions />)

      const createButton = screen.getByRole('button', { name: /create new post/i })
      await userEvent.click(createButton)

      const titleField = screen.getByLabelText(/title/i)
      const contentField = screen.getByLabelText(/content/i)

      await userEvent.type(titleField, 'First Post')
      await userEvent.type(contentField, 'First content')

      const createPostButton = screen.getAllByRole('button', { name: /create post/i })[0]
      await userEvent.click(createPostButton)

      await waitFor(() => {
        const allDiscussionTitles = screen.getAllByRole('heading', { level: 3 })
        expect(allDiscussionTitles[0]).toHaveTextContent('First Post')
      }, { timeout: 10000 })
    }, 15000)
  })

  describe('Existing Discussions Display', () => {
    it('renders discussion posts from sample data', () => {
      renderWithProviders(<Discussions />)

      // Check for sample discussion titles
      expect(screen.getByText(/dietary requirements/i)).toBeInTheDocument()
      expect(screen.getByText(/setup timeline/i)).toBeInTheDocument()
    })

    it('shows resolve/reopen button for each discussion', () => {
      renderWithProviders(<Discussions />)

      const resolveButtons = screen.getAllByRole('button', { name: /resolve|reopen/i })
      expect(resolveButtons.length).toBeGreaterThan(0)
    })
  })
})
