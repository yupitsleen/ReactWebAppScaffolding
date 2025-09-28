# Business Portal Scaffold

A production-ready, configuration-driven React portal designed for **instant business customization**. Developers can transform this into domain-specific applications through data configuration, not code rewrites.

## Table of Contents

- [Quick Start](#quick-start)
- [Business Customization](#business-customization)
- [Dashboard Configuration](#dashboard-configuration)
- [Business Domain Examples](#business-domain-examples)
- [Live Theme Testing](#live-theme-testing)
- [Technical Architecture](#technical-architecture)
- [Session Management for Claude Code](#session-management-for-claude-code)
- [File Structure](#file-structure)
- [Development Commands](#development-commands)
- [Customization Priority](#customization-priority)
- [Production Ready Features](#production-ready-features)

## Architecture Philosophy

- **Configuration Over Code** - 90% customization through data files
- **Smart Abstractions** - Generic components adapt to any business domain
- **Quality Assured** - 86 tests ensure stability during customization
- **Performance First** - React.memo, memoization, lazy loading throughout

## Quick Start

```bash
git clone [repository]
npm install && npm run dev    # → http://localhost:5173
```

## Business Customization

### 3-Step Process

<details>
<summary><strong>1. Business Identity</strong> (<code>src/data/configurableData.ts</code>)</summary>

```typescript
export const appConfig: AppConfig = {
  appName: "Your Business Portal",

  // Your navigation structure
  navigation: [
    { id: "orders", label: "Orders", path: "/orders", enabled: true },
    { id: "customers", label: "Customers", path: "/customers", enabled: true },
    { id: "inventory", label: "Inventory", path: "/inventory", enabled: true },
  ],

  // Your brand colors
  theme: {
    primaryColor: "#1976d2",
    secondaryColor: "#f57c00",
    mode: "light",
  },
};
```

</details>

<details>
<summary><strong>2. Data Domain Mapping</strong> (<code>src/data/sampleData.ts</code>)</summary>

The scaffold uses generic structures that map to most business domains:

| Generic       | E-commerce   | SaaS          | Medical      | Manufacturing  |
| ------------- | ------------ | ------------- | ------------ | -------------- |
| `todoItems`   | Orders       | Tasks         | Appointments | Work Orders    |
| `payments`    | Transactions | Subscriptions | Billing      | Invoices       |
| `documents`   | Receipts     | Documentation | Records      | Specifications |
| `discussions` | Support      | Team Chat     | Notes        | Communication  |

**Replace with your domain objects:**

```typescript
// Transform todoItems → orders
export const orders = [
  {
    id: "ORD-001",
    title: "Premium Widget Order",
    status: "processing",
    priority: "high",
    amount: 299.99,
    customer: "John Doe",
    dueDate: "2024-02-15",
  },
];
```

</details>

<details>
<summary><strong>3. Field & Status Configuration</strong></summary>

```typescript
// Define your business statuses
statusConfig: {
  orderStatus: {
    pending: { color: "warning", label: "Pending" },
    processing: { color: "info", label: "Processing" },
    shipped: { color: "success", label: "Shipped" },
    cancelled: { color: "error", label: "Cancelled" }
  }
},

// Control field display
fieldConfig: {
  order: {
    primary: "title",                           // Main heading
    secondary: ["status", "amount", "dueDate"], // Status chips
    hidden: ["id", "internalNotes"]            // Never display
  }
}
```

</details>

## Dashboard Configuration

<details>
<summary><strong>Key Metrics & Data Sections</strong></summary>

```typescript
// Key metrics cards
dashboardCards: [
  {
    title: "Monthly Revenue",
    dataSource: "payments",
    valueType: "sum",
    icon: "AttachMoney"
  },
  {
    title: "Active Orders",
    dataSource: "orders",
    valueType: "count",
    icon: "ShoppingCart"
  }
],

// Filtered data sections
dashboardSections: [
  {
    title: "Urgent Orders",
    dataSource: "orders",
    filterCriteria: { priority: "urgent", status: "!completed" },
    maxItems: 5
  }
]
```

</details>

## Business Domain Examples

<details>
<summary><strong>E-commerce Platform</strong></summary>

```typescript
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "orders", label: "Orders", path: "/orders" },
  { id: "products", label: "Products", path: "/products" },
  { id: "customers", label: "Customers", path: "/customers" },
];
```

</details>

<details>
<summary><strong>SaaS Platform</strong></summary>

```typescript
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "team", label: "Team", path: "/team" },
  { id: "billing", label: "Billing", path: "/billing" },
];
```

</details>

<details>
<summary><strong>Medical Practice</strong></summary>

```typescript
navigation: [
  { id: "appointments", label: "Appointments", path: "/appointments" },
  { id: "patients", label: "Patients", path: "/patients" },
  { id: "records", label: "Records", path: "/records" },
];
```

</details>

## Live Theme Testing

**Browser Console Commands:**

```javascript
// Test colors instantly without file changes
setThemeColor("primary-color", "#e91e63"); // Pink theme
applyColorPreset("blue"); // Corporate blue
applyColorPreset("green"); // Nature theme
```

## Technical Architecture

### Tech Stack

- **React 19.1.1** + **TypeScript 5.8.3** + **Vite 7.1.0**
- **Material-UI** + **React Router**
- **86 Tests** + **Strict TypeScript**

<details>
<summary><strong>Key Abstractions</strong></summary>

**PageLayout Component** - Universal page wrapper:

```tsx
<PageLayout pageId="orders" loading={loading}>
  {content}
</PageLayout>
```

**FieldRenderer Component** - Handles all field types (dates, currency, status):

```tsx
<FieldRenderer field="amount" value={299.99} variant="chip" />
```

**useDataOperations Hook** - Generic data manipulation:

```tsx
const { filteredData, sortData, filterData } = useDataOperations(orders);
```

</details>

<details>
<summary><strong>Performance Features</strong></summary>

- **React.memo** on all components prevents unnecessary re-renders
- **Lazy loading** for route components
- **Memoized contexts** prevent cascading updates
- **Optimized abstractions** handle large datasets efficiently
</details>

## Session Management for Claude Code

<details>
<summary><strong>Continuous Session Tracking</strong></summary>

When working with Claude Code, maintain session state to handle conversation compaction:

```bash
# Initial setup
claude code --file CLAUDE.md "Read project guide and update CURRENT_SESSION.md to track our development progress"

# During development
claude code "Update CURRENT_SESSION.md with our progress"

# Pre-compaction preparation
claude code "Update CURRENT_SESSION.md with everything we've accomplished and next priorities"

# Session recovery after compaction
claude code --file CLAUDE.md --file CURRENT_SESSION.md "Review project guide and continue where we left off"
```

### Session File Structure

Claude Code maintains `CURRENT_SESSION.md` with:

- **Current Work** - Active features and tasks
- **Completed Today** - Finished items with checkmarks
- **Next Priorities** - Upcoming tasks and priorities
- **Architecture Decisions** - Important technical decisions made
- **Files Modified** - List of changed files for context
- **Session Recovery Notes** - Key context for next session

This approach ensures seamless transitions between Claude Code sessions and preserves development context through conversation compaction.

</details>

## File Structure

```
src/
├── data/
│   ├── configurableData.ts    # ← Your main customization file
│   └── sampleData.ts          # ← Replace with your data
├── components/
│   ├── PageLayout.tsx         # Universal page wrapper
│   ├── FieldRenderer.tsx      # Universal field display
│   └── StatusChip.tsx         # Configurable status display
├── hooks/
│   ├── useDataOperations.ts   # Generic data manipulation
│   └── useNavigation.ts       # Navigation utilities
├── pages/                     # Route components
├── services/                  # API/auth (ready for backend)
└── theme/                     # Centralized styling
```

## Development Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm test           # Run all 86 tests
npm run lint       # Code quality checks
```

## Customization Priority

1. **High Impact, 5 minutes** - Update `configurableData.ts` and `sampleData.ts`
2. **Medium Impact, 30 minutes** - Add new status types, field types, actions
3. **High Impact, 2 hours** - Add new pages using existing abstractions
4. **Complex, 1 day** - Backend integration and authentication

## Production Ready Features

<details>
<summary><strong>Enterprise Features</strong></summary>

- **Environment configuration** ready for deployment
- **API client** prepared for backend integration
- **Azure AD authentication** service ready
- **Error boundaries** for graceful failure handling
- **TypeScript strict mode** with 100% type coverage
- **Performance optimized** for large datasets
</details>

**Ready to fork and customize!** Transform this generic portal into your business application through configuration, not code rewrites.
