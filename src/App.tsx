import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from './theme/portalTheme'
import { appConfig } from './data/configurableData'
import { AppProvider, useAppContext } from './context/AppContext'
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

// Themed App Router component that has access to AppContext
function ThemedAppRouter() {
  const { state } = useAppContext()
  const isAuthenticated = state.user?.isAuthenticated

  // Create dynamic theme based on current theme state
  const dynamicTheme = createPortalTheme({
    ...appConfig.theme,
    mode: state.theme
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
        <AppProvider>
          <NotificationProvider>
            <MockNotificationHandler />
            <ThemedAppRouter />
          </NotificationProvider>
        </AppProvider>
      </MockProvider>
    </ErrorBoundary>
  )
}

export default App
