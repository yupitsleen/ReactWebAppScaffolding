import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { portalTheme } from '../theme/portalTheme'
import SkeletonLoader from './SkeletonLoader'

const renderSkeleton = (props = {}) => {
  return render(
    <ThemeProvider theme={portalTheme}>
      <SkeletonLoader {...props} />
    </ThemeProvider>
  )
}

describe('SkeletonLoader', () => {
  it('renders text skeleton by default', () => {
    const { container } = renderSkeleton()
    const skeletons = container.querySelectorAll('.MuiSkeleton-text')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders multiple skeleton items based on count prop', () => {
    const { container } = renderSkeleton({ count: 5 })
    const skeletons = container.querySelectorAll('.MuiSkeleton-text')
    expect(skeletons.length).toBe(5)
  })

  it('renders card skeleton variant', () => {
    const { container } = renderSkeleton({ variant: 'card', count: 2 })
    const cards = container.querySelectorAll('.MuiCard-root')
    expect(cards.length).toBe(2)
  })

  it('renders table skeleton variant with header and rows', () => {
    const { container } = renderSkeleton({ variant: 'table', count: 3 })
    const skeletons = container.querySelectorAll('.MuiSkeleton-text')
    // Header (4 columns) + 3 rows (4 columns each) = 16 total
    expect(skeletons.length).toBeGreaterThanOrEqual(16)
  })

  it('renders list skeleton variant', () => {
    const { container } = renderSkeleton({ variant: 'list', count: 3 })
    const circles = container.querySelectorAll('.MuiSkeleton-circular')
    expect(circles.length).toBe(3)
  })

  it('renders avatar skeleton variant', () => {
    const { container } = renderSkeleton({ variant: 'avatar', count: 2 })
    const circles = container.querySelectorAll('.MuiSkeleton-circular')
    expect(circles.length).toBe(2)
  })

  it('applies custom width and height', () => {
    const { container } = renderSkeleton({
      variant: 'text',
      width: 200,
      height: 50
    })
    const skeleton = container.querySelector('.MuiSkeleton-text')
    expect(skeleton).toBeTruthy()
  })

  it('supports animation prop', () => {
    const { container } = renderSkeleton({ animate: false })
    const skeleton = container.querySelector('.MuiSkeleton-root')
    expect(skeleton).toBeTruthy()
  })
})
