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

### 1. Update Business Information (`src/data/mockData.ts`)

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

### 2. Configure App Settings

```typescript
export const appConfig: AppConfig = {
  appName: "Your Portal Name",
  pageTitle: "Your Dashboard Title",
  navigation: [
    { id: "tasks", label: "Your Tasks", path: "/tasks", enabled: true },
    // Add/remove navigation items as needed
  ],
  theme: {
    primaryColor: "#YourBrandColor",
    secondaryColor: "#YourAccentColor",
    mode: "light", // or "dark"
    borderRadius: 16,
    fontFamily: '"Your Font", sans-serif'
  }
}
```

### 3. Replace Sample Data

Replace the sample wedding data with your domain's data:

- **`todoItems`** → Your tasks/projects/orders
- **`payments`** → Your billing/invoices/transactions
- **`documents`** → Your files/contracts/reports
- **`discussions`** → Your communications/support tickets
- **`users`** → Your user roles and information

### 4. Update Dashboard Cards

```typescript
dashboardCards: [
  {
    id: "your-metric",
    title: "Your Metric",
    subtitle: "Description",
    dataSource: "yourData", // Update getCardValue() in Home.tsx
    valueType: "count",
    icon: "YourIcon", // Add to iconMap in Home.tsx
    color: "primary"
  }
]
```

### 5. Customize Pages

- **`src/pages/Home.tsx`** - Update dashboard logic for your data
- **`src/pages/Tasks.tsx`** - Customize for your task management
- **`src/pages/Payments.tsx`** - Adapt for your billing system
- **`src/pages/Documents.tsx`** - Configure for your file management
- **`src/pages/Discussions.tsx`** - Modify for your communications

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
- `src/data/mockData.ts` - All configurable content and settings
- `src/theme/portalTheme.ts` - Centralized styling and component overrides
- `src/pages/` - Route components using theme and data
- `src/components/` - Reusable UI components

**Key Principles:**
- **Configuration Over Code** - Customize through data, not component changes
- **Theme Inheritance** - Components inherit styling from theme provider
- **Generic Interfaces** - Reusable types that work for any business domain
- **Abstraction Hierarchy** - Clear parent-child relationships for easy maintenance

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
