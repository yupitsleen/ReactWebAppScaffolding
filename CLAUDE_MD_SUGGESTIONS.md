# Suggested Updates to CLAUDE.md

**Date:** 2025-10-02
**Based on:** Session on frontend polish and API integration refinements

---

## 1. Update Test Counts

**Location:** Quick Reference section

**Current:**
```bash
npm test        # Run frontend tests (40 tests)
dotnet test     # Run backend tests (6 integration tests)
```

**Suggested:**
```bash
npm test        # Run frontend tests (51 tests)
dotnet test     # Run backend tests (6 integration tests)
```

**Reason:** Frontend test count increased from 40 to 51 with new state persistence tests

---

## 2. Add Section: State Persistence Pattern

**Location:** After "Available Utilities" section

**Add New Section:**

```markdown
## State Persistence Patterns (#memorize)

### localStorage Integration

**Pattern for UI preferences:**

```typescript
// Lazy initialization from storage
const [state, setState] = useState<boolean>(() =>
  getFromStorage('storage_key', defaultValue)
)

// Automatic persistence on change
useEffect(() => {
  setToStorage('storage_key', state)
}, [state])
```

**Benefits:**
- Instant UI with cached values
- Automatic persistence
- Type-safe with explicit types
- Survives page navigation and refresh

**Common Use Cases:**
- Filter states (hide completed, search terms)
- Sort preferences
- View mode (grid/list)
- Collapsed/expanded sections

**Storage Keys Convention:**
- Format: `{page}_{setting}` (e.g., `tasks_hideCompleted`)
- Prefix with page name for organization
- Use camelCase for setting name
```

---

## 3. Add Section: API Integration Testing

**Location:** Backend Development section, after Testing Strategy

**Add Subsection:**

```markdown
### Integration Test JSON Configuration (#memorize)

**Pattern for matching API serialization:**

```csharp
private readonly JsonSerializerOptions _jsonOptions;

public TestClass(WebApplicationFactory<Program> factory)
{
    // ... factory setup ...

    // Configure JSON options to match API
    _jsonOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };
    _jsonOptions.Converters.Add(new PriorityConverter());
    _jsonOptions.Converters.Add(new TodoStatusConverter());
}

// Use in all deserialization calls
var result = await response.Content.ReadFromJsonAsync<TodoItem>(_jsonOptions);
```

**Critical:** Test client must use same JSON converters as API to properly deserialize responses.

**Common Issue:** Forgetting to pass `_jsonOptions` causes enum deserialization failures.
```

---

## 4. Update DTO Pattern Section

**Location:** Backend Development section

**Add to existing DTO Pattern:**

```markdown
#### Update DTO Pattern

```csharp
public class TodoUpdateDto
{
    // All fields nullable for partial updates
    public string? Title { get; set; }
    public string? Status { get; set; }

    // Apply changes to existing entity
    public void ApplyToTodoItem(TodoItem todo)
    {
        if (Title != null) todo.Title = Title;
        if (Status != null) todo.Status = ParseStatus(Status);
        // ... other fields
    }

    private static TodoStatus ParseStatus(string status) { ... }
}
```

**Benefits:**
- Supports partial updates
- Client doesn't need to send entire object
- Immutable fields (ID, CreatedAt) protected
- Validation on changed fields only

**Controller Pattern:**
```csharp
[HttpPut("{id}")]
public async Task<ActionResult<TodoItem>> UpdateTodo(string id, TodoUpdateDto dto)
{
    var updated = await _service.UpdateAsync(id, dto);
    return updated == null ? NotFound() : Ok(updated);
}
```

**Why return entity:** Enables frontend to update state without refetch (reduces API calls).
```

---

## 5. Add Section: Custom JSON Converters

**Location:** Backend Development → Integration Patterns

**Add New Subsection:**

```markdown
### Custom JSON Converters for Enums (#memorize)

**Problem:** `JsonPropertyName` attribute doesn't work reliably with enum serialization

**Solution:** Custom `JsonConverter<T>` implementations

```csharp
public class TodoStatusConverter : JsonConverter<TodoStatus>
{
    // Deserialization: lowercase string → enum
    public override TodoStatus Read(ref Utf8JsonReader reader, ...)
    {
        var value = reader.GetString();
        return value?.ToLower() switch
        {
            "pending" => TodoStatus.Pending,
            "in-progress" => TodoStatus.InProgress,
            "completed" => TodoStatus.Completed,
            _ => TodoStatus.Pending  // Default value
        };
    }

    // Serialization: enum → lowercase string
    public override void Write(Utf8JsonWriter writer, TodoStatus value, ...)
    {
        var stringValue = value switch
        {
            TodoStatus.Pending => "pending",
            TodoStatus.InProgress => "in-progress",
            TodoStatus.Completed => "completed",
            _ => "pending"
        };
        writer.WriteStringValue(stringValue);
    }
}
```

**Registration:**
```csharp
// Program.cs
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new PriorityConverter());
        options.JsonSerializerOptions.Converters.Add(new TodoStatusConverter());
    });
```

**Benefits:**
- Case-insensitive reading (`"LOW"`, `"low"`, `"Low"` all work)
- Consistent lowercase output
- Default values for invalid input
- Works bidirectionally

**When to use:**
- Enum format differs between frontend/backend
- Need case-insensitive deserialization
- Want custom string representations
```

---

## 6. Add Section: ServiceFactory Patterns

