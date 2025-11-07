# Feature Flags System

## Overview

The React Web App Scaffolding includes a **configuration-driven feature flag system** that allows you to enable or disable features without modifying code. This is perfect for:

- 🎯 **Customizing your deployment** - Show only relevant features for your business
- 🚀 **Progressive rollout** - Enable features gradually
- 🧪 **A/B testing** - Test different feature combinations
- 💼 **Multi-tenant apps** - Different features for different customers
- 📦 **Simplified builds** - One codebase, multiple configurations

## Quick Start

### 1. Configure Features

Edit `src/data/configurableData.ts`:

```typescript
export const appConfig: AppConfig = {
  // ... other config

  features: {
    // Disable dark mode
    darkMode: false,

    // Disable discussions page
    pages: {
      discussions: false,
    },

    // Disable delete operations
    crud: {
      delete: false,
    }
  }
}
```

### 2. Use in Components

```typescript
import { useFeature } from '../hooks/useFeature'

function MyComponent() {
  const { isEnabled, canPerformCrud } = useFeature()

  return (
    <>
      {isEnabled('darkMode') && <DarkModeToggle />}
      {canPerformCrud('delete') && <DeleteButton />}
    </>
  )
}
```

## Available Feature Flags

### UI Features

Control which UI enhancements are available:

| Feature | Default | Description |
|---------|---------|-------------|
| `darkMode` | `true` | Dark mode toggle button |
| `highContrastMode` | `true` | High contrast accessibility mode |
| `layoutDensity` | `true` | Density selector (compact/comfortable/spacious) |
| `commandPalette` | `true` | Command palette (Cmd/Ctrl+K) |
| `pdfExport` | `true` | PDF export functionality |
| `keyboardShortcuts` | `true` | Keyboard shortcuts (Ctrl+H, Ctrl+T, etc.) |
| `notifications` | `true` | Notification bell and system |

**Example:**
```typescript
features: {
  darkMode: false,           // Hide dark mode toggle
  highContrastMode: true,    // Keep high contrast mode
  commandPalette: false,     // Disable command palette
}
```

### Pages

Control which pages appear in navigation and routing:

```typescript
features: {
  pages: {
    home: true,
    tasks: true,
    payments: true,
    documents: true,
    discussions: false,  // ❌ Discussions page hidden
    table: true,
    timeline: false,     // ❌ Timeline page hidden
    contact: true,
  }
}
```

**How it works:**
- Pages with `false` are removed from navigation
- Routes are automatically filtered out
- Links to disabled pages won't appear
- Direct URL access still shows NotFound page

### Authentication

Control login and auth-related features:

```typescript
features: {
  authentication: {
    enabled: true,                    // Set false to bypass login entirely
    allowGuest: false,                // Allow guest access without login
    rememberMe: true,                 // Show "Remember Me" checkbox
    requireEmailVerification: false,  // Require email verification
  }
}
```

**Use cases:**
- **Internal tools:** Set `enabled: false` to skip login
- **Public demos:** Set `allowGuest: true` for anonymous access
- **Enterprise:** Set `requireEmailVerification: true` for security

### CRUD Operations

Global defaults for create, read, update, delete operations:

```typescript
features: {
  crud: {
    create: true,   // Allow creating new entities
    edit: true,     // Allow editing existing entities
    delete: false,  // ❌ Disable delete operations
    export: true,   // Allow exporting data to CSV/PDF
    import: false,  // ❌ Disable data import
  }
}
```

**In components:**
```typescript
const { canPerformCrud } = useFeature()

{canPerformCrud('create') && <CreateButton />}
{canPerformCrud('edit') && <EditButton />}
{canPerformCrud('delete') && <DeleteButton />}
```

### Dashboard Features

Control what appears on the dashboard:

```typescript
features: {
  dashboard: {
    cards: true,          // Show summary cards
    sections: true,       // Show data sections (Recent Discussions, etc.)
    charts: false,        // Show charts/graphs (if implemented)
    quickActions: true,   // Show quick action buttons
  }
}
```

