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

// Centralized icon registry to avoid wildcard imports
// Only import icons actually used in the application
export const iconRegistry: Record<string, React.ComponentType> = {
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
}

export const getIconComponent = (iconName: string): ReactNode => {
  const IconComponent = iconRegistry[iconName]
  return IconComponent ? <IconComponent /> : null
}
