import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MockProvider, useMockContext } from './MockContext'

// Test component to access mock context
function TestMockContext() {
  const { isMockMode, authService, notificationService } = useMockContext()

  return (
    <div>
      <div data-testid="mock-mode">{isMockMode ? 'true' : 'false'}</div>
      <div data-testid="auth-service">{authService ? 'available' : 'null'}</div>
      <div data-testid="notification-service">{notificationService ? 'available' : 'null'}</div>
    </div>
  )
}

describe('MockContext', () => {
  it('provides mock services when forceMock is true', () => {
    render(
      <MockProvider forceMock={true}>
        <TestMockContext />
      </MockProvider>
    )

    expect(screen.getByTestId('mock-mode')).toHaveTextContent('true')
    expect(screen.getByTestId('auth-service')).toHaveTextContent('available')
    expect(screen.getByTestId('notification-service')).toHaveTextContent('available')
  })

  it('does not provide notification service when not in mock mode', () => {
    render(
      <MockProvider forceMock={false}>
        <TestMockContext />
      </MockProvider>
    )

    expect(screen.getByTestId('mock-mode')).toHaveTextContent('false')
    expect(screen.getByTestId('notification-service')).toHaveTextContent('null')
  })

  it('notification service has required demo methods', () => {
    function TestServiceMethods() {
      const { notificationService } = useMockContext()

      return (
        <div>
          <div data-testid="trigger-task-completed">{typeof notificationService?.triggerTaskCompleted}</div>
          <div data-testid="trigger-new-message">{typeof notificationService?.triggerNewMessage}</div>
          <div data-testid="trigger-task-due-soon">{typeof notificationService?.triggerTaskDueSoon}</div>
          <div data-testid="trigger-upload-error">{typeof notificationService?.triggerUploadError}</div>
          <div data-testid="trigger-random-demo">{typeof notificationService?.triggerRandomDemo}</div>
        </div>
      )
    }

    render(
      <MockProvider forceMock={true}>
        <TestServiceMethods />
      </MockProvider>
    )

    expect(screen.getByTestId('trigger-task-completed')).toHaveTextContent('function')
    expect(screen.getByTestId('trigger-new-message')).toHaveTextContent('function')
    expect(screen.getByTestId('trigger-task-due-soon')).toHaveTextContent('function')
    expect(screen.getByTestId('trigger-upload-error')).toHaveTextContent('function')
    expect(screen.getByTestId('trigger-random-demo')).toHaveTextContent('function')
  })
})