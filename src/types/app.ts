import type { AuthUser } from './portal'

export interface AppState {
  user: AuthUser | null
  theme: 'light' | 'dark'
  loading: boolean
}

export interface AppContextValue {
  state: AppState
  setUser: (user: AuthUser | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
}