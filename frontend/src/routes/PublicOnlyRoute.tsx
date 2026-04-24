import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function PublicOnlyRoute() {
  const { token } = useAuth()

  if (token) {
    return <Navigate to="/institutions" replace />
  }

  return <Outlet />
}
