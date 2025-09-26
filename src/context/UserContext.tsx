import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '../types/portal'
import { getFromStorage, setToStorage, removeFromStorage } from '../utils/helpers'

interface UserContextValue {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
  isAuthenticated: boolean
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUserState] = useState<AuthUser | null>(
    () => getFromStorage<AuthUser | null>('user', null)
  )

  const setUser = useCallback((newUser: AuthUser | null) => {
    setUserState(newUser)
    if (newUser) {
      setToStorage('user', newUser)
    } else {
      removeFromStorage('user')
    }
  }, [])

  const clearUser = useCallback(() => {
    setUserState(null)
    removeFromStorage('user')
  }, [])

  const isAuthenticated = useMemo(() => {
    return user !== null && user.isAuthenticated === true
  }, [user])

  const value = useMemo<UserContextValue>(() => ({
    user,
    setUser,
    clearUser,
    isAuthenticated,
  }), [user, setUser, clearUser, isAuthenticated])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}