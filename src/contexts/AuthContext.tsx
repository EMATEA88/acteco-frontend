import { createContext, useEffect, useState, useContext } from "react"
import type { ReactNode } from "react"
import { api } from "../services/api"

interface UserBank {
  id: number
  name: string
  bank: string
  iban: string
}

interface UserVerification {
  status: string
}

interface User {
  id: number
  phone?: string
  role?: string
  balance?: number
  isVerified?: boolean
  verification?: UserVerification | null
  bank?: UserBank | null
}

interface AuthContextData {
  isAuthenticated: boolean
  token: string | null
  user: User | null
  loading: boolean
  isUserVerified: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

export function AuthProvider({ children }: { children: ReactNode }) {

  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // =========================
  // FETCH USER FROM BACKEND
  // =========================
  async function fetchUserFromApi() {
    try {
      const response = await api.get("/profile")

      const normalizedUser: User = {
        ...response.data,
        balance: Number(response.data.balance ?? 0)
      }

      localStorage.setItem("user", JSON.stringify(normalizedUser))
      setUser(normalizedUser)

    } catch (err) {
      logout()
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    const storedToken = localStorage.getItem("token")

    if (!storedToken) {
      setLoading(false)
      return
    }

    setToken(storedToken)

    fetchUserFromApi()
      .finally(() => setLoading(false))

  }, [])

  const isAuthenticated = !!token && !loading

  const isUserVerified = (() => {
    if (!user) return false

    if (user.isVerified === true) return true

    if (user.verification?.status === "VERIFIED") return true

    if (user.verification?.status === "APPROVED") return true

    return false
  })()

  // =========================
  // LOGIN
  // =========================
  async function login(newToken: string, _userFromLogin: User) {

    localStorage.setItem("token", newToken)
    setToken(newToken)

    // 🔥 Sempre sincroniza com backend real
    await fetchUserFromApi()
  }

  // =========================
  // REFRESH USER
  // =========================
  async function refreshUser() {
    await fetchUserFromApi()
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

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
        isUserVerified,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}