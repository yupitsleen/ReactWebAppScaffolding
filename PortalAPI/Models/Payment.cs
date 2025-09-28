using System.ComponentModel.DataAnnotations;

namespace PortalAPI.Models;

public enum PaymentStatus
{
    Pending,
    Paid,
    Overdue
}

public class Payment
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public PaymentStatus Status { get; set; }

    public DateTime? PaidDate { get; set; }

    [StringLength(100)]
    public string? PaymentMethod { get; set; }

    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;
}