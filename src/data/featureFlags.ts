/**
 * Feature Flags Configuration
 *
 * Centralized feature flag management for the application.
 * Controls which features, pages, and functionality are available.
 *
 * Usage:
 * - Import and use with useFeature hook: `const { isEnabled } = useFeature()`
 * - Check features: `isEnabled('darkMode')` or `isEnabled('pages.tasks')`
 * - Override in appConfig.features to customize per deployment
 */

export interface FeatureFlags {
  // UI Features - Control which UI enhancements are available
  darkMode: boolean; // Dark mode toggle
  highContrastMode: boolean; // High contrast accessibility mode
  layoutDensity: boolean; // Compact/Comfortable/Spacious layout options
  commandPalette: boolean; // Cmd+K command palette
  pdfExport: boolean; // Export to PDF functionality
  keyboardShortcuts: boolean; // Global keyboard shortcuts
  notifications: boolean; // In-app notifications

  // Pages - Control which pages are available (overrides navigation.enabled)
  // Set to false to completely disable a page and remove from app
  // Uses index signature to allow any page ID
  pages: {
    [pageId: string]: boolean;
  };

  // Authentication - Control login/auth features
  authentication: {
    enabled: boolean; // Set to false to disable login entirely (auto-login as guest)
    allowGuest: boolean; // Allow guest access without login
    rememberMe: boolean; // Show "Remember Me" checkbox
    requireEmailVerification: boolean; // Require email verification for new accounts
  };

  // CRUD Operations - Global defaults (can be overridden per entity)
  crud: {
    create: boolean; // Allow creating new entities
    edit: boolean; // Allow editing existing entities
    delete: boolean; // Allow deleting entities
    export: boolean; // Allow exporting data to CSV/PDF
    import: boolean; // Allow importing data from files
  };

  // Dashboard Features - Control what appears on dashboard
  dashboard: {
    cards: boolean; // Show summary cards
    sections: boolean; // Show data sections (Recent Discussions, etc.)
    charts: boolean; // Show charts/graphs (if implemented)
    quickActions: boolean; // Show quick action buttons
  };

  // Advanced Features - Premium/enterprise features
  advancedFiltering: boolean; // Multi-field filtering
  advancedSorting: boolean; // Multi-column sorting
  bulkOperations: boolean; // Bulk edit/delete
  customFields: boolean; // User-defined custom fields
  webhooks: boolean; // Webhook integrations
  apiAccess: boolean; // REST API access
}

/**
 * Default feature flags
 *
 * These defaults provide a baseline configuration when features are undefined.
 * Most features are enabled by default for maximum flexibility.
 * Override in appConfig.features to customize per environment/deployment.
 */
export const DEFAULT_FEATURES: FeatureFlags = {
  // UI Features - All enabled by default
  darkMode: true,
  highContrastMode: true,
  layoutDensity: true,
  commandPalette: true,
  pdfExport: true,
  keyboardShortcuts: true,
  notifications: true,

  // Pages - Empty object by default (no pages disabled)
  pages: {},

  // Authentication - Enabled with standard options
  authentication: {
    enabled: true,
    allowGuest: false,
    rememberMe: true,
    requireEmailVerification: false,
  },

  // CRUD Operations - All enabled by default
  crud: {
    create: true,
    edit: true,
    delete: true,
    export: true,
    import: false,
  },

  // Dashboard Features - All enabled by default
  dashboard: {
    cards: true,
    sections: true,
    charts: false,
    quickActions: true,
  },

  // Advanced Features - Basic features enabled, enterprise disabled
  advancedFiltering: true,
  advancedSorting: true,
  bulkOperations: false,
  customFields: false,
  webhooks: false,
  apiAccess: false,
};
