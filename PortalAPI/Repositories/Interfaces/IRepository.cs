using System.Linq.Expressions;

namespace PortalAPI.Repositories.Interfaces;

/// <summary>
/// Generic repository interface providing common CRUD operations for all entities
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public interface IRepository<T> where T : class
{
    // Basic CRUD Operations
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(string id);
    Task<T> CreateAsync(T entity);
    Task<bool> UpdateAsync(T entity);
    Task<bool> DeleteAsync(string id);
    Task<bool> ExistsAsync(string id);

    // Advanced Query Operations
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
    Task<int> CountAsync();
    Task<int> CountAsync(Expression<Func<T, bool>> predicate);

    // Bulk Operations
    Task<int> SaveChangesAsync();
}