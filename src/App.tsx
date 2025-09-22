import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from './theme/portalTheme'
import { appConfig } from './data/configurableData'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './layouts/Layout'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Discussions from './pages/Discussions'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import './utils/colorManager'

function App() {
  useDocumentTitle(appConfig.appName)

  const pageComponents = {
    home: Home,
    tasks: Tasks,
    payments: Payments,
    documents: Documents,
    discussions: Discussions,
    account: Account
  }

  return (
    <ThemeProvider theme={createPortalTheme(appConfig.theme)}>
      <CssBaseline />
      <ErrorBoundary>
        <AppProvider>
          <Router>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </AppProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
