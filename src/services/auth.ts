import { env } from '../utils/env'
import { apiClient } from './api'
import type { AuthUser, UserType } from '../types/portal'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  userType: UserType
  role?: string
  phone?: string
}

class AuthService {
  private readonly TOKEN_KEY = 'auth_tokens'
  private readonly USER_KEY = 'auth_user'

  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    // TODO: Implement actual authentication when backend is ready
    console.log('Login attempt for:', credentials.email)
    throw new Error('Authentication not yet implemented - backend API required')
  }

  async register(data: RegisterData): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    // TODO: Implement actual registration when backend is ready
    console.log('Registration attempt for:', data.email)
    throw new Error('Registration not yet implemented - backend API required')
  }

  async loginWithAzure(): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    // TODO: Implement Azure AD authentication
    if (!env.AZURE_CLIENT_ID) {
      throw new Error('Azure authentication not configured')
    }
    throw new Error('Azure authentication not yet implemented')
  }

  async logout(): Promise<void> {
    this.clearTokens()
    this.clearUser()
    apiClient.clearAuthToken()
  }

  async refreshToken(): Promise<AuthTokens> {
    const tokens = this.getTokens()
    if (!tokens?.refreshToken) {
      throw new Error('No refresh token available')
    }
    // TODO: Implement token refresh when backend is ready
    throw new Error('Token refresh not yet implemented')
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
    const expirationTime = tokens.expiresIn * 1000
    return now < expirationTime
  }

  private _setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens))
    apiClient.setAuthToken(tokens.accessToken)
  }

  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  private _setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private clearUser(): void {
    localStorage.removeItem(this.USER_KEY)
  }
}

export const authService = new AuthService()
export default authService