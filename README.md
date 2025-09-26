# Business Portal Scaffold

A production-ready, highly configurable React portal application designed for **easy forking and business customization**. Built with modern React patterns, comprehensive abstractions, and configuration-driven architecture that allows senior developers to customize for any business domain without touching core components.

## 🎯 Quick Fork & Customize

This scaffold is designed to be **forked and personalized** for any business use case. Transform it from a generic portal into your domain-specific application in minutes, not days.

### Architecture Philosophy

- **Configuration Over Code** - Customize through data files, not component rewrites
- **Smart Abstractions** - Generic components that adapt to any business domain
- **SOLID Principles** - Open for extension, closed for modification
- **Performance First** - React.memo, memoization, and lazy loading throughout
- **Quality Gates** - 86 comprehensive tests ensure stability during customization

## 🚀 Quick Start

```bash
# Clone/fork this repository
npm install
npm run dev     # → http://localhost:5173
```

## 📋 Business Customization Guide

Transform this scaffold for your specific business domain by following these steps:

### 1. Business Identity & Branding

**Update Core Information** (`src/data/configurableData.ts`):

```typescript
export const appConfig: AppConfig = {
  appName: "Your Business Portal",
  pageTitle: "Your Dashboard",

  // Your navigation structure
  navigation: [
    { id: "dashboard", label: "Dashboard", path: "/", enabled: true },
    { id: "orders", label: "Orders", path: "/orders", enabled: true },
    { id: "customers", label: "Customers", path: "/customers", enabled: true },
    { id: "inventory", label: "Inventory", path: "/inventory", enabled: true },
    { id: "reports", label: "Reports", path: "/reports", enabled: true }
  ],

  // Your brand colors and styling
  theme: {
    primaryColor: "#1976d2",      // Your brand primary
    secondaryColor: "#f57c00",    // Your brand accent
    mode: "light",
    borderRadius: 8,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
}
```

**Update Service Information** (`src/data/sampleData.ts`):

```typescript
export const serviceInfo: ServiceInfo = {
  name: "Your Business Name",
  tagline: "Your Value Proposition",
  description: "What your business does",
  contact: {
    email: "contact@yourbusiness.com",
    phone: "(555) 123-4567",
    address: "123 Business St, City, State 12345"
  }
}
```

### 2. Data Structure Mapping

**Replace Sample Data with Your Domain Objects**:

The scaffold uses generic data structures that map to most business domains:

| Generic Structure | E-commerce | SaaS Platform | Medical Practice | Project Management |
|------------------|------------|---------------|------------------|-------------------|
| `todoItems` | Orders/Shipments | Tasks/Features | Appointments | Milestones |
| `payments` | Transactions | Subscriptions | Billing | Budgets |
| `documents` | Invoices/Receipts | Documentation | Medical Records | Contracts |
| `discussions` | Customer Support | Team Chat | Patient Notes | Communication |
| `users` | Customers | Team Members | Patients | Stakeholders |

**Example: E-commerce Transformation**:

```typescript
// Replace todoItems with orders
export const orders = [
  {
    id: "ORD-001",
    title: "Premium Widget Order",
    priority: "high",
    status: "processing",
    dueDate: "2024-02-15",
    category: "electronics",
    description: "Customer order for premium widgets",
    amount: 299.99,
    customer: "John Doe"
  }
]

// Update field configuration
fieldConfig: {
  order: {
    primary: "title",
    secondary: ["status", "amount", "dueDate", "customer"],
    hidden: ["id", "internalNotes"]
  }
}
```

### 3. Dashboard Configuration

**Configure Dashboard Cards** for your key metrics:

```typescript
dashboardCards: [
  {
    id: "revenue-card",
    title: "Monthly Revenue",
    subtitle: "This Month",
    dataSource: "payments",
    pageId: "payments",
    valueType: "sum",           // count | ratio | sum
    icon: "AttachMoney",
    color: "success"
  },
  {
    id: "active-orders",
    title: "Active Orders",
    subtitle: "In Progress",
    dataSource: "orders",
    pageId: "orders",
    valueType: "count",
    icon: "ShoppingCart",
    color: "primary"
  }
]
```

**Configure Dashboard Sections** for detailed views:

```typescript
dashboardSections: [
  {
    id: "urgent-orders",
    title: "Urgent Orders",
    dataSource: "orders",
    pageId: "orders",
    filterCriteria: { priority: "urgent", status: "!completed" },
    maxItems: 5,
    enabled: true
  }
]
```

### 4. Status & Field Configuration

**Define Your Business Status Mappings**:

```typescript
statusConfig: {
  orderStatus: {
    pending: { color: "warning", label: "Pending" },
    processing: { color: "info", label: "Processing" },
    shipped: { color: "success", label: "Shipped" },
    delivered: { color: "success", label: "Delivered" },
    cancelled: { color: "error", label: "Cancelled" }
  },
  priority: {
    low: { color: "default", label: "Low" },
    medium: { color: "warning", label: "Medium" },
    high: { color: "error", label: "High" },
    urgent: { color: "error", label: "Urgent" }
  }
}
```

