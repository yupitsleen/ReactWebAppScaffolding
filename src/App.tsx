import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from './theme/portalTheme'
import { appConfig } from './data/mockData'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Discussions from './pages/Discussions'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import './utils/colorManager'

function App() {
  return (
    <ThemeProvider theme={createPortalTheme(appConfig.theme)}>
      <CssBaseline />
      <ErrorBoundary>
        <AppProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/todos" element={<Tasks />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/account" element={<Account />} />
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
