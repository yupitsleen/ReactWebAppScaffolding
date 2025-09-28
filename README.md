# Business Portal Scaffold

A production-ready, configuration-driven React portal designed for **instant business customization**. Senior developers can transform this into domain-specific applications through data configuration, not code rewrites.

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

## Business Customization (3-Step Process)

### 1. Business Identity (`src/data/configurableData.ts`)

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

### 2. Data Domain Mapping (`src/data/sampleData.ts`)

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

### 3. Field & Status Configuration

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

## Dashboard Configuration

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

## Business Domain Examples

### E-commerce Platform

```typescript
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "orders", label: "Orders", path: "/orders" },
  { id: "products", label: "Products", path: "/products" },
  { id: "customers", label: "Customers", path: "/customers" },
];
```

### SaaS Platform

```typescript
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "team", label: "Team", path: "/team" },
  { id: "billing", label: "Billing", path: "/billing" },
];
```

### Medical Practice

```typescript
navigation: [
  { id: "appointments", label: "Appointments", path: "/appointments" },
  { id: "patients", label: "Patients", path: "/patients" },
  { id: "records", label: "Records", path: "/records" },
];
```

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

### Key Abstractions

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

### Performance Features

- **React.memo** on all components prevents unnecessary re-renders
- **Lazy loading** for route components
- **Memoized contexts** prevent cascading updates
- **Optimized abstractions** handle large datasets efficiently

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

- **Environment configuration** ready for deployment
- **API client** prepared for backend integration
- **Azure AD authentication** service ready
- **Error boundaries** for graceful failure handling
- **TypeScript strict mode** with 100% type coverage
- **Performance optimized** for large datasets

**Ready to fork and customize!** Transform this generic portal into your business application through configuration, not code rewrites.
