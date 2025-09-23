import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from '../theme/portalTheme'
import { AppProvider } from '../context/AppContext'
import { MockProvider } from '../context/MockContext'
import Login from './Login'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockTheme = {
  primaryColor: '#312E81',
  secondaryColor: '#F59E0B',
  mode: 'light' as const,
  borderRadius: 0,
  fontFamily: '"Inter", sans-serif',
  iconMappings: {}
}

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={createPortalTheme(mockTheme)}>
      <CssBaseline />
      <MockProvider forceMock={true}>
        <AppProvider>
          {children}
        </AppProvider>
      </MockProvider>
    </ThemeProvider>
  </BrowserRouter>
)

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form elements', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows validation error for empty fields', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)

    // Form should not submit (no navigation should occur)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows error for invalid credentials', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Fill in invalid credentials
    await user.type(screen.getByLabelText(/email address/i), 'invalid@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')

    // Submit form
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('successfully logs in with valid credentials', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Fill in valid credentials
    await user.type(screen.getByLabelText(/email address/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    // Wait for navigation to home page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('shows loading state during login', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'customer@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /^sign in$/i })
    await user.click(submitButton)

    // Should show loading state briefly
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument()
  })

  it('navigates to register page when sign up is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    const signUpButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(signUpButton)

    expect(mockNavigate).toHaveBeenCalledWith('/register')
  })

  it('tests login with vendor user type', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'vendor@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('tests login with service provider user type', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'service@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('tests login with admin user type', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    )

    // Fill in credentials
    await user.type(screen.getByLabelText(/email address/i), 'admin@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')

    // Submit form
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})