### Advanced Features

Premium/enterprise-level features:

```typescript
features: {
  advancedFiltering: true,   // Multi-field filtering
  advancedSorting: true,     // Multi-column sorting
  bulkOperations: false,     // Bulk edit/delete
  customFields: false,       // User-defined custom fields
  webhooks: false,           // Webhook integrations
  apiAccess: false,          // REST API access
}
```

## useFeature Hook API

### Import

```typescript
import { useFeature } from '../hooks/useFeature'
```

### Methods

#### `isEnabled(featurePath: string): boolean`

Check if a feature is enabled using dot notation:

```typescript
const { isEnabled } = useFeature()

// Top-level features
isEnabled('darkMode')           // true/false
isEnabled('commandPalette')     // true/false

// Nested features
isEnabled('pages.discussions')         // true/false
isEnabled('crud.delete')              // true/false
isEnabled('authentication.rememberMe') // true/false
isEnabled('dashboard.cards')          // true/false
```

#### `isPageEnabled(pageId: string): boolean`

Check if a specific page is enabled:

```typescript
const { isPageEnabled } = useFeature()

isPageEnabled('discussions')  // true/false
isPageEnabled('timeline')     // true/false
```

#### `canPerformCrud(operation: string): boolean`

Check if a CRUD operation is enabled:

```typescript
const { canPerformCrud } = useFeature()

canPerformCrud('create')  // true/false
canPerformCrud('edit')    // true/false
canPerformCrud('delete')  // true/false
canPerformCrud('export')  // true/false
canPerformCrud('import')  // true/false
```

#### `getEnabledPages(): string[]`

Get list of all enabled page IDs:

```typescript
const { getEnabledPages } = useFeature()

const enabledPages = getEnabledPages()
// ['home', 'tasks', 'payments', 'documents', 'contact']
```

#### `features: FeatureFlags`

Access the full feature flags object:

```typescript
const { features } = useFeature()

console.log(features.darkMode)
console.log(features.pages)
console.log(features.crud)
```

## Common Use Cases

### Example 1: Disable Discussions Page

**Goal:** Remove discussions from your app entirely.

**Configuration:**
```typescript
// src/data/configurableData.ts
features: {
  pages: {
    discussions: false,  // ❌ Hide discussions page
  }
}
```

**Result:**
- ✅ Discussions link removed from navigation
- ✅ `/discussions` route disabled (shows NotFound)
- ✅ Discussion dashboard card can be manually removed from `dashboardCards`

### Example 2: Read-Only Mode

**Goal:** Prevent users from creating, editing, or deleting data.

**Configuration:**
```typescript
features: {
  crud: {
    create: false,  // ❌ No create
    edit: false,    // ❌ No edit
    delete: false,  // ❌ No delete
    export: true,   // ✅ Still allow export
  }
}
```

**Implementation in pages:**
```typescript
const { canPerformCrud } = useFeature()

<PageLayout
  pageId="tasks"
  action={canPerformCrud('create') && (
    <Button onClick={handleCreate}>Create Task</Button>
  )}
>
  <DataTable
    data={tasks}
    onRowClick={canPerformCrud('edit') ? handleEdit : undefined}
    onDelete={canPerformCrud('delete') ? handleDelete : undefined}
  />
</PageLayout>
```

### Example 3: Minimal UI (No Theme Customization)

**Goal:** Simple app without dark mode, color picker, or density options.

**Configuration:**
```typescript
features: {
  darkMode: false,           // ❌ No dark mode toggle
  highContrastMode: false,   // ❌ No high contrast
  layoutDensity: false,      // ❌ No density selector
  commandPalette: false,     // ❌ No command palette
}
```

**Result:**
- ✅ Clean header with fewer buttons
- ✅ Simpler UI for non-technical users
- ✅ Reduced cognitive load

### Example 4: Public Demo Mode

**Goal:** Allow anyone to view the app without login.

**Configuration:**
```typescript
features: {
  authentication: {
    enabled: false,   // ❌ Skip login screen
  },
  crud: {
    create: false,    // ❌ Read-only for guests
    edit: false,
    delete: false,
  }
}
```

