/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from 'react'
import type { AuthUser } from '../types/portal'
import type { AuthTokens, LoginCredentials, RegisterData } from '../services/auth'
import { authService } from '../services/auth'
import { mockAuthUsers } from '../data/sampleData'

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
    mockAuthUsers.push({
      ...user,
      password: data.password
    })

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

// Context
interface MockContextType {
  authService: MockAuthService | typeof authService
  isMockMode: boolean
}

const MockContext = createContext<MockContextType | undefined>(undefined)

// Provider
interface MockProviderProps {
  children: ReactNode
  forceMock?: boolean
}

export const MockProvider = ({ children, forceMock }: MockProviderProps) => {
  const isMockMode = forceMock ?? (
    import.meta.env.VITE_USE_MOCK === 'true' ||
    import.meta.env.NODE_ENV === 'development' ||
    import.meta.env.DEV === true
  )

  const selectedAuthService = isMockMode ? new MockAuthService() : authService

  return (
    <MockContext.Provider value={{ authService: selectedAuthService, isMockMode }}>
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