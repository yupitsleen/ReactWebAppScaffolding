using System.ComponentModel.DataAnnotations;

namespace PortalAPI.Models;

public enum Priority
{
    Low,
    Medium,
    High
}

public enum TodoStatus
{
    Pending,
    InProgress,
    Completed
}

public class TodoItem
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string AssignedTo { get; set; } = string.Empty;

    [Required]
    public Priority Priority { get; set; }

    [Required]
    public TodoStatus Status { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string CreatedBy { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}