import { useCallback } from 'react'
import { useData } from '../context/ContextProvider'
import { useNavigation } from './useNavigation'
import type { ActionButton } from '../types/portal'

interface UseEntityActionsReturn {
  executeAction: (action: ActionButton, entity?: Record<string, unknown>) => void
  isActionAvailable: (actionId: string, entity?: Record<string, unknown>) => boolean
  getActionHandler: (actionId: string) => ((entity?: Record<string, unknown>) => void) | undefined
}

export const useEntityActions = (): UseEntityActionsReturn => {
  const { navigateToPage, navigateBack, navigateTo } = useNavigation()
  const { updateTodoStatus, updateDiscussionStatus, updateDocumentSharing } = useData()

  // Define all available action handlers
  const actionHandlers = useCallback(() => ({
    // Navigation actions using smart navigation
    navigateToTasks: () => navigateToPage('tasks'),
    navigateToPayments: () => navigateToPage('payments'),
    navigateToDocuments: () => navigateToPage('documents'),
    navigateToDiscussions: () => navigateToPage('discussions'),
    navigateToAccount: () => navigateToPage('account'),
    navigateToLogin: () => navigateTo('/login'),
    navigateToRegister: () => navigateTo('/register'),
    navigateToProfile: () => navigateTo('/profile'),
    navigateBack: () => navigateBack(),
    navigateHome: () => navigateToPage('home'),

    // Entity status actions
    handleCompleteTask: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateTodoStatus(entity.id, 'completed')
      }
    },
    handleResumeTask: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateTodoStatus(entity.id, 'in-progress')
      }
    },
    handlePendTask: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateTodoStatus(entity.id, 'pending')
      }
    },
    handleResolveDiscussion: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateDiscussionStatus(entity.id, true)
      }
    },
    handleReopenDiscussion: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateDiscussionStatus(entity.id, false)
      }
    },
    handleShareDocument: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateDocumentSharing(entity.id, true)
      }
    },
    handleUnshareDocument: (entity?: Record<string, unknown>) => {
      if (entity?.id && typeof entity.id === 'string') {
        updateDocumentSharing(entity.id, false)
      }
    },

    // Placeholder actions for future implementation
    handleDownload: (entity?: Record<string, unknown>) => {
      console.log('Download action triggered', entity)
      // TODO: Implement download functionality
    },
    handleShare: (entity?: Record<string, unknown>) => {
      console.log('Share action triggered', entity)
      // TODO: Implement share functionality
    },
    handleUpdateProfile: () => {
      console.log('Update profile action triggered')
      navigateTo('/profile')
    },
    handleContactSupport: () => {
      console.log('Contact support action triggered')
      // TODO: Implement contact support functionality
    },
    handleEdit: (entity?: Record<string, unknown>) => {
      console.log('Edit action triggered', entity)
      // TODO: Implement edit functionality
    },
    handleDelete: (entity?: Record<string, unknown>) => {
      console.log('Delete action triggered', entity)
      // TODO: Implement delete functionality
    },
    handleView: (entity?: Record<string, unknown>) => {
      console.log('View action triggered', entity)
      // TODO: Implement view functionality
    },
  }), [navigateToPage, navigateBack, navigateTo, updateTodoStatus, updateDiscussionStatus, updateDocumentSharing])

  const executeAction = useCallback((action: ActionButton, entity?: Record<string, unknown>) => {
    const handlers = actionHandlers()
    const handler = handlers[action.onClick as keyof typeof handlers]

    if (handler && typeof handler === 'function') {
      handler(entity)
    } else {
      console.warn(`Action handler "${action.onClick}" not found`)
    }
  }, [actionHandlers])

  const isActionAvailable = useCallback((actionId: string, entity?: Record<string, unknown>): boolean => {
    // Add conditional logic based on entity state
    switch (actionId) {
      case 'complete-task':
        return entity?.status !== 'completed'
      case 'resume-task':
      case 'pend-task':
        return entity?.status === 'completed'
      case 'resolve-discussion':
        return entity?.resolved === false
      case 'reopen-discussion':
        return entity?.resolved === true
      case 'share-document':
        return entity?.shared === false
      case 'unshare-document':
        return entity?.shared === true
      default:
        return true
    }
  }, [])

  const getActionHandler = useCallback((actionId: string) => {
    const handlers = actionHandlers()
    return handlers[actionId as keyof typeof handlers]
  }, [actionHandlers])

  return {
    executeAction,
    isActionAvailable,
    getActionHandler,
  }
}