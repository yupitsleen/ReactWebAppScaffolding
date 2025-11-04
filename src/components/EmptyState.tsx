import { memo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import {
  Inbox as InboxIcon,
  Search as SearchIcon,
  Error as ErrorIcon,
  CloudOff as CloudOffIcon,
  Description as DescriptionIcon,
  Forum as ForumIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material'
import type { SvgIconComponent } from '@mui/icons-material'

interface EmptyStateProps {
  /** Type of empty state (determines default icon and message) */
  variant?: 'no-data' | 'no-search-results' | 'error' | 'offline' | 'custom'
  /** Custom icon component */
  icon?: SvgIconComponent
  /** Custom title */
  title?: string
  /** Custom description */
  description?: string
  /** Optional action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Entity type for contextual messages */
  entityType?: 'tasks' | 'documents' | 'discussions' | 'payments' | 'generic'
}

const defaultConfig = {
  'no-data': {
    icon: InboxIcon,
    title: 'No Data Yet',
    description: 'Get started by creating your first item',
  },
  'no-search-results': {
    icon: SearchIcon,
    title: 'No Results Found',
    description: 'Try adjusting your search or filters',
  },
  error: {
    icon: ErrorIcon,
    title: 'Something Went Wrong',
    description: 'An error occurred while loading data',
  },
  offline: {
    icon: CloudOffIcon,
    title: 'You\'re Offline',
    description: 'Check your internet connection',
  },
  custom: {
    icon: InboxIcon,
    title: 'No Items',
    description: '',
  },
}

const entityIcons: Record<string, SvgIconComponent> = {
  tasks: AssignmentIcon,
  documents: DescriptionIcon,
  discussions: ForumIcon,
  payments: PaymentIcon,
  generic: InboxIcon,
}

const entityMessages: Record<string, { title: string; description: string }> = {
  tasks: {
    title: 'No Tasks Yet',
    description: 'Create your first task to get started with project management',
  },
  documents: {
    title: 'No Documents',
    description: 'Upload or create your first document to begin collaborating',
  },
  discussions: {
    title: 'No Discussions',
    description: 'Start a conversation to collaborate with your team',
  },
  payments: {
    title: 'No Payments',
    description: 'No payment records found',
  },
  generic: {
    title: 'No Data',
    description: 'This section is currently empty',
  },
}

const EmptyState = memo(({
  variant = 'no-data',
  icon: CustomIcon,
  title: customTitle,
  description: customDescription,
  action,
  entityType = 'generic',
}: EmptyStateProps) => {
  // Determine icon, title, and description
  const defaultEntityConfig = entityMessages[entityType]
  const variantConfig = defaultConfig[variant]

  const Icon = CustomIcon || (variant === 'no-data' ? entityIcons[entityType] : variantConfig.icon)
  const title = customTitle || (variant === 'no-data' ? defaultEntityConfig.title : variantConfig.title)
  const description = customDescription || (variant === 'no-data' ? defaultEntityConfig.description : variantConfig.description)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
        minHeight: 300,
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          mb: 3,
          color: 'text.secondary',
          opacity: 0.5,
        }}
      >
        <Icon sx={{ fontSize: 80 }} />
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: action ? 3 : 0, maxWidth: 400 }}
        >
          {description}
        </Typography>
      )}

      {/* Action Button */}
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  )
})

EmptyState.displayName = 'EmptyState'

export default EmptyState
