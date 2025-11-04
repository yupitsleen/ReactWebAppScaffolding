# Extensibility Guide

> **Complete Developer Guide** for extending the React Web App Scaffold with new entities, pages, and functionality

## Table of Contents

- [Quick Start](#quick-start)
- [Adding a New Entity (5 Minutes)](#adding-a-new-entity-5-minutes)
- [Using Generic Entity Pages](#using-generic-entity-pages)
- [Custom Field Rendering](#custom-field-rendering)
- [Form Generation](#form-generation)
- [Validation](#validation)
- [Testing Your Extension](#testing-your-extension)
- [Advanced Patterns](#advanced-patterns)

---

## Quick Start

The scaffold uses a **registry + factory pattern** that allows you to add complete CRUD functionality for new entities with minimal code. Everything is configured in one place: [`src/data/configurableData.ts`](src/data/configurableData.ts).

**What you get automatically:**
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Form generation with validation
- ✅ Generic page with table/card views
- ✅ Filtering and sorting
- ✅ Export functionality
- ✅ Loading and error states

**What you configure:**
- Entity type definition
- Sample data
- Form schema
- Status configurations
- Field display rules

---

## Adding a New Entity (5 Minutes)

Let's add a complete "Order" entity with CRUD operations.

### Step 1: Define the Entity Type

```typescript
// In src/types/portal.ts (or create src/types/orders.ts)
export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  items: OrderItem[]
  shippingAddress: string
  orderDate: string
  deliveryDate?: string
  notes?: string
  createdBy: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}
```

### Step 2: Create Sample Data

```typescript
// In src/data/configurableData.ts
import { Order } from '../types/portal'

export const sampleOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2025-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    total: 299.99,
    status: 'processing',
    paymentStatus: 'paid',
    items: [
      { productId: 'p1', productName: 'Widget', quantity: 2, price: 149.99 }
    ],
    shippingAddress: '123 Main St, City, ST 12345',
    orderDate: '2025-01-15T10:00:00Z',
    createdBy: 'system',
    createdAt: '2025-01-15T10:00:00Z'
  },
  // Add more sample orders...
]
```

### Step 3: Register the Service

```typescript
// In src/data/configurableData.ts
import { serviceRegistry } from '../services/ServiceRegistry'

// Register the order service (works with or without backend)
serviceRegistry.register<Order>('orders', {
  entityName: 'Orders',
  endpoint: '/api/orders',        // Backend endpoint (optional)
  mockData: sampleOrders,          // Fallback data
  mode: 'fallback'                 // Try API first, use mock if unavailable
})
```

### Step 4: Configure Status Display

```typescript
// In src/data/configurableData.ts
export const appConfig: AppConfig = {
  // ... other config

  statusConfig: {
    // Entity-scoped status configuration
    order: {
      status: {
        pending: { color: 'warning', label: 'Pending', icon: '⏳' },
        processing: { color: 'info', label: 'Processing', icon: '⚙️' },
        shipped: { color: 'primary', label: 'Shipped', icon: '📦' },
        delivered: { color: 'success', label: 'Delivered', icon: '✅' },
        cancelled: { color: 'error', label: 'Cancelled', icon: '❌' }
      },
      paymentStatus: {
        pending: {
          color: 'warning',
          label: 'Payment Pending',
          icon: '💳',
          description: 'Awaiting payment processing'
        },
        paid: { color: 'success', label: 'Paid', icon: '✅' },
        refunded: { color: 'default', label: 'Refunded', icon: '↩️' },
        failed: { color: 'error', label: 'Failed', icon: '❌' }
      }
    }
  }
}
```

### Step 5: Configure Field Display

```typescript
// In src/data/configurableData.ts
export const appConfig: AppConfig = {
  // ... other config

  fieldConfig: {
    order: {
      primary: 'orderNumber',                    // Main display field
      secondary: ['customerName', 'total', 'status', 'paymentStatus', 'orderDate'],
      hidden: ['id', 'items', 'createdBy']       // Don't show these fields
    }
  }
}
```

### Step 6: Configure Form Schema

```typescript
// In src/data/configurableData.ts
export const appConfig: AppConfig = {
  // ... other config

  formSchemas: {
    order: {
      title: 'Order',
      description: 'Create a new customer order',
      submitLabel: 'Create Order',
      cancelLabel: 'Cancel',
      fields: [
        {
          name: 'orderNumber',
          label: 'Order Number',
          type: 'text',
          placeholder: 'ORD-2025-XXX',
          required: true,
          grid: { xs: 12, md: 6 }
        },
        {
          name: 'customerName',
          label: 'Customer Name',
          type: 'text',
          required: true,
          grid: { xs: 12, md: 6 }
        },
        {
          name: 'customerEmail',
          label: 'Customer Email',
          type: 'email',
          required: true,
          grid: { xs: 12, md: 6 }
        },
        {
          name: 'total',
          label: 'Order Total',
          type: 'number',
          required: true,
          min: 0,
          step: 0.01,
          grid: { xs: 12, md: 6 }
        },
        {
          name: 'status',
          label: 'Order Status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' }
          ],
          grid: { xs: 12, md: 6 }
        },
        {
          name: 'paymentStatus',
          label: 'Payment Status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' }
          ],
          grid: { xs: 12, md: 6 }
        },
        {
          name: 'shippingAddress',
          label: 'Shipping Address',
          type: 'textarea',
          rows: 3,
          required: true,
          grid: { xs: 12 }
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
          rows: 4,
          placeholder: 'Add any special instructions',
          grid: { xs: 12 }
        }
      ]
    }
  }
}
```

### Step 7: Add Validation (Optional)

```typescript
// In src/data/configurableData.ts
import { validator } from '../validation/EntityValidator'

validator.registerSchema<Order>('order', {
  rules: [
    {
      field: 'orderNumber',
      required: true,
      pattern: /^ORD-\d{4}-\d{3}$/,
      patternMessage: 'Order number must be in format: ORD-YYYY-XXX'
    },
    {
      field: 'customerEmail',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: 'Please enter a valid email address'
    },
    {
      field: 'total',
      required: true,
      custom: (value) => {
        if (typeof value !== 'number') return 'Total must be a number'
        if (value <= 0) return 'Total must be greater than zero'
        if (value > 1000000) return 'Total exceeds maximum order value ($1,000,000)'
        return null
      }
    },
    {
      field: 'shippingAddress',
      required: true,
      min: 10,
      minMessage: 'Shipping address must be at least 10 characters'
    }
  ]
})
```

### Step 8: Add Navigation

```typescript
// In src/data/configurableData.ts
export const appConfig: AppConfig = {
  // ... other config

  navigation: [
    // ... existing nav items
    {
      id: 'orders',
      label: 'Orders',
      path: '/orders',
      enabled: true,
      description: 'Manage customer orders'
    }
  ]
}
```

**That's it!** You now have a complete CRUD system for Orders with:
- ✅ Automatic page generation (no custom component needed)
- ✅ Create/Edit dialogs
- ✅ Table and card views
- ✅ Filtering and sorting
- ✅ Form validation
- ✅ Status chips with icons

---

## Using Generic Entity Pages

The Generic Entity Page provides a complete, configurable page without writing any custom component code.

### Basic Configuration

```typescript
// In src/data/configurableData.ts
export const appConfig: AppConfig = {
  // ... other config

  entityPages: {
    orders: {
      entityKey: 'orders',
      title: 'Orders',
      subtitle: 'Manage and track customer orders',
      viewMode: 'both',              // 'table', 'cards', or 'both'
      defaultView: 'table',          // Default when viewMode is 'both'
      showFilters: true,
      showSort: true,
      showCreate: true,
      showExport: true,
      showRefresh: true
    }
  }
}
```

### Advanced: Custom Table Columns

```typescript
entityPages: {
  orders: {
    entityKey: 'orders',
    tableColumns: [
      { field: 'orderNumber', header: 'Order #', sortable: true },
      { field: 'customerName', header: 'Customer', sortable: true },
      {
        field: 'total',
        header: 'Total',
        sortable: true,
        render: (value) => `$${value.toFixed(2)}`
      },
      { field: 'status', header: 'Status', sortable: true },
      { field: 'orderDate', header: 'Order Date', sortable: true }
    ]
  }
}
```

### Advanced: Filters

```typescript
entityPages: {
  orders: {
    entityKey: 'orders',
    showFilters: true,
    filters: [
      {
        field: 'status',
        label: 'Order Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'processing', label: 'Processing' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' }
        ]
      },
      {
        field: 'paymentStatus',
        label: 'Payment Status',
        type: 'multiselect',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'paid', label: 'Paid' }
        ]
      },
      {
        field: 'orderDate',
        label: 'Order Date',
        type: 'dateRange'
      },
      {
        field: 'customerName',
        label: 'Customer Name',
        type: 'text'
      }
    ]
  }
}
```

### Advanced: Custom Sort Options

```typescript
entityPages: {
  orders: {
    entityKey: 'orders',
    sortOptions: [
      { value: 'orderDate', label: 'Order Date' },
      { value: 'total', label: 'Order Total' },
      { value: 'status', label: 'Status' },
      { value: 'customerName', label: 'Customer Name' }
    ],
    defaultSort: {
      field: 'orderDate',
      direction: 'desc'
    }
  }
}
```

---

## Custom Field Rendering

The scaffold includes a field renderer registry that allows you to customize how specific fields are displayed.

### Built-in Patterns

The following patterns are automatically recognized:

- `*Status` fields → Status chips with colors
- `*Date`, `*At` fields → Formatted date chips
- `*Amount`, `*Price`, `*Cost`, `total` → Currency formatting
- `is*`, `has*`, `can*` → Boolean Yes/No chips
- `*Email` → Email formatting
- `*Url`, `*Link` → Clickable links
- `*Percentage` → Percentage formatting

### Register Custom Field Renderer

```typescript
// In src/data/configurableData.ts or a separate file
import { fieldRenderers } from '../components/fieldRenderers/FieldRendererRegistry'
import { Chip, Typography } from '@mui/material'

// Exact field name match
fieldRenderers.register('orderNumber', ({ value }) => (
  <Chip
    label={value}
    size="small"
    variant="outlined"
    color="primary"
  />
))

// Pattern-based match (all fields ending in "Total")
fieldRenderers.registerPattern(/.*Total$/i, ({ value }) => (
  <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
    ${value.toFixed(2)}
  </Typography>
), 10) // Priority: higher = checked first

// Entity-specific override (highest priority)
fieldRenderers.register('order.priority', ({ value }) => {
  const config = {
    urgent: { label: '🔥 Urgent', color: 'error' },
    high: { label: '⬆️ High', color: 'warning' },
    normal: { label: 'Normal', color: 'default' }
  }
  const { label, color } = config[value] || { label: value, color: 'default' }
  return <Chip label={label} color={color} size="small" />
})
```

---

## Form Generation

Forms are automatically generated from your schema configuration.

### Field Types

The form generator supports all common field types:

#### Text Input
```typescript
{
  name: 'customerName',
  label: 'Customer Name',
  type: 'text',
  placeholder: 'Enter customer name',
  required: true,
  helperText: 'Full name as it appears on ID'
}
```

#### Email Input
```typescript
{
  name: 'email',
  label: 'Email Address',
  type: 'email',
  required: true
}
```

#### Number Input
```typescript
{
  name: 'total',
  label: 'Total Amount',
  type: 'number',
  min: 0,
  max: 1000000,
  step: 0.01,
  required: true
}
```

#### Textarea
```typescript
{
  name: 'notes',
  label: 'Additional Notes',
  type: 'textarea',
  rows: 4,
  placeholder: 'Add any special instructions'
}
```

#### Select Dropdown
```typescript
{
  name: 'status',
  label: 'Status',
  type: 'select',
  required: true,
  defaultValue: 'pending',
  options: [
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ]
}
```

#### Multi-Select
```typescript
{
  name: 'categories',
  label: 'Categories',
  type: 'multiselect',
  options: [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food' }
  ]
}
```

#### Checkbox
```typescript
{
  name: 'agreeToTerms',
  label: 'I agree to the terms and conditions',
  type: 'checkbox',
  required: true
}
```

#### Radio Buttons
```typescript
{
  name: 'shippingMethod',
  label: 'Shipping Method',
  type: 'radio',
  required: true,
  options: [
    { value: 'standard', label: 'Standard (5-7 days)' },
    { value: 'express', label: 'Express (2-3 days)' },
    { value: 'overnight', label: 'Overnight' }
  ]
}
```

#### Date Picker
```typescript
{
  name: 'dueDate',
  label: 'Due Date',
  type: 'date',
  required: true
}
```

#### DateTime Picker
```typescript
{
  name: 'appointmentTime',
  label: 'Appointment Time',
  type: 'datetime',
  required: true
}
```

#### Autocomplete
```typescript
{
  name: 'assignedTo',
  label: 'Assign To',
  type: 'autocomplete',
  options: [
    { value: 'user1', label: 'John Doe' },
    { value: 'user2', label: 'Jane Smith' }
  ]
}
```

### Grid Layout

Control responsive grid layout with the `grid` property:

```typescript
{
  name: 'firstName',
  label: 'First Name',
  type: 'text',
  grid: { xs: 12, md: 6 }  // Full width on mobile, half on desktop
}
```

### Using Forms in Custom Components

```typescript
import { EntityCreateDialog, EntityEditDialog } from '../components'

// In your component
<EntityCreateDialog
  entityKey="order"
  open={createDialogOpen}
  onClose={() => setCreateDialogOpen(false)}
  onSuccess={() => showSuccessMessage()}
/>

<EntityEditDialog
  entityKey="order"
  entity={selectedOrder}
  open={editDialogOpen}
  onClose={() => setEditDialogOpen(false)}
  onSuccess={() => showSuccessMessage()}
/>
```

---

## Validation

### Schema-Based Validation

```typescript
import { validator } from '../validation/EntityValidator'

validator.registerSchema<Order>('order', {
  rules: [
    // Required field
    {
      field: 'customerName',
      required: true
    },

    // Min/max length
    {
      field: 'customerName',
      required: true,
      min: 2,
      max: 100,
      minMessage: 'Name must be at least 2 characters',
      maxMessage: 'Name cannot exceed 100 characters'
    },

    // Pattern matching
    {
      field: 'email',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: 'Please enter a valid email address'
    },

    // Custom validation function
    {
      field: 'total',
      custom: (value, entity) => {
        if (typeof value !== 'number') return 'Total must be a number'
        if (value <= 0) return 'Total must be greater than zero'
        if (value > 1000000) return 'Total exceeds maximum allowed'

        // Cross-field validation
        if (entity.paymentStatus === 'paid' && value < 10) {
          return 'Paid orders must have a minimum total of $10'
        }

        return null // No error
      }
    }
  ]
})
```

### Using Validation in Custom Forms

```typescript
import { useEntityValidation } from '../hooks/useEntityValidation'

const MyCustomForm = () => {
  const [formData, setFormData] = useState<Partial<Order>>({})
  const { errors, validate, validateField } = useEntityValidation<Order>('order')

  const handleFieldChange = (field: keyof Order, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)

    // Real-time validation on change
    validateField(field, value, updated)
  }

  const handleSubmit = async () => {
    // Validate all fields
    if (!validate(formData)) {
      return // Errors are set in state
    }

    // Submit data
    await createEntity('order', formData)
  }

  return (
    <form>
      <TextField
        label="Customer Name"
        value={formData.customerName || ''}
        onChange={(e) => handleFieldChange('customerName', e.target.value)}
        error={!!errors.customerName}
        helperText={errors.customerName}
      />
      {/* More fields... */}
    </form>
  )
}
```

---

## Testing Your Extension

### Manual Testing Checklist

- [ ] **Create:** Can you create a new entity through the form?
- [ ] **Read:** Does the entity appear in the table/card view?
- [ ] **Update:** Can you edit the entity?
- [ ] **Delete:** Can you delete the entity?
- [ ] **Validation:** Do validation rules work correctly?
- [ ] **Filters:** Do filters work as expected?
- [ ] **Sorting:** Does sorting work for all configured fields?
- [ ] **Export:** Does CSV export work?
- [ ] **Status Chips:** Are status chips displaying with correct colors/icons?
- [ ] **Responsive:** Does the page work on mobile/tablet/desktop?

### Testing with Mock Data

The scaffold works entirely with mock data (no backend required). Test your entity by:

1. Adding sample data to your service registration
2. Running `npm run dev`
3. Navigating to your new page
4. Performing CRUD operations

All changes are persisted in memory during the session.

### Testing with Backend API

When you're ready to connect to a real backend:

1. Ensure your backend API matches the endpoint in service registration
2. Start your backend: `dotnet run` (for .NET backend)
3. The FallbackEntityService will automatically switch to using the API
4. No frontend code changes needed!

---

## Advanced Patterns

### Using Data Factories for Testing

Create reusable factory functions for generating test data:

```typescript
import { todoItemFactory, documentFactory } from './data/factories'

// Generate single entity
const todo = todoItemFactory.create({ priority: 'high' })

// Generate multiple entities
const todos = todoItemFactory.createMany(10)

// Generate variant
const urgentTodo = todoItemFactory.createHighPriority()
```

See [src/data/factories/](src/data/factories/) for factory implementations.

### Custom Page Components

If the Generic Entity Page doesn't meet your needs, create a custom component:

```typescript
// src/pages/CustomOrders.tsx
import { useGenericData } from '../context/GenericDataContext'

const CustomOrders = () => {
  const { getEntities, createEntity } = useGenericData()
  const orders = getEntities<Order>('orders')

  // Your custom UI logic
  return <div>Custom Orders Page</div>
}

export default CustomOrders
```

Then reference it in navigation:

```typescript
navigation: [
  {
    id: 'orders',
    label: 'Orders',
    path: '/orders',
    enabled: true,
    component: 'CustomOrders'  // Uses src/pages/CustomOrders.tsx
  }
]
```

### Programmatic CRUD Operations

Use the Generic Data Context anywhere in your app:

```typescript
import { useGenericData } from '../context/GenericDataContext'

const MyComponent = () => {
  const {
    getEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    getLoading,
    getError
  } = useGenericData()

  const orders = getEntities<Order>('orders')
  const loading = getLoading('orders')
  const error = getError('orders')

  const handleCreateOrder = async () => {
    try {
      const newOrder = await createEntity<Order>('orders', {
        orderNumber: 'ORD-2025-999',
        customerName: 'John Doe',
        total: 299.99,
        // ... other fields
      })
      console.log('Created:', newOrder)
    } catch (err) {
      console.error('Failed to create order:', err)
    }
  }

  const handleUpdateOrder = async (orderId: string) => {
    await updateEntity<Order>('orders', orderId, {
      status: 'shipped'
    })
  }

  const handleDeleteOrder = async (orderId: string) => {
    await deleteEntity('orders', orderId)
  }

  // Your component logic...
}
```

---

## Best Practices

### 1. Start Simple, Add Complexity

Begin with basic configuration and add features incrementally:

1. Register service with mock data
2. Add navigation item
3. Test with Generic Entity Page
4. Add form schema
5. Add validation
6. Add filters (if needed)
7. Customize field rendering (if needed)
8. Create custom page component (if needed)

### 2. Use TypeScript

Define proper types for your entities to get autocomplete and type checking:

```typescript
// ✅ Good - Type-safe
const order: Order = {
  id: '1',
  orderNumber: 'ORD-001',
  // TypeScript will ensure all required fields are present
}

// ❌ Bad - No type safety
const order = {
  id: '1',
  // Missing fields won't be caught
}
```

### 3. Leverage Default Renderers

Before writing custom field renderers, check if built-in patterns work:

- Fields ending in `Status` get status chips automatically
- Fields ending in `Date` get date formatting automatically
- Fields starting with `is` get boolean chips automatically

### 4. Keep Configuration Centralized

Put all entity configuration in `src/data/configurableData.ts` for easy discovery and maintenance.

### 5. Test with Mock Data First

Always test with mock data before connecting to a real backend. This allows rapid iteration without backend dependencies.

---

## Troubleshooting

### "Page Configuration Not Found"

**Problem:** Generic Entity Page shows error message

**Solution:** Add configuration to `appConfig.entityPages`:

```typescript
entityPages: {
  yourPageId: {
    entityKey: 'yourEntity',
    // ... config
  }
}
```

### Form Not Showing Fields

**Problem:** Create/Edit dialog appears but has no fields

**Solution:** Add form schema to `appConfig.formSchemas`:

```typescript
formSchemas: {
  yourEntity: {
    fields: [
      // ... field definitions
    ]
  }
}
```

### Validation Not Working

**Problem:** Forms submit without validation

**Solution:** Register validation schema:

```typescript
import { validator } from '../validation/EntityValidator'

validator.registerSchema('yourEntity', {
  rules: [
    // ... validation rules
  ]
})
```

### Status Chips Not Showing

**Problem:** Status fields display as plain text

**Solution:** Add status configuration:

```typescript
statusConfig: {
  yourEntity: {
    yourStatusField: {
      value1: { color: 'success', label: 'Label', icon: '✅' },
      // ... more status values
    }
  }
}
```

---

## Summary

With this scaffold, you can:

- **Add new entities in ~50 lines** (84% less code than traditional approach)
- **Get complete CRUD for free** (no custom page components needed)
- **Customize through configuration** (not code modifications)
- **Test without a backend** (mock data built-in)
- **Scale to production** (automatic API integration)

The key is **configuration over code** - define what you want, let the scaffold handle how.

---

*For more information, see:*
- [CLAUDE.md](CLAUDE.md) - Complete development guide
- [EXTENSIBILITY_IMPROVEMENTS.md](EXTENSIBILITY_IMPROVEMENTS.md) - Technical implementation details
- [README.md](README.md) - Project overview and setup

