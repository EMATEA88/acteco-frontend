import { api } from './api'

/* ================= TYPES ================= */

export interface TransferResponse {
  success: boolean
  amount: number
  currency: 'AOA' | 'USDT'
  recipient: string
}

/* ================= SERVICE ================= */

export const TransferService = {

  /**
   * Transferência interna multi-moeda
   */
  async internal(
    recipientPublicId: string,
    amount: number,
    currency: 'AOA' | 'USDT' = 'AOA'
  ): Promise<TransferResponse> {

    try {

      const res = await api.post('/transfer/internal', {
        recipientPublicId,
        amount,
        currency // 🔥 AGORA ENVIA
      })

      return res.data

    } catch (err: any) {

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro na transferência'

      throw new Error(message)
    }
  }
}