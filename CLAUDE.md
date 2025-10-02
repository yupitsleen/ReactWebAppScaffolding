# CLAUDE.md

This file provides guidance to Claude Code when working with this React web application.

## Quick Navigation

- [Quick Reference](#quick-reference) - Commands and tech stack
- [Project Architecture](#project-architecture) - Structure and patterns
- [Critical Development Rules](#critical-development-rules) - Git workflow and quality gates
- [Design System](#design-system) - Color management and visual principles
- [Configuration System](#configuration-system) - Data-driven customization
- [Available Utilities](#available-utilities) - Hooks, helpers, and services
- [Smart Abstractions](#smart-abstractions) - Key reusable components
- [Backend Development](#backend-development) - .NET Core API patterns
- [Development Preferences](#development-preferences) - Coding standards and approach

## Quick Reference

**Development Commands:**

```bash
npm run dev     # Start dev server (localhost:5173)
                # Works with or without backend running
                # Uses FallbackEntityService for tasks
npm run build   # Build for production
npm run lint    # Run ESLint
npm test        # Run frontend tests (56 tests)

# Backend commands (OPTIONAL for frontend development)
dotnet run      # Start API server (localhost:5276)
                # Frontend auto-connects when available
dotnet test     # Run backend tests (6 integration tests)
dotnet build    # Verify compilation
```

**Development Modes:**
- **Frontend only:** Full CRUD with mock data (backend not required)
- **Frontend + Backend:** Full CRUD with real API
- **No configuration changes needed** - FallbackEntityService handles switching

**Tech Stack:** React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.0 + Material-UI + React Router  
**Backend Stack:** .NET 8.0 + ASP.NET Core + Entity Framework Core + SQLite

## Project Architecture

### Frontend Structure

```
src/
├── data/                # mockData.ts (config), sampleData.ts (data)
├── components/          # PageLayout, FieldRenderer, StatusChip
├── pages/               # Route components
├── hooks/               # useDebounce, usePageLoading, useDataOperations
├── services/            # API client, auth, ServiceFactory
├── theme/               # Centralized theme provider
└── types/               # TypeScript interfaces
```

### Backend Structure

```
PortalAPI/
├── Controllers/         # Slim HTTP request handlers
├── Services/            # Business logic (ITodoService)
├── Repositories/        # Optional domain queries (ITodoRepository)
├── Models/              # Entity definitions
├── DTOs/                # API contracts with validation
├── Data/                # DbContext and migrations
└── Tests/               # Integration tests (WebApplicationFactory)
```

### Key Patterns

- **Configuration-Driven** - 90% customization through `src/data/configurableData.ts`
- **Service Layer** - Controllers → Services → Repositories → DbContext
- **Theme-Based Styling** - NO inline styles, all through `src/theme/portalTheme.ts`
- **Performance Optimized** - React.memo, useMemo/useCallback, lazy loading

## Critical Development Rules

### Git Workflow (#memorize)

```bash
# Work on current feature branch (user creates from main)
git commit -m "Add field renderer configuration system"
# NOT: "Add field rendering with Claude assistance"

# Push and create PR when complete
git push origin [current-branch-name]
# Then create PR with descriptive title and summary

# User approves/merges PR and creates next fresh branch
```

**Commit Standards:**

- Imperative mood: "Add", "Fix", "Refactor"
- Be specific about what changed
- No co-author attribution (#memorize)
- Include scope: "components:", "hooks:", "services:"
- Minimal comments - only for complex logic

### Quality Gates (#memorize)

- **Always run tests** after each working change
- **No commits without passing tests** - Frontend: 40/40 ✓, Backend: 6/6 ✓
- **Dev server assumed running** - localhost:5173 for real-time feedback
- **Minimal, focused tests** - Test core functionality only
- **Avoid excessive comments** - Code should be self-explanatory

### Session Management (#memorize)

- **Maintain CURRENT_SESSION.md** - Update throughout development
- **Track progress and decisions** - Modified files, architecture choices, next steps
- **Prepare for compaction** - Thorough updates when approaching conversation limits
- **Session structure** - Current work, completed items, next priorities, modified files, recovery context

## Design System

### Color Management (CRITICAL)

Centralized CSS custom properties system:

**CSS Variables:**

- `--primary-color` (#312E81 - Dark Purple)
- `--secondary-color` (#F59E0B - Yellow)
- `--background-color` (#F3F4F6 - Subdued Purple)

**Live Testing (Browser Console):**

```javascript
setThemeColor("primary-color", "#d32f2f");
applyColorPreset("blue");
```

**Configuration:**

```javascript
// src/data/configurableData.ts
theme: {
  primaryColor: "#312E81",
  secondaryColor: "#F59E0B"
}
```

### Styling Rules (#memorize)

- **NEVER use inline styles** - ALL styling through theme provider
- **Use semantic CSS classes** - `header-section`, `dashboard-section`
- **Desktop-first design** - Sophisticated layouts, minimal whitespace
- **Flat, geometric aesthetic** - No rounded edges, no shadows

## Configuration System

### Action Buttons

```javascript
appConfig.actions.document = {
  icon: "Download",
  variant: "contained",
  color: "primary",
};
```

### Status/Priority System

```javascript
statusConfig.priority[todo.priority].color;
appConfig.statusConfig.priority.high = { color: "#dc2626", label: "High" };
```

### Field Display Configuration

```javascript
appConfig.fieldConfig.todoItem = {
  primary: ["title"], // Prominent display
  secondary: ["priority"], // As chips
  hidden: ["internalNotes"], // Excluded
};
```

## Available Utilities

### Custom Hooks

- `useDebounce(value, delay)` - Debounce for search/input
- `usePageLoading(delay?)` - Page-level loading states
- `useCurrentPage()` - Auto-detect page config from URL
- `useDataOperations(data)` - Generic filtering, sorting, pagination

### Service Layer (#memorize)

**Choose the right service for your entity:**

1. **MockEntityService** - No backend, never will have
   - Example: Static reference data, demos
   - All operations in-memory only
   - Use for: Discussions, Documents (currently)

2. **BaseEntityService** - Backend required, no fallback
   - Example: Production APIs, auth services
   - Fails fast if backend unavailable
   - Use for: Critical APIs that must have backend

3. **FallbackEntityService** - Backend preferred, mock fallback
   - Example: CRUD entities during development
   - Seamless offline development
   - **Use for: Tasks (current implementation)**

**Current Configuration (src/services/index.ts):**
```typescript
// FallbackEntityService - tries API, falls back to mock
export const todosService = new FallbackEntityService<TodoItem>('Tasks', '/api/todo', todoItems)

// MockEntityService - always uses mock data
export const discussionsService = new MockEntityService<Discussion>('Discussions', discussions)
export const documentsService = new MockEntityService<Document>('Documents', documents)
```

**FallbackEntityService Behavior:**
- Tries API first on every call
- Falls back to mock on network error
- Console warns: "Tasks API unavailable, using mock data"
- Retries API every 30 seconds
- Automatically reconnects when backend available

## Smart Abstractions

### PageLayout Component

```tsx
<PageLayout pageId="documents" loading={loading}>
  {content}
</PageLayout>
```

- Auto title/description from navigation config
- Built-in loading wrapper
- Consistent layout patterns

### FieldRenderer Component

Handles all field types automatically (dates, currency, status, priority)

### DataTable Component

```tsx
<DataTable
  data={items}
  columns={[
    { field: 'title', header: 'Title', width: '40%' },
    {
      field: 'status',
      header: 'Status',
      render: (value, row) => <FieldRenderer field="status" value={value} entity={row} variant="chip" />
    }
  ]}
  sortable
  filterable
  paginated
  defaultRowsPerPage={10}
  onRowClick={(row) => handleEdit(row)}
/>
```

**Features:**
- Type-safe column configuration
- Built-in sorting, filtering, pagination
- Custom cell renderers
- Clickable rows
- Empty states
- Responsive design

**Benefits:**
- Eliminates 100+ lines of boilerplate per table page
- Consistent table UX across application

### Interactive Component Patterns

#### Timeline Visualization

**Pattern:** Proportional positioning on visual timeline

```typescript
// Calculate position based on date range
const minDate = new Date(Math.min(...dates))
const maxDate = new Date(Math.max(...dates))
const range = maxDate.getTime() - minDate.getTime()
const position = ((date.getTime() - minDate.getTime()) / range) * 100

// Render at calculated position
<Box sx={{ left: `${position}%`, position: 'absolute' }} />
```

**Use cases:**
- Task timelines (src/pages/Timeline.tsx)
- Project milestones
- Event schedules

**Best practices:**
- Use proportional positioning (0-100%) for scalability
- Handle edge cases (single date, same dates)
- Provide visual feedback (hover states, tooltips)

#### Color-Coded Status Indicators

**Pattern:** Dynamic color based on multiple conditions

```typescript
const getStatusColor = (item: TodoItem): string => {
  const isOverdue = new Date(item.dueDate) < new Date()
  const isComplete = item.status === 'completed'

  if (isOverdue && !isComplete) return theme.palette.error.main
  if (isComplete) return theme.palette.success.main
  return theme.palette.info.main
}
```

**⚠️ CRITICAL:** Use theme colors, not hardcoded hex values
```typescript
// WRONG
return '#ef4444'

// RIGHT
return theme.palette.error.main
```

## Backend Development

### .NET Architecture Patterns (#memorize)

#### Service Layer Implementation

```csharp
// Interface-first design
public interface ITodoService {
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem> CreateAsync(TodoCreateDto dto);
}

// Registration in Program.cs
builder.Services.AddScoped<ITodoService, TodoService>();
```

#### DTO Pattern for API Integration

```csharp
public class TodoCreateDto {
    [Required]
    [RegularExpression(@"^(low|medium|high)$")]
    public string Priority { get; set; } = string.Empty;
}
```

#### Controller Conventions

```csharp
[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase {
    private readonly ITodoService _service;

    public TodoController(ITodoService service) {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetAll() {
        return Ok(await _service.GetAllAsync());
    }
}
```

### Frontend-Backend Integration (#memorize)

#### Enum Serialization Strategy

**Problem:** Frontend sends lowercase ("high", "in-progress"), Backend expects PascalCase enums

**Solution:**

```csharp
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Priority {
    [JsonPropertyName("low")] Low,
    [JsonPropertyName("medium")] Medium,
    [JsonPropertyName("high")] High
}
```

#### Integration Patterns

- **Explicit endpoints** - Direct API paths over complex derivation
- **Environment configuration** - `.env.local` requires dev server restart
- **Cache management** - `window.__APP_DEBUG__.clearPersistedData()` for localStorage
- **SDK version consistency** - Use `global.json` to pin .NET SDK

### Testing Strategy (#memorize)

#### xUnit Integration Tests

```csharp
public class TodoControllerTests : IClassFixture<WebApplicationFactory<Program>> {
    private readonly HttpClient _client;

    public TodoControllerTests(WebApplicationFactory<Program> factory) {
        _factory = factory.WithWebHostBuilder(builder => {
            builder.ConfigureServices(services => {
                services.AddDbContext<PortalDbContext>(options =>
                    options.UseInMemoryDatabase("TestDb"));
            });
        });
        _client = _factory.CreateClient();
    }
}
```

#### Testing Principles

- **WebApplicationFactory** - Test complete HTTP pipeline
- **In-memory database** - Isolated test data
- **Arrange-Act-Assert** - Clear test structure
- **Quality gate** - All PRs require passing tests

### Repository Pattern (Optional) (#memorize)

```csharp
// Generic CRUD
public interface IRepository<T> where T : class {
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(string id);
}

// Domain-specific queries
public interface ITodoRepository : IRepository<TodoItem> {
    Task<IEnumerable<TodoItem>> GetByStatusAsync(TodoStatus status);
    Task<IEnumerable<TodoItem>> GetOverdueAsync();
}
```

**When to use:**

- Complex domain queries
- Analytics and reporting
- Multiple data sources

**When to skip:**

- Simple CRUD operations work with Service → DbContext

**Note:** DbContext IS Unit of Work - no additional pattern needed

### ARM Architecture (#memorize)

- .NET SDK location: `/c/Program Files/dotnet/x64/dotnet.exe`
- PATH fix: `export PATH="$PATH:/c/Program Files/dotnet/x64"`
- Verification: `dotnet --version`

## Development Preferences

- **Be concise** - Short, focused responses
- **One feature at a time** - Maintain working state
- **Assume dev server running** - Changes visible at localhost:5173
- **Configuration over code** - Prefer data-driven solutions
- **Abstraction first** - Ask "Can this be configured?"
- **Minimal comments** - Only for complex logic
- **Minimal tests** - 3-5 essential tests, not exhaustive suites
- **Incremental changes** - Small changes, test, continue

### Development Workflow (#memorize)

#### Frontend-First Development

1. **Start frontend only** - `npm run dev`
   - Full CRUD operations with mock data
   - No backend required
   - Changes to tasks persist in memory during session

2. **Optional: Start backend** - `dotnet run`
   - Frontend automatically detects and connects
   - Switches from mock to real API
   - Check console for "API unavailable, using mock data" warnings

3. **Backend restart**
   - Frontend retries connection every 30 seconds
   - Automatically reconnects when backend available
   - No page refresh needed

#### Testing Workflow

1. **Frontend tests** - `npm test` (no backend needed)
2. **Backend tests** - `dotnet test` (uses in-memory database)
3. **Integration** - Start both, verify API connection in console

#### When to Use Each Mode

**Mock Data (backend off):**
- UI development and styling
- Component development
- Frontend-only feature work
- Rapid prototyping

**Real API (backend on):**
- API integration testing
- Database schema changes
- Backend business logic development
- Full-stack feature testing

### Offline Development (#memorize)

- **Design for offline-first** - All services should work without backend
- **Use FallbackEntityService** - For entities with backend implementation
- **Console warnings are helpful** - "Using mock data" shows current state
- **Periodic retry pattern** - 30 seconds is good balance (not too aggressive)
- **Transparent fallback** - Consumers shouldn't need to know about fallback logic

### Configuration Extension (#memorize)

- **Extend existing config** - Add to appConfig/statusConfig
- **Use type-safe config** - Follow existing TypeScript interfaces
- **Data-driven features** - Configure in configurableData.ts, not hardcode
- **Document config changes** - Update interface definitions

### TypeScript Best Practices (#memorize)

- **Use existing interfaces** - Extend, don't create new
- **Strict type checking** - No `any` types
- **Type-only imports** - Use `import type` (verbatimModuleSyntax)
- **Interface over type** - Objects use `interface`, unions use `type`

### Performance Considerations (#memorize)

- **Always use React.memo** for new components
- **Memoize calculations** - useMemo for data transformations
- **Memoize callbacks** - useCallback for functions as props
- **Avoid inline objects/arrays** - Extract or memoize

### File Organization (#memorize)

- **Use existing structure** - Don't create new folders unnecessarily
- **Naming conventions** - PascalCase for components, camelCase for hooks/utils
- **Avoid deep nesting** - Maximum 2-3 levels in src/
- **Barrel exports** - Use index files for clean imports

### Error Handling (#memorize)

- **Use existing ErrorBoundary** - Don't create new ones
- **Graceful degradation** - Show fallback UI, don't crash
- **User-friendly messages** - "Unable to load data" not "TypeError"
- **Console.error for debugging** - Technical details to console only

### Complex Task Management (#memorize)

- **Use TodoWrite tool** for multi-step implementations
- **Document before commit** - Update CLAUDE.md with new patterns
- **Three-phase completion** - Update docs → Commit code → Update session
- **Recovery preparation** - Update CURRENT_SESSION.md with context

## GitHub Issue Tracking (#memorize)

### Issue Workflow

```bash
# Start work
git checkout -b feature/backend-foundation
# Reference: Issue #10

# Link PR to issue (in PR description)
"Closes #10" or "Fixes #10"

# Issue auto-closes when PR merges
```

### Issue Organization

- **Phase 1 (#10-13)** - Local Development MVP
- **Phase 2 (#14-15)** - Azure Deployment MVP
- **Phase 3 (#16-17)** - Infrastructure as Code
- **Phase 4 (#18-19)** - Production Hardening

This scaffold provides a production-ready foundation for React applications with enterprise-grade patterns and comprehensive backend integration.
