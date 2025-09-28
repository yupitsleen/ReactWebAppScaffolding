using System.ComponentModel.DataAnnotations;

namespace PortalAPI.Models;

public enum UserType
{
    Customer,
    Vendor,
    ServiceProvider,
    Admin
}

public class User
{
    [Key]
    public string Id { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Role { get; set; } = string.Empty;

    [Required]
    public UserType UserType { get; set; }

    [StringLength(255)]
    public string? Avatar { get; set; }

    [StringLength(20)]
    public string? Phone { get; set; }
}

public class AuthUser : User
{
    public bool IsAuthenticated { get; set; }
    public string? Token { get; set; }
}