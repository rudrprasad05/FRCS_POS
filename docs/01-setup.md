# Project Setup Guide

Welcome to our full-stack application! This guide will help you set up the development environment from scratch.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js v24 LTS** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)
- **Visual Studio Code** (recommended) with extensions:
  - C# Dev Kit
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Docker
  - GitLens

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <https://github.com/rudrprasad05/FRCS_POS.git>
   cd <FRCS_POS>
   ```

2. **Create your feature branch**

   ```bash
   git checkout -b <your-name>  # -b will create new branch if branch does not exist
   ```

3. **Set up the database**

   ```bash
   # Start MySQL container
   docker compose up -d mysql

   # Wait 30 seconds for MySQL to initialize
   # Run database migrations
   cd backend
   dotnet ef database update
   ```

4. **Start the backend**

   ```bash
   cd backend
   dotnet run --launch-profile https
   # Backend runs on https://localhost:5081
   ```

5. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

## Project Structure

```
project-root/
├── frontend/                # Next.js 14 App Router application
│   ├── app/                 # App Router pages and layouts
│   ├── src/
│   │   └── components/
│   │       └── ui/          # Shadcn/UI components
│   ├── public/              # Static assets
│   ├── .env.local           # Frontend environment variables
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── backend/                 # ASP.NET Core 8 Web API
│   ├── Controllers/         # API controllers
│   ├── Models/              # Data models
│   ├── Services/            # Business logic services
│   ├── Data/                # EF Core DbContext and migrations
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   └── Program.cs
├── database/                # Database scripts and documentation
├── docs/                    # Additional documentation
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   └── docker.md
├── docker-compose.yml       # Docker
├── .dockerignore            # Docker
```
