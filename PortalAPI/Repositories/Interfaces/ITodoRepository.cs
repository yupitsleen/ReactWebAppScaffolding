using PortalAPI.Models;

namespace PortalAPI.Repositories.Interfaces;

/// <summary>
/// Repository interface for TodoItem-specific operations
/// Extends the generic repository with domain-specific methods
/// </summary>
public interface ITodoRepository : IRepository<TodoItem>
{
    // Domain-specific query methods
    Task<IEnumerable<TodoItem>> GetByStatusAsync(TodoStatus status);
    Task<IEnumerable<TodoItem>> GetByPriorityAsync(Priority priority);
    Task<IEnumerable<TodoItem>> GetByAssignedToAsync(string assignedTo);
    Task<IEnumerable<TodoItem>> GetByCategoryAsync(string category);
    Task<IEnumerable<TodoItem>> GetOverdueAsync();
    Task<IEnumerable<TodoItem>> GetDueSoonAsync(int daysFromNow = 7);

    // Analytics methods
    Task<Dictionary<TodoStatus, int>> GetStatusSummaryAsync();
    Task<Dictionary<Priority, int>> GetPrioritySummaryAsync();
}