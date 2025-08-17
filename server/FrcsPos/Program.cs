using FrcsPos.Config;
using FrcsPos.Interfaces;
using AspNetCore.Swagger.Themes;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using FrcsPos.Services;
using FrcsPos.Context;
using FrcsPos.Middleware;
using FrcsPos.Service;
using DotNetEnv;
using FrcsPos.Repository;
using Microsoft.AspNetCore.Authorization;
using FrcsPos.Background;
using FrcsPos.Socket;


var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Configuration.AddEnvironmentVariables();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerServices();
builder.Services.AddDatabaseContext(builder.Configuration);
builder.Services.AddIdentityService();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IPosTerminalRepository, PosTerminalRepository>();
builder.Services.AddScoped<ISuperAdminDashboardRepository, SuperAdminDashboardRepository>();
builder.Services.AddScoped<IPosSessionRepository, PosSessionRepository>();
builder.Services.AddScoped<IQuickConnectRepository, QuickConnectReopsitory>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IUserContext, UserContextService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddSingleton<IAmazonS3Service, AmazonS3Service>();
builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationMiddlewareResultHandler>();
builder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
builder.Services.AddHostedService<BackgroundQueueService>();

builder.Services.AddSignalR();

builder.WebHost
    .UseUrls(builder.Configuration["Backend:Url"]
             ?? throw new InvalidOperationException());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(Style.Dark);
}

app
.UseCors("allowSpecificOrigin")
.UseHttpsRedirection()
.UseWebSockets()
.UseAuthentication()
.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// app.UseMiddleware<TokenMiddleware>();
app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<ApiResponseMiddleware>();
app.MapHub<NotificationHub>("/socket/notificationHub");
app.MapHub<BarcodeHub>("/socket/barcodeHub");

// TODO was adding barcodes. 

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        var connection = dbContext.Database.GetDbConnection();
        Console.WriteLine("🔍 Connection string being used:");
        Console.WriteLine(connection.ConnectionString);

        dbContext.Database.OpenConnection(); // Test the connection
        dbContext.Database.CloseConnection();
        Console.WriteLine("Database connection successful.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
    }
}

app.Run();