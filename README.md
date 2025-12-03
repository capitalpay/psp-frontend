# PSP Frontend

Frontend application for the Capitak PayPSP platform - a modern payment service provider platform for the African market.

## Tech Stack

- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **Form Handling**: React Hook Form + Zod
- **API Client**: Axios
- **Testing**: Vitest + React Testing Library

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized development)

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up

# Open http://localhost:3000
```

## Environment Variables

Copy `.env.sample` to `.env` and configure:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_AUTH_API_URL=http://localhost:8001/api
```

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── store/          # State management
├── types/          # TypeScript types
├── utils/          # Utility functions
└── App.tsx         # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and development process.

## License

MIT License - see LICENSE file for details
