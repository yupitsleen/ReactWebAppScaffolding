using Microsoft.AspNetCore.Mvc;
using PortalAPI.Models;
using PortalAPI.DTOs;
using PortalAPI.Services.Interfaces;

namespace PortalAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;
    private readonly ILogger<TodoController> _logger;

    public TodoController(ITodoService todoService, ILogger<TodoController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    // GET: api/todo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos()
    {
        try
        {
            var todos = await _todoService.GetAllAsync();
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
            var todo = await _todoService.GetByIdAsync(id);

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
    public async Task<ActionResult<TodoItem>> CreateTodo(TodoCreateDto todoDto)
    {
        try
        {
            var todo = await _todoService.CreateAsync(todoDto);
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
    public async Task<ActionResult<TodoItem>> UpdateTodo(string id, TodoUpdateDto todoDto)
    {
        try
        {
            var updatedTodo = await _todoService.UpdateAsync(id, todoDto);
            if (updatedTodo == null)
            {
                return NotFound();
            }

            return Ok(updatedTodo);
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
            var success = await _todoService.DeleteAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting todo {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

}