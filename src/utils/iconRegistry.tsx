import { type ReactNode } from 'react'
import {
  AssignmentTurnedIn,
  Payment,
  Description,
  Forum,
  Warning,
  CheckCircle,
  Download,
  Share,
  Edit,
  Support,
  TrendingUp,
  TrendingDown,
  Delete,
  Visibility,
  PlayArrow,
  Pause,
  Refresh,
  Add,
  Search,
  FilterList,
  Sort,
  MoreVert
} from '@mui/icons-material'
import { IconNames, type IconName } from '../types/icons'

/**
 * Centralized icon registry to avoid wildcard imports
 * Only imports icons actually used in the application
 *
 * Uses IconNames constants to prevent string duplication
 */
export const iconRegistry: Record<IconName, React.ComponentType> = {
  [IconNames.ASSIGNMENT_TURNED_IN]: AssignmentTurnedIn,
  [IconNames.PAYMENT]: Payment,
  [IconNames.DESCRIPTION]: Description,
  [IconNames.FORUM]: Forum,
  [IconNames.WARNING]: Warning,
  [IconNames.CHECK_CIRCLE]: CheckCircle,
  [IconNames.DOWNLOAD]: Download,
  [IconNames.SHARE]: Share,
  [IconNames.EDIT]: Edit,
  [IconNames.SUPPORT]: Support,
  [IconNames.TRENDING_UP]: TrendingUp,
  [IconNames.TRENDING_DOWN]: TrendingDown,
  [IconNames.DELETE]: Delete,
  [IconNames.VISIBILITY]: Visibility,
  [IconNames.PLAY_ARROW]: PlayArrow,
  [IconNames.PAUSE]: Pause,
  [IconNames.REFRESH]: Refresh,
  [IconNames.ADD]: Add,
  [IconNames.SEARCH]: Search,
  [IconNames.FILTER_LIST]: FilterList,
  [IconNames.SORT]: Sort,
  [IconNames.MORE_VERT]: MoreVert,
}

/**
 * Get an icon component by name
 *
 * @param iconName - Icon name from IconNames constants
 * @returns React icon component or null if not found
 */
export const getIconComponent = (iconName: string): ReactNode => {
  const IconComponent = iconRegistry[iconName as IconName]
  return IconComponent ? <IconComponent /> : null
}
