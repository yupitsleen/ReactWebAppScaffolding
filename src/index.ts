// Main application
export { default as App } from './App'

// Core configuration and data
export * from './data/configurableData'
export * from './data/sampleData'

// Type definitions
export * from './types/portal'
export * from './types/app'

// Reusable components
export * from './components'

// Custom hooks
export * from './hooks'

// Context providers
export * from './context'

// Services and utilities
export * from './services'
export * from './utils/helpers'
export * from './utils/colorManager'

// Theme
export { portalTheme, createPortalTheme } from './theme/portalTheme'