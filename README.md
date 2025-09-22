# Professional Portal Scaffold

A sophisticated, configurable React portal application built with TypeScript, Material-UI, and a theme-driven architecture. Currently configured as a wedding venue portal but designed to be easily customized for any business domain.

## Features

- **Desktop-First Sophisticated Design** - Non-typical, mature aesthetic with symmetrical layouts
- **Fully Configurable** - Change content, navigation, colors, and branding through data files
- **Theme-Driven Architecture** - Centralized styling with Material-UI component overrides
- **Responsive Design** - Thoughtful mobile adaptations that preserve desktop character
- **TypeScript** - Full type safety with generic, reusable interfaces
- **Modern React Patterns** - React 19, Context API, custom hooks

## Quick Start

```bash
npm install
npm run dev     # Start development server (http://localhost:5173)
```

## Customizing for Your Business

This portal is currently configured as a wedding venue portal. Follow these steps to customize it for your specific domain:

### 1. Update Business Information (`src/data/sampleData.ts`)

```typescript
export const serviceInfo: ServiceInfo = {
  name: "Your Business Name",
  tagline: "Your Business Tagline",
  description: "Description of your services",
  contact: {
    email: "your@email.com",
    phone: "(555) 123-4567",
    address: "Your business address"
  }
}
```

### 2. Configure App Settings (`src/data/configurableData.ts`)

```typescript
export const appConfig: AppConfig = {
  appName: "Your Portal Name",
  pageTitle: "Your Dashboard Title",
  navigation: [
    { id: "tasks", label: "Your Tasks", path: "/tasks", enabled: true, description: "Manage your tasks" },
    // Add/remove navigation items as needed
  ],
  theme: {
    primaryColor: "#YourBrandColor",
    secondaryColor: "#YourAccentColor",
    mode: "light", // or "dark"
    borderRadius: 16,
    fontFamily: '"Your Font", sans-serif'
  },
  // Configure status colors, field display, actions, etc.
  statusConfig: {
    priority: {
      high: { color: 'error', label: 'High Priority' },
      medium: { color: 'warning', label: 'Medium' }
    }
  },
  fieldConfig: {
    todoItem: {
      primary: 'title',
      secondary: ['priority', 'status', 'dueDate'],
      hidden: ['id', 'createdBy']
    }
  }
}
```

### 3. Replace Sample Data (`src/data/sampleData.ts`)

Replace the sample wedding data with your domain's data:

- **`todoItems`** → Your tasks/projects/orders
- **`payments`** → Your billing/invoices/transactions
- **`documents`** → Your files/contracts/reports
- **`discussions`** → Your communications/support tickets
- **`users`** → Your user roles and information

### 4. Update Dashboard Cards (`src/data/configurableData.ts`)

```typescript
dashboardCards: [
  {
    id: "your-metric",
    title: "Your Metric",
    subtitle: "Description",
    dataSource: "yourData",
    valueType: "count", // or "ratio"
    icon: "YourIcon", // Add to iconMappings in theme
    color: "primary"
  }
]
```

### 5. Configure Actions and Status Mappings

The new configuration system allows you to define:
- **Action buttons** for documents, accounts, etc.
- **Status color mappings** for priorities, statuses, payment states
- **Field display configuration** for what fields to show/hide
- **Icon mappings** for dynamic icon loading

### 6. Customize Pages (Optional)

Most functionality is now configurable through data files, but you may need to update:

- **`src/pages/Home.tsx`** - Dashboard calculations for your metrics
- **Page-specific logic** - Only if your domain requires different behavior than the generic abstractions provide

### Common Business Examples

**E-commerce Portal:**
- Tasks → Orders/Shipments
- Payments → Transactions
- Discussions → Customer Support
- Add inventory management sections

**Project Management:**
- Tasks → Projects/Milestones
- Payments → Budgets/Expenses
- Discussions → Team Communications
- Add time tracking features

**Medical Practice:**
- Tasks → Appointments
- Payments → Billing
- Documents → Medical Records
- Discussions → Patient Communications

### Design Customization

All styling is managed through the theme provider (`src/theme/portalTheme.ts`). The design follows these principles:

- **Desktop-First** - Sophisticated layouts designed for desktop, then adapted for mobile
- **Symmetrical Design** - Balanced, centered layouts with perfect proportions
- **Theme-Driven** - All styling centralized, components inherit from theme
- **Non-Typical** - Mature, sophisticated aesthetic that stands out

## Architecture

**File Structure:**
- `src/types/portal.ts` - Generic, reusable TypeScript interfaces
- `src/data/configurableData.ts` - App configuration (theme, navigation, actions, status mappings)
- `src/data/sampleData.ts` - Demo content data (replace with your actual data)
- `src/theme/portalTheme.ts` - Centralized styling and component overrides
- `src/components/PageLayout.tsx` - Eliminates page boilerplate
- `src/pages/` - Route components using abstractions and configuration
- `src/components/` - Reusable UI components

**Key Principles:**
- **Configuration Over Code** - Customize through data files, minimal component changes needed
- **Smart Abstractions** - PageLayout, action buttons, status mappings, field display all configurable
- **Theme Inheritance** - Components inherit styling from theme provider
- **Clear Data Separation** - Configuration vs. sample data clearly separated
- **Generic Interfaces** - Reusable types that work for any business domain

## Development

```bash
npm run dev     # Development server
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # Code linting
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
