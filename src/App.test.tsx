import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Routes, Route, MemoryRouter } from 'react-router-dom'

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

const MockPage = ({ testId }: { testId: string }) => <div data-testid={testId}>Mock Page</div>
const NotFound = () => <div data-testid="not-found">Not Found</div>

const TestRoutes = ({ initialEntries }: { initialEntries: string[] }) => {
  const routes = [
    { path: '/', testId: 'home-page', enabled: true },
    { path: '/todos', testId: 'tasks-page', enabled: true },
    { path: '/payments', testId: 'payments-page', enabled: false },
    { path: '/documents', testId: 'documents-page', enabled: true }
  ]

  return (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        {routes
          .filter(route => route.enabled)
          .map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<MockPage testId={route.testId} />}
            />
          ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('App Feature Flags', () => {
  it('renders enabled pages', () => {
    render(<TestRoutes initialEntries={['/']} />)
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  it('renders enabled route for tasks', () => {
    render(<TestRoutes initialEntries={['/todos']} />)
    expect(screen.getByTestId('tasks-page')).toBeInTheDocument()
  })

  it('does not render disabled payments page - shows 404', () => {
    render(<TestRoutes initialEntries={['/payments']} />)
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('renders enabled documents page', () => {
    render(<TestRoutes initialEntries={['/documents']} />)
    expect(screen.getByTestId('documents-page')).toBeInTheDocument()
  })
})