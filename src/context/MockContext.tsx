/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { AuthUser } from '../types/portal'
import type { AuthTokens, LoginCredentials, RegisterData } from '../services/auth'
import { authService } from '../services/auth'
import { mockAuthUsers } from '../data/sampleData'
import { useNotifications } from './NotificationContext'

// Mock auth service that overrides the real one
class MockAuthService {
  private readonly TOKEN_KEY = 'auth_tokens'
  private readonly USER_KEY = 'auth_user'

  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const mockUser = mockAuthUsers.find(
      user => user.email === credentials.email && user.password === credentials.password
    )

    if (!mockUser) {
      throw new Error('Invalid email or password')
    }

    const tokens: AuthTokens = {
      accessToken: `mock_token_${mockUser.id}_${Date.now()}`,
      refreshToken: `mock_refresh_${mockUser.id}_${Date.now()}`,
      expiresIn: Date.now() + (24 * 60 * 60 * 1000)
    }

    const user: AuthUser = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      userType: mockUser.userType,
      phone: mockUser.phone,
      isAuthenticated: true,
      token: tokens.accessToken
    }

    // Store tokens and user directly
    this.setTokens(tokens)
    this.setUser(user)

    return { user, tokens }
  }

  async register(data: RegisterData): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const existingUser = mockAuthUsers.find(user => user.email === data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const newUserId = `auth-${Date.now()}`

    const tokens: AuthTokens = {
      accessToken: `mock_token_${newUserId}_${Date.now()}`,
      refreshToken: `mock_refresh_${newUserId}_${Date.now()}`,
      expiresIn: Date.now() + (24 * 60 * 60 * 1000)
    }

    const user: AuthUser = {
      id: newUserId,
      name: data.name,
      email: data.email,
      role: data.role || `${data.userType} User`,
      userType: data.userType,
      phone: data.phone,
      isAuthenticated: true,
      token: tokens.accessToken
    }

    // Add to mock database
    const mockUser = {
      id: newUserId,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || `${data.userType} User`,
      userType: data.userType,
      phone: data.phone || ''
    }
    mockAuthUsers.push(mockUser as typeof mockAuthUsers[0])

    // Store tokens and user directly
    this.setTokens(tokens)
    this.setUser(user)

    return { user, tokens }
  }

  async logout() {
    this.clearTokens()
    this.clearUser()
  }

  getCurrentUser(): AuthUser | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    return userJson ? JSON.parse(userJson) : null
  }

  getTokens(): AuthTokens | null {
    const tokensJson = localStorage.getItem(this.TOKEN_KEY)
    return tokensJson ? JSON.parse(tokensJson) : null
  }

  isAuthenticated(): boolean {
    const tokens = this.getTokens()
    if (!tokens) return false

    const now = Date.now()
    const expirationTime = tokens.expiresIn
    return now < expirationTime
  }

  async refreshToken() {
    return authService.refreshToken()
  }

  async loginWithAzure() {
    return authService.loginWithAzure()
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens))
  }

  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  private setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private clearUser(): void {
    localStorage.removeItem(this.USER_KEY)
  }
}

// Mock notification service for demo functionality
class MockNotificationService {
  private addNotification: ((notification: { type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; autoHide?: boolean }) => void) | null = null

  setNotificationHandler(handler: (notification: { type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string; autoHide?: boolean }) => void) {
    this.addNotification = handler
  }

  // Demo notification triggers
  triggerTaskCompleted(taskName: string = 'Sample Task') {
    this.addNotification?.({
      type: 'success',
      title: 'Task Completed!',
      message: `You have successfully completed "${taskName}"`,
      autoHide: true
    })
  }

  triggerNewMessage(from: string = 'John Doe') {
    this.addNotification?.({
      type: 'info',
      title: 'New Message',
      message: `You have received a new message from ${from}`,
      autoHide: false
    })
  }

  triggerTaskDueSoon(taskName: string = 'Sample Task', timeLeft: string = '2 hours') {
    this.addNotification?.({
      type: 'warning',
      title: 'Task Due Soon',
      message: `Your task "${taskName}" is due in ${timeLeft}`,
      autoHide: false
    })
  }

  triggerUploadError() {
    this.addNotification?.({
      type: 'error',
      title: 'Upload Failed',
      message: 'Could not upload document. Please check your connection and try again.',
      autoHide: false
    })
  }

  triggerRandomDemo() {
    const demos = [
      () => this.triggerTaskCompleted(),
      () => this.triggerNewMessage(),
      () => this.triggerTaskDueSoon(),
      () => this.triggerUploadError()
    ]
    const randomDemo = demos[Math.floor(Math.random() * demos.length)]
    randomDemo()
  }
}

// Context
interface MockContextType {
  authService: MockAuthService | typeof authService
  notificationService: MockNotificationService | null
  isMockMode: boolean
}

const MockContext = createContext<MockContextType | undefined>(undefined)

// Provider
interface MockProviderProps {
  children: ReactNode
  forceMock?: boolean
}

// Export this component to be used inside NotificationProvider
export const MockNotificationHandler = () => {
  const { notificationService } = useMockContext()
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (notificationService && addNotification) {
      notificationService.setNotificationHandler(addNotification)

      // Set up global console testing functions
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).mockNotifications = {
          success: (task?: string) => notificationService.triggerTaskCompleted(task),
          info: (from?: string) => notificationService.triggerNewMessage(from),
          warning: (task?: string, time?: string) => notificationService.triggerTaskDueSoon(task, time),
          error: () => notificationService.triggerUploadError(),
          random: () => notificationService.triggerRandomDemo(),
        }
      }
    }
  }, [notificationService, addNotification])

  return null
}

export const MockProvider = ({ children, forceMock }: MockProviderProps) => {
  const isMockMode = forceMock ?? (
    import.meta.env.VITE_USE_MOCK === 'true' ||
    import.meta.env.NODE_ENV === 'development' ||
    import.meta.env.DEV === true
  )

  const selectedAuthService = isMockMode ? new MockAuthService() : authService
  const mockNotificationService = isMockMode ? new MockNotificationService() : null

  return (
    <MockContext.Provider value={{
      authService: selectedAuthService,
      notificationService: mockNotificationService,
      isMockMode
    }}>
      {children}
    </MockContext.Provider>
  )
}

// Hooks
export const useMockContext = () => {
  const context = useContext(MockContext)
  if (context === undefined) {
    throw new Error('useMockContext must be used within a MockProvider')
  }
  return context
}

export const useAuthService = () => {
  const { authService } = useMockContext()
  return authService
}

export const useMockNotificationService = () => {
  const { notificationService, isMockMode } = useMockContext()
  if (!isMockMode || !notificationService) {
    return null
  }
  return notificationService
}

// Make mock notification service available globally for console testing (similar to colorManager)
if (typeof window !== 'undefined') {
  // This will be set up by the MockNotificationHandler when available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).mockNotifications = {
    success: () => console.log('Mock notifications not yet initialized'),
    info: () => console.log('Mock notifications not yet initialized'),
    warning: () => console.log('Mock notifications not yet initialized'),
    error: () => console.log('Mock notifications not yet initialized'),
    random: () => console.log('Mock notifications not yet initialized'),
  }
}