using PortalAPI.Models;
using PortalAPI.DTOs;

namespace PortalAPI.Services.Interfaces;

public interface ITodoService
{
    Task<IEnumerable<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(string id);
    Task<TodoItem> CreateAsync(TodoCreateDto dto);
    Task<TodoItem?> UpdateAsync(string id, TodoUpdateDto dto);
    Task<bool> DeleteAsync(string id);
    Task<bool> ExistsAsync(string id);
}