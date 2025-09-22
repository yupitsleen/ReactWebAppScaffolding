import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import createPortalTheme from './theme/portalTheme'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Payments from './pages/Payments'
import Documents from './pages/Documents'
import Discussions from './pages/Discussions'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

vi.mock('./data/configurableData', () => ({
  appConfig: {
    appName: 'Test Portal',
    navigation: [
      { id: 'home', label: 'Home', path: '/', enabled: true, description: 'Home page' },
      { id: 'tasks', label: 'Tasks', path: '/todos', enabled: true, description: 'Tasks page' },
      { id: 'payments', label: 'Payments', path: '/payments', enabled: false, description: 'Payments page' },
      { id: 'documents', label: 'Documents', path: '/documents', enabled: true, description: 'Documents page' }
    ],
    theme: {
      primaryColor: '#2D1B35',
      secondaryColor: '#F59E0B',
      mode: 'light',
      borderRadius: 16,
      fontFamily: '"Inter", sans-serif',
      iconMappings: {}
    }
  }
}))

vi.mock('./hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn()
}))

vi.mock('./pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('./pages/Tasks', () => ({
  default: () => <div data-testid="tasks-page">Tasks Page</div>
}))

vi.mock('./pages/Payments', () => ({
  default: () => <div data-testid="payments-page">Payments Page</div>
}))

vi.mock('./pages/Documents', () => ({
  default: () => <div data-testid="documents-page">Documents Page</div>
}))

vi.mock('./pages/Discussions', () => ({
  default: () => <div data-testid="discussions-page">Discussions Page</div>
}))

vi.mock('./pages/Account', () => ({
  default: () => <div data-testid="account-page">Account Page</div>
}))

vi.mock('./pages/NotFound', () => ({
  default: () => <div data-testid="not-found">Not Found</div>
}))

const AppRoutes = ({ initialEntries }: { initialEntries: string[] }) => {
  const pageComponents = {
    home: Home,
    tasks: Tasks,
    payments: Payments,
    documents: Documents,
    discussions: Discussions,
    contact: Contact
  }

  const mockNavigation = [
    { id: 'home', label: 'Home', path: '/', enabled: true, description: 'Home page' },
    { id: 'tasks', label: 'Tasks', path: '/todos', enabled: true, description: 'Tasks page' },
    { id: 'payments', label: 'Payments', path: '/payments', enabled: false, description: 'Payments page' },
    { id: 'documents', label: 'Documents', path: '/documents', enabled: true, description: 'Documents page' }
  ]

  const mockTheme = {
    primaryColor: '#2D1B35',
    secondaryColor: '#F59E0B',
    mode: 'light',
    borderRadius: 16,
    fontFamily: '"Inter", sans-serif',
    iconMappings: {}
  }

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider theme={createPortalTheme(mockTheme)}>
        <CssBaseline />
        <ErrorBoundary>
          <AppProvider>
            <Layout>
              <Routes>
                {mockNavigation
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
          </AppProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('App Feature Flags', () => {
  it('renders enabled pages', () => {
    render(<AppRoutes initialEntries={['/']} />)
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  it('renders enabled route for tasks', () => {
    render(<AppRoutes initialEntries={['/todos']} />)
    expect(screen.getByTestId('tasks-page')).toBeInTheDocument()
  })

  it('does not render disabled payments page - shows 404', () => {
    render(<AppRoutes initialEntries={['/payments']} />)
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
    expect(screen.queryByTestId('payments-page')).not.toBeInTheDocument()
  })

  it('renders enabled documents page', () => {
    render(<AppRoutes initialEntries={['/documents']} />)
    expect(screen.getByTestId('documents-page')).toBeInTheDocument()
  })
})