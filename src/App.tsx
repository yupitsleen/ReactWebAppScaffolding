import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { Box, CircularProgress } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { AnimatePresence } from 'framer-motion'
import createPortalTheme from './theme/portalTheme'
import { appConfig } from './data/configurableData'
import { ContextProvider, useUser, useTheme } from './context/ContextProvider'
import { GenericDataProvider } from './context/GenericDataContext'
import { MockProvider, MockNotificationHandler } from './context/MockContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './layouts/Layout'
import PageTransition from './components/PageTransition'
import { ToastContainer } from './components/Toast'
import { KeyboardShortcutsDialog } from './components/KeyboardShortcutsDialog'
import { CommandPalette } from './components/CommandPalette'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './utils/colorManager'

// Lazy load route components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Tasks = lazy(() => import('./pages/Tasks'))
const Payments = lazy(() => import('./pages/Payments'))
const Documents = lazy(() => import('./pages/Documents'))
const Discussions = lazy(() => import('./pages/Discussions'))
const Table = lazy(() => import('./pages/Table'))
const Timeline = lazy(() => import('./pages/Timeline'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const MyAccount = lazy(() => import('./pages/MyAccount'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component (used by Suspense for lazy-loaded routes)
function PageLoadingFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
    </Box>
  )
}

// Component for authenticated users
function AuthenticatedApp() {
  const location = useLocation()
  const [shortcutsDialogOpen, setShortcutsDialogOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Enable keyboard shortcuts
  useKeyboardShortcuts({ enabled: true })

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      // Cmd/Ctrl+K for command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setCommandPaletteOpen(true)
        return
      }

      // "?" key to open shortcuts dialog (only when not in input field)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey && !isInputField) {
        event.preventDefault()
        setShortcutsDialogOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const pageComponents = {
    home: Home,
    tasks: Tasks,
    payments: Payments,
    documents: Documents,
    discussions: Discussions,
    table: Table,
    timeline: Timeline,
    contact: Contact
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {appConfig.navigation
            .filter(nav => nav.enabled)
            .map(nav => {
              const Component = pageComponents[nav.id as keyof typeof pageComponents]
              return Component ? (
                <Route key={nav.id} path={nav.path} element={<PageTransition><Suspense fallback={<PageLoadingFallback />}><Component /></Suspense></PageTransition>} />
              ) : null
            })}
          <Route path="/my-account" element={<PageTransition><Suspense fallback={<PageLoadingFallback />}><MyAccount /></Suspense></PageTransition>} />
          <Route path="*" element={<PageTransition><Suspense fallback={<PageLoadingFallback />}><NotFound /></Suspense></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <KeyboardShortcutsDialog
        open={shortcutsDialogOpen}
        onClose={() => setShortcutsDialogOpen(false)}
      />
    </Layout>
  )
}

// Component for unauthenticated users
function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/register" element={<Suspense fallback={<PageLoadingFallback />}><Register /></Suspense>} />
      <Route path="*" element={<Suspense fallback={<PageLoadingFallback />}><Login /></Suspense>} />
    </Routes>
  )
}

// Themed App Router component that has access to contexts
function ThemedAppRouter() {
  const { user } = useUser()
  const { theme } = useTheme()
  const isAuthenticated = user?.isAuthenticated

  // Create dynamic theme based on current theme state
  const dynamicTheme = createPortalTheme({
    ...appConfig.theme,
    mode: theme
  })

  return (
    <ThemeProvider theme={dynamicTheme}>
      <CssBaseline />
      <ToastContainer />
      <Router basename="/ReactWebAppScaffolding">
        {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Router>
    </ThemeProvider>
  )
}

function App() {
  useDocumentTitle(appConfig.appName)

  return (
    <ErrorBoundary>
      <MockProvider forceMock={true}>
        <ContextProvider>
          <GenericDataProvider>
            <NotificationProvider>
              <MockNotificationHandler />
              <ThemedAppRouter />
            </NotificationProvider>
          </GenericDataProvider>
        </ContextProvider>
      </MockProvider>
    </ErrorBoundary>
  )
}

export default App
