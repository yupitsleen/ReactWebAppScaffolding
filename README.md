# Business Portal Scaffold

A production-ready, configuration-driven React portal designed for **instant business customization**. Transform this into domain-specific applications through data configuration, not code rewrites.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Philosophy](#architecture-philosophy)
- [Key Features](#key-features)
- [Business Customization](#business-customization)
- [Technical Architecture](#technical-architecture)
- [Development Workflow](#development-workflow)
- [Session Management for Claude Code](#session-management-for-claude-code)
- [Development Commands](#development-commands)
- [Customization Priority](#customization-priority)

## Architecture Philosophy

- **Configuration Over Code** - 90% customization through data files
- **Smart Abstractions** - Generic components adapt to any business domain
- **Offline-First Development** - Full CRUD operations without backend running
- **Quality Assured** - 62 tests (56 frontend + 6 backend) ensure stability
- **Performance First** - React.memo, memoization, lazy loading throughout

## Quick Start

### Try the Demo

```bash
# Frontend only (works immediately)
npm install && npm run dev    # → http://localhost:5173

# Optional: Backend API
cd PortalAPI && dotnet run    # → http://localhost:5276
```

**No backend required** - Frontend automatically uses mock data when API unavailable, seamlessly connects when backend starts.

### Customize Your App

<details>
<summary><strong>Step 1: Clone and Setup (5 minutes)</strong></summary>

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_APP_NAME.git
cd YOUR_APP_NAME
npm install && npm run dev
```

Verify at http://localhost:5173

</details>

<details>
<summary><strong>Step 2: Customize Identity (10 minutes)</strong></summary>

**File: `src/data/configurableData.ts`**

```typescript
export const appConfig: AppConfig = {
  appName: "Your Business Portal",

  navigation: [
    { id: "home", label: "Home", path: "/", enabled: true },
    { id: "orders", label: "Orders", path: "/orders", enabled: true },
    { id: "customers", label: "Customers", path: "/customers", enabled: true },
  ],

  theme: {
    primaryColor: "#1976d2",
    secondaryColor: "#f57c00",
    mode: "light",
  },
};
```

</details>

<details>
<summary><strong>Step 3: Replace Sample Data (15 minutes)</strong></summary>

**File: `src/data/sampleData.ts`**

```typescript
// Transform todoItems → orders
export const orders = [
  {
    id: "ORD-001",
    customerName: "Acme Corp",
    product: "Widget Pro",
    quantity: 50,
    status: "processing",
    total: 2499.99,
    orderDate: "2024-02-15",
  },
];
```

**Update types:** `src/types/portal.ts`  
**Update context:** `src/context/ContextProvider.tsx`

</details>

<details>
<summary><strong>Step 4: Configure Status & Fields (10 minutes)</strong></summary>

```typescript
statusConfig: {
  orderStatus: {
    pending: { color: "warning", label: "Pending" },
    processing: { color: "info", label: "Processing" },
    shipped: { color: "success", label: "Shipped" }
  }
},

fieldConfig: {
  order: {
    primary: "customerName",
    secondary: ["status", "total", "orderDate"],
    hidden: ["id", "internalNotes"]
  }
}
```

</details>

<details>
<summary><strong>Step 5: Customize Pages (30 minutes)</strong></summary>

```tsx
// Rename Tasks.tsx → Orders.tsx
import { useData } from "../context/ContextProvider";

const Orders = memo(() => {
  const { orders } = useData();

  return (
    <PageLayout pageId="orders">
      <DataTable
        data={orders}
        columns={[
          { field: "customerName", header: "Customer", width: "30%" },
          { field: "product", header: "Product", width: "25%" },
          {
            field: "status",
            header: "Status",
            render: (value, row) => (
              <FieldRenderer
                field="status"
                value={value}
                entity={row}
                variant="chip"
              />
            ),
          },
        ]}
        sortable
        filterable
        paginated
      />
    </PageLayout>
  );
});
```

Update `App.tsx` routing to map navigation id to component

</details>

**Estimated customization time:** 2-4 hours

## Key Features

- **DataTable** - Reusable table with sorting, filtering, pagination, custom renderers
- **Timeline** - Interactive visualization with color-coded status indicators
- **FieldRenderer** - Automatic field type handling (dates, currency, status, priority)
- **FallbackEntityService** - Tries API first, falls back to mock data, retries every 30s
- **Google Maps Integration** - Embedded maps with service locations
- **Backend API** - .NET 8.0 with Entity Framework Core + SQLite

## Business Customization

### Data Domain Mapping

Generic structures map to most business domains:

| Generic       | E-commerce   | SaaS          | Medical      | Manufacturing  |
| ------------- | ------------ | ------------- | ------------ | -------------- |
| `todoItems`   | Orders       | Tasks         | Appointments | Work Orders    |
| `payments`    | Transactions | Subscriptions | Billing      | Invoices       |
| `documents`   | Receipts     | Documentation | Records      | Specifications |
| `discussions` | Support      | Team Chat     | Notes        | Communication  |

<details>
<summary><strong>Business Domain Examples</strong></summary>

**E-commerce:**

```typescript
navigation: [
  { id: "orders", label: "Orders", path: "/orders" },
  { id: "products", label: "Products", path: "/products" },
  { id: "customers", label: "Customers", path: "/customers" },
];
```

**SaaS Platform:**

```typescript
navigation: [
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "team", label: "Team", path: "/team" },
  { id: "billing", label: "Billing", path: "/billing" },
];
```

**Medical Practice:**

```typescript
navigation: [
  { id: "appointments", label: "Appointments", path: "/appointments" },
  { id: "patients", label: "Patients", path: "/patients" },
  { id: "records", label: "Records", path: "/records" },
];
```

</details>

### Dashboard Configuration

<details>
<summary><strong>Key Metrics & Data Sections</strong></summary>

```typescript
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

### Live Theme Testing

```javascript
// Browser console commands
setThemeColor("primary-color", "#e91e63"); // Pink theme
applyColorPreset("blue"); // Corporate blue
applyColorPreset("green"); // Nature theme
```

## Technical Architecture

### Tech Stack

**Frontend:** React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.0 + Material-UI  
**Backend:** .NET 8.0 + ASP.NET Core + Entity Framework Core + SQLite  
**Tests:** 62 tests (56 frontend + 6 backend)

<details>
<summary><strong>Key Abstractions</strong></summary>

**DataTable Component:**

```tsx
<DataTable
  data={items}
  columns={[
    { field: 'title', header: 'Title', width: '40%' },
    { field: 'status', header: 'Status', render: (value, row) => <FieldRenderer ... /> }
  ]}
  sortable
  filterable
  paginated
  onRowClick={handleEdit}
/>
```

**PageLayout Component:**

```tsx
<PageLayout pageId="orders" loading={loading}>
  {content}
</PageLayout>
```

**FallbackEntityService:**

```typescript
// Tries API first, falls back to mock on error, retries every 30s
export const todosService = new FallbackEntityService<TodoItem>(
  "Tasks",
  "/api/todo",
  todoItems
);
```

**Timeline Visualization:**

- Proportional date positioning
- Color-coded status (red=overdue, yellow=today, blue=upcoming, green=completed)
- Interactive tooltips and click details
</details>

<details>
<summary><strong>Performance Features</strong></summary>

- React.memo on all components prevents unnecessary re-renders
- Lazy loading for route components
- Memoized contexts prevent cascading updates
- Optimized abstractions handle large datasets efficiently
- Layout classes reduce inline styles
</details>

## Development Workflow

### Frontend-First Development

```bash
# Start frontend (works immediately)
npm run dev

# Full CRUD with mock data - no backend needed

# Optional: Start backend
cd PortalAPI && dotnet run

# Frontend automatically:
# - Detects API
# - Connects to backend
# - Switches from mock to real data
```

**Development Modes:**

- **Mock (backend off):** UI dev, components, prototyping
- **API (backend on):** Integration testing, DB changes, full-stack features

**Testing:**

```bash
npm test           # 56 frontend tests (no backend needed)
cd PortalAPI
dotnet test        # 6 backend integration tests
```

## Session Management for Claude Code

<details>
<summary><strong>Continuous Session Tracking</strong></summary>

```bash
# Initial setup
claude code --file CLAUDE.md "Read project guide and create CURRENT_SESSION.md"

# During development
claude code "Update CURRENT_SESSION.md with our progress"

# Pre-compaction
claude code "Update CURRENT_SESSION.md with accomplishments and priorities. Suggest CLAUDE.md improvements based on lessons learned."

# Session recovery
claude code --file CLAUDE.md --file CURRENT_SESSION.md "Continue where we left off"
```

**Session File Structure:**

- Current Work - Active tasks
- Completed Today - Finished items
- Next Priorities - Upcoming tasks
- Architecture Decisions - Technical choices
- Files Modified - Changed files
- Recovery Notes - Context for next session
</details>

## File Structure

```
src/
├── data/
│   ├── configurableData.ts    # Main customization file
│   └── sampleData.ts          # Replace with your data
├── components/
│   ├── DataTable.tsx          # Reusable table
│   ├── FieldRenderer.tsx      # Field type handling
│   └── PageLayout.tsx         # Page wrapper
├── pages/                     # Route components
├── services/
│   ├── fallbackService.ts     # Intelligent API fallback
│   └── index.ts               # Service configuration
└── theme/                     # Centralized styling

PortalAPI/
├── Controllers/               # HTTP handlers
├── Services/                  # Business logic
├── Models/                    # Entities
├── DTOs/                      # API contracts
└── Tests/                     # Integration tests
```

## Development Commands

```bash
# Frontend
npm run dev        # Dev server (localhost:5173)
npm run build      # Production build
npm test           # Run 56 tests
npm run lint       # Code quality

# Backend (optional)
dotnet run         # API server (localhost:5276)
dotnet test        # Run 6 integration tests
```

## Customization Priority

1. **5 minutes** - Update `configurableData.ts` and `sampleData.ts`
2. **30 minutes** - Add new status types, field types, actions
3. **2 hours** - Add new pages using DataTable and existing abstractions
4. **1 day** - Backend integration and authentication

## Production Ready Features

<details>
<summary><strong>Enterprise Features</strong></summary>

**Frontend:**

- Offline-first with FallbackEntityService
- Error boundaries for graceful failures
- TypeScript strict mode, 100% type coverage
- Performance optimized for large datasets
- State persistence with localStorage

**Backend:**

- Service layer with dependency injection
- Custom JSON converters for enum serialization
- DTO pattern for API contracts
- Repository pattern (optional)
- Integration tests with WebApplicationFactory

**Developer Experience:**

- Backend optional for frontend development
- Automatic API detection and reconnection
- Console warnings show system state
- Session management for Claude Code
- Comprehensive documentation
</details>

---

**Test Coverage:** 62 tests (56 frontend + 6 backend) ✓  
**Frontend-First:** Works without backend, seamlessly connects when available  
**Production-Ready:** Enterprise patterns, performance optimized, fully typed

**Ready to fork and customize!** Transform this into your business application through configuration, not code rewrites.
