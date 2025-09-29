using System.ComponentModel.DataAnnotations;
using PortalAPI.Models;

namespace PortalAPI.DTOs;

public class TodoCreateDto
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string AssignedTo { get; set; } = string.Empty;

    [Required(ErrorMessage = "Priority is required")]
    [RegularExpression(@"^(low|medium|high)$", ErrorMessage = "Priority must be 'low', 'medium', or 'high'")]
    public string Priority { get; set; } = string.Empty;

    [Required(ErrorMessage = "Status is required")]
    [RegularExpression(@"^(pending|in-progress|completed)$", ErrorMessage = "Status must be 'pending', 'in-progress', or 'completed'")]
    public string Status { get; set; } = string.Empty;

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>
    /// Convert DTO to TodoItem with proper enum parsing
    /// </summary>
    public TodoItem ToTodoItem()
    {
        return new TodoItem
        {
            Id = Guid.NewGuid().ToString(),
            Title = Title,
            Description = Description,
            AssignedTo = AssignedTo,
            Priority = ParsePriority(Priority),
            Status = ParseStatus(Status),
            DueDate = DueDate,
            Category = Category,
            CreatedBy = CreatedBy,
            CreatedAt = DateTime.UtcNow
        };
    }

    private static Models.Priority ParsePriority(string priority)
    {
        return priority.ToLower() switch
        {
            "low" => Models.Priority.Low,
            "medium" => Models.Priority.Medium,
            "high" => Models.Priority.High,
            _ => Models.Priority.Medium // Default fallback
        };
    }

    private static TodoStatus ParseStatus(string status)
    {
        return status.ToLower() switch
        {
            "pending" => TodoStatus.Pending,
            "in-progress" => TodoStatus.InProgress,
            "completed" => TodoStatus.Completed,
            _ => TodoStatus.Pending // Default fallback
        };
    }
}