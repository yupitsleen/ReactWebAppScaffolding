using System.ComponentModel.DataAnnotations;

namespace PortalAPI.Models;

public class Document
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty;

    [Required]
    [Url]
    public string Url { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string UploadedBy { get; set; } = string.Empty;

    [Required]
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [StringLength(50)]
    public string Size { get; set; } = string.Empty;

    [Required]
    public bool Shared { get; set; }
}