import { ReactNode } from 'react'
import Loading from './Loading'

interface LoadingWrapperProps {
  loading: boolean
  children: ReactNode
  fallback?: ReactNode
  /** Maintain the exact dimensions of the wrapped content during loading */
  preserveLayout?: boolean
  /** Custom loading text */
  loadingText?: string
  /** Custom minimum height to prevent layout shift */
  minHeight?: string | number
}

export default function LoadingWrapper({
  loading,
  children,
  fallback,
  preserveLayout = true,
  loadingText = 'Loading...',
  minHeight
}: LoadingWrapperProps) {
  if (loading) {
    if (fallback) {
      return <>{fallback}</>
    }

    const loadingStyles: React.CSSProperties = {
      ...(minHeight && { minHeight }),
      ...(preserveLayout && {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      })
    }

    return (
      <div style={loadingStyles}>
        <Loading text={loadingText} />
      </div>
    )
  }

  return <>{children}</>
}