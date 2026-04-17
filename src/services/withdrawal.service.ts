import { api } from './api'

export interface WithdrawalResponse {
  id: number
  amount: number
  fee: number
  status: 'PENDING' | 'APPROVED' | 'SUCCESS' | 'REJECTED'
  createdAt: string
}

// Exportamos como interface para garantir a tipagem no Frontend
export interface WithdrawalError {
  error?: string
  message?: string
}

export const WithdrawalService = {
  /**
   * Cria um novo pedido de levantamento
   * @param amount Valor bruto do saque
   */
  async create(amount: number): Promise<WithdrawalResponse> {
    try {
      const response = await api.post('/withdrawals', {
        amount
      })

      return response.data
    } catch (err: any) {
      // ✅ Captura o erro estruturado vindo do WithdrawalController do Backend
      const errorData = err.response?.data as WithdrawalError

      // Lança o objeto de erro padronizado para ser lido pelo handleError da página
      throw {
        error: errorData?.error || 'INTERNAL_ERROR',
        message: errorData?.message || 'Erro ao processar levantamento'
      } as WithdrawalError
    }
  },

  /**
   * Lista o histórico de levantamentos do utilizador
   */
  async list(): Promise<WithdrawalResponse[]> {
    try {
      const response = await api.get('/withdrawals')
      return response.data
    } catch (err) {
      throw new Error('Erro ao carregar histórico de levantamentos')
    }
  }
}