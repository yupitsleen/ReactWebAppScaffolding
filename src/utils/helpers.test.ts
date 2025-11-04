import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  debounce,
  classNames,
  generateId,
  isValidEmail,
  getFromStorage,
  setToStorage,
  removeFromStorage
} from './helpers'

describe('helpers', () => {
  describe('formatDate', () => {
    it('formats Date objects correctly', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
    })

    it('formats date strings correctly', () => {
      const formatted = formatDate('2024-01-15T12:00:00Z')
      expect(formatted).toContain('2024')
    })

    it('applies custom formatting options', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date, { year: 'numeric', month: 'long' })
      expect(formatted).toMatch(/2024/)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('delays function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('cancels previous calls when invoked multiple times', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      vi.advanceTimersByTime(50)
      debouncedFn('second')
      vi.advanceTimersByTime(50)
      debouncedFn('third')

      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('third')
    })
  })

  describe('classNames', () => {
    it('combines valid class names', () => {
      expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz')
    })

    it('filters out falsy values', () => {
      expect(classNames('foo', null, undefined, false, 'bar')).toBe('foo bar')
    })

    it('handles empty input', () => {
      expect(classNames()).toBe('')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      expect(classNames('btn', isActive && 'active', isDisabled && 'disabled')).toBe(
        'btn active'
      )
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()

      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })

    it('generates IDs without spaces or special characters', () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+$/)
    })
  })

  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@domain')).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('localStorage helpers', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    describe('getFromStorage', () => {
      it('retrieves stored values', () => {
        localStorage.setItem('test-key', JSON.stringify({ value: 'test' }))
        const result = getFromStorage('test-key', { value: 'default' })
        expect(result).toEqual({ value: 'test' })
      })

      it('returns default value when key does not exist', () => {
        const result = getFromStorage('nonexistent', 'default')
        expect(result).toBe('default')
      })

      it('returns default value on parse error', () => {
        // Suppress expected console warning
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        localStorage.setItem('bad-key', 'invalid json')
        const result = getFromStorage('bad-key', 'default')
        expect(result).toBe('default')

        consoleWarnSpy.mockRestore()
      })
    })

    describe('setToStorage', () => {
      it('stores values as JSON', () => {
        setToStorage('test-key', { value: 'test' })
        const stored = localStorage.getItem('test-key')
        expect(stored).toBe('{"value":"test"}')
      })

      it('handles primitive values', () => {
        setToStorage('string-key', 'hello')
        setToStorage('number-key', 42)
        setToStorage('boolean-key', true)

        expect(getFromStorage('string-key', '')).toBe('hello')
        expect(getFromStorage('number-key', 0)).toBe(42)
        expect(getFromStorage('boolean-key', false)).toBe(true)
      })
    })

    describe('removeFromStorage', () => {
      it('removes stored values', () => {
        localStorage.setItem('test-key', 'value')
        removeFromStorage('test-key')
        expect(localStorage.getItem('test-key')).toBeNull()
      })

      it('handles removing nonexistent keys gracefully', () => {
        expect(() => removeFromStorage('nonexistent')).not.toThrow()
      })
    })
  })
})
