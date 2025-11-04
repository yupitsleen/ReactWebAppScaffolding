import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  shortcuts?: KeyboardShortcut[]
}

/**
 * Custom hook for managing keyboard shortcuts throughout the application
 * Provides navigation shortcuts and allows custom shortcut registration
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
  const { enabled = true, shortcuts = [] } = options
  const navigate = useNavigate()
  const location = useLocation()

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Skip if user is typing in an input field
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Check custom shortcuts first
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault()
          shortcut.action()
          return
        }
      }

      // Global navigation shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'h':
            event.preventDefault()
            navigate('/')
            break
          case 'k':
            event.preventDefault()
            navigate('/tasks')
            break
          case 'd':
            event.preventDefault()
            navigate('/discussions')
            break
          case 'm':
            event.preventDefault()
            navigate('/documents')
            break
          case 'p':
            event.preventDefault()
            navigate('/payments')
            break
          case 't':
            event.preventDefault()
            navigate('/timeline')
            break
        }
      }

      // Escape key to close modals/dialogs
      if (event.key === 'Escape') {
        // Dispatch custom event that modals can listen to
        window.dispatchEvent(new CustomEvent('escape-pressed'))
      }
    },
    [enabled, shortcuts, navigate]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  return {
    currentPath: location.pathname,
  }
}

/**
 * Default keyboard shortcuts available throughout the app
 */
export const defaultShortcuts: Record<string, { keys: string; description: string }> = {
  home: { keys: 'Ctrl+H', description: 'Go to Dashboard' },
  tasks: { keys: 'Ctrl+K', description: 'Go to Tasks' },
  discussions: { keys: 'Ctrl+D', description: 'Go to Discussions' },
  documents: { keys: 'Ctrl+M', description: 'Go to Documents' },
  payments: { keys: 'Ctrl+P', description: 'Go to Payments' },
  timeline: { keys: 'Ctrl+T', description: 'Go to Timeline' },
  escape: { keys: 'Esc', description: 'Close modal/dialog' },
}
