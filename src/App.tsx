import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import VerifyEmailPage from '@/pages/VerifyEmailPage'
import DashboardPage from '@/pages/DashboardPage'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Placeholder routes for future pages */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600">Profile page - Coming soon</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/api-keys"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600">API Keys page - Coming soon</p>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600">Settings page - Coming soon</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}

export default App
