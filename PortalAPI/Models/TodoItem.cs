using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace PortalAPI.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Priority
{
    [JsonPropertyName("low")]
    Low,
    [JsonPropertyName("medium")]
    Medium,
    [JsonPropertyName("high")]
    High
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TodoStatus
{
    [JsonPropertyName("pending")]
    Pending,
    [JsonPropertyName("in-progress")]
    InProgress,
    [JsonPropertyName("completed")]
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