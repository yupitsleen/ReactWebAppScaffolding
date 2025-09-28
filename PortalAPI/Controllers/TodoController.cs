using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortalAPI.Data;
using PortalAPI.Models;

namespace PortalAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private readonly PortalDbContext _context;
    private readonly ILogger<TodoController> _logger;

    public TodoController(PortalDbContext context, ILogger<TodoController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/todo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        try
        {
            var todos = await _context.TodoItems
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();

            return Ok(todos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todos");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/todo/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodo(string id)
    {
        try
        {
            var todo = await _context.TodoItems.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving todo {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/todo
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodo(TodoItem todo)
    {
        try
        {
            todo.Id = Guid.NewGuid().ToString();
            todo.CreatedAt = DateTime.UtcNow;

            _context.TodoItems.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodo), new { id = todo.Id }, todo);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating todo");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/todo/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(string id, TodoItem todo)
    {
        if (id != todo.Id)
        {
            return BadRequest();
        }

        try
        {
            _context.Entry(todo).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await TodoExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating todo {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/todo/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(string id)
    {
        try
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting todo {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    private async Task<bool> TodoExists(string id)
    {
        return await _context.TodoItems.AnyAsync(e => e.Id == id);
    }
}