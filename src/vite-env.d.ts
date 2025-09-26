/// <reference types="vite/client" />

declare global {
  interface Window {
    __APP_DEBUG__?: {
      clearPersistedData?: () => void
      setThemeColor?: (colorName: string, colorValue: string) => void
      applyColorPreset?: (preset: 'dark-purple' | 'blue' | 'green' | 'red') => void
      getThemeColor?: (colorName: string) => string
      [key: string]: unknown
    }
  }
}
