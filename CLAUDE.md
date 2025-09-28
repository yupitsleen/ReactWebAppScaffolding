### Configuration Extension Patterns (#memorize)

- **Extend existing config** - Add to appConfig/statusConfig rather than creating new config objects
- **Use type-safe config** - Ensure new config follows existing TypeScript interfaces
- **Data-driven features** - If something can be configured in mockData.ts, do that instead of hardcoding
- **Preserve existing structure** - Follow patterns in configurableData.ts for consistency
- **Document config changes** - Update interface definitions when adding new config options

### Session Management (#memorize)

- **Maintain CURRENT_SESSION.md** - Create and update this file throughout development sessions
- **Update session file with every significant change** - Track progress, decisions, and next steps
- **Include recovery context** - File names modified, architectural decisions, current priorities
- **Prepare for conversation compaction** - Thoroughly update session file when approaching limits
- **Session file structure** - Current work, completed items, next priorities, architecture notes, modified files### Performance Considerations (#memorize)
- **Always use React.memo** for new components - prevents unnecessary re-renders
- **Memoize expensive calculations** - Use useMemo for data transformations
- **Memoize callback functions** - Use useCallback for functions passed as props
- **Avoid inline objects/arrays** - Extract to constants or memoize with useMemo
- **Lazy load when appropriate** - Use React.lazy for large route components### TypeScript Best Practices (#memorize)
- **Use existing interfaces** - Extend AppConfig, extend existing types rather than creating new ones
- **Strict type checking** - No `any` types, use proper TypeScript
- **Type-only imports** - Use `import type` for type imports due to verbatimModuleSyntax
- **Interface over type** - Use `interface` for object shapes, `type` for unions
- **Generic constraints** - Use `<T extends SomeInterface>` for reusable components### File Organization Patterns (#memorize)
- **Use existing directory structure** - Don't create new folders unless absolutely necessary
- **Follow naming conventions** - PascalCase for components, camelCase for hooks/utils
- **Group related functionality** - Keep related files in same directory
- **Avoid deep nesting** - Maximum 2-3 levels deep in src/
- **Export from index files** - Use barrel exports for clean imports### Testing Philosophy (#memorize)
- **Minimal, focused tests** - Test core functionality only, not edge cases or obvious behavior
- **Quality over quantity** - 3-5 essential tests better than 20+ exhaustive tests
- **Test critical paths** - Business logic, data transformations, error handling
- **Skip obvious tests** - Don't test props passing, simple renders, or framework behavior
- **One test file per major component/hook** - Keep test files concise and readable

### Error Handling Patterns (#memorize)

- **Use existing ErrorBoundary** - Don't create new error boundaries
- **Graceful degradation** - Show fallback UI for missing data, don't crash
- **User-friendly messages** - "Unable to load data" not "TypeError: undefined"
- **Console.error for debugging** - Log technical details to console, not UI
- **Validate at boundaries** - Check data at component entry points# CLAUDE.md

This file provides guidance to Claude Code when working with this React web application.

## Quick Navigation

