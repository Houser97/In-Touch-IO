using System.Text;
using System.Text.Json;
using API.SignalR;
using Application;
using Application.Auth;
using Application.Services.Chats;
using Application.Core;
using Application.Interfaces;
using Application.Services.Messages;
using Domain;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization;
using Persistence;
using Persistence.Configurations;

var builder = WebApplication.CreateBuilder(args);

// Mongo Configuration
MongoDbConventions.Register();

// Configure settings inject IOptions<AppDbSettings>
builder.Services.Configure<AppDbSettings>(
    builder.Configuration.GetSection("InTouchIoDatabase"));

// Register AppDbContext as singleton
builder.Services.AddSingleton<AppDbContext>();

builder.Services.AddScoped<MessageService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ChatsService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped(typeof(ServiceHelper<>));

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

builder.Services.AddSingleton<JwtTokenGenerator>();






// Add services to the container.

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:5173", "https://localhost:5173"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/signalR");

app.Run();
