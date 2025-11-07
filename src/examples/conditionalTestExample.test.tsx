/**
 * Example: How to conditionally run tests based on feature flags
 *
 * This file demonstrates various patterns for testing features that can be
 * enabled/disabled via feature flags.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { isFeatureEnabled, isPageEnabled, isCrudEnabled, describeIfEnabled, itIfEnabled } from '../test-utils/featureTestUtils'

// Mock component for demonstration
function DarkModeToggle() {
  return <button>Toggle Dark Mode</button>
}

function DeleteButton() {
  return <button>Delete</button>
}

function DiscussionsPage() {
  return <div>Discussions Page Content</div>
}

// ============================================================================
// Pattern 1: Skip entire test suite if feature is disabled
// ============================================================================

describe.skipIf(!isFeatureEnabled('darkMode'))('Dark Mode Tests', () => {
  it('renders dark mode toggle', () => {
    render(<DarkModeToggle />)
    expect(screen.getByRole('button', { name: /toggle dark mode/i })).toBeInTheDocument()
  })

  it('toggles dark mode on click', () => {
    // Test only runs if darkMode feature is enabled
    expect(true).toBe(true)
  })
})

// ============================================================================
// Pattern 2: Skip individual tests
// ============================================================================

describe('CRUD Operations', () => {
  it('creates items', () => {
    // Always runs
    expect(true).toBe(true)
  })

  it.skipIf(!isCrudEnabled('delete'))('deletes items', () => {
    // Only runs if delete operation is enabled
    render(<DeleteButton />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it.skipIf(!isCrudEnabled('import'))('imports data', () => {
    // Only runs if import operation is enabled (disabled by default)
    expect(true).toBe(true)
  })
})

// ============================================================================
// Pattern 3: Using helper functions for better readability
// ============================================================================

describeIfEnabled('commandPalette', 'Command Palette', () => {
  it('opens with Cmd+K', () => {
    expect(isFeatureEnabled('commandPalette')).toBe(true)
  })

  it('searches pages', () => {
    expect(true).toBe(true)
  })
})

// ============================================================================
// Pattern 4: Page-specific tests
// ============================================================================

describeIfEnabled('pages.discussions', 'Discussions Page', () => {
  it('renders discussions list', () => {
    render(<DiscussionsPage />)
    expect(screen.getByText(/discussions page content/i)).toBeInTheDocument()
  })

  itIfEnabled('crud.create', 'allows creating new discussions', () => {
    // Only runs if both discussions page AND create operation are enabled
    expect(isPageEnabled('discussions')).toBe(true)
    expect(isCrudEnabled('create')).toBe(true)
  })
})

// ============================================================================
// Pattern 5: Conditional test within a suite
// ============================================================================

describe('Layout Component', () => {
  it('always renders header', () => {
    expect(true).toBe(true)
  })

  describe('optional features', () => {
    if (isFeatureEnabled('notifications')) {
      it('renders notification bell', () => {
        expect(true).toBe(true)
      })
    }

    if (isFeatureEnabled('darkMode')) {
      it('renders dark mode toggle', () => {
        expect(true).toBe(true)
      })
    }

    if (isFeatureEnabled('layoutDensity')) {
      it('renders density selector', () => {
        expect(true).toBe(true)
      })
    }
  })
})

// ============================================================================
// Pattern 6: Multiple feature dependencies
// ============================================================================

describe.skipIf(
  !isFeatureEnabled('advancedFiltering') || !isFeatureEnabled('advancedSorting')
)('Advanced Data Table Features', () => {
  it('filters and sorts data', () => {
    // Only runs if BOTH advancedFiltering AND advancedSorting are enabled
    expect(isFeatureEnabled('advancedFiltering')).toBe(true)
    expect(isFeatureEnabled('advancedSorting')).toBe(true)
  })
})

// ============================================================================
// Pattern 7: Feature-dependent test data
// ============================================================================

describe('Navigation', () => {
  it('renders enabled pages in navigation', () => {
    const expectedPages = []

    if (isPageEnabled('home')) expectedPages.push('Home')
    if (isPageEnabled('tasks')) expectedPages.push('Tasks')
    if (isPageEnabled('discussions')) expectedPages.push('Discussions')

    expect(expectedPages.length).toBeGreaterThan(0)
  })
})

// ============================================================================
// Pattern 8: Informative skip messages
// ============================================================================

describe('Premium Features', () => {
  const bulkOpsEnabled = isFeatureEnabled('bulkOperations')

  describe.skipIf(!bulkOpsEnabled)(
    `Bulk Operations ${bulkOpsEnabled ? '' : '(disabled in config)'}`,
    () => {
      it('bulk edits items', () => {
        expect(true).toBe(true)
      })

      it('bulk deletes items', () => {
        expect(true).toBe(true)
      })
    }
  )
})

// ============================================================================
// Pattern 9: Run-only tests (useful during development)
// ============================================================================

describe('Development Focus', () => {
  // Run ONLY this test if working on a specific feature
  it.runIf(isFeatureEnabled('customFields') && process.env.DEV_FOCUS === 'customFields')(
    'custom fields work correctly',
    () => {
      expect(true).toBe(true)
    }
  )
})
