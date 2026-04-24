import { api } from './api'

/* ================= TYPES ================= */

// 🔥 HISTÓRICO (LISTAGEM)
export interface WithdrawalHistory {
  id: number
  type: 'AOA' | 'USDT'
  amount: number
  fee: number
  status: string
  createdAt: string
  txHash?: string
}

// 🔥 RESPOSTA DO SAQUE USDT
export interface WithdrawUSDTResponse {
  success: boolean
  txHash: string
}

// 🔥 ERRO PADRÃO
export interface WithdrawalError {
  error?: string
  message?: string
}

/* ================= SERVICE ================= */

export const WithdrawalService = {

  /* ================= AOA ================= */

  async create(amount: number) {
    try {
      const response = await api.post('/withdrawals', {
        amount
      })

      return response.data

    } catch (err: any) {

      const errorData = err.response?.data as WithdrawalError

      throw {
        error: errorData?.error || 'INTERNAL_ERROR',
        message: errorData?.message || 'Erro ao processar levantamento'
      } as WithdrawalError
    }
  },

  /* ================= USDT ================= */

  async withdrawUSDT(
    amount: number,
    address: string,
    otp: string,
    email: string
  ) {
    try {
      const response = await api.post('/withdrawals/usdt', {
        amount,
        address,
        otp,
        email
      })

      return response.data

    } catch (err: any) {

      const errorData = err.response?.data

      throw {
        error: errorData?.error || 'INTERNAL_ERROR',
        message: errorData?.message || 'Erro ao processar saque USDT'
      }
    }
  }, // ✅ CORREÇÃO AQUI

  /* ================= LIST ================= */

  async list(): Promise<WithdrawalHistory[]> {
    try {
      const response = await api.get('/withdrawals')
      return response.data
    } catch (err: any) {

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao carregar histórico de levantamentos'

      throw new Error(message)
    }
  },

}