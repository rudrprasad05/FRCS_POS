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
using StackExchange.Redis;
using Azure.Storage.Blobs;
using FrcsPos.Mappers;
using Microsoft.AspNetCore.Mvc;
using FrcsPos.Response;
using FrcsPos.Models;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

builder.Configuration.AddEnvironmentVariables();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerServices();
builder.Services.AddDatabaseContext(builder.Configuration);
builder.Services.AddRedisContext(builder.Configuration);
builder.Services.AddIdentityService();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.Configure<HostOptions>(options =>
{
    options.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.Ignore;
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRefundService, RefundService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IPosTerminalRepository, PosTerminalRepository>();
builder.Services.AddScoped<ISuperAdminDashboardRepository, SuperAdminDashboardRepository>();
builder.Services.AddScoped<IPosSessionRepository, PosSessionRepository>();
builder.Services.AddScoped<IQuickConnectRepository, QuickConnectReopsitory>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IUserContext, UserContextService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ITaxCategoryRepository, TaxCategoryRepository>();
builder.Services.AddScoped<IMediaRepository, MediaRepository>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();
builder.Services.AddScoped<ICheckoutRepository, CheckoutRepository>();
builder.Services.AddScoped<IWarehouseRepository, WarehouseRepository>();
builder.Services.AddScoped<IProductBatchRepository, ProductBatchRepository>();
builder.Services.AddScoped<IRedisCacheService, RedisCacheService>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<IEmailVerificationRepository, EmailVerificationRepository>();
builder.Services.AddScoped<IRefundRepository, RefundRepository>();

// DI mappers
builder.Services.AddScoped<IMediaMapper, MediaMapper>();
builder.Services.AddScoped<IProductVariantMapper, ProductVariantMapper>();
builder.Services.AddScoped<IProductMapper, ProductMapper>();
builder.Services.AddScoped<ISaleItemMapper, SaleItemMapper>();
builder.Services.AddScoped<ISaleMapper, SaleMapper>();
builder.Services.AddScoped<IRefundMapper, RefundMapper>();
builder.Services.AddScoped<IRefundItemMapper, RefundItemMapper>();

builder.Services.AddSingleton<IAmazonS3Service, AmazonS3Service>();
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.AddSingleton<IAzureBlobService, AzureBlobService>();
builder.Services.AddSingleton(x => new BlobServiceClient(builder.Configuration.GetConnectionString("StorageAccount")));
builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationMiddlewareResultHandler>();
builder.Services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
builder.Services.AddHostedService<BackgroundQueueService>();
builder.Services.AddHostedService<ExpiryNotificationService>();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(ms => ms.Value?.Errors.Count > 0)
            .SelectMany(ms => ms.Value?.Errors.Select(e => $"{ms.Key}: {e.ErrorMessage}"))
            .ToList();

        var response = new ApiResponse<object>
        {
            Success = false,
            StatusCode = 400,
            Message = "Validation failed",
            Data = null,
            Errors = errors,
            Timestamp = DateTime.UtcNow,
            TraceId = context.HttpContext.TraceIdentifier
        };

        return new BadRequestObjectResult(response);
    };
});

builder.Services.AddSignalR();
builder.WebHost.UseUrls(builder.Configuration["Backend:Url"] ?? throw new InvalidOperationException());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(Style.Dark);
}

app.UseRouting();

app
.UseCors("allowSpecificOrigin")
// .UseHttpsRedirection()
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

app.MapControllers();

app.MapHub<NotificationHub>("/socket/notificationHub");
app.MapHub<PosHub>("/socket/posHub");
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        var connection = dbContext.Database.GetDbConnection();
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