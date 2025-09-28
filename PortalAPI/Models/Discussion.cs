using System.ComponentModel.DataAnnotations;

namespace PortalAPI.Models;

public enum DiscussionPriority
{
    Normal,
    Urgent
}

public class Discussion
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Author { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string AuthorRole { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Reply> Replies { get; set; } = new();

    [Required]
    public DiscussionPriority Priority { get; set; }

    [Required]
    public bool Resolved { get; set; }
}

public class Reply
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Author { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string AuthorRole { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key for Discussion
    [Required]
    public string DiscussionId { get; set; } = string.Empty;
    public Discussion? Discussion { get; set; }
}