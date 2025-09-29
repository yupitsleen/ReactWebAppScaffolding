using Microsoft.EntityFrameworkCore;
using PortalAPI.Data;
using PortalAPI.Models;
using PortalAPI.Repositories.Interfaces;

namespace PortalAPI.Repositories.Implementations;

/// <summary>
/// TodoItem-specific repository implementation with domain methods
/// </summary>
public class TodoRepository : BaseRepository<TodoItem>, ITodoRepository
{
    public TodoRepository(PortalDbContext context, ILogger<BaseRepository<TodoItem>> logger)
        : base(context, logger)
    {
    }

    public async Task<IEnumerable<TodoItem>> GetByStatusAsync(TodoStatus status)
    {
        try
        {
            _logger.LogInformation("Retrieving TodoItems with status: {Status}", status);
            return await _dbSet.Where(t => t.Status == status).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving TodoItems with status: {Status}", status);
            throw;
        }
    }

    public async Task<IEnumerable<TodoItem>> GetByPriorityAsync(Priority priority)
    {
        try
        {
            _logger.LogInformation("Retrieving TodoItems with priority: {Priority}", priority);
            return await _dbSet.Where(t => t.Priority == priority).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving TodoItems with priority: {Priority}", priority);
            throw;
        }
    }

    public async Task<IEnumerable<TodoItem>> GetByAssignedToAsync(string assignedTo)
    {
        try
        {
            _logger.LogInformation("Retrieving TodoItems assigned to: {AssignedTo}", assignedTo);
            return await _dbSet.Where(t => t.AssignedTo == assignedTo).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving TodoItems assigned to: {AssignedTo}", assignedTo);
            throw;
        }
    }

    public async Task<IEnumerable<TodoItem>> GetByCategoryAsync(string category)
    {
        try
        {
            _logger.LogInformation("Retrieving TodoItems in category: {Category}", category);
            return await _dbSet.Where(t => t.Category == category).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving TodoItems in category: {Category}", category);
            throw;
        }
    }

    public async Task<IEnumerable<TodoItem>> GetOverdueAsync()
    {
        try
        {
            var currentDate = DateTime.UtcNow;
            _logger.LogInformation("Retrieving overdue TodoItems as of: {CurrentDate}", currentDate);
            return await _dbSet.Where(t => t.DueDate < currentDate && t.Status != TodoStatus.Completed).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving overdue TodoItems");
            throw;
        }
    }

    public async Task<IEnumerable<TodoItem>> GetDueSoonAsync(int daysFromNow = 7)
    {
        try
        {
            var currentDate = DateTime.UtcNow;
            var targetDate = currentDate.AddDays(daysFromNow);
            _logger.LogInformation("Retrieving TodoItems due between {CurrentDate} and {TargetDate}", currentDate, targetDate);

            return await _dbSet.Where(t =>
                t.DueDate >= currentDate &&
                t.DueDate <= targetDate &&
                t.Status != TodoStatus.Completed).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving TodoItems due within {DaysFromNow} days", daysFromNow);
            throw;
        }
    }

    public async Task<Dictionary<TodoStatus, int>> GetStatusSummaryAsync()
    {
        try
        {
            _logger.LogInformation("Generating TodoItem status summary");
            var summary = await _dbSet
                .GroupBy(t => t.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);

            // Ensure all status values are represented (with 0 if no items)
            foreach (TodoStatus status in Enum.GetValues<TodoStatus>())
            {
                if (!summary.ContainsKey(status))
                {
                    summary[status] = 0;
                }
            }

            return summary;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating TodoItem status summary");
            throw;
        }
    }

    public async Task<Dictionary<Priority, int>> GetPrioritySummaryAsync()
    {
        try
        {
            _logger.LogInformation("Generating TodoItem priority summary");
            var summary = await _dbSet
                .GroupBy(t => t.Priority)
                .Select(g => new { Priority = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Priority, x => x.Count);

            // Ensure all priority values are represented (with 0 if no items)
            foreach (Priority priority in Enum.GetValues<Priority>())
            {
                if (!summary.ContainsKey(priority))
                {
                    summary[priority] = 0;
                }
            }

            return summary;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating TodoItem priority summary");
            throw;
        }
    }
}