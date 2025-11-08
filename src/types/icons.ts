/**
 * Centralized icon name constants
 * Prevents hard-coded string duplication across components
 */
export const IconNames = {
  // Actions
  ADD: 'Add',
  EDIT: 'Edit',
  DELETE: 'Delete',
  VISIBILITY: 'Visibility',
  CHECK_CIRCLE: 'CheckCircle',
  PLAY_ARROW: 'PlayArrow',
  PAUSE: 'Pause',
  REFRESH: 'Refresh',
  DOWNLOAD: 'Download',
  SHARE: 'Share',
  MORE_VERT: 'MoreVert',

  // Status
  WARNING: 'Warning',
  SUPPORT: 'Support',

  // Navigation
  SEARCH: 'Search',
  FILTER_LIST: 'FilterList',
  SORT: 'Sort',

  // Trending
  TRENDING_UP: 'TrendingUp',
  TRENDING_DOWN: 'TrendingDown',

  // Entity types
  ASSIGNMENT_TURNED_IN: 'AssignmentTurnedIn',
  PAYMENT: 'Payment',
  DESCRIPTION: 'Description',
  FORUM: 'Forum',
} as const

export type IconName = typeof IconNames[keyof typeof IconNames]

/**
 * Icon aliases for action-specific naming
 * Maps user-friendly action names to icon registry names
 */
export const IconAliases: Record<string, IconName> = {
  View: IconNames.VISIBILITY,
  Complete: IconNames.CHECK_CIRCLE,
  Resume: IconNames.PLAY_ARROW,
  Pend: IconNames.PAUSE,
  Resolve: IconNames.CHECK_CIRCLE,
  Reopen: IconNames.REFRESH,
  Filter: IconNames.FILTER_LIST,
  More: IconNames.MORE_VERT,
}
