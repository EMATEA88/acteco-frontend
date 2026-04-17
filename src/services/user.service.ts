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
  // 🟢 Novos campos de perfil e localização
  address?: string
  country?: string
  province?: string
  neighborhood?: string
  bio?: string
  
  role: string
  balance: number
  inviteCode?: string
  createdAt: string
  isVerified: boolean
  
  // 🟢 Campo para controle de segurança no frontend
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

// Interface para os dados de atualização
export interface UpdateProfileDTO {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  province?: string
  neighborhood?: string
  bio?: string
  otp?: string // Código enviado por e-mail
}

export const UserService = {

  async me(): Promise<{ data: UserResponse }> {
    const response = await api.get<UserResponse>('/users/me')
    return response
  },

  // 🟢 Novo: Enviar os dados atualizados para o servidor
  async updateProfile(data: UpdateProfileDTO): Promise<any> {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  // 🟢 Novo: Solicitar o código OTP para o e-mail atual
  async requestEmailChangeOTP(): Promise<{ message: string }> {
    const response = await api.post('/users/request-email-otp')
    return response.data
  }

}