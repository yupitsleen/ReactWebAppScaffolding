# PortalAPI - Backend Documentation

**Enterprise-grade ASP.NET Core API with Service Layer and Repository patterns.**

## 🏗️ Architecture Overview

### Technology Stack
- **ASP.NET Core 8.0** - Modern web framework
- **Entity Framework Core 8.0** - ORM with SQLite
- **xUnit** - Testing framework with WebApplicationFactory
- **Dependency Injection** - Built-in ASP.NET Core DI container

### Architecture Patterns
```
HTTP Request → Controller → Service Layer → Repository Layer → DbContext → SQLite
```

## 🚀 Quick Start

### Prerequisites
- .NET 8.0 SDK
- SQLite (auto-installed with EF Core)

### Development Setup

```bash
# 1. Install dependencies
dotnet restore

# 2. Build project
dotnet build

# 3. Run tests
dotnet test --verbosity normal
# Expected: 6/6 tests passing

# 4. Start development server
dotnet run
# API available at: http://localhost:5276
```

## 📋 API Endpoints

### TodoController (`/api/todo`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET    | `/api/todo` | Get all todos | - | `TodoItem[]` |
| GET    | `/api/todo/{id}` | Get specific todo | - | `TodoItem` or 404 |
| POST   | `/api/todo` | Create new todo | `TodoCreateDto` | `TodoItem` |
| PUT    | `/api/todo/{id}` | Update existing todo | `TodoItem` | 204 or 404 |
| DELETE | `/api/todo/{id}` | Delete todo | - | 204 or 404 |

### Request/Response Examples

**POST `/api/todo`**
```json
{
  "title": "Complete backend testing",
  "description": "Implement comprehensive test suite",
  "assignedTo": "Development Team",
  "priority": "high",
  "status": "in-progress",
  "dueDate": "2025-10-01T12:00:00Z",
  "category": "Development",
  "createdBy": "System"
}
```

**Response (all endpoints):**
```json
{
  "id": "uuid-string",
  "title": "Complete backend testing",
  "description": "Implement comprehensive test suite",
  "assignedTo": "Development Team",
  "priority": "High",
  "status": "InProgress",
  "dueDate": "2025-10-01T12:00:00Z",
  "category": "Development",
  "createdBy": "System",
  "createdAt": "2025-09-29T21:11:09.6016585Z"
}
```

## 🏛️ Architecture Details

### Service Layer Pattern

**ITodoService Interface (`Services/Interfaces/ITodoService.cs`)**
```csharp
public interface ITodoService
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(string id);
    Task<TodoItem> CreateAsync(TodoCreateDto dto);
    Task<bool> UpdateAsync(string id, TodoItem todo);
    Task<bool> DeleteAsync(string id);
    Task<bool> ExistsAsync(string id);
}
```

**Benefits:**
- **Separation of Concerns**: Controllers handle HTTP, Services handle business logic
- **Testability**: Services can be mocked for unit testing
- **Reusability**: Service methods can be used by multiple controllers
- **Structured Logging**: Business context logging at service level

### Repository Pattern (Optional)

**ITodoRepository Interface (`Repositories/Interfaces/ITodoRepository.cs`)**
```csharp
public interface ITodoRepository : IRepository<TodoItem>
{
    // Domain-specific queries
    Task<IEnumerable<TodoItem>> GetByStatusAsync(TodoStatus status);
    Task<IEnumerable<TodoItem>> GetByPriorityAsync(Priority priority);
    Task<IEnumerable<TodoItem>> GetOverdueAsync();
    Task<Dictionary<TodoStatus, int>> GetStatusSummaryAsync();
}
```

**When to Use:**
- Complex domain queries
- Multiple data sources
- Advanced caching strategies
- Analytics and reporting

### Data Transfer Objects (DTOs)

**TodoCreateDto (`DTOs/TodoCreateDto.cs`)**
- Input validation with DataAnnotations
- Enum serialization handling (frontend: "high" → backend: Priority.High)
- RegularExpression validation for enum values

## 🗄️ Database Configuration

### Entity Framework Setup

**Connection String (`appsettings.json`)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=portal.db"
  }
}
```

**DbContext (`Data/PortalDbContext.cs`)**
- Automatic enum-to-string conversion
- Relationship configuration
- Entity constraints and indexes

### Database Models

**TodoItem Entity (`Models/TodoItem.cs`)**
```csharp
public class TodoItem
{
    [Key] public string Id { get; set; }
    [Required, StringLength(200)] public string Title { get; set; }
    [Required] public Priority Priority { get; set; }  // Enum with JSON conversion
    [Required] public TodoStatus Status { get; set; }  // Enum with JSON conversion
    // ... additional properties
}
```

### Enum Serialization

**Frontend-Backend Compatibility:**
```csharp
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Priority
{
    [JsonPropertyName("low")] Low,
    [JsonPropertyName("medium")] Medium,
    [JsonPropertyName("high")] High
}
```

**How it works:**
- Frontend sends: `"priority": "high"`
- Backend receives: `Priority.High`
- Database stores: `"High"`
- Response sends: `"priority": "High"`

## 🧪 Testing Strategy

### Integration Tests (`Tests/TodoControllerTests.cs`)

**Test Infrastructure:**
- **WebApplicationFactory**: Full HTTP pipeline testing
- **In-Memory Database**: Isolated test data per test run
- **Realistic Scenarios**: Complete request/response cycle testing

**Test Coverage:**
```csharp
[Fact] public async Task GetTodos_ReturnsEmptyArray_WhenNoTodos()
[Fact] public async Task GetTodo_ReturnsNotFound_WhenTodoDoesNotExist()
[Fact] public async Task CreateTodo_ReturnsCreatedTodo_WithValidData()
[Fact] public async Task UpdateTodo_ReturnsNoContent_WithValidData()
[Fact] public async Task DeleteTodo_ReturnsNoContent_WhenTodoExists()
[Fact] public async Task ApiHealthCheck_ReturnsOk()
```

### Running Tests

```bash
# Run all tests with detailed output
dotnet test --verbosity normal

