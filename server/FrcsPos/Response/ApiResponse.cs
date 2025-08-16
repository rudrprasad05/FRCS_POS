using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response
{
    public class ApiResponse<T>
    {
        public bool Success { get; init; }
        public int StatusCode { get; init; }
        public string? Message { get; init; }
        public T? Data { get; init; }
        public MetaData? Meta { get; init; }
        public List<string>? Errors { get; init; }
        public DateTime Timestamp { get; init; } = DateTime.UtcNow;
        public string? TraceId { get; init; } // for correlation/log tracing

        public ApiResponse() { }

        public ApiResponse(bool success, int statusCode, string? message = null, T? data = default, MetaData? meta = null, List<string>? errors = null, string? traceId = null)
        {
            Success = success;
            StatusCode = statusCode;
            Message = message;
            Data = data;
            Meta = meta;
            Errors = errors;
            TraceId = traceId;
        }

        // Factory methods for ease of use
        public static ApiResponse<T> Ok(T? data, string? message = null, MetaData? meta = null, ILogger? logger = null)
        {
            var traceId = Activity.Current?.Id ?? Guid.NewGuid().ToString();
            logger?.LogInformation("Request succeeded: {TraceId}", traceId);

            return new ApiResponse<T>(
                success: true,
                statusCode: 200,
                message: message ?? "Success",
                data: data,
                meta: meta,
                traceId: traceId
            );
        }

        public static ApiResponse<T> Fail(int statusCode = 400, string? message = "An error occurred", List<string>? errors = null, ILogger? logger = null)
        {
            var traceId = Activity.Current?.Id ?? Guid.NewGuid().ToString();
            logger?.LogWarning("Request failed: {TraceId}, Message: {Message}", traceId, message);

            return new ApiResponse<T>(
                success: false,
                statusCode: statusCode,
                message: message,
                errors: errors,
                traceId: traceId
            );
        }

        public static ApiResponse<T> NotFound(int statusCode = 404, string? message = "the requested resource was not found. invalid url", List<string>? errors = null, ILogger? logger = null)
        {
            var traceId = Activity.Current?.Id ?? Guid.NewGuid().ToString();
            logger?.LogWarning("Request failed: {TraceId}, Message: {Message}", traceId, message);

            return new ApiResponse<T>(
                success: false,
                statusCode: statusCode,
                message: message,
                errors: errors,
                traceId: traceId
            );
        }

        public static ApiResponse<T> Unauthorised(int statusCode = 401, string? message = "the resource requested cannot be accessed using current credentials", List<string>? errors = null, ILogger? logger = null)
        {
            var traceId = Activity.Current?.Id ?? Guid.NewGuid().ToString();
            logger?.LogWarning("Request failed: {TraceId}, Message: {Message}", traceId, message);

            return new ApiResponse<T>(
                success: false,
                statusCode: statusCode,
                message: message,
                errors: errors,
                traceId: traceId
            );
        }

        public static ApiResponse<T> ValidationError(List<string> errors, string? traceId = null)
        {
            return new ApiResponse<T>(false, 422, "Validation failed", default, null, errors, traceId);
        }
    }
    public class MetaData
    {
        public int PageSize { get; init; } = 0;
        public int PageNumber { get; init; } = 0;
        public int TotalCount { get; init; } = 0;
        public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)TotalCount / PageSize) : 0;
        public bool HasNextPage => PageNumber < TotalPages;
        public bool HasPreviousPage => PageNumber > 1;
    }
}