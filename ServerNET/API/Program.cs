using System.Text;
using System.Text.Json;
using API.SignalR;
using Application.Auth;
using Application.Services.Chats;
using Application.Core;
using Application.Services.Messages;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Persistence.Configurations;
using Application.Services.Users;
using Persistence.Interfaces;
using Application.Repositories;
using Application.Interfaces.Repositories;
using Application.Interfaces.Messages;
using Application.Interfaces.Auth;
using Application.Interfaces.Chats;
using Application.Interfaces.Core;
using Application.Interfaces.Storage;
using Application.Interfaces.Security;
using Infrastructure.Security;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using FluentValidation;
using FluentValidation.AspNetCore;
using Application.DTOs.Auth;
using Application.Interfaces.Helpers;
using Application.Helpers;

var builder = WebApplication.CreateBuilder(args);

// Mongo Configuration
MongoDbConventions.Register();

// Configure settings inject IOptions<AppDbSettings>
builder.Services.Configure<AppDbSettings>(
    builder.Configuration.GetSection("InTouchIoDatabase"));

// MongoClient as Singleton (thread-safe)
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<AppDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// Register AppDbContext as scoped
builder.Services.AddScoped<IAppDbContext, AppDbContext>();

builder.Services.AddSingleton<IConnectionManager, ConnectionManager>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMessagesRepository, MessagesRepository>();
builder.Services.AddScoped<IChatsRepository, ChatsRepository>();

builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IChatService, ChatsService>();
builder.Services.AddScoped<IUserService ,UserService>();
builder.Services.AddScoped(typeof(IServiceHelper<>), typeof(ServiceHelper<>));

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Accessors
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserAccessor, UserAccessor>();

// SignalR
builder.Services.AddSignalR();

// Cloudinary
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddScoped<IPhotoService, PhotoService>();

// 1. JWT configuration
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

// 2. Add authentication
builder.Services.AddAuthentication(options =>
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
        ValidIssuer = jwtSettings?.Issuer,
        ValidAudience = jwtSettings?.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings!.Key))
    };
});

// 3. Add authorization
builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .Build());

builder.Services.AddSingleton<ITokenGenerator, JwtTokenGenerator>();






// Add services to the container.


builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters();

builder.Services.AddValidatorsFromAssemblyContaining<BaseAuthDto>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors(policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
}
// Static fields
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html").AllowAnonymous();

app.MapHub<ChatHub>("/signalR");

app.Run();
