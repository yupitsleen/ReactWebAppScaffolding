import type { ReactNode } from 'react'
import { UserProvider } from './UserContext'
import { ThemeProvider } from './ThemeContext'
import { DataProvider } from './DataContext'

interface ContextProviderProps {
  children: ReactNode
}

/**
 * Combined provider that wraps all context providers in the correct order.
 * Order matters: UserProvider -> ThemeProvider -> DataProvider
 * This ensures dependencies are available when needed.
 */
export function ContextProvider({ children }: ContextProviderProps) {
  return (
    <UserProvider>
      <ThemeProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

// Export all hooks for convenience
export { useUser } from './UserContext'
export { useTheme } from './ThemeContext'
export { useData } from './DataContext'