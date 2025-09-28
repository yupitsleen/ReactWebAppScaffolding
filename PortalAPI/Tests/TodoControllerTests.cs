using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PortalAPI.Data;
using PortalAPI.Models;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace PortalAPI.Tests;

public class TodoControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public TodoControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace SQLite with in-memory database for testing
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<PortalDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                services.AddDbContext<PortalDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetTodos_ReturnsEmptyArray_WhenNoTodos()
    {
        // Act
        var response = await _client.GetAsync("/api/todo");

        // Assert
        response.EnsureSuccessStatusCode();
        var todos = await response.Content.ReadFromJsonAsync<TodoItem[]>();
        Assert.NotNull(todos);
        Assert.Empty(todos);
    }

    [Fact]
    public async Task CreateTodo_ReturnsCreatedTodo_WithValidData()
    {
        // Arrange
        var newTodo = new TodoItem
        {
            Title = "Test Todo",
            Description = "Test Description",
            AssignedTo = "Test User",
            Priority = Priority.High,
            Status = TodoStatus.Pending,
            DueDate = DateTime.UtcNow.AddDays(7),
            Category = "Test Category",
            CreatedBy = "Test Creator"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/todo", newTodo);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var createdTodo = await response.Content.ReadFromJsonAsync<TodoItem>();

        Assert.NotNull(createdTodo);
        Assert.False(string.IsNullOrEmpty(createdTodo.Id));
        Assert.Equal(newTodo.Title, createdTodo.Title);
        Assert.Equal(newTodo.Description, createdTodo.Description);
        Assert.Equal(newTodo.Priority, createdTodo.Priority);
        Assert.Equal(newTodo.Status, createdTodo.Status);
    }

    [Fact]
    public async Task GetTodo_ReturnsNotFound_WhenTodoDoesNotExist()
    {
        // Act
        var response = await _client.GetAsync("/api/todo/nonexistent-id");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateTodo_ReturnsNoContent_WithValidData()
    {
        // Arrange - Create a todo first
        var newTodo = new TodoItem
        {
            Title = "Original Title",
            Description = "Original Description",
            AssignedTo = "Test User",
            Priority = Priority.Low,
            Status = TodoStatus.Pending,
            DueDate = DateTime.UtcNow.AddDays(7),
            Category = "Test Category",
            CreatedBy = "Test Creator"
        };

        var createResponse = await _client.PostAsJsonAsync("/api/todo", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoItem>();

        // Update the todo
        createdTodo!.Title = "Updated Title";
        createdTodo.Status = TodoStatus.Completed;

        // Act
        var updateResponse = await _client.PutAsJsonAsync($"/api/todo/{createdTodo.Id}", createdTodo);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, updateResponse.StatusCode);
    }

    [Fact]
    public async Task DeleteTodo_ReturnsNoContent_WhenTodoExists()
    {
        // Arrange - Create a todo first
        var newTodo = new TodoItem
        {
            Title = "To Be Deleted",
            Description = "This will be deleted",
            AssignedTo = "Test User",
            Priority = Priority.Medium,
            Status = TodoStatus.Pending,
            DueDate = DateTime.UtcNow.AddDays(7),
            Category = "Test Category",
            CreatedBy = "Test Creator"
        };

        var createResponse = await _client.PostAsJsonAsync("/api/todo", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoItem>();

        // Act
        var deleteResponse = await _client.DeleteAsync($"/api/todo/{createdTodo!.Id}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Verify it's actually deleted
        var getResponse = await _client.GetAsync($"/api/todo/{createdTodo.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task ApiHealthCheck_ReturnsOk()
    {
        // Act
        var response = await _client.GetAsync("/");

        // Assert
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Equal("PortalAPI is running!", content);
    }
}