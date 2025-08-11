# Backend Setup Guide - ASP.NET Core 8

This guide covers the backend setup using ASP.NET Core 8 Web API with Entity Framework Core and MySQL.

## Initial Setup

### 1. Install Dependencies

Navigate to the backend directory and restore packages:

```bash
cd backend
dotnet restore
```

### 2. Environment Configuration

Configure your `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    },
    "File": {
      "Path": "logs/app.log"
    }
  },
  "Frontend": {
    "Url": "https://localhost:3000/"
  },
  "Backend": {
    "Url": "https://localhost:5081/"
  },
  "AllowedHosts": "*",
  "CorsOrigins": [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://frcs-frontend.home.lan",
    "https://frcs-pos.procyonfiji.com"
  ],
  "Kestrel": {
    "Certificates": {
      "Default": {
        "Path": "./cert/localhost.pem",
        "KeyPath": "./cert/localhost-key.pem"
      }
    }
  }
}
```

Configure your `.env.local` (send email for env values):

```env
MINIO__AccessKey=
MINIO__SecretKey=
MINIO__BucketName=
MINIO__Region=
MINIO__ServiceURL=

JWT__Audience=
JWT__Issuer=
JWT__SigningKey=

ConnectionStrings__DefaultConnectionPassword=
AllowPublicKeyRetrieval=
```

### 3. Database Setup

```bash
# Ensure MySQL is running (via Docker)
docker compose up -d mysql

# Apply migrations
dotnet ef database update

# If no migrations exist, create initial migration
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Start Development Server

```bash
dotnet run
# or with hot reload
dotnet watch run
```

The API will be available at:

- HTTP: http://localhost:5081
- HTTPS: https://localhost:5081
- Swagger UI: https://localhost:5081/swagger (development only)

## Project Structure

```
backend/
├── Controllers/             # API Controllers
│   ├── AuthController.cs
│   ├── UsersController.cs
│   └── BaseApiController.cs
├── Data/                   # Entity Framework
│   ├── AppDbContext.cs
│   ├── Migrations/
│   └── Configurations/     # Entity configurations
├── Models/                 # Data models and DTOs
│   ├── Entities/          # Database entities
│   ├── DTOs/              # Data Transfer Objects
│   └── Requests/          # Request models
├── Services/              # Business logic
│   ├── Interfaces/
│   ├── AuthService.cs
│   └── UserService.cs
├── Extensions/            # Extension methods
├── Middlewares/          # Custom middleware
├── Properties/
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── backend.csproj
```

## Essential Configuration

### Base Entity (`Models/Entities/BaseEntity.cs`)

```csharp
using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
```

### Base API Controller (`Controllers/BaseApiController.cs`)

```csharp
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseApiController : ControllerBase
    {
        protected int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            return null;
        }

        protected string? GetCurrentUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value;
        }

        protected IActionResult HandleError(Exception ex, string message = "An error occurred")
        {
            // Log the exception here
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");

            return StatusCode(500, new {
                message = message,
                details = ex.Message // Remove in production
            });
        }

        protected IActionResult ValidationErrorResponse(string message)
        {
            return BadRequest(new { message, errors = ModelState });
        }
    }
}
```
