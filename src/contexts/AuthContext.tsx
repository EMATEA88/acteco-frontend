import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { api } from "../services/api"

/* ================= TYPES ================= */

export type UserRole =
  | "CLIENT"
  | "AGENT"
  | "SUB_AGENT"
  | "ADMIN"

export type AgentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"

export interface AgentProfile {
  status: AgentStatus
  isActive: boolean
  agentCode: string
  companyName?: string | null

  commissionBalance: number
  totalSales: number
  totalCommission: number
}

export interface User {
  id: number
  publicId: string

  fullName: string
  email: string
  phone: string

  role: UserRole

  balance: number
  frozenBalance: number

  isVerified: boolean
  isBlocked: boolean
  isAgentApproved: boolean

  createdAt: string

  agent?: AgentProfile | null
}

interface AuthContextData {
  loading: boolean

  token: string | null

  user: User | null

  isAuthenticated: boolean

  login: (
    token: string,
    user: User
  ) => void

  logout: () => void

  refreshUser: () => Promise<void>

  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >
}

/* ================= CONTEXT ================= */

export const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  )

/* ================= PROVIDER ================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {

  const [loading, setLoading] =
    useState(true)

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem("token")
    )

  const [user, setUser] =
    useState<User | null>(() => {

      const stored =
        localStorage.getItem("user")

      if (!stored) return null

      try {

        return JSON.parse(stored)

      } catch {

        return null

      }

    })

  /* ================= INIT ================= */

  useEffect(() => {

    if (token) {

      api.defaults.headers.common.Authorization =
        `Bearer ${token}`

    }

    setLoading(false)

  }, [token])

  /* ================= REFRESH ================= */

  async function refreshUser() {

  try {

    const response =
      await api.get("/users/me")

    const raw =
      response.data?.data ??
      response.data

    const currentUser: User = {
      ...raw,

      isAgentApproved:
        Boolean(raw.isAgentApproved),

      agent:
        raw.agent
          ? {
              ...raw.agent,
              status:
                raw.agent.status ??
                raw.agentStatus ??
                "PENDING",
            }
          : raw.role === "AGENT"
            ? {
                status:
                  raw.agentStatus ??
                  (raw.isAgentApproved
                    ? "APPROVED"
                    : "PENDING"),

                isActive:
                  Boolean(raw.isActive),

                agentCode:
                  raw.agentCode ?? "",

                companyName:
                  raw.companyName ?? null,

                commissionBalance:
                  Number(
                    raw.commissionBalance ?? 0
                  ),

                totalSales:
                  Number(
                    raw.totalSales ?? 0
                  ),

                totalCommission:
                  Number(
                    raw.totalCommission ?? 0
                  ),
              }
            : null,
    }

    setUser(currentUser)

    localStorage.setItem(
      "user",
      JSON.stringify(currentUser)
    )

  } catch {

    logout()

  }

}

  /* ================= LOGIN ================= */

  function login(
    newToken: string,
    newUser: User
  ) {

    localStorage.setItem(
      "token",
      newToken
    )

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    )

    api.defaults.headers.common.Authorization =
      `Bearer ${newToken}`

    setToken(newToken)

    setUser(newUser)

  }

  /* ================= LOGOUT ================= */

  function logout() {

    localStorage.removeItem("token")

    localStorage.removeItem("user")

    delete api.defaults.headers.common.Authorization

    setToken(null)

    setUser(null)

  }

  /* ================= PROVIDER ================= */

  return (

    <AuthContext.Provider
      value={{

        loading,

        token,

        user,

        isAuthenticated:
          !!token && !!user,

        login,

        logout,

        refreshUser,

        setUser

      }}
    >

      {children}

    </AuthContext.Provider>

  )

}

/* ================= HOOK ================= */

export function useAuth() {

  return useContext(
    AuthContext
  )

}