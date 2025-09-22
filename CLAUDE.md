# CLAUDE.md

This file provides guidance to Claude Code when working with this React web application.

## Project Structure

This is a React web application built with Vite, TypeScript, and modern React patterns. It's designed as a reusable scaffold for any future React projects.

### Key Files and Directories
- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `src/components/` - Reusable UI components (ErrorBoundary, Footer, Loading, LoadingWrapper, PageLayout)
- `src/layouts/` - Page layout components with theme-driven styling
- `src/pages/` - Route components (Home, Tasks, Payments, Documents, Discussions, Account, About, Login, Register, Profile, NotFound)
- `src/hooks/` - Custom React hooks (useDebounce, useToggle, usePageLoading, useCurrentPage, useDocumentTitle)
- `src/utils/` - Utility functions and color management (helpers.ts, colorManager.ts, env.ts)
- `src/context/` - React Context providers for state management
- `src/types/` - TypeScript type definitions (app.ts, portal.ts)
- `src/services/` - API and authentication services (api.ts, auth.ts)
- `src/data/` - Mock data and configuration (mockData.ts)
- `src/theme/` - Centralized theme provider (portalTheme.ts)

## Common Commands

**Development:**
```bash
npm run dev     # Start development server (http://localhost:5173)
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## Architecture

**Core Technologies:**
- **React 19.1.1** - Latest React with modern patterns
- **TypeScript 5.8.3** - Strict typing with verbatimModuleSyntax
- **Vite 7.1.0** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Material-UI** - Component library with theme provider system
- **CSS Modules** - Scoped styling for Layout component

**Application Structure:**
- **Routing** - React Router with BrowserRouter
- **State Management** - Context API for global app state (user, theme, loading)
- **Layout System** - Reusable Layout component with navigation
- **Error Handling** - Error boundaries for graceful error recovery
- **TypeScript** - Strict configuration with proper type-only imports

**Available Utilities:**
- `useDebounce` - Debounce values for search/input
- `useToggle` - Simple boolean state toggle
- `usePageLoading` - Manage page-level loading states with configurable delays
- `useAsyncLoading` - Handle async data loading with loading/error states
- `useCurrentPage` - Automatically detect current page config from URL
- `useDocumentTitle` - Dynamically set browser tab title
- Helper functions: `formatDate`, `debounce`, `classNames`, `generateId`, `isValidEmail`

## Performance & Patterns

**React Performance Optimizations:**
- **React.memo** - All page components wrapped with memo to prevent unnecessary re-renders
- **useMemo/useCallback** - AppContext optimized with memoization to prevent cascading re-renders
- **Component Memoization** - Expensive calculations and object creations are memoized
- **Lazy Loading** - Route components are lazy loaded for better initial load performance

**Component Patterns:**
- **PageLayout Component** - Unified layout pattern for all pages
- **useCurrentPage Hook** - Automatic page configuration detection from URL
- **Dynamic Titles** - Browser tab titles automatically sync with navigation labels
- **Feature Flags** - Easy on/off toggles for pages via navigation config

**Architecture Benefits:**
- ✅ No hardcoded page IDs or navigation lookups
- ✅ Automatic synchronization between navigation and page titles
- ✅ Consistent layout and loading patterns across all pages
- ✅ Performance optimized with minimal re-renders

## Development Notes

- All TypeScript interfaces use `type` imports due to `verbatimModuleSyntax`
- CSS Modules provide automatic scoping (`.module.css` files)
- Error boundaries catch and display user-friendly error messages
- The app is fully responsive and supports light/dark theming via Context
- Code is structured to be easily forkable for new projects
- **IMPORTANT: Avoid Claude Code co-author attribution in commits** (#memorize)

## Git Workflow

**IMPORTANT: Always start new features from a fresh branch off main**

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create new feature branch
git checkout -b feature/feature-name

# 3. Make changes and commit
git add src/
git commit -m "Add feature description"

# 4. Push and create PR
git push -u origin feature/feature-name
# Then create PR via GitHub URL provided in output

# 5. After PR is merged, repeat from step 1
```

## Design System & Architecture

**Theme-Driven Development:**
- All styling is centralized in `src/theme/portalTheme.ts`
- Components inherit styling from theme provider, NOT inline styles
- Use semantic CSS classes (e.g., `header-section`, `dashboard-section`, `card-header`)
- Material-UI component overrides define consistent behavior

