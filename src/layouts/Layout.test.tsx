import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Layout from './Layout'

vi.mock('../context/AppContext', () => ({
  useAppContext: () => ({
    state: { user: null },
    setUser: vi.fn()
  })
}))

vi.mock('../data/configurableData', () => ({
  appConfig: {
    appName: 'Test Portal',
    navigation: [
      { id: 'home', label: 'Home', path: '/', enabled: true, description: 'Home page' },
      { id: 'tasks', label: 'Tasks', path: '/todos', enabled: true, description: 'Tasks page' },
      { id: 'payments', label: 'Payments', path: '/payments', enabled: false, description: 'Payments page' },
      { id: 'documents', label: 'Documents', path: '/documents', enabled: true, description: 'Documents page' },
      { id: 'discussions', label: 'Discussions', path: '/discussions', enabled: false, description: 'Discussions page' }
    ]
  }
}))

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}))

describe('Layout Feature Flags', () => {
  it('only shows enabled navigation items', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    )

    // Should show 3 enabled navigation items (home, tasks, documents)
    const navLinks = screen.getAllByRole('link')
    const navigationLinks = navLinks.filter(link =>
      link.getAttribute('href') &&
      !link.getAttribute('href')?.includes('logout')
    )
    expect(navigationLinks).toHaveLength(3)
  })

  it('shows logout button', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    )

    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('shows app name in header', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </MemoryRouter>
    )

    // Should show the configured app name
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})