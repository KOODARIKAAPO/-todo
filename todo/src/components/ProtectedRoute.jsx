import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../context/useUser'

export default function ProtectedRoute() {
  const { user } = useUser()
  const location = useLocation()

  if (!user?.token) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return <Outlet />
}
