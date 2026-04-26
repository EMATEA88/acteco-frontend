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

  // 🔥 SALDOS (OBRIGATÓRIO PARA OTC)
  balance: number
  balanceUSDT: number
  cryptoBalance?: number

  // 🔥 CARTEIRAS
  depositWalletAddress?: string
  withdrawWalletAddress?: string

  // 🔥 SEGURANÇA
  isVerified: boolean
  role?: string

  verification?: Verification
}

/* ================= CONTEXT ================= */

interface AuthContextData {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /* ================= FETCH USER ================= */

  async function fetchUserFromApi() {
    try {
      const response = await api.get<User>("/users/me")

      // 🔒 GARANTE TIPAGEM E DEFAULTS (ANTI-CRASH)
      const safeUser: User = {
        ...response.data,
        balance: Number(response.data.balance ?? 0),
        balanceUSDT: Number(response.data.balanceUSDT ?? 0),
        isVerified: Boolean(response.data.isVerified)
      }

      localStorage.setItem("user", JSON.stringify(safeUser))
      setUser(safeUser)

    } catch (err) {
      console.error("AUTH_FETCH_ERROR:", err)
      setUser(null)
    }
  }

  /* ================= INIT ================= */

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      fetchUserFromApi().finally(() => setLoading(false))
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

/* ================= HOOK ================= */

export const useAuth = () => useContext(AuthContext)