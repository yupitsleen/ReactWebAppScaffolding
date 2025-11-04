import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AnimatePresence } from 'framer-motion'
import createPortalTheme from './theme/portalTheme'
import { appConfig } from './data/configurableData'
import { ContextProvider, useUser, useTheme } from './context/ContextProvider'
import { MockProvider, MockNotificationHandler } from './context/MockContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './layouts/Layout'
import PageTransition from './components/PageTransition'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Discussions from './pages/Discussions'
import Table from './pages/Table'
import Timeline from './pages/Timeline'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import MyAccount from './pages/MyAccount'
import NotFound from './pages/NotFound'
import './utils/colorManager'

// Component for authenticated users
function AuthenticatedApp() {
  const location = useLocation()

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
                <Route key={nav.id} path={nav.path} element={<PageTransition><Component /></PageTransition>} />
              ) : null
            })}
          <Route path="/my-account" element={<PageTransition><MyAccount /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

// Component for unauthenticated users
function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
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
          <NotificationProvider>
            <MockNotificationHandler />
            <ThemedAppRouter />
          </NotificationProvider>
        </ContextProvider>
      </MockProvider>
    </ErrorBoundary>
  )
}

export default App