**Configure Field Display Logic**:

```typescript
fieldConfig: {
  order: {
    primary: "title",                                    // Main heading
    secondary: ["status", "priority", "amount", "dueDate"], // Status chips
    hidden: ["id", "internalNotes", "createdBy"]         // Never display
  },
  customer: {
    primary: "name",
    secondary: ["email", "phone", "status"],
    hidden: ["id", "passwordHash"]
  }
}
```

### 5. Action Configuration

**Define Available Actions** for each entity type:

```typescript
actions: {
  order: [
    {
      id: "view-details",
      label: "View Details",
      icon: "Visibility",
      variant: "outlined",
      onClick: "handleViewOrder"
    },
    {
      id: "update-status",
      label: "Update Status",
      icon: "Edit",
      variant: "contained",
      onClick: "handleUpdateStatus"
    }
  ],
  customer: [
    {
      id: "send-email",
      label: "Send Email",
      icon: "Email",
      variant: "outlined",
      onClick: "handleSendEmail"
    }
  ]
}
```

## 🛠 Advanced Customization

### Page-Level Customization

Most functionality is now configurable, but for complex business logic:

**Option 1: Use Configuration** (Recommended)
- 90% of customization can be achieved through `configurableData.ts`
- Add new status types, field types, action types
- Extend existing interfaces rather than creating new ones

**Option 2: Extend Components** (When Needed)
```typescript
// Create domain-specific page that extends the scaffold
import { memo } from 'react'
import PageLayout from '../components/PageLayout'
import { useCurrentPage } from '../hooks/useCurrentPage'

const CustomOrdersPage = memo(() => {
  const currentPage = useCurrentPage()

  // Your custom business logic here
  const processOrders = () => {
    // Domain-specific order processing
  }

  return (
    <PageLayout pageId="orders">
      {/* Use existing components with your data */}
    </PageLayout>
  )
})
```

### Custom Field Types

**Add New Field Types** to `FieldRenderer`:

```typescript
// In src/components/FieldRenderer.tsx
case 'currency':
  return (
    <Chip
      label={`$${(value as number).toLocaleString()}`}
      size="small"
      color="success"
      variant="outlined"
    />
  )

case 'percentage':
  return (
    <Chip
      label={`${value}%`}
      size="small"
      color="info"
    />
  )
```

### Integration Patterns

**API Integration** (Ready for Implementation):
```typescript
// Services layer already prepared
import { apiClient } from '../services/api'

const loadOrders = async () => {
  const response = await apiClient.get<Order[]>('/api/orders')
  return response.data
}
```

**Authentication Integration** (Azure AD Ready):
```typescript
// Authentication service prepared
import { authService } from '../services/auth'

const authenticateUser = async () => {
  return await authService.loginWithAzure()
}
```

## 📱 Business Domain Examples

### E-commerce Platform
```typescript
// Navigation
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "orders", label: "Orders", path: "/orders" },
  { id: "products", label: "Products", path: "/products" },
  { id: "customers", label: "Customers", path: "/customers" },
  { id: "analytics", label: "Analytics", path: "/analytics" }
]

// Key Metrics
dashboardCards: [
  { title: "Revenue", dataSource: "payments", valueType: "sum" },
  { title: "Orders", dataSource: "orders", valueType: "count" },
  { title: "Conversion Rate", dataSource: "analytics", valueType: "percentage" }
]
```

### SaaS Platform
```typescript
// Navigation
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "team", label: "Team", path: "/team" },
  { id: "billing", label: "Billing", path: "/billing" },
  { id: "settings", label: "Settings", path: "/settings" }
]

// Key Metrics
dashboardCards: [
  { title: "Active Projects", dataSource: "projects", valueType: "count" },
  { title: "Team Members", dataSource: "users", valueType: "count" },
  { title: "Monthly Spend", dataSource: "billing", valueType: "sum" }
]
```

### Medical Practice
```typescript
// Navigation
navigation: [
  { id: "dashboard", label: "Dashboard", path: "/" },
  { id: "appointments", label: "Appointments", path: "/appointments" },
  { id: "patients", label: "Patients", path: "/patients" },
  { id: "records", label: "Records", path: "/records" },
  { id: "billing", label: "Billing", path: "/billing" }
]

// Status Mappings
statusConfig: {
  appointmentStatus: {
    scheduled: { color: "info", label: "Scheduled" },
    inProgress: { color: "warning", label: "In Progress" },
    completed: { color: "success", label: "Completed" },
    noShow: { color: "error", label: "No Show" }
  }
}
```

## 🎨 Theme & Design System

### Color Customization

**Live Theme Testing** (Browser Console):
```javascript
// Test colors instantly without file changes
setThemeColor('primary-color', '#e91e63')    // Pink
setThemeColor('secondary-color', '#ff9800')  // Orange

// Apply preset themes
applyColorPreset('blue')     // Corporate blue
applyColorPreset('green')    // Nature green
applyColorPreset('purple')   // Luxury purple
applyColorPreset('red')      // Bold red
```

