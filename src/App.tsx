import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from './theme/portalTheme'
import { appConfig } from './data/configurableData'
import { ContextProvider, useUser, useTheme } from './context/ContextProvider'
import { MockProvider, MockNotificationHandler } from './context/MockContext'
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './layouts/Layout'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Discussions from './pages/Discussions'
import Table from './pages/Table'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import MyAccount from './pages/MyAccount'
import NotFound from './pages/NotFound'
import './utils/colorManager'

// Component for authenticated users
function AuthenticatedApp() {
  const pageComponents = {
    home: Home,
    tasks: Tasks,
    payments: Payments,
    documents: Documents,
    discussions: Discussions,
    table: Table,
    contact: Contact
  }

  return (
    <Layout>
      <Routes>
        {appConfig.navigation
          .filter(nav => nav.enabled)
          .map(nav => {
            const Component = pageComponents[nav.id as keyof typeof pageComponents]
            return Component ? (
              <Route key={nav.id} path={nav.path} element={<Component />} />
            ) : null
          })}
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
      <Router>
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
