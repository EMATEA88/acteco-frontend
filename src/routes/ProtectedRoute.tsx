import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

import { useAuth } from "../contexts/AuthContext"

interface Props {
  children: ReactNode
  roles?: Array<
    "CLIENT" |
    "AGENT" |
    "SUB_AGENT" |
    "ADMIN"
  >
}

export default function ProtectedRoute({
  children,
  roles
}: Props) {

  const {
    loading,
    isAuthenticated,
    user
  } = useAuth()

  if (loading) {
    return null
  }

  // Alterado para redirecionar para /login diretamente
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    roles &&
    !roles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/home"
        replace
      />
    )
  }

  if (user.isBlocked) {
    return (
      <Navigate
        to="/blocked"
        replace
      />
    )
  }

  // Novo bloco simplificado com switch para verificação do AGENT
  if (
    user.role === "AGENT" &&
    user.agent
  ) {
    switch (user.agent.status) {
      case "PENDING":
        return (
          <Navigate
            to="/agent/pending"
            replace
          />
        )

      case "REJECTED":
        return (
          <Navigate
            to="/agent/rejected"
            replace
          />
        )

      case "SUSPENDED":
        return (
          <Navigate
            to="/agent/suspended"
            replace
          />
        )
    }
  }

  return <>{children}</>
}