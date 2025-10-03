# CLAUDE.md Update Suggestions

**Date:** 2025-10-02  
**Based on:** Frontend polish and API integration refinements

## 1. Update Test Counts

**Location:** Quick Reference → Development Commands

**Change:**

```bash
npm test        # Run frontend tests (56 tests)  # was 40
```

---

## 2. Add State Persistence Pattern

**Location:** After Available Utilities

**Add:**

```markdown
### State Persistence Pattern (#memorize)

**localStorage for UI preferences:**
\`\`\`typescript
// Lazy initialization from storage
const [hideCompleted, setHideCompleted] = useState<boolean>(() =>
getFromStorage('tasks_hideCompleted', false)
)

// Auto-persist on change
useEffect(() => {
setToStorage('tasks_hideCompleted', hideCompleted)
}, [hideCompleted])
\`\`\`

**Use cases:** Filter states, sort preferences, view modes, collapsed sections  
**Storage keys:** Format as `{page}_{setting}` (e.g., `tasks_hideCompleted`)
```

---

## 3. Add Custom JSON Converters

**Location:** Backend Development → Frontend-Backend Integration

**Add after Enum Serialization Strategy:**

```markdown
#### Custom JSON Converters (#memorize)

**When JsonPropertyName fails:**
\`\`\`csharp
public class TodoStatusConverter : JsonConverter<TodoStatus> {
public override TodoStatus Read(ref Utf8JsonReader reader, ...) {
return reader.GetString()?.ToLower() switch {
"pending" => TodoStatus.Pending,
"in-progress" => TodoStatus.InProgress,
"completed" => TodoStatus.Completed,
\_ => TodoStatus.Pending
};
}

    public override void Write(Utf8JsonWriter writer, TodoStatus value, ...) {
        var stringValue = value switch {
            TodoStatus.Pending => "pending",
            TodoStatus.InProgress => "in-progress",
            TodoStatus.Completed => "completed",
            _ => "pending"
        };
        writer.WriteStringValue(stringValue);
    }

}
\`\`\`

**Register in Program.cs:**
\`\`\`csharp
builder.Services.AddControllers()
.AddJsonOptions(options => {
options.JsonSerializerOptions.Converters.Add(new TodoStatusConverter());
});
\`\`\`

**When to use:** Enum format differs between frontend/backend, need case-insensitive deserialization
```

---

## 4. Update DTO Pattern

**Location:** Backend Development → DTO Pattern

**Add:**

```markdown
**Partial Update DTO:**
\`\`\`csharp
public class TodoUpdateDto {
public string? Title { get; set; } // All fields nullable
public string? Status { get; set; }

    public void ApplyToTodoItem(TodoItem todo) {
        if (Title != null) todo.Title = Title;
        if (Status != null) todo.Status = ParseStatus(Status);
    }

}
\`\`\`

**Controller returns updated entity (HTTP 200):**
\`\`\`csharp
[HttpPut("{id}")]
public async Task<ActionResult<TodoItem>> Update(string id, TodoUpdateDto dto) {
var updated = await \_service.UpdateAsync(id, dto);
return updated == null ? NotFound() : Ok(updated);
}
\`\`\`

**Benefits:** Partial updates, immutable fields protected, frontend updates state without refetch
```

---

## 5. Add Common Pitfalls

**Location:** After Development Preferences

**Add:**

```markdown
## Common Pitfalls (#memorize)

**Vite Cache Issues:**
\`\`\`bash
rm -rf node_modules/.vite && npm run dev
\`\`\`

**useEffect Infinite Loops:**
\`\`\`typescript
// ❌ Bad: New function every render
useEffect(() => { loadData() }, [loadData])

// ✅ Good: Run only on mount
useEffect(() => { loadData() }, [])
\`\`\`

**Test File Locks:**
\`\`\`bash

# Stop API server before testing

Ctrl+C && dotnet test
\`\`\`

**localStorage Stale Data:**
\`\`\`javascript
window.**APP_DEBUG**.clearPersistedData() // Browser console
\`\`\`
```

---

## 6. Add Testing Patterns

**Location:** Development Preferences → Testing

**Add:**

```markdown
### React Testing Patterns (#memorize)

**Router context:**
\`\`\`typescript
import { MemoryRouter } from 'react-router-dom'
render(<MemoryRouter><Component /></MemoryRouter>)
\`\`\`

**Storage spies:**
\`\`\`typescript
const setStorageSpy = vi.spyOn(helpers, 'setToStorage')
expect(setStorageSpy).toHaveBeenCalledWith('key', value)
\`\`\`

**Async updates:**
\`\`\`typescript
await waitFor(() => {
expect(screen.getByText('Updated')).toBeInTheDocument()
})
\`\`\`
```

---

## 7. Update Performance Section

**Location:** Development Preferences → Performance Considerations

**Add:**

```markdown
**API Data Refresh:**
\`\`\`typescript
// Run only on mount, not on every loadEntities change
useEffect(() => {
loadEntities()
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
\`\`\`
```

---

## 8. Add Quick Reference Commands

**Location:** Quick Reference section

**Add:**

```bash
# Clear caches
window.__APP_DEBUG__.clearPersistedData()  # Frontend (browser console)
rm -rf node_modules/.vite                   # Vite build cache

# Run specific test
npm test -- Tasks.test.tsx
```

---

## Summary

**Key Additions:**

- State persistence pattern (localStorage)
- Custom JSON converters for enums
- Partial update DTO pattern
- Common pitfalls and solutions
- React testing patterns
- Performance considerations

**Updated:**

- Test count: 40 → 56 frontend tests
- Quick reference commands

**Rationale:**

- Document proven patterns from successful integration
- Prevent common mistakes
- Faster debugging with documented solutions
- Better test coverage guidance
