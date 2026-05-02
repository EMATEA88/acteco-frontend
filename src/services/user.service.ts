import { api } from './api'

/* ================= TYPES ================= */

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

/* ================= DTO ================= */

export interface UpdateProfileDTO {
  fullName?: string
  phone?: string
  address?: string
  province?: string
  neighborhood?: string
  bio?: string
  withdrawWalletAddress?: string
  otp?: string
}

/* ================= SERVICE ================= */

export const UserService = {

  /* ================= GET PROFILE ================= */
  async me(): Promise<UserResponse> {
    const response = await api.get<UserResponse>('/users/me')
    return response.data
  },

  /* ================= UPDATE PROFILE ================= */
  async updateProfile(data: UpdateProfileDTO): Promise<any> {

    if (data.withdrawWalletAddress) {
      const addr = data.withdrawWalletAddress.trim()

      const evmRegex = /^0x[a-fA-F0-9]{40}$/

      if (!evmRegex.test(addr)) {
        throw new Error("Endereço BEP20 inválido.")
      }

      data.withdrawWalletAddress = addr
    }

    const response = await api.put('/users/profile', data)
    return response.data
  },

  /* ================= OTP (NOVO PADRÃO) ================= */
  async sendOtp(type: 'WITHDRAW', target: string): Promise<void> {
    await api.post('/otp/send', {
      type,
      target
    })
  }

}