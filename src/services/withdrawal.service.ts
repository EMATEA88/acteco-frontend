import { api } from './api'

export interface WithdrawalResponse {
  id: number
  amount: number
  fee: number
  status: string
  createdAt: string
}

export interface WithdrawalError {
  error?: string
  message?: string
}

export const WithdrawalService = {

  async create(amount: number): Promise<WithdrawalResponse> {

    try {

      const response = await api.post('/withdrawals', {
        amount
      })

      return response.data

    } catch (error: any) {

      const errorCode = error?.response?.data?.error
      const errorMessage = error?.response?.data?.message

      const normalizedError: WithdrawalError = {
        error: errorCode || 'UNKNOWN_ERROR',
        message: errorMessage || 'Erro ao solicitar retirada'
      }

      throw normalizedError
    }
  }

}