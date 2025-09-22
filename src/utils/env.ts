export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,

  APP_NAME: import.meta.env.VITE_APP_NAME || 'Portal App',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',

  AZURE_CLIENT_ID: import.meta.env.VITE_AZURE_CLIENT_ID || '',
  AZURE_TENANT_ID: import.meta.env.VITE_AZURE_TENANT_ID || '',
  AZURE_REDIRECT_URI: import.meta.env.VITE_AZURE_REDIRECT_URI || '',

  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const

export type Environment = typeof env