using Microsoft.EntityFrameworkCore;
using PortalAPI.Models;

namespace PortalAPI.Data;

public class PortalDbContext : DbContext
{
    public PortalDbContext(DbContextOptions<PortalDbContext> options) : base(options)
    {
    }

    // Entity sets
    public DbSet<User> Users { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<Discussion> Discussions { get; set; }
    public DbSet<Reply> Replies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.UserType)
                  .HasConversion<string>();
        });

        // Configure TodoItem entity
        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Priority)
                  .HasConversion<string>();
            entity.Property(e => e.Status)
                  .HasConversion<string>();
        });

        // Configure Payment entity
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount)
                  .HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status)
                  .HasConversion<string>();
        });

        // Configure Document entity
        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        // Configure Discussion entity with Reply relationship
        modelBuilder.Entity<Discussion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Priority)
                  .HasConversion<string>();

            entity.HasMany(d => d.Replies)
                  .WithOne(r => r.Discussion)
                  .HasForeignKey(r => r.DiscussionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Reply entity
        modelBuilder.Entity<Reply>(entity =>
        {
            entity.HasKey(e => e.Id);
        });
    }
}