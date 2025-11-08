/**
 * Demo Date Helpers
 *
 * **Purpose:**
 * Provides utilities for generating dynamic demo dates relative to "today".
 * This ensures timeline graphs always show relevant data (e.g., "last 7 days").
 *
 * **Usage:**
 * ```typescript
 * import { daysAgo, daysFromNow, todayISO } from './utils/demoDateHelpers'
 *
 * // For demo data
 * const dueDate = daysFromNow(7)  // 7 days from today
 * const createdAt = daysAgo(14)   // 14 days ago
 *
 * // Future: User-settable dates
 * // const dueDate = userInputDate || daysFromNow(7)
 * ```
 */

/**
 * Get today's date at midnight (00:00:00)
 */
export const today = (): Date => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

/**
 * Get a date N days in the past from today
 * @param days Number of days to go back (positive number)
 * @returns ISO date string (YYYY-MM-DD format)
 */
export const daysAgo = (days: number): string => {
  const date = today()
  date.setDate(date.getDate() - days)
  return date.toISOString().split('T')[0]
}

/**
 * Get a date N days in the future from today
 * @param days Number of days to go forward (positive number)
 * @returns ISO date string (YYYY-MM-DD format)
 */
export const daysFromNow = (days: number): string => {
  const date = today()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const todayISO = (): string => {
  return today().toISOString().split('T')[0]
}

/**
 * Get a date N days ago from today with full ISO timestamp
 * @param days Number of days to go back
 * @param hours Optional: hour of day (0-23)
 * @param minutes Optional: minute (0-59)
 * @returns Full ISO timestamp string
 */
export const daysAgoISO = (days: number, hours = 10, minutes = 0): string => {
  const date = today()
  date.setDate(date.getDate() - days)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

/**
 * Get a date N days from now with full ISO timestamp
 * @param days Number of days to go forward
 * @param hours Optional: hour of day (0-23)
 * @param minutes Optional: minute (0-59)
 * @returns Full ISO timestamp string
 */
export const daysFromNowISO = (days: number, hours = 10, minutes = 0): string => {
  const date = today()
  date.setDate(date.getDate() + days)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

/**
 * Get now as ISO timestamp
 */
export const nowISO = (): string => {
  return new Date().toISOString()
}

/**
 * Generate a random date within a range
 * @param daysBack How many days back to start the range
 * @param daysForward How many days forward to end the range
 * @returns ISO date string (YYYY-MM-DD format)
 */
export const randomDateInRange = (daysBack: number, daysForward: number): string => {
  const start = today()
  start.setDate(start.getDate() - daysBack)

  const end = today()
  end.setDate(end.getDate() + daysForward)

  const range = end.getTime() - start.getTime()
  const random = Math.random() * range
  const randomDate = new Date(start.getTime() + random)

  return randomDate.toISOString().split('T')[0]
}
