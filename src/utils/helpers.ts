export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(undefined, options)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => func(...args), delay)
  }
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error)
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
}