**Permanent Color Configuration**:
```typescript
theme: {
  primaryColor: "#1976d2",      // Material Blue
  secondaryColor: "#f57c00",    // Material Orange
  mode: "light",                // or "dark"
  borderRadius: 8,              // 0 for sharp, 16+ for rounded
  fontFamily: '"Inter", sans-serif'
}
```

### Design Principles

- **Desktop-First Design** - Sophisticated layouts optimized for desktop, then mobile
- **Flat, Geometric Aesthetic** - Clean lines, minimal shadows, professional appearance
- **Maximum Information Density** - Efficient use of space, minimal whitespace
- **Color-Based Interactions** - Hover effects use color changes, no animations
- **Mature, Sophisticated Tones** - Professional color palettes, not trendy

## 🧪 Testing & Quality

### Quality Gates
- **86 Comprehensive Tests** - Unit tests for all major components and hooks
- **Type Safety** - Strict TypeScript configuration with 100% coverage
- **Performance Testing** - React.memo and memoization patterns tested
- **Integration Testing** - Page-level and context testing

### Running Tests
```bash
npm test                    # Run all tests
npm test -- FieldRenderer  # Run specific component tests
npm test -- useData        # Run specific hook tests
npm run lint               # Code quality checks
```

### Pre-Commit Quality Checks
```bash
# Ensure all tests pass before customization
npm test && npm run lint
```

## 🔧 Technical Architecture

### Core Technologies
- **React 19.1.1** - Latest React with modern patterns
- **TypeScript 5.8.3** - Strict typing with verbatimModuleSyntax
- **Vite 7.1.0** - Fast build tool and dev server
- **Material-UI** - Component library with comprehensive theming
- **React Router** - Client-side routing with lazy loading

### Key Abstractions

**1. PageLayout Component**
- Eliminates page boilerplate
- Automatic title/description lookup from navigation config
- Built-in loading states and error boundaries
- Consistent layout patterns

**2. FieldRenderer Component**
- Handles all field types: dates, currency, status, priority
- Configurable variants: primary, secondary, chip
- Type-safe with fallback handling
- Extensible for new field types

**3. useDataOperations Hook**
- Generic filtering, sorting, pagination
- Works with any data structure
- Reusable across all pages
- Performance optimized

**4. Configuration-Driven Architecture**
- Navigation, actions, status mappings, field display all configurable
- Generic TypeScript interfaces work for any business domain
- Clear separation between configuration and sample data

### Performance Optimizations
- **React.memo** - All components optimized to prevent unnecessary re-renders
- **useMemo/useCallback** - Expensive calculations and object creation memoized
- **Lazy Loading** - Route components loaded on demand
- **Context Optimization** - AppContext optimized to prevent cascading re-renders

## 🚢 Deployment & Production

### Build Process
```bash
npm run build      # Production build → dist/
npm run preview    # Test production build locally
```

### Environment Configuration
```typescript
// src/utils/env.ts - Ready for environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
export const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID
export const ENVIRONMENT = import.meta.env.MODE
```

### Production Checklist
- [ ] Update service information with real business data
- [ ] Configure authentication endpoints
- [ ] Set up API integration
- [ ] Update environment variables
- [ ] Test on target devices and browsers
- [ ] Run full test suite
- [ ] Security audit for any sensitive data

## 📚 Additional Resources

### File Structure Guide
```
src/
├── components/          # Reusable UI components
│   ├── PageLayout.tsx   # Universal page wrapper
│   ├── FieldRenderer.tsx # Universal field display
│   └── StatusChip.tsx   # Configurable status display
├── data/
│   ├── configurableData.ts # App configuration (your main customization file)
│   └── sampleData.ts       # Sample data (replace with your data)
├── hooks/              # Custom React hooks
│   ├── useDataOperations.ts # Generic data manipulation
│   └── useNavigation.ts     # Navigation utilities
├── pages/              # Route components
├── services/           # API and authentication (ready for backend)
├── theme/              # Centralized styling
├── types/              # Generic TypeScript interfaces
└── utils/              # Helper functions
```

### Customization Priority
1. **High Impact, Low Effort** - Update `configurableData.ts` and `sampleData.ts`
2. **Medium Impact, Low Effort** - Add new status types, field types, action types
3. **High Impact, Medium Effort** - Add new pages using existing abstractions
4. **Medium Impact, High Effort** - Extend components for domain-specific logic
5. **High Impact, High Effort** - Backend integration and authentication

### Getting Help
- Review `CLAUDE.md` for detailed development guidelines
- Check the test files for usage examples of all components
- Use the browser console theme functions for rapid color testing
- All components are documented with TypeScript interfaces

---

**Ready to fork and customize!** This scaffold provides the foundation for any business portal application with minimal customization effort and maximum flexibility.