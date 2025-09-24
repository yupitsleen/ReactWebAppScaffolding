import { describe, it, expect, beforeEach } from 'vitest'
import { createPortalTheme } from './portalTheme'
import type { ThemeConfig } from '../types/portal'

// Mock document.documentElement for CSS variable injection
const mockSetProperty = vi.fn()
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: mockSetProperty
    }
  }
})

describe('createPortalTheme', () => {
  beforeEach(() => {
    mockSetProperty.mockClear()
  })

  it('creates theme with correct primary color', () => {
    const config: ThemeConfig = {
      primaryColor: '#FF0000',
      secondaryColor: '#00FF00',
      mode: 'light',
      borderRadius: 0,
      fontFamily: 'Arial'
    }

    const theme = createPortalTheme(config)

    expect(theme.palette.primary.main).toBe('#FF0000')
    expect(theme.palette.secondary.main).toBe('#00FF00')
    expect(theme.palette.mode).toBe('light')
  })

  it('injects CSS variables for dynamic colors', () => {
    const config: ThemeConfig = {
      primaryColor: '#312E81',
      secondaryColor: '#F59E0B',
      mode: 'dark',
      borderRadius: 0,
      fontFamily: 'Roboto'
    }

    createPortalTheme(config)

    expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', '#312E81')
    expect(mockSetProperty).toHaveBeenCalledWith('--secondary-color', '#F59E0B')
    expect(mockSetProperty).toHaveBeenCalledWith('--background-color', '#1F2937') // dark mode background
  })

  it('sets correct background color for light mode', () => {
    const config: ThemeConfig = {
      primaryColor: '#312E81',
      secondaryColor: '#F59E0B',
      mode: 'light',
      borderRadius: 0,
      fontFamily: 'Roboto'
    }

    createPortalTheme(config)

    expect(mockSetProperty).toHaveBeenCalledWith('--background-color', '#E8E3EB') // light mode background
  })

  it('creates theme with zero border radius', () => {
    const config: ThemeConfig = {
      primaryColor: '#312E81',
      secondaryColor: '#F59E0B',
      mode: 'light',
      borderRadius: 0,
      fontFamily: 'Roboto'
    }

    const theme = createPortalTheme(config)

    expect(theme.shape.borderRadius).toBe(0)
  })
})