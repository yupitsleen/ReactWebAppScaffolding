using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PortalAPI.Data;
using PortalAPI.Repositories.Interfaces;

namespace PortalAPI.Repositories.Implementations;

/// <summary>
/// Generic repository implementation providing common CRUD operations
/// </summary>
/// <typeparam name="T">Entity type</typeparam>
public class BaseRepository<T> : IRepository<T> where T : class
{
    protected readonly PortalDbContext _context;
    protected readonly DbSet<T> _dbSet;
    protected readonly ILogger<BaseRepository<T>> _logger;

    public BaseRepository(PortalDbContext context, ILogger<BaseRepository<T>> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _dbSet = _context.Set<T>();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        try
        {
            _logger.LogInformation("Retrieving all {EntityType} entities", typeof(T).Name);
            return await _dbSet.ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all {EntityType} entities", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<T?> GetByIdAsync(string id)
    {
        try
        {
            _logger.LogInformation("Retrieving {EntityType} entity with ID: {Id}", typeof(T).Name, id);
            return await _dbSet.FindAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving {EntityType} entity with ID: {Id}", typeof(T).Name, id);
            throw;
        }
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        try
        {
            _logger.LogInformation("Creating new {EntityType} entity", typeof(T).Name);
            var result = await _dbSet.AddAsync(entity);
            await SaveChangesAsync();
            _logger.LogInformation("Successfully created {EntityType} entity", typeof(T).Name);
            return result.Entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating {EntityType} entity", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<bool> UpdateAsync(T entity)
    {
        try
        {
            _logger.LogInformation("Updating {EntityType} entity", typeof(T).Name);
            _dbSet.Update(entity);
            var result = await SaveChangesAsync();
            _logger.LogInformation("Successfully updated {EntityType} entity", typeof(T).Name);
            return result > 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating {EntityType} entity", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<bool> DeleteAsync(string id)
    {
        try
        {
            _logger.LogInformation("Deleting {EntityType} entity with ID: {Id}", typeof(T).Name, id);
            var entity = await GetByIdAsync(id);
            if (entity == null)
            {
                _logger.LogWarning("{EntityType} entity with ID: {Id} not found for deletion", typeof(T).Name, id);
                return false;
            }

            _dbSet.Remove(entity);
            var result = await SaveChangesAsync();
            _logger.LogInformation("Successfully deleted {EntityType} entity with ID: {Id}", typeof(T).Name, id);
            return result > 0;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting {EntityType} entity with ID: {Id}", typeof(T).Name, id);
            throw;
        }
    }

    public virtual async Task<bool> ExistsAsync(string id)
    {
        try
        {
            var entity = await GetByIdAsync(id);
            return entity != null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking existence of {EntityType} entity with ID: {Id}", typeof(T).Name, id);
            throw;
        }
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        try
        {
            _logger.LogInformation("Finding {EntityType} entities with custom predicate", typeof(T).Name);
            return await _dbSet.Where(predicate).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finding {EntityType} entities with predicate", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
    {
        try
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting first {EntityType} entity with predicate", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<int> CountAsync()
    {
        try
        {
            return await _dbSet.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error counting {EntityType} entities", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
    {
        try
        {
            return await _dbSet.CountAsync(predicate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error counting {EntityType} entities with predicate", typeof(T).Name);
            throw;
        }
    }

    public virtual async Task<int> SaveChangesAsync()
    {
        try
        {
            return await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving changes to database");
            throw;
        }
    }
}