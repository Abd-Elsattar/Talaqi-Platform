using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication;
using Talaqi.Application.Interfaces.Repositories;
using Talaqi.Application.Interfaces.Services;
using Talaqi.Application.Mapping;
using Talaqi.Application.Services;
using Talaqi.Infrastructure.Data;
using Talaqi.Infrastructure.Repositories;
using Talaqi.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Talaqi.API.Extensions
{
    public static class ServiceExtensions
    {
        #region Application Services
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // AutoMapper
            services.AddAutoMapper(typeof(MappingProfile));

            // Application Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ILostItemService, LostItemService>();
            services.AddScoped<IFoundItemService, FoundItemService>();
            services.AddScoped<IMatchingService, MatchingService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IAIService, AIService>();
            services.AddScoped<IFileService, FileService>();

            return services;
        }
        #endregion

        #region Infrastructure Services (Database + Repositories)
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            #region Database
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    b =>
                    {
                        b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
                        b.EnableRetryOnFailure(); // Resiliency
                    }
                ));
            #endregion

            #region Repositories & Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ILostItemRepository, LostItemRepository>();
            services.AddScoped<IFoundItemRepository, FoundItemRepository>();
            services.AddScoped<IMatchRepository, MatchRepository>();
            services.AddScoped<IVerificationCodeRepository, VerificationCodeRepository>();

            // New repositories
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            #endregion

            #region External Services
            services.AddHttpClient<IAIService, AIService>();
            #endregion

            return services;
        }
        #endregion

        #region JWT Authentication
        public static IServiceCollection AddJwtAuthentication(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["Secret"]
                ?? throw new InvalidOperationException("JWT Secret not configured");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero
                };

                // Allow access token in query string for SignalR
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"].FirstOrDefault();
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

            return services;
        }
        #endregion

        #region Swagger Documentation
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                #region Swagger Info
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Talaqi API",
                    Version = "v1",
                    Description = "Smart Lost & Found Platform API",
                    Contact = new OpenApiContact
                    {
                        Name = "Talaqi Support",
                        Email = "talaqi.platform@gmail.com"
                    }
                });
                #endregion

                #region JWT Security
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme.\nEnter 'Bearer' + space + token.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id   = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
                #endregion
            });

            return services;
        }
        #endregion

        #region CORS Policy
        public static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularApp", builder =>
                {
                    builder.WithOrigins("http://localhost:4200", "https://talaqi.com")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });

            return services;
        }
        #endregion
    }
}