**Location:** Frontend Architecture section

**Add Subsection:**

```markdown
### ServiceFactory Mock Configuration

**Pattern for hybrid data sources:**

```typescript
// src/services/index.ts
export const tasksService = ServiceFactory.createService<TodoItem>(
  'Tasks',
  '/api/todo',
  mockTodos,
  false  // Use API
)

export const discussionsService = ServiceFactory.createService<Discussion>(
  'Discussions',
  '/api/discussions',
  mockDiscussions,
  true  // Force mock data
)
```

**Use Cases:**
- Develop frontend while backend is incomplete
- Test with consistent mock data
- Avoid API rate limits during development
- Demo mode without backend

**ServiceFactory signature:**
```typescript
createService<T>(
  entityName: string,
  apiEndpoint: string,
  mockData: T[],
  forceMock?: boolean  // Override environment setting
)
```
```

---

## 7. Update Testing Preferences

**Location:** Development Preferences section

**Add to Testing subsection:**

```markdown
### React Component Testing Best Practices

**Router Context:**
```typescript
import { MemoryRouter } from 'react-router-dom'

render(
  <MemoryRouter initialEntries={['/tasks']}>
    <TasksComponent />
  </MemoryRouter>
)
```

**Context Mocking:**
```typescript
vi.mock('../context/ContextProvider', () => ({
  useData: () => ({ todos: mockTodos }),
  useUser: () => ({ user: mockUser })
}))
```

**Storage Helpers:**
```typescript
const getFromStorageSpy = vi.spyOn(helpers, 'getFromStorage')
const setToStorageSpy = vi.spyOn(helpers, 'setToStorage')

// Verify persistence
expect(setToStorageSpy).toHaveBeenCalledWith('key', value)
```

**Async Updates:**
```typescript
await waitFor(() => {
  expect(screen.getByText('Updated Text')).toBeInTheDocument()
})
```
```

---

## 8. Add Common Pitfalls Section

**Location:** After Development Preferences

**Add New Section:**

```markdown
## Common Pitfalls & Solutions (#memorize)

### Frontend

**Vite Cache Corruption:**
```bash
# Symptom: MIME type errors, module loading failures
# Solution:
rm -rf node_modules/.vite
npm run dev  # Restart dev server
```

**useEffect Infinite Loops:**
```typescript
// ❌ Bad: Creates new function on every render
useEffect(() => { loadData() }, [loadData])

// ✅ Good: Run only on mount
useEffect(() => { loadData() }, [])

// ✅ Good: Properly memoized dependency
const loadData = useCallback(() => { ... }, [])
useEffect(() => { loadData() }, [loadData])
```

**localStorage Stale Data:**
```typescript
// Clear cache during development
window.__APP_DEBUG__.clearPersistedData()
```

### Backend

**Test File Locks:**
```bash
# Symptom: dotnet test fails with file locked error
# Solution: Stop API server before testing
Ctrl+C  # Stop server
dotnet test
```

**Enum Case Mismatches:**
- Frontend expects lowercase ("pending")
- Backend returns PascalCase ("Pending")
- Solution: Custom JSON converters (see Custom JSON Converters section)

**Hot Reload Limitations:**
- Some changes require server restart
- Custom converters, middleware, DI registration
- When in doubt: restart server
```

---

## 9. Update Quick Reference Commands

**Location:** Quick Reference section

**Add:**

```bash
# Clear frontend cache
window.__APP_DEBUG__.clearPersistedData()  # Browser console

# Clear Vite build cache
rm -rf node_modules/.vite

# Run specific test file
npm test -- Tasks.test.tsx
```

---

## 10. Add Performance Considerations Section

**Location:** Development Preferences section

**Add Subsection:**

```markdown
### Performance Considerations (#memorize)

**API Data Refresh:**
```typescript
// Current implementation (potential issue):
useEffect(() => {
  loadEntities()
}, [loadEntities])  // Triggers on every loadEntities reference change

// Recommended for mount-only:
useEffect(() => {
  loadEntities()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])  // Run only on mount

// Alternative with staleness check:
const [lastFetch, setLastFetch] = useState<number>(0)
useEffect(() => {
  const now = Date.now()
  if (now - lastFetch > 5000) {  // 5 second cache
    loadEntities().then(() => setLastFetch(now))
  }
}, [])
```

**Memoization Dependencies:**
```typescript
// Include ALL dependencies
const filtered = useMemo(() => {
  return data.filter(item => item.status !== 'completed')
}, [data])  // ✅ Includes data dependency

// TypeScript explicit typing prevents errors
const statusValues: Record<string, number> = {
  'pending': 1,
  'completed': 3
}
```
```

---

## Summary of Changes

**Additions:**
1. State Persistence Patterns section
2. Integration Test JSON Configuration
3. Update DTO Pattern examples
4. Custom JSON Converters section
5. ServiceFactory mock configuration
6. React testing best practices
7. Common Pitfalls & Solutions section
8. Performance considerations
9. Additional quick reference commands
10. Updated test counts (40→51 frontend tests)

**Why These Changes:**
- Capture lessons from successful integration work
- Document patterns that work well
- Prevent common mistakes
- Provide quick reference for testing
- Improve onboarding for future sessions

**Impact:**
- Faster debugging (common pitfalls documented)
- Better test coverage (testing patterns clear)
- Consistent patterns (DTO, converters, mocking)
- Reduced trial-and-error (proven solutions documented)
