import { useState, useEffect } from 'react'

/**
 * Hook for managing page-level loading states with configurable delays
 */
export function usePageLoading(initialLoading = true, delay = 500) {
  const [loading, setLoading] = useState(initialLoading)

  useEffect(() => {
    if (initialLoading && delay > 0) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [initialLoading, delay])

  return [loading, setLoading] as const
}

/**
 * Hook for simulating async data loading with loading states
 */
export function useAsyncLoading<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    asyncFn()
      .then((result) => {
        if (isMounted) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, deps)

  return { loading, data, error, setLoading }
}