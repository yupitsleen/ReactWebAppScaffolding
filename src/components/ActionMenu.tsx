import { memo, type ReactNode } from 'react'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import {
  Download,
  Share,
  Edit,
  Delete,
  Support,
  Visibility,
  CheckCircle,
  PlayArrow,
  Pause,
  Refresh,
  Add,
  Search,
  FilterList,
  Sort,
  MoreVert
} from '@mui/icons-material'
import type { ActionButton } from '../types/portal'
import { useEntityActions } from '../hooks/useEntityActions'

interface ActionMenuProps {
  actions: ActionButton[]
  entity?: Record<string, unknown>
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  spacing?: number
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
}

const ActionMenu = memo<ActionMenuProps>(({
  actions,
  entity,
  orientation = 'horizontal',
  showLabels = true,
  spacing = 1,
  justifyContent = 'flex-start'
}) => {
  const { executeAction, isActionAvailable } = useEntityActions()

  const iconMap: Record<string, ReactNode> = {
    Download: <Download />,
    Share: <Share />,
    Edit: <Edit />,
    Delete: <Delete />,
    Support: <Support />,
    View: <Visibility />,
    Complete: <CheckCircle />,
    Resume: <PlayArrow />,
    Pend: <Pause />,
    Resolve: <CheckCircle />,
    Reopen: <Refresh />,
    Add: <Add />,
    Search: <Search />,
    Filter: <FilterList />,
    Sort: <Sort />,
    More: <MoreVert />,
  }

  const availableActions = actions.filter(action =>
    isActionAvailable(action.id, entity)
  )

  if (availableActions.length === 0) {
    return null
  }

  const renderActionButton = (action: ActionButton) => {
    const icon = action.icon ? iconMap[action.icon as keyof typeof iconMap] : null
    const handleClick = () => executeAction(action, entity)

    if (!showLabels && icon) {
      return (
        <Tooltip title={action.label} key={action.id}>
          <IconButton
            size={action.size || 'medium'}
            color={action.color || 'primary'}
            onClick={handleClick}
            sx={{
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )
    }

    return (
      <Button
        key={action.id}
        variant={action.variant || 'contained'}
        color={action.color || 'primary'}
        size={action.size || 'medium'}
        startIcon={icon}
        onClick={handleClick}
        sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: (theme) => theme.shadows[4],
          }
        }}
      >
        {action.label}
      </Button>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: spacing,
        justifyContent,
        alignItems: 'center',
        flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
      }}
    >
      {availableActions.map(renderActionButton)}
    </Box>
  )
})

ActionMenu.displayName = 'ActionMenu'

export default ActionMenu