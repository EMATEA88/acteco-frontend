import { api } from './api'

export type VerificationStatus =
  | 'NOT_SUBMITTED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'

export interface UserResponse {
  id: number
  publicId: string
  fullName?: string
  phone: string
  email: string
  address?: string
  country?: string
  province?: string
  neighborhood?: string
  bio?: string
  
  role: string
  balance: number
  cryptoBalance: number // 🟢 Adicionado para refletir o saldo de USDT
  walletAddress?: string // 🟢 Novo: Endereço da carteira USDT (Rede Tron)
  
  inviteCode?: string
  createdAt: string
  isVerified: boolean
  
  securityLockoutUntil?: string | null

  verification: {
    status: VerificationStatus
    submittedAt?: string
    reviewedAt?: string
  } | null

  bank: {
    id: number
    bankName: string
    accountNumber: string
    accountName: string
  } | null
}

export interface UpdateProfileDTO {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  province?: string
  neighborhood?: string
  bio?: string
  walletAddress?: string // 🟢 Novo: Campo para salvar o endereço TRC20
  otp?: string 
}

export const UserService = {

  async me(): Promise<{ data: UserResponse }> {
    const response = await api.get<UserResponse>('/users/me')
    return response
  },

  async updateProfile(data: UpdateProfileDTO): Promise<any> {
    // 🟢 Validação simples: se houver endereço de carteira, deve começar com "T"
    if (data.walletAddress && !data.walletAddress.startsWith('T')) {
      throw new Error("Endereço inválido. A plataforma aceita apenas a rede Tron (TRC20).")
    }
    const response = await api.put('/users/profile', data)
    return response.data
  },

  async requestEmailChangeOTP(): Promise<{ message: string }> {
    const response = await api.post('/users/request-email-otp')
    return response.data
  }

}