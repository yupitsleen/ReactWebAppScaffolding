using Microsoft.EntityFrameworkCore;
using PortalAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add Entity Framework
builder.Services.AddDbContext<PortalDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=portal.db"));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors("ReactApp");
app.UseHttpsRedirection();
app.UseRouting();
app.MapControllers();

// Simple health check endpoint
app.MapGet("/", () => "PortalAPI is running!");

// Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PortalDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
