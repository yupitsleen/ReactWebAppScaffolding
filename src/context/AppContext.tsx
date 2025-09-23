import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { AppState, AppContextValue } from '../types/app'
import type { AuthUser } from '../types/portal'
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/helpers'

const getInitialState = (): AppState => {
  return {
    user: getFromStorage<AuthUser | null>('user', null),
    theme: getFromStorage<'light' | 'dark'>('theme', 'light'),
    loading: false,
  }
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>(getInitialState)

  // Memoize callbacks to prevent recreation on every render
  const setUser = useCallback((user: AuthUser | null) => {
    setState(prev => ({ ...prev, user }))
    if (user) {
      setToStorage('user', user)
    } else {
      removeFromStorage('user')
    }
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }))
    setToStorage('theme', theme)
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<AppContextValue>(() => ({
    state,
    setUser,
    setTheme,
    setLoading,
  }), [state, setUser, setTheme, setLoading])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}