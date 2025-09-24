import { render, screen, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NotificationProvider, useNotifications } from './NotificationContext'

// Test component to access notification context
function TestNotifications() {
  const { notifications, unreadCount, addNotification, markAsRead, clearNotifications } = useNotifications()

  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <div data-testid="total-notifications">{notifications.length}</div>
      <button
        data-testid="add-success"
        onClick={() => addNotification({ type: 'success', title: 'Test Success', autoHide: false })}
      >
        Add Success
      </button>
      <button
        data-testid="mark-read"
        onClick={() => notifications[0] && markAsRead(notifications[0].id)}
      >
        Mark First Read
      </button>
      <button data-testid="clear-all" onClick={clearNotifications}>
        Clear All
      </button>
      {notifications.map(n => (
        <div key={n.id} data-testid={`notification-${n.type}`}>
          {n.title} - {n.read ? 'read' : 'unread'}
        </div>
      ))}
    </div>
  )
}

describe('NotificationContext', () => {
  it('provides notification functions', () => {
    render(
      <NotificationProvider>
        <TestNotifications />
      </NotificationProvider>
    )

    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    expect(screen.getByTestId('total-notifications')).toHaveTextContent('0')
  })

  it('adds notifications and tracks unread count', () => {
    render(
      <NotificationProvider>
        <TestNotifications />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-success').click()
    })

    expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
    expect(screen.getByTestId('total-notifications')).toHaveTextContent('1')
    expect(screen.getByTestId('notification-success')).toHaveTextContent('Test Success - unread')
  })

  it('marks notifications as read', () => {
    render(
      <NotificationProvider>
        <TestNotifications />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-success').click()
    })

    act(() => {
      screen.getByTestId('mark-read').click()
    })

    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    expect(screen.getByTestId('notification-success')).toHaveTextContent('Test Success - read')
  })

  it('clears all notifications', () => {
    render(
      <NotificationProvider>
        <TestNotifications />
      </NotificationProvider>
    )

    act(() => {
      screen.getByTestId('add-success').click()
    })

    act(() => {
      screen.getByTestId('clear-all').click()
    })

    expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
    expect(screen.getByTestId('total-notifications')).toHaveTextContent('0')
  })
})