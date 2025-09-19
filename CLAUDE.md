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

## Development Preferences

- Take development slowly, explaining each step for learning
- Keep the development server running to see changes in real-time
- Commit all significant code additions when the app is running properly
- Focus on one feature at a time with explanations
- Use concise commit messages without Claude co-author attribution
- Always create fresh branches off main for new features

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