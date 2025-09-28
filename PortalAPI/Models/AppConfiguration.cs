using System.ComponentModel.DataAnnotations;

namespace PortalAPI.Models;

public class ServiceInfo
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Tagline { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public ContactInfo Contact { get; set; } = new();
}

public class ContactInfo
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Address { get; set; } = string.Empty;
}

public class DashboardSummary
{
    public int TotalTodos { get; set; }
    public int CompletedTodos { get; set; }
    public int PendingPayments { get; set; }
    public int TotalDocuments { get; set; }
    public int UnreadDiscussions { get; set; }
}