- [Quick Reference](#quick-reference) - Commands and tech stack
- [Project Architecture](#project-architecture) - Structure and patterns
- [Critical Development Rules](#critical-development-rules) - Git workflow and quality gates
- [Design System](#design-system) - Color management and visual principles
- [Configuration System](#configuration-system) - Data-driven customization
- [Available Utilities](#available-utilities) - Hooks, helpers, and services
- [Smart Abstractions](#smart-abstractions) - Key reusable components
- [Development Preferences](#development-preferences) - Coding standards and approach

## Quick Reference

**Development Commands:**

```bash
npm run dev     # Start development server (http://localhost:5173) - usually already running
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
- Avoid excessive comments in code - only comment complex logic

### Quality Gates (#memorize)

- **Always run tests and linter** after each working change
- **No commits without passing tests** (40/40 ✓ required)
- **Dev server assumed running** on localhost:5173 for real-time feedback
- **Add unit tests** for crucial functionality before committing - minimal, focused tests only
- **Avoid excessive comments** - Only comment complex business logic, not self-explanatory code

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
- **Assume dev server running** - Changes visible at localhost:5173 for immediate feedback
- **Configuration over code** - Prefer data-driven solutions
- **Abstraction first** - Ask "Can this be configured instead of coded?"
- **Minimal comments** - Only comment complex logic, not self-explanatory code
- **Minimal tests** - Write only essential tests for core functionality, not exhaustive test suites
- **Incremental changes** - Make small changes, test, then continue - avoid large refactors

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

## MVP Backend Development Workflow (#memorize)

### Phase 1: Local Development MVP (Week 1-2) - IN PROGRESS
```bash
# ✅ .NET 8.0 SDK installed successfully
# 🎯 CURRENT TASK: Issue #10 - Backend Foundation Setup

# 1. Create C# Web API project
dotnet new webapi -n PortalAPI
cd PortalAPI

# 2. Install essential packages
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.Identity.Web

# 3. Generate models from TypeScript interfaces
# Use src/types/portal.ts as reference for C# model creation
```

**Current Progress:**
- ✅ Issue #10 started on feature/back-end branch
- ✅ .NET SDK installation complete
- 🔄 VS Code Admin restart for package installation privileges
- 📋 Ready to create PortalAPI project structure

**Critical Development Rules:**
- **Use TypeScript interfaces as contracts** - Generate C# models from `src/types/portal.ts`
- **Test immediately** - Use Thunder Client/Postman for each endpoint
- **Frontend integration first** - Switch ServiceFactory to API mode early
- **Authentication priority** - Implement auth before complex business logic

### Phase 2: Azure Deployment MVP (Week 3)
```bash
# Manual Azure setup (before Terraform)
az group create --name rg-portal-dev --location eastus
az sql server create --name portal-sql-dev --resource-group rg-portal-dev
az webapp create --name portal-api-dev --resource-group rg-portal-dev
```

**Deployment Checklist:**
- [ ] Azure App Service for Web API
- [ ] Azure SQL Database (Basic tier for MVP)
- [ ] Azure AD app registration
- [ ] Static Web Apps for React frontend
- [ ] Environment variables configuration

### Phase 3: Infrastructure as Code (Week 4)
```
/infrastructure
├── terraform/
│   ├── main.tf              # Main Azure resources
│   ├── variables.tf         # Environment configuration
│   ├── modules/
│   │   ├── app-service/     # Web API hosting
│   │   ├── database/        # SQL Database
│   │   └── static-web-app/  # React frontend
└── scripts/deploy.sh        # Automated deployment
```

**Terraform Integration Timeline:**
- **Manual setup first** - Learn Azure resources and requirements
- **Codify after validation** - Convert working infrastructure to Terraform
- **Benefits**: Avoid over-engineering before MVP validation

### Backend Integration Points

**Ready-to-Use Frontend Services:**
```typescript
// Frontend already configured for instant backend integration
ServiceFactory.createService<TodoItem>('tasks', mockTodos)
// Automatically switches to /api/todos when backend available

authService.login(credentials)  // Ready for C# auth endpoints
apiClient.get<TodoItem[]>('/todos')  // Type-safe API calls
```

**Environment Configuration:**
```bash
# Frontend .env for backend integration
VITE_API_BASE_URL=http://localhost:5000     # Local development
VITE_API_BASE_URL=https://portal-api.azurewebsites.net  # Production
VITE_AZURE_CLIENT_ID=your-azure-client-id
VITE_AZURE_TENANT_ID=your-azure-tenant-id
```

### Quality Gates for Backend Development (#memorize)
- **Frontend tests must pass** - 46/46 tests maintain green status
- **API integration testing** - Test ServiceFactory switch immediately
- **Authentication flow validation** - Login/logout/token refresh complete
- **Error handling verification** - Graceful API failure management
- **TypeScript contracts honored** - C# models match portal.ts interfaces

## GitHub Issue Tracking System (#memorize)

### MVP Development Issues Created (Issues #10-19)

**Issue Management Workflow:**
```bash
# 1. Start work on an issue
git checkout -b feature/backend-foundation
# Reference: Issue #10 - Backend Foundation Setup

# 2. Link PR to issue (include in PR description)
"Closes #10" or "Fixes #10"

# 3. Track progress by updating issue checkboxes
# Each issue has detailed sub-tasks for granular tracking

# 4. Issue automatically closes when PR merges
```

**Issue Organization:**
- **Phase 1 (Issues #10-13)**: Local Development MVP
  - Backend Foundation Setup, Authentication, API Endpoints, Integration Testing
- **Phase 2 (Issues #14-15)**: Azure Deployment MVP
  - Infrastructure Setup, Frontend Deployment
- **Phase 3 (Issues #16-17)**: Infrastructure as Code
  - Terraform Implementation, CI/CD Pipeline
- **Phase 4 (Issues #18-19)**: Production Hardening
  - Security & Performance, Scaling & Monitoring

**Strategic Labels for Filtering:**
- **Phase tracking**: `phase-1`, `phase-2`, `phase-3`, `phase-4`
- **Component tracking**: `backend`, `frontend`, `infrastructure`
- **Technology tracking**: `terraform`, `azure-ad`, `cicd`, `authentication`
- **Quality tracking**: `security`, `performance`, `testing`, `monitoring`

**Development Workflow Integration:**
- Each issue contains actionable sub-tasks and acceptance criteria
- Definition of Done specified for quality gates
- Related frontend files referenced for integration context
- Ready for PR linking and automated issue closure

**Issue Progress Tracking:**
```bash
# View issues by phase
gh issue list --label "phase-1"

# View all backend-related issues
gh issue list --label "backend"

# Check current MVP progress
gh issue list --milestone "Week 1-2"
```

This scaffold provides a solid foundation for any React application with enterprise-grade patterns, extensibility, and comprehensive project tracking.
