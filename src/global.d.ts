// Global type declarations

interface Window {
  __APP_DEBUG__?: {
    contextState?: unknown
    dataState?: unknown
    colorManager?: unknown
    clearPersistedData?: () => void
    setThemeColor?: (colorName: string, value: string) => void
    applyColorPreset?: (preset: string) => void
    getThemeColor?: (colorName: string) => string | undefined
  }
}
