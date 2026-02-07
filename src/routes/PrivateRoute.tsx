import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import type { ReactNode } from 'react'

import { AuthContext } from '../contexts/AuthContext'

export function PrivateRoute({
  children,
}: {
  children: ReactNode
}) {
  const { isAuthenticated, loading } =
    useContext(AuthContext)

  // ⏳ enquanto reidrata o token
  if (loading) {
    return null
    // ou um splash neutro, se quiser
  }

  // 🔒 decisão só depois do loading
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
