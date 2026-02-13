import { createContext, useEffect, useState, useContext } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: number
  name?: string
  email?: string
  role?: string
}

interface AuthContextData {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) setToken(storedToken)
    if (storedUser) setUser(JSON.parse(storedUser))

    setLoading(false)
  }, [])

  const isAuthenticated = !loading && !!token

  function login(newToken: string, newUser: User) {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook para acesso ao contexto de autenticação
 */
export function useAuth() {
  return useContext(AuthContext)
}
