import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useAuthService } from '../context/MockContext'
import Footer from '../components/Footer'
import NotificationBell from '../components/NotificationBell'
import { appConfig } from '../data/configurableData'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { state, setUser, setTheme } = useAppContext()
  const authService = useAuthService()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const isPageActive = (path: string) => location.pathname === path

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [accountMenuOpen])

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear user state even if logout fails
      setUser(null)
      navigate('/login')
    }
  }

  const toggleTheme = () => {
    setTheme(state.theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>{appConfig.appName}</div>
          <nav className={styles.nav}>
            {appConfig.navigation
              .filter(nav => nav.enabled)
              .map(nav => (
                <Link
                  key={nav.id}
                  to={nav.path}
                  className={`${styles.navLink} ${isPageActive(nav.path) ? styles.active : ''}`}
                >
                  {nav.label}
                </Link>
              ))}
            <div className={styles.accountMenu} ref={accountMenuRef}>
              <button
                className={styles.accountButton}
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              >
                Account ▼
              </button>
              {accountMenuOpen && (
                <div className={styles.accountDropdown}>
                  {state.user ? (
                    <>
                      <div className={styles.userInfo}>
                        {state.user.name} ({state.user.userType})
                      </div>
                      <Link
                        to="/my-account"
                        className={styles.dropdownLink}
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setAccountMenuOpen(false); }}
                        className={styles.dropdownButton}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={styles.dropdownLink}
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className={styles.dropdownLink}
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              className={styles.themeToggle}
              onClick={toggleTheme}
              title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {state.theme === 'light' ? '🌙' : '☀️'}
            </button>
            <NotificationBell />
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout