# Frontend Setup Guide - Next.js 14

This guide covers the frontend setup using Next.js 14 App Router with TypeScript, TailwindCSS, and Shadcn/UI.

## Initial Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5081/api/
NODE_OPTIONS=--use-openssl-ca
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
frontend/
├── app/                     # App Router (Next.js 14)
│   ├── (auth)/             # Route groups
│   │   ├── login/
│   │   └── register/
│   ├── admin/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── loading.tsx         # Loading UI
│   ├── not-found.tsx       # 404 page
│   └── page.tsx            # Home page
├── src/
│   ├── components/
│   │   ├── ui/             # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── shared/         # Shared components
│   ├── lib/
│   │   ├── api.ts          # API client
│   │   ├── utils.ts        # Utility functions
│   │   └── validations.ts  # Form validations
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management (if needed)
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── .env.local             # Environment variables
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## Essential Code Examples

### 1. API Client Setup (`src/lib/api.ts`)

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5081/api";

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000");
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
```

### 2. Layout File (Root) (`app/layout.tsx`)

```typescript
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Full-stack application built with Next.js and ASP.NET Core",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  );
}
```

### 3. Example Page with API Integration (`app/users/page.tsx`)

```typescript
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/src/lib/api";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<User[]>("/users");
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchUsers}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button onClick={fetchUsers}>Refresh</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## Shadcn/UI Components

### Installing Components

```bash
# Install shadcn/ui CLI
npx shadcn-ui@latest init

# Add specific components
npx shadcn-ui@latest add button
```

### Common Components Setup

The components will be installed in `src/components/ui/`. Always import from there:

```typescript
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## Best Practices

1. **File Naming**: Use PascalCase for components and files
2. **Import Order**: External libraries → Internal modules → Relative imports
3. **TypeScript**: Always type your props and state
4. **Error Handling**: Always handle loading and error states
5. **Accessibility**: Use semantic HTML and ARIA attributes
6. **Performance**: Use dynamic imports for heavy components
7. **Styling**: Prefer Tailwind utilities over custom CSS

## Common Patterns

### Loading State Component

```typescript
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
```

### Error Boundary

```typescript
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
```

This setup provides a solid foundation for developing with our Next.js 14 frontend stack!
