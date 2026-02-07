import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextData {
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔑 REIDRATAÇÃO CONTROLADA
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const isAuthenticated = !!token

  function login(newToken: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
