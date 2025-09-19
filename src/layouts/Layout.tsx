import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Footer from '../components/Footer'
import { env } from '../utils/env'
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
        <nav className={styles.nav}>
          <div className={styles.logo}>{env.APP_NAME}</div>
          <Link
            to="/"
            className={`${styles.navLink} ${isPageActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/todos"
            className={`${styles.navLink} ${isPageActive('/todos') ? styles.active : ''}`}
          >
            Tasks
          </Link>
          <Link
            to="/payments"
            className={`${styles.navLink} ${isPageActive('/payments') ? styles.active : ''}`}
          >
            Payments
          </Link>
          <Link
            to="/documents"
            className={`${styles.navLink} ${isPageActive('/documents') ? styles.active : ''}`}
          >
            Documents
          </Link>
          <Link
            to="/discussions"
            className={`${styles.navLink} ${isPageActive('/discussions') ? styles.active : ''}`}
          >
            Discussions
          </Link>
          <Link
            to="/account"
            className={`${styles.navLink} ${isPageActive('/account') ? styles.active : ''}`}
          >
            Account
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout