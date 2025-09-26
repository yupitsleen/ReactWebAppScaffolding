import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { getFromStorage, setToStorage } from '../utils/helpers'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => getFromStorage<Theme>('theme', 'light')
  )

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    setToStorage('theme', newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [theme, setTheme])

  const isDarkMode = useMemo(() => theme === 'dark', [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDarkMode,
  }), [theme, setTheme, toggleTheme, isDarkMode])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}