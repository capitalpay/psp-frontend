# Capital Pay PSP - Frontend

Modern, responsive web application for the Capital Pay Payment Service Provider platform, built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for full stack)

### Development Setup

#### Option 1: Standalone Development (Recommended for Frontend Work)

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

The app will be available at `http://localhost:5173`

> **Note:** In development mode, API requests to `/api/v1` are proxied to `http://localhost:8080` (API Gateway). Make sure the backend services are running.

#### Option 2: Full Stack with Docker (Production-like)

From the **root** `psp` directory:

```bash
# Start all services (Auth Service, Gateway, Frontend)
docker compose up -d

# Rebuild frontend after code changes
docker compose up -d --build frontend

# View logs
docker compose logs -f frontend
```

The production build will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
psp-frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components (Register, Login, Dashboard, etc.)
│   ├── services/       # API client and service layer
│   ├── store/          # Zustand state management
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── Dockerfile          # Multi-stage Docker build
├── nginx.conf          # Nginx config for production
└── vite.config.ts      # Vite configuration
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run lint             # Run ESLint

# Docker (from root psp directory)
docker compose up -d                    # Start all services
docker compose up -d --build frontend   # Rebuild frontend
docker compose logs -f frontend         # View frontend logs
docker compose down                     # Stop all services
```

## 🔧 Environment Configuration

### Development Mode (Vite)

API requests are automatically proxied via `vite.config.ts`:

```typescript
proxy: {
  '/api/v1': {
    target: 'http://localhost:8080',  // API Gateway
    changeOrigin: true,
    secure: false,
  },
}
```

### Production Mode (Docker)

The production Nginx configuration (`nginx.conf`) proxies API requests to the Gateway service:

```nginx
location /api/v1/ {
    proxy_pass http://gateway:80/api/v1/;
    # ... proxy headers
}
```

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

## 🔐 Authentication Flow

1. **Register** → Create account at `/register`
2. **Email Verification** → Check email for verification link
3. **Login** → Sign in at `/login` (supports 2FA)
4. **Dashboard** → Access protected routes

## 🐛 Troubleshooting

### Port Conflicts

If port 3000 or 5173 is already in use:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Frontend Not Loading in Docker

```bash
# Rebuild the frontend image
docker compose up -d --build frontend

# Check logs for errors
docker compose logs frontend
```

### API Requests Failing (405/CORS Errors)

- Ensure the API Gateway is running: `docker compose ps gateway`
- Check Gateway logs: `docker compose logs gateway`
- Verify frontend Nginx config includes proxy rules

### Password Validation Errors

Passwords must meet Django's requirements:

- Minimum 12 characters
- At least one uppercase letter
- Cannot be too common

Example valid password: `TestPassword123`

## 📚 Key Features

- ✅ Modern, responsive UI with glassmorphism effects
- ✅ Split-screen authentication layouts
- ✅ Password strength validation
- ✅ Email verification flow
- ✅ Two-factor authentication (2FA) support
- ✅ Protected routes with automatic token refresh
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling
- ✅ Mobile-responsive design

## 🔗 Related Services

- **Auth Service**: `http://localhost:8000`
- **API Gateway**: `http://localhost:8080`
- **Frontend (Production)**: `http://localhost:3000`
- **Frontend (Development)**: `http://localhost:5173`

## 📄 License

Copyright © 2025 Capital Pay PSP. All rights reserved.