**Implementation:**
```typescript
// App.tsx will automatically skip login if authentication.enabled = false
// CRUD buttons will be hidden per the crud config above
```

### Example 5: Enterprise Edition

**Goal:** Enable advanced features for paying customers.

**Configuration:**
```typescript
features: {
  advancedFiltering: true,
  advancedSorting: true,
  bulkOperations: true,      // 🎯 Premium feature
  customFields: true,        // 🎯 Premium feature
  webhooks: true,            // 🎯 Premium feature
  apiAccess: true,           // 🎯 Premium feature
  pdfExport: true,
}
```

## How It Works

### Architecture

1. **Type-Safe Configuration** - `FeatureFlags` interface in `types/portal.ts`
2. **Centralized Config** - `appConfig.features` in `configurableData.ts`
3. **React Hook** - `useFeature()` for accessing flags in components
4. **Automatic Filtering** - Navigation and routes filtered by flags
5. **Conditional Rendering** - Components check flags before rendering

### Integration Points

**Navigation (`useNavigation` hook):**
```typescript
// Filters pages by both navigation.enabled AND features.pages
const enabledPages = allPages.filter(page =>
  page.enabled && isPageEnabled(page.id)
)
```

**Routes (`App.tsx`):**
```typescript
// Only generates routes for enabled pages
const routes = useMemo(() => {
  const allRoutes = generateRoutesFromConfig(appConfig)
  return allRoutes.filter(route => isPageEnabled(route.id))
}, [isPageEnabled])
```

**Components (`Layout.tsx`, etc.):**
```typescript
{isEnabled('darkMode') && <DarkModeToggle />}
{isEnabled('commandPalette') && <CommandPalette />}
{isEnabled('notifications') && <NotificationBell />}
```

## Default Values

If you don't specify a `features` object in your config, **all features are enabled by default**. This ensures backward compatibility with existing apps.

```typescript
// Default behavior (all features ON)
const defaultFeatures: FeatureFlags = {
  darkMode: true,
  highContrastMode: true,
  layoutDensity: true,
  commandPalette: true,
  pdfExport: true,
  keyboardShortcuts: true,
  notifications: true,
  pages: {},  // All pages enabled
  authentication: { enabled: true, allowGuest: false, rememberMe: true },
  crud: { create: true, edit: true, delete: true, export: true, import: false },
  dashboard: { cards: true, sections: true, charts: false, quickActions: true },
  advancedFiltering: true,
  advancedSorting: true,
  bulkOperations: false,
  customFields: false,
  webhooks: false,
  apiAccess: false,
}
```

## Best Practices

### 1. Start with All Features Enabled

Begin with the default configuration and selectively disable what you don't need:

```typescript
features: {
  // Only specify what you want to DISABLE
  pages: {
    discussions: false,
  },
  crud: {
    delete: false,
  }
  // Everything else stays enabled by default
}
```

### 2. Use Semantic Names

When extending with custom features, use clear, descriptive names:

```typescript
// ✅ Good
features: {
  exportToExcel: true,
  emailNotifications: true,
  twoFactorAuth: false,
}

// ❌ Avoid
features: {
  feature1: true,
  newThing: false,
}
```

### 3. Document Your Decisions

Add comments explaining why features are disabled:

```typescript
features: {
  pages: {
    discussions: false,  // Customer requested removal for v1
    timeline: false,     // Not needed for this industry
  }
}
```

### 4. Test Both States

When building components, test with features both ON and OFF:

```typescript
// Test with feature enabled
features: { darkMode: true }

// Test with feature disabled
features: { darkMode: false }
```

### 5. Graceful Degradation

Ensure your app works even if features are disabled:

```typescript
// ✅ Good - Handles missing feature gracefully
{isEnabled('pdfExport') && <ExportButton />}
{!isEnabled('pdfExport') && <p>Export not available</p>}

// ❌ Avoid - App breaks if feature disabled
<ExportButton />  // Always shows, might crash if pdfExport=false
```

