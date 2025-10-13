using System.Text.Json;
using FrcsPos.Response;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace FrcsPos.Middleware
{
    public class ApiResponseMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ApiResponseMiddleware> _logger;

        public ApiResponseMiddleware(RequestDelegate next, ILogger<ApiResponseMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);

                // Handle non-exception 4xx/5xx responses
                if (!context.Response.HasStarted && context.Response.StatusCode >= 400)
                {
                    var statusCode = context.Response.StatusCode;
                    var message = GetStatusMessage(statusCode);

                    await WriteErrorResponse(context, statusCode, message);
                }
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database update failed");

                string message = dbEx.InnerException switch
                {
                    MySqlException sqlEx => sqlEx.Number switch
                    {
                        1452 => "Foreign key constraint failed",
                        1062 => "Duplicate entry",
                        _ => sqlEx.Message
                    },
                    _ => dbEx.Message
                };

                await WriteErrorResponse(context, 400, "Database error", new List<string> { message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                await WriteErrorResponse(context, 500, "Internal Server Error", new List<string> { ex.Message });
            }
        }

        private async Task WriteErrorResponse(HttpContext context, int statusCode, string message, List<string>? errors = null)
        {
            var response = new ApiResponse<object>
            {
                Success = false,
                StatusCode = statusCode,
                Message = message,
                Data = null,
                Meta = null,
                Errors = errors,
                Timestamp = DateTime.UtcNow,
                TraceId = context.TraceIdentifier
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            });

            await context.Response.WriteAsync(json);
        }

        private static string GetStatusMessage(int statusCode) =>
            statusCode switch
            {
                400 => "Bad Request",
                401 => "Unauthorized",
                403 => "Forbidden",
                404 => "Not Found",
                409 => "Conflict",
                422 => "Unprocessable Entity",
                500 => "Internal Server Error",
                _ => "Error"
            };
    }
}
