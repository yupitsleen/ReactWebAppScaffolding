import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser, useTheme } from '../context/ContextProvider'
import { useAuthService } from '../context/MockContext'
import { useNavigation } from '../hooks/useNavigation'
import { useHighContrast } from '../hooks/useHighContrast'
import { useFeature } from '../hooks/useFeature'
import Footer from '../components/Footer'
import NotificationBell from '../components/NotificationBell'
// ColorPresetSelector removed - using Constructivism theme as default
import { DensitySelector } from '../components/DensitySelector'
import { appConfig } from '../data/configurableData'
import { Menu as MenuIcon, Close as CloseIcon, Contrast as ContrastIcon } from '@mui/icons-material'
// colorManager removed - colors managed in configurableData.ts
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const { user, setUser } = useUser()
  const { theme, toggleTheme } = useTheme()
  const { isHighContrast, toggleHighContrast } = useHighContrast()
  const authService = useAuthService()
  const { isCurrentPage, getEnabledPages } = useNavigation()
  const { isEnabled } = useFeature()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // colorPresetDialogOpen removed - using Constructivism theme as default
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [mobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [navigate])

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

  const handleToggleTheme = () => {
    toggleTheme()
  }

  // handleColorPresetSelect removed - using Constructivism theme as default

  // Load saved color preset removed - using Constructivism theme as default

  return (
    <div className={styles.layout}>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <header className={styles.header} role="banner">
        <div className={styles.headerContent}>
          <div className={styles.logo}>{appConfig.appName}</div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Desktop Navigation */}
          <nav className={styles.nav} aria-label="Main navigation">
            {getEnabledPages().map(nav => (
              <Link
                key={nav.id}
                to={nav.path}
                className={`${styles.navLink} ${isCurrentPage(nav.path) ? styles.active : ''}`}
                aria-current={isCurrentPage(nav.path) ? 'page' : undefined}
              >
                {nav.label}
              </Link>
            ))}
            <div className={styles.accountMenu} ref={accountMenuRef}>
              <button
                className={styles.accountButton}
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                Account ▼
              </button>
              {accountMenuOpen && (
                <div className={styles.accountDropdown}>
                  {user ? (
                    <>
                      <div className={styles.userInfo}>
                        {user.name} ({user.userType})
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
            {isEnabled('layoutDensity') && <DensitySelector />}
            {/* Color preset button removed - using Constructivism theme as default */}
            {isEnabled('highContrastMode') && (
              <button
                className={styles.iconButton}
                onClick={toggleHighContrast}
                title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
                aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
                style={{ opacity: isHighContrast ? 1 : 0.7 }}
              >
                <ContrastIcon />
              </button>
            )}
            {isEnabled('darkMode') && (
              <button
                className={styles.themeToggle}
                onClick={handleToggleTheme}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            )}
            {isEnabled('notifications') && <NotificationBell />}
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenuOverlay} ref={mobileMenuRef}>
            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {getEnabledPages().map(nav => (
                <Link
                  key={nav.id}
                  to={nav.path}
                  className={`${styles.mobileNavLink} ${isCurrentPage(nav.path) ? styles.activeMobile : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {nav.label}
                </Link>
              ))}
              <div className={styles.mobileDivider} />
              {user ? (
                <>
                  <div className={styles.mobileUserInfo}>
                    {user.name} ({user.userType})
                  </div>
                  <Link
                    to="/my-account"
                    className={styles.mobileNavLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className={styles.mobileNavButton}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={styles.mobileNavLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={styles.mobileNavLink}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
              <div className={styles.mobileDivider} />
              {/* Color preset button removed - using Constructivism theme as default */}
              <button
                className={styles.mobileNavButton}
                onClick={() => { toggleHighContrast(); setMobileMenuOpen(false); }}
              >
                {isHighContrast ? '🔆 Normal Contrast' : '⚫ High Contrast'}
              </button>
              <button
                className={styles.mobileNavButton}
                onClick={() => { handleToggleTheme(); setMobileMenuOpen(false); }}
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </nav>
          </div>
        )}
      </header>
      <main id="main-content" className={styles.main} role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      {/* ColorPresetSelector removed - using Constructivism theme as default */}
    </div>
  )
}

export default Layout