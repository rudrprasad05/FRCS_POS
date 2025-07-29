namespace FrcsPos.Middleware
{
    public class LoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<LoggingMiddleware> _logger;

    public LoggingMiddleware(RequestDelegate next, ILogger<LoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var requestTime = DateTime.UtcNow;
        var ip = context.Connection.RemoteIpAddress?.ToString();
        var method = context.Request.Method;
        var path = context.Request.Path;
        var query = context.Request.QueryString.Value;
        var ua = context.Request.Headers["User-Agent"];
        var traceId = context.TraceIdentifier;

        // Call next
        await _next(context);

        var status = context.Response.StatusCode;

        _logger.LogInformation("Req {Method} {Path}{Query} | IP: {IP} | Status: {Status} | UA: {UA} | TraceId: {TraceId}",
            method, path, query, ip, status, ua, traceId);
    }
}


}

