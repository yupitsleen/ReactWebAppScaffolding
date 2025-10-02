using System.ComponentModel.DataAnnotations;
using PortalAPI.Models;

namespace PortalAPI.DTOs;

public class TodoUpdateDto
{
    [StringLength(200)]
    public string? Title { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [StringLength(100)]
    public string? AssignedTo { get; set; }

    [RegularExpression(@"^(low|medium|high)$", ErrorMessage = "Priority must be 'low', 'medium', or 'high'")]
    public string? Priority { get; set; }

    [RegularExpression(@"^(pending|in-progress|completed)$", ErrorMessage = "Status must be 'pending', 'in-progress', or 'completed'")]
    public string? Status { get; set; }

    public DateTime? DueDate { get; set; }

    [StringLength(100)]
    public string? Category { get; set; }

    public void ApplyToTodoItem(TodoItem todo)
    {
        if (Title != null) todo.Title = Title;
        if (Description != null) todo.Description = Description;
        if (AssignedTo != null) todo.AssignedTo = AssignedTo;
        if (Priority != null) todo.Priority = ParsePriority(Priority);
        if (Status != null) todo.Status = ParseStatus(Status);
        if (DueDate.HasValue) todo.DueDate = DueDate.Value;
        if (Category != null) todo.Category = Category;
    }

    private static Models.Priority ParsePriority(string priority)
    {
        return priority.ToLower() switch
        {
            "low" => Models.Priority.Low,
            "medium" => Models.Priority.Medium,
            "high" => Models.Priority.High,
            _ => Models.Priority.Medium
        };
    }

    private static TodoStatus ParseStatus(string status)
    {
        return status.ToLower() switch
        {
            "pending" => TodoStatus.Pending,
            "in-progress" => TodoStatus.InProgress,
            "completed" => TodoStatus.Completed,
            _ => TodoStatus.Pending
        };
    }
}
