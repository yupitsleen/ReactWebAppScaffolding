import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingWrapper from './LoadingWrapper'

describe('LoadingWrapper', () => {
  const TestChild = () => <div data-testid="child-content">Test Content</div>

  it('shows loading state when loading is true', () => {
    render(
      <LoadingWrapper loading={true}>
        <TestChild />
      </LoadingWrapper>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()
  })

  it('shows children when loading is false', () => {
    render(
      <LoadingWrapper loading={false}>
        <TestChild />
      </LoadingWrapper>
    )

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  it('shows custom loading text', () => {
    render(
      <LoadingWrapper loading={true} loadingText="Please wait...">
        <TestChild />
      </LoadingWrapper>
    )

    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('shows custom fallback when provided', () => {
    const CustomFallback = () => <div data-testid="custom-fallback">Custom Loading</div>

    render(
      <LoadingWrapper loading={true} fallback={<CustomFallback />}>
        <TestChild />
      </LoadingWrapper>
    )

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('preserves layout by default', () => {
    render(
      <LoadingWrapper loading={true}>
        <TestChild />
      </LoadingWrapper>
    )

    const loadingContainer = screen.getByText('Loading...').closest('div')
    expect(loadingContainer).toHaveStyle({ display: 'flex' })
  })
})