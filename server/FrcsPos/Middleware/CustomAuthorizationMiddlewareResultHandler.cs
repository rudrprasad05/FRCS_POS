using FrcsPos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using System.Security.Claims;
using System.Text.Json;


public class CustomAuthorizationMiddlewareResultHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler defaultHandler = new();
    private readonly ILogger<CustomAuthorizationMiddlewareResultHandler> _logger;

    public CustomAuthorizationMiddlewareResultHandler(ILogger<CustomAuthorizationMiddlewareResultHandler> logger)
    {
        _logger = logger;
    }

    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        if (authorizeResult.Succeeded)
        {
            await next(context);
            return;
        }

        var userName = context.User.Identity?.Name ?? "Anonymous";
        var rolesRequired = string.Join(", ", policy.Requirements
            .OfType<Microsoft.AspNetCore.Authorization.Infrastructure.RolesAuthorizationRequirement>()
            .Select(r => r.AllowedRoles)
            .SelectMany(r => r));
        var userRoles = context.User.FindAll(ClaimTypes.Role)
            .Select(c => c.Value)
            .DefaultIfEmpty("None")
            .Aggregate((current, next) => $"{current}, {next}");

        _logger.LogWarning(
            "Unauthorized access attempt by user: {UserName}, Required roles: {RolesRequired}, User roles: {UserRoles}, Path: {Path}, TraceId: {TraceId}",
            userName,
            rolesRequired,
            userRoles,
            context.Request.Path,
            context.TraceIdentifier);


        // Set status code and response content type
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";

        var response = ApiResponse<string>.Unauthorised();

        var json = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(json);
    }
}
