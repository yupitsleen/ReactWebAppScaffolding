import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Footer from '../components/Footer'
import { appConfig } from '../data/mockData'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { state, setUser } = useAppContext()
  
  const isPageActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    setUser(null)
    alert('You have been logged out')
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
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
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