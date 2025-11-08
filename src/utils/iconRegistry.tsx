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
  TrendingDown
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
  TrendingDown
}

export const getIconComponent = (iconName: string): ReactNode => {
  const IconComponent = iconRegistry[iconName]
  return IconComponent ? <IconComponent /> : null
}
