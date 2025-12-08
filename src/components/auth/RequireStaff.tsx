import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface RequireStaffProps {
  children: React.ReactNode
}

const RequireStaff: React.FC<RequireStaffProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check for is_staff property
  if (!user.is_staff) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default RequireStaff
