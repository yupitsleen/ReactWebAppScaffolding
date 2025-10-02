/**
 * Reusable layout class definitions for MUI theme integration
 * Eliminates repeated inline sx patterns across components
 */

export const layoutClasses = {
  // Flex row with centered alignment (20+ occurrences replaced)
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  // Flex row with wrapping for responsive layouts
  flexRowWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap' as const,
  },

  // Flex column layout
  flexColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  // Empty state container (5+ occurrences replaced)
  emptyState: {
    textAlign: 'center' as const,
    padding: '64px 16px',
  },

  // Right-aligned action buttons (3+ occurrences replaced)
  actionsRight: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '16px',
  },

  // Standard section spacing
  sectionSpacing: {
    marginTop: '24px',
    marginBottom: '24px',
  },

  // Spacing utilities - small (8px)
  spacingSm: {
    margin: '8px 0',
  },

  spacingTopSm: {
    marginTop: '8px',
  },

  spacingBottomSm: {
    marginBottom: '8px',
  },

  // Spacing utilities - medium (16px)
  spacingMd: {
    margin: '16px 0',
  },

  spacingTopMd: {
    marginTop: '16px',
  },

  spacingBottomMd: {
    marginBottom: '16px',
  },

  // Spacing utilities - large (24px)
  spacingLg: {
    margin: '24px 0',
  },

  spacingTopLg: {
    marginTop: '24px',
  },

  spacingBottomLg: {
    marginBottom: '24px',
  },
}

export type LayoutClassKey = keyof typeof layoutClasses