**Color Philosophy:**
- Primary palette uses purple-yellow-green triadic harmony
- **Dark Purple (#312E81)** for primary actions and headers
- **Yellow (#F59E0B)** for secondary actions and warnings
- **Green (#10B981)** for success states
- Mature, sophisticated tones (not bright or trendy)
- **Subdued purple background (#F3F4F6)** for subtle page background

**Data-Driven Configuration:**
- All UI elements configurable through `src/data/mockData.ts`
- Navigation, dashboard cards, sections, and theme customizable
- Generic interfaces in `src/types/portal.ts`
- Domain-specific content only in mock data

**Visual Design Principles:**
- **Desktop-First Design** - Reject mobile-first as too constraining for sophisticated interfaces
- **Flat, Geometric Aesthetic** - No rounded edges, shadows, or movement animations
- **Subtle Color-Based Interactions** - Hover effects use color changes only, no transforms or shadows
- **Maximum Information Density** - Minimal whitespace, compact layouts
- **Right-Aligned Discussions** - Discussion entries align right with max-width constraints
- **Sophisticated, Non-Typical Design** - Avoid typical design patterns, prefer symmetry over asymmetry
- **Sharp, Clean Lines** - borderRadius: 0 for all components
- **Sleek, No-Nonsense Layouts** - Remove unnecessary spacing and decoration

**Spacing System:**
- Section spacing: 48px desktop, 32px mobile
- Card padding: 24px
- Component gaps: 16px standard, 24px for sections
- Responsive breakpoints: xs (mobile), md (tablet), lg (desktop)

**Typography Hierarchy:**
- H1/H3/H4: Purple gradient text for primary headings
- H5: Section headers with medium weight
- H6: Subtitle text with proper line height
- Body text: Proper contrast ratios for accessibility

## Dynamic Color Management System

**CRITICAL: This app uses a centralized color management system with CSS custom properties**

**How it Works:**
1. **Theme Provider (`src/theme/portalTheme.ts`)** injects CSS variables into the DOM
2. **All colors use CSS variables** (`var(--primary-color)`, `var(--background-color)`, etc.)
3. **Configuration in `src/data/mockData.ts`** controls the theme colors

**Available CSS Variables:**
- `--primary-color` - Main theme color (currently #312E81)
- `--secondary-color` - Accent color (#F59E0B)
- `--background-color` - Page background (#F3F4F6)
- `--text-primary` - Main text color
- `--text-secondary` - Secondary text color
- `--border-color` - Border and divider colors

**Color Management Methods:**

1. **Configuration Changes (Permanent):**
   ```javascript
   // Edit src/data/mockData.ts
   theme: {
     primaryColor: "#312E81",  // Change this to update entire app
     secondaryColor: "#F59E0B",
     // ...
   }
   ```

2. **Live Testing (Browser Console):**
   ```javascript
   // Instant color changes for testing
   setThemeColor('primary-color', '#d32f2f');  // Red
   setThemeColor('primary-color', '#2e7d32');  // Green

   // Use presets
   applyColorPreset('red');
   applyColorPreset('green');
   applyColorPreset('blue');
   applyColorPreset('dark-purple');  // Back to current
   ```

3. **Global Functions Available:**
   - `setThemeColor(colorName, colorValue)` - Change any CSS variable
   - `getThemeColor(colorName)` - Get current color value
   - `applyColorPreset(preset)` - Apply predefined color schemes

**Key Benefits:**
- ✅ Change one value, updates entire app instantly
- ✅ Live testing in browser console without file edits
- ✅ No hunting through multiple CSS files
- ✅ Future color schemes are just config changes
- ✅ Works across all Material-UI components and CSS files

**NEVER hardcode colors** - always use CSS variables or theme configuration.

## Smart Abstraction System

**CRITICAL: This scaffold uses extensive abstraction for maximum reusability**

### PageLayout Component
- **Use for all pages**: `<PageLayout pageId="documents" loading={loading}>{content}</PageLayout>`
- **Eliminates boilerplate**: Automatic title/description lookup, built-in loading wrapper
- **Page titles/descriptions**: Configured in `appConfig.navigation`

### Action Button Configuration
- **All buttons configurable**: `appConfig.actions.document`, `appConfig.actions.account`
- **Dynamic rendering**: Icons, variants, colors, sizes from mockData
- **Add new actions**: Just add to mockData, no component changes needed

### Status/Priority System
- **All status colors configurable**: `appConfig.statusConfig.priority`, `statusConfig.status`
- **Usage**: `statusConfig.priority[todo.priority].color` instead of hardcoded logic
- **Supports**: priority, status, paymentStatus, documentShared mappings

### Field Display Configuration
- **Controls field rendering**: `appConfig.fieldConfig.todoItem.primary/secondary/hidden`
- **Dynamic field display**: Primary field prominent, secondary as chips, hidden excluded
- **Per-entity config**: todoItem, document, payment, discussion

### Icon Mapping
- **All icons configurable**: `appConfig.theme.iconMappings`
- **Dynamic loading**: `Icons[action.icon as keyof typeof Icons]`
- **Centralized**: No hardcoded icon imports in components

## Abstraction & Hierarchy Philosophy

**CRITICAL: Maximize abstraction and create clear hierarchies for ease of development**

**Parent-Child Inheritance:**
- Components should inherit ALL styling from parent theme provider
- Never override styles at component level unless absolutely necessary
- Create hierarchical styling where children inherit from parents
- Use composition over customization

**Configuration Over Code:**
- Prefer configuration files over hardcoded values
- Make everything data-driven through mock data
- Use interfaces to define structure, data to define content
- Enable customization without touching component code

**Abstraction Layers:**
1. **Theme Layer** - Global styling rules and component overrides
2. **Interface Layer** - Generic, reusable type definitions
3. **Data Layer** - Configurable content and settings
4. **Component Layer** - Presentational components using theme and data
5. **Page Layer** - Compositions using components with minimal custom logic

**Hierarchy Benefits:**
- **Easy Maintenance** - Change once, apply everywhere
- **Consistent Behavior** - All components follow same patterns
- **Rapid Development** - New features inherit existing styling
- **Predictable Results** - Clear inheritance chain for debugging
- **Scalable Architecture** - Adding new features doesn't break existing patterns

**Development Rules:**
- If you need custom styling, add it to theme provider first
- If you need new functionality, create a reusable abstraction
- Always ask: "Can this be configured instead of coded?"
- Prefer generic interfaces over specific implementations

## Future Extensibility Roadmap

**PRIORITY: Make the app more extensible through better abstractions following SOLID principles**

### Planned Extensibility Improvements:

**1. Generic Data Display Components**
- **Problem**: Each page manually maps data fields with duplicated logic
- **Solution**: Create `<DataCard>` and `<DataList>` components that work with any data structure
- **Benefit**: Add new data types without touching existing components
- **Configuration**: Use existing `fieldConfig` system for field rendering rules

**2. Abstract Status and Action Systems**
- **Problem**: Status colors and action buttons scattered across components
- **Solution**: Create `<StatusChip>` and `<ActionButton>` components driven by configuration
- **Benefit**: Add new statuses/actions by updating config only
- **Enhancement**: Extend current `statusConfig` and `actions` systems

**3. Configurable Field Rendering System**
- **Problem**: Field display logic duplicated across pages (dates, chips, etc.)
- **Solution**: Create `<FieldRenderer>` that handles different field types automatically
- **Benefit**: Support new field types (currency, images, etc.) through config
- **Integration**: Works with existing `fieldConfig.primary/secondary/hidden` system

**4. Generic Filtering and Sorting**
- **Problem**: Each page implements its own filtering logic
- **Solution**: Create reusable `useDataFilter` and `useDataSort` hooks
- **Benefit**: Add filtering/sorting to any page without custom implementation
- **Configuration**: Define filter rules in `appConfig`

### SOLID Principles Implementation:
- **Single Responsibility**: Each component handles one specific concern
- **Open/Closed**: Add new data types/actions/statuses without modifying existing code
- **Liskov Substitution**: Generic components work with any data that follows the interface
- **Interface Segregation**: Small, focused interfaces instead of large ones
- **Dependency Inversion**: Components depend on abstractions (config) not concrete implementations

### Architecture Benefits:
- **One-Place Updates**: Add new features by updating configuration only
- **Type Safety**: Generic components with proper TypeScript constraints
- **Reusability**: Same components work across different business domains
- **Maintainability**: Changes isolated to specific abstractions

## Development Preferences

- **Be concise** - Keep responses short and focused
- Keep the development server running to see changes in real-time
- Commit all significant code additions when the app is running properly
- Focus on one feature at a time
- **Use concise commit messages without Claude co-author attribution** (#memorize)
- **Avoid adjectives like "sophisticated" in commit messages** (#memorize)
- Always create fresh branches off main for new features

**Styling Guidelines:**
- NEVER use inline styles in components
- Use theme-defined classes and Material-UI variants
- All visual changes go through theme provider
- Maintain accessibility and responsive design principles
- **All text centered by default** through theme overrides
- Discussion content text left-aligned for readability

**Loading System:**
- Use `LoadingWrapper` for all async content
- Use `usePageLoading` hook for page-level loading
- No artificial delays - loading states for real async operations only

## Services Architecture

**API Layer (`src/services/api.ts`):**
- Modern fetch-based HTTP client with timeout handling
- TypeScript interfaces for responses and errors
- Authentication token support ready for Azure integration
- Methods: `get()`, `post()`, `put()`, `delete()`
- Usage: `import { apiClient } from '../services'`

**Authentication (`src/services/auth.ts`):**
- User management and token handling
- Azure AD authentication placeholders
- Local storage session management
- Methods: `login()`, `loginWithAzure()`, `logout()`, `isAuthenticated()`
- Usage: `import { authService } from '../services'`

**Environment Config (`src/utils/env.ts`):**
- Centralized environment variable management
- Azure configuration placeholders (CLIENT_ID, TENANT_ID, etc.)
- API endpoints and timeout settings
- Development/production detection

**Authentication Pages:**
- `Login.tsx` - Full login form with Azure AD button
- `Register.tsx` - User registration with validation
- `Profile.tsx` - User profile management
- All integrate with services layer and include TODO comments for backend implementation

## Future Technology Plans

- **Azure** - User management and authentication (services layer ready)
- **Terraform** - Infrastructure as code management
- **SQLite** - Local database storage
- **C# and .NET** - Backend API development (API client ready)

## Future Extensions

This scaffold provides a solid foundation for:
- Adding new pages (create in `src/pages/`)
- New UI components (create in `src/components/`)
- Custom hooks (add to `src/hooks/`)
- State management extensions (modify `src/context/AppContext.tsx`)
- API integration (add to `src/utils/` or new `src/services/`)
- Database integration (SQLite or other databases)

The scaffold follows React best practices and can be extended for any application type.