import { createContext, useEffect, useState, useContext } from "react"
import type { ReactNode } from "react"
import { api } from "../services/api"

interface User {
  id: number
  fullName?: string
  balance?: number
  cryptoBalance?: number //
  depositWalletAddress?: string
  withdrawWalletAddress?: string
  isVerified?: boolean
}

interface AuthContextData {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  login: (token: string, user: User) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void> // 🟢 Essencial para o Wallet.tsx
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchUserFromApi() {
    try {
      const response = await api.get("/users/me")
      
      // 🟢 ADICIONE ESTA LINHA: Salva o objeto completo (com o ID real) no storage
      localStorage.setItem("user", JSON.stringify(response.data)) 
      
      setUser(response.data)
    } catch (err) {
      console.error("Falha ao carregar usuário");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserFromApi().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(token: string) {
    localStorage.setItem("token", token)
    await fetchUserFromApi()
  }

  function logout() {
    localStorage.clear()
    setUser(null)
  }

  // 🟢 Esta é a função que está faltando no seu erro!
  async function refreshUser() {
    await fetchUserFromApi()
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      loading, 
      login, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)