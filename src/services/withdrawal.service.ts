import { api } from './api'

export interface WithdrawalResponse {
  id: number
  amount: number
  fee: number
  status: 'PENDING' | 'APPROVED' | 'SUCCESS' | 'REJECTED'
  createdAt: string
}

export interface WithdrawalError {
  error?: string
  message?: string
}

export const WithdrawalService = {

  async create(amount: number): Promise<WithdrawalResponse> {

    try {

      const response = await api.post('/withdraw', {
        amount
      })

      return response.data

    } catch (err: unknown) {

      const error = err as {
        response?: {
          data?: WithdrawalError
        }
      }

      // 🔒 fallback seguro
      if (error.response?.data) {
        throw error.response.data
      }

      throw {
        message: 'Erro ao processar levantamento'
      } as WithdrawalError
    }
  }
}