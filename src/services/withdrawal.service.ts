import { api } from './api'

/* ================= TYPES ================= */

export interface WithdrawalHistory {
  id: number
  type: 'AOA' | 'USDT'
  amount: number
  fee: number
  status: string
  createdAt: string

  txHash?: string

  // 🔥 NOVOS CAMPOS (BSC READY)
  network?: string
  token?: string
}

export interface WithdrawUSDTResponse {
  success: boolean
  txHash: string
  sent: number     // 🔥 valor enviado (com fee aplicado)
  fee: number      // 🔥 taxa cobrada
}

export interface WithdrawalError {
  error?: string
  message?: string
}

/* ================= SERVICE ================= */

export const WithdrawalService = {

  /* ================= AOA ================= */

  async create(amount: number) {
    try {
      const { data } = await api.post('/withdrawals', {
        amount
      })

      return data

    } catch (err: any) {
      const errorData = err.response?.data as WithdrawalError

      throw {
        error: errorData?.error || 'INTERNAL_ERROR',
        message: errorData?.message || 'Erro ao processar levantamento'
      } as WithdrawalError
    }
  },

  /* ================= USDT (BSC) ================= */

  async withdrawUSDT(data: {
    amount: number
    address: string
    otp: string
    email: string
  }): Promise<WithdrawUSDTResponse> {

    try {
      const response = await api.post('/withdrawals/usdt', data)
      return response.data

    } catch (err: any) {

      const errorData = err.response?.data as WithdrawalError

      throw {
        error: errorData?.error || 'INTERNAL_ERROR',
        message: errorData?.message || 'Erro ao processar saque USDT'
      } as WithdrawalError
    }
  },

  /* ================= LIST ================= */

  async list(): Promise<WithdrawalHistory[]> {
    try {
      const { data } = await api.get('/withdrawals')

      // 🔥 NORMALIZAÇÃO (importante para frontend)
      return data.map((item: any) => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        fee: item.fee,
        status: item.status,
        createdAt: item.createdAt,
        txHash: item.txHash,

        network: item.network || null,
        token: item.token || null
      }))

    } catch (err: any) {

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao carregar histórico de levantamentos'

      throw new Error(message)
    }
  }

}