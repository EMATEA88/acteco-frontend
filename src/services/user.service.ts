import { api } from './api'

export interface UserResponse {
  id: number
  publicId: string
  phone: string
  role: string
  balance: number
  inviteCode: string
  createdAt: string
  isVerified: boolean
  verification: {
    status: 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  } | null
  bank: any
}

export const UserService = {

  async me(): Promise<{ data: UserResponse }> {
    const response = await api.get('/users/me')
    return response
  }

}