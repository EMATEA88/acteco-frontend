import { createContext, useEffect, useState, useContext } from "react"
import type { ReactNode } from "react"
import { api } from "../services/api"

/* ================= TYPES ================= */

interface Verification {
  status: "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED"
}

interface User {
  id: number
  fullName?: string
  phone?: string
  email?: string

  balance: number
  balanceUSDT: number
  cryptoBalance?: number

  depositWalletAddress?: string
  withdrawWalletAddress?: string

  isVerified: boolean
  role?: string

  verification?: Verification
}

interface AuthContextData {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /* ================= FETCH USER ================= */

  async function fetchUserFromApi() {
    try {
      const response = await api.get("/users/me")

      const rawUser =
        response.data?.data ??
        response.data

      if (!rawUser?.id) {
        throw new Error("INVALID_USER_RESPONSE")
      }

      const safeUser: User = {
        ...rawUser,
        balance: Number(rawUser.balance ?? 0),
        balanceUSDT: Number(rawUser.balanceUSDT ?? 0),
        cryptoBalance: Number(rawUser.cryptoBalance ?? 0),
        isVerified: Boolean(rawUser.isVerified)
      }

      localStorage.setItem(
        "user",
        JSON.stringify(safeUser)
      )

      setUser(safeUser)

    } catch (err) {
      console.error("AUTH_FETCH_ERROR:", err)

      localStorage.removeItem("user")

      setUser(null)
    }
  }

  /* ================= INIT ================= */

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      fetchUserFromApi()
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  /* ================= ACTIONS ================= */

  async function login(token: string) {
    localStorage.setItem("token", token)

    await fetchUserFromApi()
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  async function refreshUser() {
    await fetchUserFromApi()
  }

  /* ================= RETURN ================= */

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)