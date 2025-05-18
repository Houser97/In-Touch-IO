using Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppDbContext>(
    builder.Configuration.GetSection("InTouchIoDatabase"));

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();
