# CLAUDE.md

This file provides guidance to Claude Code when working with this React web application.

## Quick Reference

**Development Commands:**

```bash
npm run dev     # Start development server (http://localhost:5173)
npm run build   # Build for production
npm run lint    # Run ESLint
```

**Tech Stack:** React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.0 + Material-UI + React Router

## Project Architecture

### Core Structure

```
src/
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
├── components/          # Reusable UI (ErrorBoundary, Loading, PageLayout)
├── pages/               # Route components (Home, Tasks, Payments, etc.)
├── hooks/               # Custom hooks (useDebounce, usePageLoading, etc.)
├── context/             # React Context for state management
├── services/            # API and auth services
├── theme/               # Centralized theme provider
├── types/               # TypeScript definitions
├── utils/               # Helpers and color management
└── data/                # Mock data and configuration
```

### Key Patterns

- **PageLayout Component**: Use `<PageLayout pageId="documents" loading={loading}>{content}</PageLayout>` for all pages
- **Configuration-Driven**: All UI elements configurable through `src/data/mockData.ts`
- **Theme-Based Styling**: NO inline styles, all styling through `src/theme/portalTheme.ts`
- **Performance Optimized**: React.memo, useMemo/useCallback, lazy loading

## Critical Development Rules

### Git Workflow (#memorize)

```bash
# 1. Always start fresh from main
git checkout main && git pull origin main

# 2. Create descriptive feature branch
git checkout -b feature/component-name

# 3. Make focused commits with clear messages
git commit -m "Add field renderer configuration system"
# NOT: "Add sophisticated field rendering with Claude assistance"

# 4. Clean up after merge
git checkout main && git pull && git branch -d feature/component-name
```

**Commit Standards:**

- Use imperative mood: "Add", "Fix", "Refactor"
- Be specific: "Extract FieldRenderer switch to config"
- No co-author attribution (#memorize)
- Include scope: "components:", "hooks:", "services:"

### Quality Gates (#memorize)

- **Always run tests and linter** after each working change
- **No commits without passing tests** (40/40 ✓ required)
- **Keep dev server running** on localhost:5173
- **Add unit tests** for crucial functionality before committing

## Design System

### Color Management (CRITICAL)

This app uses a centralized CSS custom properties system:

**CSS Variables Available:**

- `--primary-color` (#312E81 - Dark Purple)
- `--secondary-color` (#F59E0B - Yellow)
- `--background-color` (#F3F4F6 - Subdued Purple)
- `--text-primary`, `--text-secondary`, `--border-color`

**Live Testing (Browser Console):**

```javascript
setThemeColor("primary-color", "#d32f2f"); // Test red
applyColorPreset("blue"); // Apply blue preset
applyColorPreset("dark-purple"); // Back to default
```

**Configuration Changes:**

```javascript
// Edit src/data/mockData.ts
theme: {
  primaryColor: "#312E81",  // Change this to update entire app
  secondaryColor: "#F59E0B"
}
```

### Visual Principles

- **Desktop-First Design** - Sophisticated interfaces, not mobile-constrained
- **Flat, Geometric** - No rounded edges (borderRadius: 0), no shadows
- **Subdued Color Interactions** - Hover effects use color changes only
- **Maximum Information Density** - Minimal whitespace, compact layouts
- **Purple-Yellow-Green Triadic Harmony** - Mature, sophisticated tones

### Styling Rules

- **NEVER use inline styles** - ALL styling through theme provider
- **Use semantic CSS classes** - `header-section`, `dashboard-section`, `card-header`
- **Inherit from theme** - Components get styling from Material-UI overrides
- **All text centered by default** - Discussion content left-aligned for readability

## Configuration System

### Action Buttons

```javascript
// All buttons configurable in mockData.ts
appConfig.actions.document = {
  icon: "Download",
  variant: "contained",
  color: "primary",
};
```

### Status/Priority System

```javascript
// All status colors configurable
statusConfig.priority[todo.priority].color; // Instead of hardcoded logic
appConfig.statusConfig.priority.high = { color: "#dc2626", label: "High" };
```

### Field Display Configuration

```javascript
// Controls what fields show and how
appConfig.fieldConfig.todoItem = {
  primary: ["title"], // Prominent display
  secondary: ["priority"], // As chips
  hidden: ["internalNotes"], // Excluded from display
};
```

## Available Utilities

### Custom Hooks

- `useDebounce(value, delay)` - Debounce for search/input
- `useToggle(initial)` - Boolean state toggle
- `usePageLoading(delay?)` - Page-level loading with configurable delays
- `useCurrentPage()` - Auto-detect current page config from URL
- `useDocumentTitle(title)` - Dynamic browser tab titles

### Helper Functions

- `formatDate(date)`, `debounce(fn, delay)`, `classNames(...)`
- `generateId()`, `isValidEmail(email)`

### Services

```javascript
// API Client
import { apiClient } from "../services/api";
await apiClient.get("/todos");

// Authentication
import { authService } from "../services/auth";
await authService.login(credentials);
```

## Smart Abstractions

### PageLayout Component

Eliminates boilerplate for all pages:

```tsx
<PageLayout pageId="documents" loading={loading}>
  {content}
</PageLayout>
```

- Auto title/description lookup from `appConfig.navigation`
- Built-in loading wrapper
- Consistent layout patterns

### Icon Mapping

```javascript
// All icons configurable in mockData.ts
appConfig.theme.iconMappings = {
  download: "Download",
  edit: "Edit"
};

// Dynamic loading in components
const IconComponent = Icons[action.icon as keyof typeof Icons];
```

## Future Extensibility Roadmap

### Planned Abstractions (SOLID Principles)

1. **Generic Data Display** - `<DataCard>` and `<DataList>` components for any data structure
2. **Abstract Status System** - `<StatusChip>` driven by configuration
3. **Field Rendering System** - `<FieldRenderer>` handles different field types automatically
4. **Generic Filtering/Sorting** - Reusable `useDataFilter` and `useDataSort` hooks

### Backend Integration Ready

- **API Client** - Ready for C# Web API integration
- **Auth Service** - Azure AD integration prepared
- **Environment Config** - Backend endpoint configuration
- **Type Safety** - TypeScript interfaces can generate C# models

## Development Preferences

- **Be concise** - Keep responses short and focused
- **One feature at a time** - Maintain working state between changes
- **Real-time feedback** - Keep dev server running to see changes
- **Configuration over code** - Prefer data-driven solutions
- **Abstraction first** - Ask "Can this be configured instead of coded?"

### Loading System

- Use `LoadingWrapper` for async content
- Use `usePageLoading` hook for page-level loading
- No artificial delays - real async operations only

### Error Handling

- Error boundaries catch and display user-friendly messages
- TypeScript strict mode with proper type-only imports
- Graceful degradation for missing data or failed requests

## Backend Strategy

### Recommended Stack

- **C# and .NET Core** - Excellent VS Code support, enterprise-ready
- **Azure Active Directory** - Frontend already structured for integration
- **SQLite for development** - Migrate to SQL Server for production
- **VS Code Extensions**: C# Dev Kit, Azure Tools, REST Client

### Alternative Considerations

- **Node.js + Express** - Same language as frontend (TypeScript)
- **Auth0 or Firebase** - More flexible authentication providers
- **PostgreSQL** - More robust than SQLite for production

This scaffold provides a solid foundation for any React application with enterprise-grade patterns and extensibility.
