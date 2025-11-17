using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Talaqi.API.Extensions;
using Talaqi.API.Filters;
using Talaqi.API.Middleware;
using Talaqi.API.Validators;
using Talaqi.Infrastructure.Data;

namespace Talaqi.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            #region Serilog Configuration
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File("logs/talaqi-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            builder.Host.UseSerilog();
            #endregion

            #region Services Registration
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            #endregion

            #region Custom Extensions Registration
            builder.Services.AddMemoryCache();
            builder.Services.AddSwaggerDocumentation();
            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddApplicationServices();
            builder.Services.AddJwtAuthentication(builder.Configuration);
            builder.Services.AddCorsPolicy();
            #endregion

            #region Health Checks
            builder.Services.AddHealthChecks()
                .AddDbContextCheck<ApplicationDbContext>();
            #endregion

            #region Configuration Sources
            builder.Configuration
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddUserSecrets<Program>(optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();
            #endregion

            #region FluentValidation
            builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();
            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<ValidationFilter>();
            });
            #endregion

            var app = builder.Build();

            #region Development Environment Setup
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Talaqi API V1");
                    c.RoutePrefix = "Swagger";
                });
            }
            #endregion

            #region Middleware
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            app.UseMiddleware<RequestLoggingMiddleware>();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCors("AllowAngularApp");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHealthChecks("/health");
            app.MapControllers();
            #endregion

            #region Database Migration & Seeding
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();

                    if (context.Database.GetPendingMigrations().Any())
                    {
                        context.Database.Migrate();
                        Log.Information("Database migrations applied successfully");
                    }

                    await SeedData(context);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, "An error occurred while migrating or seeding the database");
                }
            }

            Log.Information("Talaqi API started successfully");
            #endregion

            app.Run();
        }

        #region Seed Method
        static async Task SeedData(ApplicationDbContext context)
        {
            if (!context.Users.Any())
            {
                var adminUser = new Talaqi.Domain.Entities.User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@talaqi.com",
                    PhoneNumber = "+201153382552",
                    PasswordHash = Convert.ToBase64String(
                        System.Security.Cryptography.SHA256.HashData(
                            System.Text.Encoding.UTF8.GetBytes("Admin@123"))),
                    Role = "Admin",
                    IsActive = true,
                    IsEmailVerified = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();

                Log.Information("Admin user created: admin@talaqi.com / Admin@123");
            }
        }
        #endregion
    }
}
