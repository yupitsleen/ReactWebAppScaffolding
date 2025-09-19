# CLAUDE.md

This file provides guidance to Claude Code when working with this React web application.

## Project Structure

This is a React web application built with Vite, TypeScript, and modern React patterns. It's designed as a reusable scaffold for any future React projects.

### Key Files and Directories
- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `src/components/` - Reusable UI components
- `src/layouts/` - Page layout components
- `src/pages/` - Route components (Home, About, NotFound)
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions and helpers
- `src/context/` - React Context providers for state management
- `src/types/` - TypeScript type definitions
- `src/constants/` - Application constants

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
- **CSS Modules** - Scoped styling

**Application Structure:**
- **Routing** - React Router with BrowserRouter
- **State Management** - Context API for global app state (user, theme, loading)
- **Layout System** - Reusable Layout component with navigation
- **Error Handling** - Error boundaries for graceful error recovery
- **TypeScript** - Strict configuration with proper type-only imports

**Available Utilities:**
- `useDebounce` - Debounce values for search/input
- `useToggle` - Simple boolean state toggle
- Helper functions: `formatDate`, `debounce`, `classNames`, `generateId`, `isValidEmail`

## Development Notes

- All TypeScript interfaces use `type` imports due to `verbatimModuleSyntax`
- CSS Modules provide automatic scoping (`.module.css` files)
- Error boundaries catch and display user-friendly error messages
- The app is fully responsive and supports light/dark theming via Context
- Code is structured to be easily forkable for new projects

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
- Purple (#6B46C1) for primary actions and headers
- Yellow (#F59E0B) for secondary actions and warnings
- Green (#10B981) for success states
- Mature, sophisticated tones (not bright or trendy)

**Data-Driven Configuration:**
- All UI elements configurable through `src/data/mockData.ts`
- Navigation, dashboard cards, sections, and theme customizable
- Generic interfaces in `src/types/portal.ts`
- Domain-specific content only in mock data

**Visual Design Principles:**
- **Simplicity** - Clean, uncluttered interfaces
- **Intuitiveness** - Clear visual hierarchy and navigation
- **Accessibility** - Proper semantic markup and contrast ratios
- **Unity** - Consistent spacing, typography, and component behavior

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

## Development Preferences

- Take development slowly, explaining each step for learning
- Keep the development server running to see changes in real-time
- Commit all significant code additions when the app is running properly
- Focus on one feature at a time with explanations
- Use concise commit messages without Claude co-author attribution
- Always create fresh branches off main for new features

**Styling Guidelines:**
- NEVER use inline styles in components
- Use theme-defined classes and Material-UI variants
- All visual changes go through theme provider
- Maintain accessibility and responsive design principles

## Future Technology Plans

- **Azure** - User management and authentication
- **Terraform** - Infrastructure as code management
- **SQLite** - Local database storage
- **C# and .NET** - Backend API development

## Future Extensions

This scaffold provides a solid foundation for:
- Adding new pages (create in `src/pages/`)
- New UI components (create in `src/components/`)
- Custom hooks (add to `src/hooks/`)
- State management extensions (modify `src/context/AppContext.tsx`)
- API integration (add to `src/utils/` or new `src/services/`)
- Database integration (SQLite or other databases)

The scaffold follows React best practices and can be extended for any application type.