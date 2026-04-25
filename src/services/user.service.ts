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
  balanceUSDT: number
  cryptoBalance?: number

  // 🔥 SEPARAÇÃO CORRETA
  depositWalletAddress?: string
  withdrawWalletAddress?: string

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
  withdrawWalletAddress?: string
  otp?: string
}

export const UserService = {

  async me(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/users/me')
    return response.data
  },

  async updateProfile(data: UpdateProfileDTO): Promise<any> {

    if (data.withdrawWalletAddress) {
      const addr = data.withdrawWalletAddress.trim()

      const tronRegex = /^T[a-zA-Z0-9]{33}$/

      if (!tronRegex.test(addr)) {
        throw new Error("Endereço TRC20 inválido.")
      }

      data.withdrawWalletAddress = addr
    }

    const response = await api.put('/users/profile', data)
    return response.data
  },

  async requestEmailChangeOTP(): Promise<{ message: string }> {
    const response = await api.post('/users/request-email-otp')
    return response.data
  }

}