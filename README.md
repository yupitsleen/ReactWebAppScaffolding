# Business Portal Scaffold

A production-ready, configuration-driven React portal designed for **instant business customization**. Developers can transform this into domain-specific applications through data configuration, not code rewrites.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Philosophy](#architecture-philosophy)
- [Key Features](#key-features)
- [Business Customization](#business-customization)
- [Dashboard Configuration](#dashboard-configuration)
- [Business Domain Examples](#business-domain-examples)
- [Live Theme Testing](#live-theme-testing)
- [Technical Architecture](#technical-architecture)
- [Development Workflow](#development-workflow)
- [Session Management for Claude Code](#session-management-for-claude-code)
- [File Structure](#file-structure)
- [Development Commands](#development-commands)
- [Production Ready Features](#production-ready-features)

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
cd PortalAPI
dotnet run                    # → http://localhost:5276
```

**No backend required** - Frontend automatically uses mock data when API unavailable, seamlessly connects when backend starts.

### Start Your Own App

After forking this repository, follow these steps to transform it into your custom business application:

<details>
<summary><strong>Step 1: Clone and Setup (5 minutes)</strong></summary>

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/YOUR_APP_NAME.git
cd YOUR_APP_NAME

# Install dependencies
npm install

# Start development server
npm run dev
```

**Verify it works:** Open http://localhost:5173 and see the demo portal

</details>

<details>
<summary><strong>Step 2: Customize App Identity (10 minutes)</strong></summary>

**File: `src/data/configurableData.ts`**

```typescript
export const appConfig: AppConfig = {
  // 1. Change app name
  appName: "Your Business Portal",  // Appears in header and page titles
  pageTitle: "Dashboard",

  // 2. Define your navigation
  navigation: [
    { id: "home", label: "Home", path: "/", enabled: true },
    { id: "orders", label: "Orders", path: "/orders", enabled: true },
    { id: "customers", label: "Customers", path: "/customers", enabled: true },
    // Add your pages here
  ],

  // 3. Set your brand colors
  theme: {
    primaryColor: "#1976d2",      // Your primary brand color
    secondaryColor: "#f57c00",    // Your accent color
    mode: "light",                // "light" or "dark"
  }
}
```

**Test it:** Save and see changes instantly in browser (Vite hot reload)

</details>

<details>
<summary><strong>Step 3: Replace Sample Data (15 minutes)</strong></summary>

**File: `src/data/sampleData.ts`**

Transform generic entities to your domain:

```typescript
// BEFORE: Generic todo items
export const todoItems = [
  { id: "1", title: "Task 1", status: "pending", ... }
]

// AFTER: Your domain objects (e.g., orders)
export const orders = [
  {
    id: "ORD-001",
    customerName: "Acme Corp",
    product: "Widget Pro",
    quantity: 50,
    status: "processing",
    total: 2499.99,
    orderDate: "2024-02-15"
  }
]
```

**Update type definitions:** `src/types/portal.ts`

```typescript
export interface Order {
  id: string
  customerName: string
  product: string
  quantity: number
  status: string
  total: number
  orderDate: string
}
```

**Update context provider:** `src/context/ContextProvider.tsx`

```typescript
// Replace todoItems with your data
const [orders, setOrders] = useState<Order[]>(sampleData.orders)
```

</details>

<details>
<summary><strong>Step 4: Configure Status & Fields (10 minutes)</strong></summary>

**File: `src/data/configurableData.ts`**

Define your business statuses:

```typescript
statusConfig: {
  orderStatus: {
    pending: { color: "warning", label: "Pending" },
    processing: { color: "info", label: "Processing" },
    shipped: { color: "success", label: "Shipped" },
    cancelled: { color: "error", label: "Cancelled" }
  }
}
```

Configure which fields to display:

```typescript
fieldConfig: {
  order: {
    primary: "customerName",                    // Main heading
    secondary: ["status", "total", "orderDate"], // Show as chips
    hidden: ["id", "internalNotes"]             // Never display
  }
}
```

</details>

<details>
<summary><strong>Step 5: Customize Pages (30 minutes)</strong></summary>

**Rename existing pages or create new ones:**

```bash
# Rename Tasks.tsx to Orders.tsx
mv src/pages/Tasks.tsx src/pages/Orders.tsx
```

**Update the page component:**

```tsx
// src/pages/Orders.tsx
import { useData } from '../context/ContextProvider'

const Orders = memo(() => {
  const { orders } = useData()  // Use your data

  return (
    <PageLayout pageId="orders">
      <DataTable
        data={orders}
        columns={[
          { field: 'customerName', header: 'Customer', width: '30%' },
          { field: 'product', header: 'Product', width: '25%' },
          {
            field: 'status',
            header: 'Status',
            render: (value, row) => (
              <FieldRenderer
                field="status"
                value={value}
                entity={row}
                statusConfig={statusConfig}
                variant="chip"
              />
            )
          }
        ]}
        sortable
        filterable
        paginated
      />
    </PageLayout>
  )
})
```

**Update App.tsx routing:**

```tsx
import Orders from './pages/Orders'

const pageComponents = {
  home: Home,
  orders: Orders,  // Map navigation id to component
  customers: Customers,
}
```

</details>

<details>
<summary><strong>Step 6: Run Tests (5 minutes)</strong></summary>

```bash
# Run all tests
npm test

# Update failing tests to match your data
# Example: src/pages/Orders.test.tsx
expect(screen.getByText('Orders')).toBeInTheDocument()
expect(screen.getByText('Acme Corp')).toBeInTheDocument()
```

</details>

<details>
<summary><strong>Step 7: Optional Backend Integration</strong></summary>

**When ready to connect to your API:**

**Update service configuration:** `src/services/index.ts`

```typescript
// Switch from mock to API with fallback
export const ordersService = new FallbackEntityService<Order>(
  'Orders',
  '/api/orders',  // Your API endpoint
  sampleOrders    // Fallback data
)
```

**Create .NET API endpoint** (if using provided backend):

```csharp
// PortalAPI/Controllers/OrderController.cs
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase {
    private readonly IOrderService _service;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetAll() {
        return Ok(await _service.GetAllAsync());
    }
}
```

**The frontend automatically:**
- Tries your API first
- Falls back to mock data if API unavailable
- Retries connection every 30 seconds
- No configuration changes needed

</details>

### Next Steps

1. **Customize dashboard cards** - Edit `dashboardCards` in `configurableData.ts`
2. **Add more pages** - Copy existing pages, update with your data
3. **Brand your theme** - Use browser console: `setThemeColor("primary-color", "#YOUR_COLOR")`
4. **Deploy** - Build with `npm run build`, deploy `/dist` folder

**Estimated time to fully customize:** 2-4 hours for basic transformation

</details>

## Key Features

### 🎯 High-Value Components

- **DataTable** - Reusable table with sorting, filtering, pagination, custom renderers
- **Timeline** - Interactive visual timeline with color-coded status indicators
- **FieldRenderer** - Automatic field type handling (dates, currency, status, priority)
- **PageLayout** - Universal page wrapper with loading states and configuration

### 🔄 Intelligent Service Layer

- **FallbackEntityService** - Tries API first, falls back to mock data on error
- **Automatic reconnection** - Retries API every 30 seconds, reconnects when available
- **Zero configuration** - Developer experience "just works" with or without backend

### 🎨 Interactive Visualizations

- **Timeline Page** - Proportional date positioning, hover tooltips, click details
- **Color-coded status** - Red (overdue), Yellow (today), Blue (upcoming), Green (completed)
- **Google Maps integration** - Embedded maps with service locations

### 🏗️ Backend Integration

- **.NET 8.0 API** - ASP.NET Core + Entity Framework Core + SQLite
- **Custom JSON converters** - Seamless enum serialization between frontend/backend
- **Repository pattern** - Optional domain-specific queries
- **Integration tests** - 6 xUnit tests with WebApplicationFactory

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

**Frontend:**
- React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.0
- Material-UI + React Router
- 56 tests with Vitest

**Backend:**
- .NET 8.0 + ASP.NET Core
- Entity Framework Core + SQLite
- 6 integration tests with xUnit

<details>
<summary><strong>Key Abstractions</strong></summary>

**DataTable Component** - Reusable table with all features:

```tsx
<DataTable
  data={items}
  columns={[
    { field: "title", header: "Title", width: "40%" },
    {
      field: "status",
      header: "Status",
      render: (value, row) => (
        <FieldRenderer field="status" value={value} entity={row} variant="chip" />
      ),
    },
  ]}
  sortable
  filterable
  paginated
  onRowClick={(row) => handleEdit(row)}
/>
```

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

**Timeline Visualization** - Proportional positioning on visual timeline:

```tsx
// See src/pages/Timeline.tsx for interactive timeline with:
// - Color-coded status indicators
// - Hover tooltips with task details
// - Click to expand full information
// - Proportional date positioning
```

</details>

<details>
<summary><strong>Service Layer Patterns</strong></summary>

**FallbackEntityService** - Intelligent API detection with automatic fallback:

```typescript
// Tries API first, falls back to mock on network errors
export const todosService = new FallbackEntityService<TodoItem>(
  "Tasks",
  "/api/todo",
  todoItems
);

// Behavior:
// - Tries API on every call
// - Falls back to mock data on error
// - Console warns: "Tasks API unavailable, using mock data"
// - Retries API every 30 seconds
// - Automatically reconnects when backend available
```

**MockEntityService** - For entities without backend:

```typescript
export const discussionsService = new MockEntityService<Discussion>(
  "Discussions",
  discussions
);
```

**BaseEntityService** - For production APIs requiring backend:

```typescript
// Fails fast if backend unavailable
export const authService = new BaseEntityService("Auth", "/api/auth");
```

</details>

<details>
<summary><strong>Performance Features</strong></summary>

- **React.memo** on all components prevents unnecessary re-renders
- **Lazy loading** for route components
- **Memoized contexts** prevent cascading updates
- **Optimized abstractions** handle large datasets efficiently
- **Layout classes** reduce inline styles and improve consistency
</details>

## Development Workflow

### Frontend-First Development

```bash
# Step 1: Start frontend (works immediately)
npm run dev

# Full CRUD operations with mock data
# - Add, edit, delete tasks
# - Filter and sort
# - All features work offline

# Step 2: Optional - Start backend
cd PortalAPI
dotnet run

# Frontend automatically:
# - Detects API availability
# - Connects to backend
# - Switches from mock to real data
# - Check console: "Tasks API unavailable, using mock data" message disappears

# Step 3: Backend restart
# Frontend automatically:
# - Retries connection every 30 seconds
# - Reconnects when backend available
# - No page refresh needed
```

### Development Modes

**Mock Data (backend off):**
- UI development and styling
- Component development
- Frontend-only feature work
- Rapid prototyping

**Real API (backend on):**
- API integration testing
- Database schema changes
- Backend business logic development
- Full-stack feature testing

### Testing Workflow

```bash
# Frontend tests (no backend needed)
npm test                      # 56 tests

# Backend tests (in-memory database)
cd PortalAPI
dotnet test                   # 6 integration tests

# Integration testing
# 1. Start both frontend and backend
# 2. Verify console shows API connection
# 3. Test CRUD operations persist to database
```

## Session Management for Claude Code

<details>
<summary><strong>Continuous Session Tracking</strong></summary>

When working with Claude Code, maintain session state to handle conversation compaction:

```bash
# Initial setup
claude code --file CLAUDE.md "Read project guide and create CURRENT_SESSION.md to track our development progress"

# During development
claude code "Update CURRENT_SESSION.md with our progress"

# Pre-compaction preparation
claude code "Update CURRENT_SESSION.md with everything we've accomplished and next priorities. If there are any patterns, preferences, or lessons learned from this session that would improve future sessions, suggest updates to CLAUDE.md."

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
│   ├── DataTable.tsx          # Reusable table component
│   ├── FieldRenderer.tsx      # Universal field display
│   └── StatusChip.tsx         # Configurable status display
├── hooks/
│   ├── useDataOperations.ts   # Generic data manipulation
│   └── usePageLoading.ts      # Loading state management
├── pages/
│   ├── Tasks.tsx              # Task management with filtering
│   ├── Timeline.tsx           # Interactive timeline visualization
│   ├── Table.tsx              # DataTable demo page
│   └── Contact.tsx            # Contact info with Google Maps
├── services/
│   ├── fallbackService.ts     # Intelligent API fallback
│   ├── mockService.ts         # Mock data service
│   ├── baseService.ts         # API service
│   └── index.ts               # Service configuration
├── theme/
│   ├── portalTheme.ts         # Centralized MUI theme
│   └── layoutClasses.ts       # Reusable layout patterns
└── types/                     # TypeScript interfaces

PortalAPI/
├── Controllers/               # Slim HTTP request handlers
├── Services/                  # Business logic (ITodoService)
├── Models/                    # Entity definitions
├── DTOs/                      # API contracts with validation
├── Converters/                # Custom JSON converters
├── Data/                      # DbContext and migrations
└── Tests/                     # Integration tests
```

## Development Commands

```bash
# Frontend
npm run dev        # Development server (localhost:5173)
npm run build      # Production build
npm test           # Run 56 frontend tests
npm run lint       # Code quality checks

# Backend
dotnet run         # Start API server (localhost:5276)
dotnet test        # Run 6 integration tests
dotnet build       # Verify compilation
```

## Production Ready Features

<details>
<summary><strong>Enterprise Features</strong></summary>

**Frontend:**
- Environment configuration ready for deployment
- Offline-first architecture with FallbackEntityService
- Error boundaries for graceful failure handling
- TypeScript strict mode with 100% type coverage
- Performance optimized for large datasets
- Layout classes system for consistent styling
- State persistence with localStorage

**Backend:**
- Service layer pattern with dependency injection
- Custom JSON converters for enum serialization
- DTO pattern for API contracts
- Repository pattern ready (optional)
- Integration tests with WebApplicationFactory
- In-memory database for testing

**Developer Experience:**
- Backend optional for frontend development
- Automatic API detection and reconnection
- Console warnings show system state
- Session management for Claude Code
- Comprehensive documentation (CLAUDE.md)

</details>

<details>
<summary><strong>Component Library</strong></summary>

**Reusable Components:**
- DataTable - Sorting, filtering, pagination, custom renderers (219 lines)
- Timeline - Interactive visual timeline (350 lines)
- FieldRenderer - Automatic field type handling
- PageLayout - Universal page wrapper
- StatusChip - Configurable status badges
- EmptyState - Standardized empty states

**Patterns:**
- Configuration-driven design
- Generic type-safe components (`DataTable<T>`)
- Intelligent service layer (`FallbackEntityService<T>`)
- Interactive visualizations (Timeline with proportional positioning)
- Theme-based styling (no inline styles)

</details>

## Customization Priority

1. **High Impact, 5 minutes** - Update `configurableData.ts` and `sampleData.ts`
2. **Medium Impact, 30 minutes** - Add new status types, field types, actions
3. **High Impact, 2 hours** - Add new pages using DataTable and existing abstractions
4. **Complex, 1 day** - Backend integration and authentication

---

**Ready to fork and customize!** Transform this generic portal into your business application through configuration, not code rewrites.

**Test Coverage:** 62 tests (56 frontend + 6 backend) ✓
**Frontend-First:** Works without backend, seamlessly connects when available
**Production-Ready:** Enterprise patterns, performance optimized, fully typed
