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
  role: string
  balance: number
  inviteCode?: string
  createdAt: string
  isVerified: boolean

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

export const UserService = {

  async me(): Promise<{ data: UserResponse }> {
    const response = await api.get<UserResponse>('/users/me')
    return response
  }

}