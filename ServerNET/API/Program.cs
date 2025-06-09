using System.Text;
using Application.Auth;
using Application.Chats;
using Application.Messages;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Mongo Configuration
BsonClassMap.RegisterClassMap<Message>(cm =>
{
    cm.AutoMap();
    cm.SetIgnoreExtraElements(true);
});

BsonClassMap.RegisterClassMap<User>(cm =>
{
    cm.AutoMap();
    cm.SetIgnoreExtraElements(true);
});

BsonClassMap.RegisterClassMap<Chat>(cm =>
{
    cm.AutoMap();
    cm.SetIgnoreExtraElements(true);
});

// Configure settings inject IOptions<AppDbSettings>
builder.Services.Configure<AppDbSettings>(
    builder.Configuration.GetSection("InTouchIoDatabase"));

// Register AppDbContext as singleton
builder.Services.AddSingleton<AppDbContext>();

builder.Services.AddScoped<MessageService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ChatsService>();

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

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
