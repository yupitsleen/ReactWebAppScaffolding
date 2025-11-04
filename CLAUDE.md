# CLAUDE.md

This file provides guidance to Claude Code when working with this forked React web application scaffold.

## Quick Navigation

- [Quick Reference](#quick-reference) - Commands and tech stack
- [Project Architecture](#project-architecture) - Structure and patterns
- [Critical Development Rules](#critical-development-rules) - Git workflow and quality gates
- [Business Customization](#business-customization) - Transform the scaffold
- [Design System](#design-system) - Color management and visual principles
- [Available Utilities](#available-utilities) - Hooks, helpers, and services
- [Smart Abstractions](#smart-abstractions) - Key reusable components
- [Backend Development](#backend-development) - .NET Core API patterns
- [Development Preferences](#development-preferences) - Coding standards and approach
- [Deployment](#deployment) - GitHub Pages auto-deployment

## Quick Reference

**Development Commands:**

```bash
npm run dev     # Start dev server (localhost:5173)
                # Works with or without backend
npm run build   # Build for production
npm run lint    # Run ESLint
npm test        # Run frontend tests (56 tests)

# Backend (OPTIONAL for frontend development)
dotnet run      # Start API (localhost:5276)
dotnet test     # Run backend tests (6 tests)
dotnet build    # Verify compilation
```

**Development Modes:**

- **Frontend only:** Full CRUD with mock data (backend not required)
- **Frontend + Backend:** Full CRUD with real API (auto-connects)
- **No configuration changes needed** - FallbackEntityService handles switching

**Tech Stack:** React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.0 + Material-UI + React Router  
**Backend Stack:** .NET 8.0 + ASP.NET Core + Entity Framework Core + SQLite

## Project Architecture

### This is a Forked Scaffold (#memorize)

**Important Context:**

- This codebase was forked from a generic business portal scaffold
- It contains reusable abstractions designed for ANY business domain
- Your job is to transform it for a SPECIFIC business purpose
- The scaffold provides the foundation, you customize for the domain

**What This Means:**

- Generic entity names (TodoItem, Document, Discussion) should be renamed to your domain
- Sample data is meant to be replaced with your business data
- Navigation, status configs, and field configs are examples to customize
- Components are intentionally generic to work with any data structure

### Frontend Structure

```
src/
├── data/                # ← CUSTOMIZE: Replace with your business data
│   ├── configurableData.ts  # App config, navigation, theme
│   └── sampleData.ts        # Replace with your domain entities
├── components/          # Reusable (usually keep as-is)
│   ├── DataTable.tsx        # Works with any entity type
│   ├── FieldRenderer.tsx    # Handles any field types
│   └── PageLayout.tsx       # Universal page wrapper
├── pages/               # ← CUSTOMIZE: Rename/create for your domain
│   ├── Tasks.tsx → Orders.tsx (example transformation)
│   └── Timeline.tsx         # Visual timeline (adapt or remove)
├── services/            # ← UPDATE: Configure for your API endpoints
│   ├── fallbackService.ts   # Keep as-is
│   └── index.ts             # Configure your services here
├── types/               # ← EXTEND: Add your domain types
│   └── portal.ts            # Extend existing interfaces
└── theme/               # ← CUSTOMIZE: Your brand colors
```

### Backend Structure

```
PortalAPI/
├── Controllers/         # ← CREATE: Your domain controllers
├── Services/            # ← CREATE: Your business logic
├── Models/              # ← CREATE: Your domain entities
├── DTOs/                # ← CREATE: Your API contracts
└── Tests/               # ← UPDATE: Tests for your domain
```

### Key Patterns

- **Configuration-Driven** - 90% customization through `src/data/configurableData.ts`
- **Generic Abstractions** - DataTable, FieldRenderer work with ANY entity type
- **Service Layer** - Controllers → Services → Repositories → DbContext
- **Offline-First** - FallbackEntityService enables development without backend

## Critical Development Rules

### Git Workflow (#memorize)

```bash
# Work on feature branches (user creates from main)
git commit -m "Replace TodoItem with Order entity"
git commit -m "Add customer management page"
# NOT: "Add customer page with Claude assistance"

# Push and create PR when complete
git push origin [current-branch-name]

# User approves/merges PR
```

**Commit Standards:**

- Imperative mood: "Add", "Replace", "Rename", "Create"
- Be specific: "Replace TodoItem with Order in all files"
- No co-author attribution (#memorize)
- Include scope: "entities:", "pages:", "services:"

### Quality Gates (#memorize)

- **Always run tests** after each working change
- **Update tests** when renaming entities (TodoItem → Order)
- **No commits without passing tests** - Frontend: 97/97 ✓, Backend: 6/6 ✓
- **Dev server assumed running** - localhost:5173 for real-time feedback
- **Minimal, focused tests** - Test core functionality only

### Session Management (#memorize)

- **Maintain CURRENT_SESSION.md** - Update throughout customization
- **Track transformation progress** - What entities renamed, what pages created
- **Document domain decisions** - Why certain entities, what they represent
- **Session structure** - Current work, completed transformations, next customizations

## Business Customization

### Phase 1: Identity & Branding (First Session)

**1. Update App Identity** (`src/data/configurableData.ts`):

```typescript
export const appConfig: AppConfig = {
  appName: "Your Business Name Portal", // Replace generic name
  pageTitle: "Your Dashboard",

  navigation: [
    // Replace generic pages with your business pages
    { id: "orders", label: "Orders", path: "/orders", enabled: true },
    { id: "customers", label: "Customers", path: "/customers", enabled: true },
  ],

  theme: {
    primaryColor: "#YOUR_BRAND_COLOR", // Your brand primary
    secondaryColor: "#YOUR_ACCENT_COLOR",
  },
};
```

**2. Replace Sample Data** (`src/data/sampleData.ts`):

```typescript
// BEFORE (generic scaffold):
export const todoItems: TodoItem[] = [...]

// AFTER (your business domain):
export const orders: Order[] = [...]
export const customers: Customer[] = [...]
```

**3. Update Types** (`src/types/portal.ts`):

```typescript
// Add your domain interfaces
export interface Order {
  id: string;
  customerName: string;
  // ... your fields
}
```

### Phase 2: Page Transformation

**Rename/Create Pages for Your Domain:**

```bash
# Example: Transform Tasks → Orders
mv src/pages/Tasks.tsx src/pages/Orders.tsx
```

**Update Page Components:**

```tsx
// src/pages/Orders.tsx
import { useData } from '../context/ContextProvider'

const Orders = memo(() => {
  const { orders } = useData()  // Use your domain data

  return (
    <PageLayout pageId="orders">
      <DataTable
        data={orders}
        columns={[
          { field: 'customerName', header: 'Customer' },
          { field: 'total', header: 'Total' },
          { field: 'status', header: 'Status', render: ... }
        ]}
        sortable
        filterable
      />
    </PageLayout>
  )
})
```

### Phase 3: Status & Field Configuration

**Configure Your Business Statuses:**

```typescript
statusConfig: {
  orderStatus: {  // Your domain status
    pending: { color: "warning", label: "Pending" },
    processing: { color: "info", label: "Processing" },
    completed: { color: "success", label: "Completed" }
  }
}
```

**Configure Field Display:**

```typescript
fieldConfig: {
  order: {  // Your entity name
    primary: "customerName",
    secondary: ["status", "total", "orderDate"],
    hidden: ["id", "internalNotes"]
  }
}
```

### Customization Checklist (#memorize)

**Data Layer:**

- [ ] Rename generic entities (TodoItem → Order)
- [ ] Replace sample data with your domain data
- [ ] Update TypeScript interfaces
- [ ] Configure status mappings for your domain
- [ ] Configure field display rules

**UI Layer:**

- [ ] Rename/create pages for your domain
- [ ] Update navigation configuration
- [ ] Update page components to use your data
- [ ] Update App.tsx routing
- [ ] Customize theme colors

**Service Layer:**

- [ ] Update service configurations for your endpoints
- [ ] Keep FallbackEntityService pattern
- [ ] Configure mock data for your entities

**Testing:**

- [ ] Update test data to match your domain
- [ ] Update test assertions for renamed entities
- [ ] Verify all 56 frontend tests pass
- [ ] Add domain-specific test cases

## Design System

### Color Management (CRITICAL)

Centralized CSS custom properties system:

**CSS Variables:**

- `--primary-color` - Default: #312E81 (customize to your brand)
- `--secondary-color` - Default: #F59E0B (customize to your brand)
- `--background-color` - Default: #F3F4F6

**Live Testing (Browser Console):**

```javascript
setThemeColor("primary-color", "#YOUR_BRAND_COLOR");
applyColorPreset("blue"); // Test presets
```

### Styling Rules (#memorize)

- **NEVER use inline styles** - ALL styling through theme provider
- **Use semantic CSS classes** - `header-section`, `dashboard-section`
- **Desktop-first design** - Sophisticated layouts
- **Theme colors, not hex** - Use `theme.palette.error.main`, not `'#ef4444'`

## User Preferences & Accessibility

### Layout Density System

**Three density modes** for user customization:

- **Compact** (75% spacing) - Maximum data on screen for power users
- **Comfortable** (100% spacing) - Balanced default
- **Spacious** (125% spacing) - Extra breathing room for accessibility

**Implementation:**
```typescript
import { useDensity } from '../hooks/useLayoutDensity'

const { density, setDensity } = useDensity()
// Persists to localStorage automatically
```

**CSS Variables:**
- `--density-spacing` - Spacing multiplier
- `--density-card-padding` - Card padding
- `--density-row-height` - Table row height
- `--density-icon-size` - Icon dimensions
- `--density-font-scale` - Font size scaling

### High Contrast Mode

**WCAG AAA compliance** (7:1+ contrast ratios):

```typescript
import { useHighContrast } from '../hooks/useHighContrast'

const { isHighContrast, toggleHighContrast } = useHighContrast()
// Persists to localStorage automatically
```

**Features:**
- Removes subtle shadows and gradients
- Strong 2px borders on all components
- Enhanced focus indicators (3px outlines)
- Works in both light and dark themes
- Automatic color adjustments

### Keyboard Navigation

**Global shortcuts** - Press `?` to see all:

- `Ctrl+K` - Open command palette (power users)
- `Ctrl+H` - Navigate to Home
- `Ctrl+T` - Navigate to Tasks
- `Escape` - Close dialogs/modals
- Arrow keys - Navigate command palette
- Tab/Shift+Tab - Focus management

## Available Utilities

### Custom Hooks

**Core Hooks:**
- `useDebounce(value, delay)` - Debounce for search/input
- `usePageLoading(delay?)` - Page-level loading states
- `useCurrentPage()` - Auto-detect page config from URL
- `useDataOperations(data)` - Generic filtering, sorting, pagination

**User Preference Hooks:**
- `useDensity()` - Layout density (compact/comfortable/spacious) with localStorage persistence
- `useHighContrast()` - High contrast mode for WCAG AAA accessibility
- `useKeyboardShortcuts(options)` - Global keyboard navigation (Ctrl+H, Ctrl+K, etc.)

**Utility Hooks:**
- `useEntityActions()` - Generic CRUD action handlers for any entity type
- `useNavigation()` - Navigation helpers (isCurrentPage, getEnabledPages)

### Service Layer (#memorize)

**Configure services for your domain** (`src/services/index.ts`):

```typescript
// Your business entities with FallbackEntityService
export const ordersService = new FallbackEntityService<Order>(
  "Orders",
  "/api/orders", // Your API endpoint
  sampleOrders // Your mock data
);

// Static/reference data with MockEntityService
export const categoriesService = new MockEntityService<Category>(
  "Categories",
  categories
);
```

**Service Selection:**

1. **FallbackEntityService** - For CRUD entities (tries API, falls back to mock)
2. **MockEntityService** - For static reference data (always uses mock)
3. **BaseEntityService** - For production APIs that must have backend

## Smart Abstractions

### DataTable Component (Works with ANY Entity Type)

```tsx
<DataTable
  data={yourEntities}  // Any array of objects
  columns={[
    { field: 'anyField', header: 'Any Header' },
    { field: 'status', header: 'Status', render: (value, row) => <FieldRenderer ... /> }
  ]}
  sortable
  filterable
  paginated
  onRowClick={handleEdit}
/>
```

### PageLayout Component

```tsx
<PageLayout
  pageId="your-page-id"
  loading={loading}
  action={<Button onClick={handleAction}>Action</Button>}  // Optional action button
>
  {content}
</PageLayout>
```

### FieldRenderer Component

Automatically handles: dates, currency, status, priority, amounts, etc.

### Command Palette Component

**Keyboard-first navigation** - Access with `Cmd/Ctrl+K`:

```tsx
// Automatically available in authenticated app
// Search across all pages, settings, and actions
// Arrow keys to navigate, Enter to select, Esc to close
```

### PDF Export Utilities

**Export dashboard or tables to PDF**:

```typescript
import { exportDashboardToPDF, exportTableToPDF } from '../utils/pdfExport'

// Export dashboard with charts
await exportDashboardToPDF(dashboardRef.current, {
  filename: 'dashboard-report.pdf',
  title: 'My Dashboard',
  quality: 2  // High quality (2x scale)
})

// Export data table
await exportTableToPDF(tableRef.current, {
  filename: 'table-export.pdf',
  title: 'Table Data'
})
```

## Backend Development

### .NET Architecture Patterns (#memorize)

**Create Controllers for Your Domain:**

```csharp
// YourEntity Controller
[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase {
    private readonly IOrderService _service;

    public OrderController(IOrderService service) {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetAll() {
        return Ok(await _service.GetAllAsync());
    }
}
```

**Service Layer Pattern:**

```csharp
public interface IOrderService {
    Task<IEnumerable<Order>> GetAllAsync();
    Task<Order> CreateAsync(OrderCreateDto dto);
}

builder.Services.AddScoped<IOrderService, OrderService>();
```

**Testing Your Domain:**

```csharp
public class OrderControllerTests : IClassFixture<WebApplicationFactory<Program>> {
    // Test your Order entity CRUD operations
}
```

## Development Preferences

- **Be concise** - Short, focused responses
- **One transformation at a time** - Rename entities incrementally
- **Configuration over code** - Prefer data-driven solutions
- **Minimal comments** - Only for complex business logic
- **Minimal tests** - 3-5 essential tests per domain entity

### Development Workflow (#memorize)

**Customization Workflow:**

1. **Identify domain entity** - What business concept (Order, Patient, Project)
2. **Replace generic entity** - Rename TodoItem → YourEntity everywhere
3. **Update sample data** - Replace with realistic domain data
4. **Configure statuses** - Define your business statuses
5. **Update pages** - Rename and customize page components
6. **Update routing** - Map navigation to new page components
7. **Run tests** - Update test data and assertions
8. **Verify in browser** - Check all pages work with new domain

**Frontend-First Development:**

1. `npm run dev` - Customize with mock data (no backend needed)
2. Optional: `dotnet run` - Connect to real API later
3. Backend restart - Frontend auto-reconnects

### Transformation Best Practices (#memorize)

**Entity Renaming Strategy:**

1. Start with one entity (TodoItem → Order)
2. Update types first (`types/portal.ts`)
3. Update data next (`data/sampleData.ts`)
4. Update context (`context/ContextProvider.tsx`)
5. Update page components (`pages/Orders.tsx`)
6. Update tests (`pages/Orders.test.tsx`)
7. Verify everything works before next entity

**When Customizing:**

- Keep existing abstractions (DataTable, FieldRenderer, PageLayout)
- Only modify business logic and data structures
- Reuse generic components for your domain
- Extend interfaces, don't rewrite them

### Complex Task Management (#memorize)

- **Use TodoWrite tool** for multi-entity transformations
- **Document domain decisions** - Why these entities, what they represent
- **Update CURRENT_SESSION.md** - Track transformation progress
- **Update CLAUDE.md** - Add domain-specific patterns

## GitHub Issue Tracking (#memorize)

**Customization Workflow:**

```bash
git checkout -b feature/replace-todoitem-with-order
# Transform TodoItem → Order across all files
git commit -m "Replace TodoItem entity with Order"
git push origin feature/replace-todoitem-with-order
# Create PR: "Transform scaffold for order management domain"
```

This scaffold provides a production-ready foundation. Your job is to transform generic entities into your specific business domain through systematic customization.

---

## Deployment

### Live Application

**Production URL:** https://yupitsleen.github.io/ReactWebAppScaffolding

The application is automatically deployed to GitHub Pages on every merge to main.

### Auto-Deployment Workflow (#memorize)

**CI/CD Pipeline:**
1. **On Pull Request:** Runs tests, linter, and build (validates before merge)
2. **On Merge to Main:** Runs tests, builds, and deploys to GitHub Pages automatically

**Workflows:**
- `.github/workflows/ci.yml` - Runs on all PRs (quality gate)
- `.github/workflows/deploy.yml` - Runs on merge to main (deployment)

### Manual Deployment

```bash
npm run deploy  # Builds and deploys directly to GitHub Pages
```

### Deployment Configuration (#memorize)

**Critical Files:**
- `vite.config.ts` - Contains `base: '/ReactWebAppScaffolding/'` for GitHub Pages subdirectory
- `src/App.tsx` - Contains `<Router basename="/ReactWebAppScaffolding">` for routing
- `package.json` - Contains `homepage` URL for deployment

**Important:** These three configurations must match:
1. Vite `base` path
2. Router `basename` prop
3. Package.json `homepage` URL

### Deployment Requirements

**Quality Gates:**
- ✅ All 89 frontend tests must pass
- ✅ TypeScript compilation must succeed
- ✅ Production build must complete

**From CLAUDE.md memorized rules:**
- Never commit without passing tests
- All test suites must be green before deployment
- CI enforces this automatically

### Troubleshooting Deployment

**404 on Page Load:**
- Check `vite.config.ts` base path matches repo name
- Verify GitHub Pages is configured to use GitHub Actions (not branch)

**Routing Issues (404 on navigation):**
- Verify `<Router basename>` matches `vite.config.ts` base path
- Ensure all three deployment configs are aligned

**Manual Re-deploy:**
```bash
git checkout main
git pull origin main
npm run deploy  # Forces fresh deployment
```
