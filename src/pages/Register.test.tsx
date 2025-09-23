import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from '../theme/portalTheme'
import { AppProvider } from '../context/AppContext'
import { MockProvider } from '../context/MockContext'
import Register from './Register'

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

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form elements', () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    )

    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/user type/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows validation error for password mismatch', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    )

    // Fill form with mismatched passwords
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
    await user.type(screen.getByLabelText(/role/i), 'Test Role')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Should show error for password mismatch
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('successfully registers with valid data', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    )

    // Fill form with valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'newuser@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.type(screen.getByLabelText(/role/i), 'Test Role')

    // Submit form
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    // Wait for navigation to home page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  describe('Password Visibility Toggle', () => {
    it('toggles password visibility independently for both fields', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const passwordToggle = screen.getByLabelText(/toggle password visibility/i)
      const confirmPasswordToggle = screen.getByLabelText(/toggle confirm password visibility/i)

      // Initially both should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')

      // Toggle password field
      await user.click(passwordToggle)
      expect(passwordInput).toHaveAttribute('type', 'text')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password') // Should remain hidden

      // Toggle confirm password field
      await user.click(confirmPasswordToggle)
      expect(passwordInput).toHaveAttribute('type', 'text') // Should remain visible
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')

      // Toggle password field back
      await user.click(passwordToggle)
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('type', 'text') // Should remain visible
    })

    it('password toggle buttons are accessible and functional', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const passwordToggle = screen.getByLabelText(/toggle password visibility/i)
      const confirmPasswordToggle = screen.getByLabelText(/toggle confirm password visibility/i)
      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

      // Both buttons should be present and clickable
      expect(passwordToggle).toBeInTheDocument()
      expect(confirmPasswordToggle).toBeInTheDocument()
      expect(passwordToggle).toBeEnabled()
      expect(confirmPasswordToggle).toBeEnabled()

      // Test password toggle functionality
      expect(passwordInput).toHaveAttribute('type', 'password')
      await user.click(passwordToggle)
      expect(passwordInput).toHaveAttribute('type', 'text')

      // Test confirm password toggle functionality
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      await user.click(confirmPasswordToggle)
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')
    })

    it('maintains password values when toggling visibility', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const passwordToggle = screen.getByLabelText(/toggle password visibility/i)
      const confirmPasswordToggle = screen.getByLabelText(/toggle confirm password visibility/i)

      const password = 'mySecretPassword123'
      const confirmPassword = 'mySecretPassword123'

      // Type passwords
      await user.type(passwordInput, password)
      await user.type(confirmPasswordInput, confirmPassword)

      expect(passwordInput).toHaveValue(password)
      expect(confirmPasswordInput).toHaveValue(confirmPassword)

      // Toggle password visibility and verify values are maintained
      await user.click(passwordToggle)
      expect(passwordInput).toHaveValue(password)
      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(confirmPasswordToggle)
      expect(confirmPasswordInput).toHaveValue(confirmPassword)
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')

      // Toggle back and verify values are still maintained
      await user.click(passwordToggle)
      await user.click(confirmPasswordToggle)
      expect(passwordInput).toHaveValue(password)
      expect(confirmPasswordInput).toHaveValue(confirmPassword)
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    })

    it('allows form submission with passwords visible', async () => {
      const user = userEvent.setup()

      render(
        <TestWrapper>
          <Register />
        </TestWrapper>
      )

      const passwordInput = screen.getByLabelText(/^password$/i)
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      const passwordToggle = screen.getByLabelText(/toggle password visibility/i)
      const confirmPasswordToggle = screen.getByLabelText(/toggle confirm password visibility/i)

      // Fill form and make passwords visible
      await user.type(screen.getByLabelText(/name/i), 'Jane Doe')
      await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.type(screen.getByLabelText(/role/i), 'Test Role')

      // Make passwords visible
      await user.click(passwordToggle)
      await user.click(confirmPasswordToggle)

      // Submit form
      await user.click(screen.getByRole('button', { name: /sign up/i }))

      // Should successfully navigate
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    })
  })
})