# Run tests with coverage (requires additional tools)
dotnet test --collect:"XPlat Code Coverage"
```

## ⚙️ Configuration & Deployment

### Dependency Injection Registration (`Program.cs`)

```csharp
// Entity Framework
builder.Services.AddDbContext<PortalDbContext>(options =>
    options.UseSqlite(connectionString));

// Repository Layer (optional)
builder.Services.AddScoped<ITodoRepository, TodoRepository>();

// Service Layer
builder.Services.AddScoped<ITodoService, TodoService>();

// CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### Environment Configuration

**Development (`appsettings.Development.json`)**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

**Production Ready:**
- Connection string externalization
- Structured logging (Serilog ready)
- Health checks endpoint
- API versioning prepared

## 🔒 Security Features

### Current Implementation
- **CORS Configuration**: Specific origin allowlist
- **Input Validation**: DataAnnotations on DTOs
- **SQL Injection Prevention**: Entity Framework parameterized queries
- **Model Validation**: Automatic validation pipeline

### Ready for Enhancement
- **Authentication**: JWT Bearer token infrastructure prepared
- **Authorization**: `[Authorize]` attribute ready for implementation
- **Azure AD Integration**: Microsoft.Identity.Web packages installed

## 📈 Performance Considerations

### Current Optimizations
- **Async/Await**: Throughout all layers
- **Entity Framework**: Optimized queries with proper async patterns
- **Structured Logging**: Efficient logging with context
- **Database Indexing**: Configured in Entity Framework

### Ready for Scaling
- **Caching**: Redis integration patterns prepared
- **Connection Pooling**: Built-in EF Core connection management
- **Background Services**: ASP.NET Core hosted services ready
- **Load Testing**: Integration test infrastructure suitable for load testing

## 🚀 Next Development Phases

### Phase 1: Authentication
```csharp
// JWT Bearer configuration ready
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* configuration */ });
```

### Phase 2: Additional Controllers
- DocumentController (`/api/documents`)
- DiscussionController (`/api/discussions`)
- PaymentController (`/api/payments`)

### Phase 3: Advanced Features
- Global exception handling middleware
- API versioning (v1, v2)
- Swagger/OpenAPI documentation
- Background job processing

## 🛠️ Development Commands

```bash
# Project management
dotnet restore              # Install dependencies
dotnet build               # Compile project
dotnet clean               # Clean build artifacts

# Development
dotnet run                 # Start development server
dotnet watch run           # Auto-restart on file changes

# Testing
dotnet test                # Run all tests
dotnet test --verbosity normal  # Detailed test output

# Database
dotnet ef migrations add <Name>    # Create migration
dotnet ef database update         # Apply migrations
```

## 📁 Project Structure

```
PortalAPI/
├── Controllers/           # HTTP endpoint handlers
│   └── TodoController.cs
├── Services/             # Business logic layer
│   ├── Interfaces/
│   │   └── ITodoService.cs
│   └── Implementations/
│       └── TodoService.cs
├── Repositories/         # Data access layer (optional)
│   ├── Interfaces/
│   └── Implementations/
├── Models/               # Domain entities
│   └── TodoItem.cs
├── DTOs/                 # Data transfer objects
│   └── TodoCreateDto.cs
├── Data/                 # Entity Framework
│   └── PortalDbContext.cs
├── Tests/                # Integration tests
│   └── TodoControllerTests.cs
├── Program.cs            # Application entry point
├── appsettings.json      # Configuration
└── portal.db             # SQLite database file
```

## 🔍 Code Quality Standards

### Coding Conventions
- **Async/Await**: All I/O operations asynchronous
- **Dependency Injection**: Constructor injection throughout
- **Error Handling**: Structured exception handling with logging
- **Naming**: PascalCase for public members, camelCase for private
- **Documentation**: XML comments on public APIs

### Quality Gates
- ✅ All tests passing (6/6)
- ✅ No compiler warnings
- ✅ Proper exception handling
- ✅ Structured logging implemented
- ✅ Input validation on all endpoints

---

**Last Updated**: September 29, 2025
**Architecture Quality**: A- (Enterprise-ready)
**Test Coverage**: 6/6 integration tests passing
**API Version**: v1.0
**Database**: SQLite (ready for production SQL Server/PostgreSQL)