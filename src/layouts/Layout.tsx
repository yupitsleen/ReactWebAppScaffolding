import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser, useTheme } from '../context/ContextProvider'
import { useAuthService } from '../context/MockContext'
import { useNavigation } from '../hooks/useNavigation'
import { useHighContrast } from '../hooks/useHighContrast'
import Footer from '../components/Footer'
import NotificationBell from '../components/NotificationBell'
import { ColorPresetSelector } from '../components/ColorPresetSelector'
import { DensitySelector } from '../components/DensitySelector'
import { appConfig } from '../data/configurableData'
import { Menu as MenuIcon, Close as CloseIcon, Palette as PaletteIcon, Contrast as ContrastIcon } from '@mui/icons-material'
import { setThemeColor } from '../utils/colorManager'
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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [colorPresetDialogOpen, setColorPresetDialogOpen] = useState(false)
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

  const handleColorPresetSelect = (primaryColor: string, secondaryColor: string) => {
    // Update colors in the color manager
    setThemeColor('primary-color', primaryColor)
    setThemeColor('secondary-color', secondaryColor)

    // Save to localStorage for persistence
    localStorage.setItem('color-preset-primary', primaryColor)
    localStorage.setItem('color-preset-secondary', secondaryColor)
  }

  // Load saved color preset on mount
  useEffect(() => {
    const savedPrimary = localStorage.getItem('color-preset-primary')
    const savedSecondary = localStorage.getItem('color-preset-secondary')

    if (savedPrimary && savedSecondary) {
      setThemeColor('primary-color', savedPrimary)
      setThemeColor('secondary-color', savedSecondary)
    }
  }, [])

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
            <DensitySelector />
            <button
              className={styles.iconButton}
              onClick={() => setColorPresetDialogOpen(true)}
              title="Change color scheme"
              aria-label="Change color scheme"
            >
              <PaletteIcon />
            </button>
            <button
              className={styles.iconButton}
              onClick={toggleHighContrast}
              title={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
              aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
              style={{ opacity: isHighContrast ? 1 : 0.7 }}
            >
              <ContrastIcon />
            </button>
            <button
              className={styles.themeToggle}
              onClick={handleToggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <NotificationBell />
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
              <button
                className={styles.mobileNavButton}
                onClick={() => { setColorPresetDialogOpen(true); setMobileMenuOpen(false); }}
              >
                🎨 Change Colors
              </button>
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
      <ColorPresetSelector
        open={colorPresetDialogOpen}
        onClose={() => setColorPresetDialogOpen(false)}
        currentPrimary={appConfig.theme.primaryColor}
        currentSecondary={appConfig.theme.secondaryColor}
        onPresetSelect={handleColorPresetSelect}
      />
    </div>
  )
}

export default Layout