## Extending the System

### Adding New Features

1. **Update TypeScript interface:**

```typescript
// src/types/portal.ts
export interface FeatureFlags {
  // ... existing features

  // Your new feature
  advancedReporting: boolean
}
```

2. **Set default in config:**

```typescript
// src/data/configurableData.ts
features: {
  // ... existing features
  advancedReporting: false,
}
```

3. **Use in components:**

```typescript
const { isEnabled } = useFeature()

{isEnabled('advancedReporting') && <AdvancedReports />}
```

### Per-Entity Feature Overrides

You can extend the system to support per-entity flags:

```typescript
export interface FeatureFlags {
  // Global CRUD
  crud: { ... },

  // Per-entity overrides
  entityFeatures?: {
    todoItem: {
      crud: { delete: false }  // Disable delete for tasks only
    },
    document: {
      crud: { edit: false }    // Read-only documents
    }
  }
}
```

## Troubleshooting

### Feature still appears after disabling

**Problem:** Set `darkMode: false` but toggle still shows

**Solution:**
1. Check `configurableData.ts` - ensure `features` object exists
2. Verify component uses `isEnabled('darkMode')` check
3. Clear browser cache and reload
4. Check for hardcoded components not using feature flags

### Routes not filtering

**Problem:** Disabled page still accessible via direct URL

**Solution:**
- Ensure `App.tsx` filters routes by `isPageEnabled(route.id)`
- Check that `useNavigation` hook integrates `useFeature`
- Verify page `id` matches between navigation config and feature flags

### Tests failing after adding features

**Problem:** Tests fail after implementing feature flags

**Solution:**
- Update test configs to include `features` object
- Mock `useFeature` hook in tests
- Set all features to `true` for baseline tests

```typescript
// In tests
const mockFeatures = {
  features: {
    darkMode: true,
    // ... all features enabled
  }
}
```

## Migration Guide

### From No Feature Flags → With Feature Flags

**Before:**
```typescript
// Components always rendered
<DarkModeToggle />
<DeleteButton />
```

**After:**
```typescript
// Components conditionally rendered
const { isEnabled, canPerformCrud } = useFeature()

{isEnabled('darkMode') && <DarkModeToggle />}
{canPerformCrud('delete') && <DeleteButton />}
```

### Gradual Migration

You can migrate components incrementally:

1. Add `features` config with all `true` (no behavior change)
2. Update components one at a time to use `isEnabled()`
3. Test each component individually
4. Once all migrated, start disabling features as needed

## Comparison: Feature Flags vs Traditional Approaches

| Approach | Pros | Cons |
|----------|------|------|
| **Feature Flags (This system)** | ✅ Single config file<br>✅ No code changes<br>✅ Type-safe<br>✅ Zero dependencies | ❌ Manual implementation<br>❌ No A/B testing built-in |
| **LaunchDarkly / Unleash** | ✅ Remote config<br>✅ A/B testing<br>✅ Analytics | ❌ External dependency<br>❌ Costs money<br>❌ Requires internet |
| **Environment Variables** | ✅ Build-time flags<br>✅ Simple | ❌ Requires rebuild<br>❌ Not runtime-configurable |
| **Commenting Code** | ✅ Very simple | ❌ Code clutter<br>❌ Merge conflicts<br>❌ Not scalable |

**Recommendation:** Use this system for most use cases. Upgrade to LaunchDarkly/Unleash only if you need remote management or advanced analytics.

---

## Summary

The feature flags system provides:

- ✅ **Zero dependencies** - No external libraries required
- ✅ **Type-safe** - TypeScript catches configuration errors
- ✅ **Single source of truth** - All flags in `configurableData.ts`
- ✅ **Easy to use** - Simple `isEnabled()` hook
- ✅ **Automatic filtering** - Routes and navigation updated automatically
- ✅ **Backward compatible** - Works with existing apps (all features ON by default)

Perfect for customizing your scaffold for different business domains, deployments, or customer tiers!
