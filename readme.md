# FRCS POS System

A modern, full-stack Point of Sale (POS) system built with Next.js 14 and ASP.NET Core 8. Designed for retail businesses to manage transactions, inventory, and customer data with a clean, intuitive interface.

## 🚀 Features

- **Modern Frontend**: Built with Next.js 14 App Router, TypeScript, and Tailwind CSS
- **Robust Backend**: ASP.NET Core 8 Web API with Entity Framework Core
- **Real-time Operations**: Fast, responsive POS interface for quick transactions
- **Inventory Management**: Track products, stock levels, and categories
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Database**: MySQL with Entity Framework migrations
- **Containerized**: Docker support for easy deployment

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React

### Backend

- **Framework**: ASP.NET Core 8 Web API
- **Language**: C#
- **Database**: MySQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Storage**: MinIO for file storage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js v20+ LTS](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/rudrprasad05/FRCS_POS.git
cd FRCS_POS
```

### 2. Create Your Feature Branch

```bash
git checkout -b your-name
```

### 3. Set Up the Database

```bash
# Start MySQL container
docker compose up -d mysql

# Wait 30 seconds for MySQL to initialize, then run migrations
cd backend
dotnet ef database update
```

### 4. Start the Backend

```bash
cd backend
dotnet run --launch-profile https
# Backend runs on https://localhost:5081
```

### 5. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **API**: https://localhost:5081
- **API Documentation**: https://localhost:5081/swagger (development only)

## 📁 Project Structure

```
FRCS_POS/
├── frontend/                # Next.js 14 App Router application
│   ├── app/                 # App Router pages and layouts
│   ├── src/
│   │   └── components/      # React components
│   │       └── ui/          # Shadcn/UI components
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # ASP.NET Core 8 Web API
│   ├── Controllers/         # API controllers
│   ├── Models/              # Data models and DTOs
│   ├── Services/            # Business logic services
│   ├── Data/                # EF Core DbContext and migrations
│   └── Program.cs
├── docs/                    # Documentation
│   ├── 01-setup.md
│   ├── 02-frontend.md
│   ├── 03-backend.md
│   └── 04-git.md
├── docker-compose.yml       # Docker services configuration
└── README.md
```

## 🔧 Development

### Environment Setup

1. **Frontend Environment** (`.env.local`):

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5081/api/
NODE_OPTIONS=--use-openssl-ca
NODE_TLS_REJECT_UNAUTHORIZED=0
```

2. **Backend Environment** (`.env.local`):

```env
JWT__Audience=your-audience
JWT__Issuer=your-issuer
JWT__SigningKey=your-secret-key
ConnectionStrings__DefaultConnectionPassword=your-db-password
```

### Available Scripts

#### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

#### Backend

```bash
dotnet run                    # Start the API server
dotnet watch run             # Start with hot reload
dotnet ef database update    # Apply database migrations
dotnet ef migrations add     # Create new migration
```

## 📚 Documentation

Detailed setup and development guides are available in the `docs/` directory:

- [📖 Setup Guide](docs/01-setup.md) - Complete project setup instructions
- [⚛️ Frontend Guide](docs/02-frontend.md) - Next.js development guide
- [🔧 Backend Guide](docs/03-backend.md) - ASP.NET Core development guide
- [🌿 Git Workflow](docs/04-git.md) - Branching strategy and commit conventions

## 🤝 Contributing

We follow a feature branch workflow:

1. **Create your feature branch**: `git checkout -b your-name`
2. **Make your changes**: Follow our coding standards
3. **Commit your changes**: Use [conventional commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat(pos): add product search functionality"
   ```
4. **Push to your branch**: `git push origin your-name`
5. **Create a Pull Request**: Submit PR to `main` branch

### Commit Convention

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
style(scope): formatting changes
refactor(scope): code refactoring
test(scope): add/update tests
chore(scope): maintenance tasks
```

## 🐳 Docker Deployment

For production deployment:

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [documentation](docs/) for setup instructions
2. Review existing [GitHub Issues](https://github.com/rudrprasad05/FRCS_POS/issues)
3. Create a new issue with detailed information about your problem

## 🔗 Related Links

- [Next.js Documentation](https://nextjs.org/docs)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)

---

**Built with ❤️ for modern retail businesses**
