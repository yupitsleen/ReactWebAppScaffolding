using Microsoft.EntityFrameworkCore;
using PortalAPI.Data;
using PortalAPI.Models;
using PortalAPI.DTOs;
using PortalAPI.Services.Interfaces;

namespace PortalAPI.Services.Implementations;

public class TodoService : ITodoService
{
    private readonly PortalDbContext _context;
    private readonly ILogger<TodoService> _logger;

    public TodoService(PortalDbContext context, ILogger<TodoService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<TodoItem>> GetAllAsync()
    {
        try
        {
            return await _context.TodoItems
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all todos");
            throw;
        }
    }

    public async Task<TodoItem?> GetByIdAsync(string id)
    {
        try
        {
            return await _context.TodoItems.FindAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todo with id {Id}", id);
            throw;
        }
    }

    public async Task<TodoItem> CreateAsync(TodoCreateDto dto)
    {
        try
        {
            var todo = dto.ToTodoItem();

            _context.TodoItems.Add(todo);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created todo with id {Id}", todo.Id);
            return todo;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo");
            throw;
        }
    }

    public async Task<TodoItem?> UpdateAsync(string id, TodoUpdateDto dto)
    {
        try
        {
            var existingTodo = await _context.TodoItems.FindAsync(id);
            if (existingTodo == null)
            {
                _logger.LogWarning("Attempted to update non-existent todo with id {Id}", id);
                return null;
            }

            dto.ApplyToTodoItem(existingTodo);

            var updatedRows = await _context.SaveChangesAsync();

            if (updatedRows > 0)
            {
                _logger.LogInformation("Updated todo with id {Id}", id);
                return existingTodo;
            }

            return existingTodo;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogError(ex, "Concurrency error updating todo with id {Id}", id);

            if (!await ExistsAsync(id))
            {
                return null;
            }

            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating todo with id {Id}", id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(string id)
    {
        try
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                _logger.LogWarning("Attempted to delete non-existent todo with id {Id}", id);
                return false;
            }

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted todo with id {Id}", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting todo with id {Id}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string id)
    {
        try
        {
            return await _context.TodoItems.AnyAsync(e => e.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if todo exists with id {Id}", id);
            throw;
        }
    }
}