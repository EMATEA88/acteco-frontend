import { api } from './api'

/* ================= TYPES ================= */

export type Transaction = {
  id: number

  // 🔥 ALINHADO COM BACKEND
  type: 'RECHARGE' | 'WITHDRAW'

  amount: number
  currency: 'AOA' | 'USDT'

  method?: 'BANK' | 'CRYPTO'

  // 🔥 CRYPTO
  network?: string
  token?: string
  txHash?: string

  status: string

  description?: string
  reference?: string

  createdAt: string
  processedAt?: string
}

export type TransactionFilter = {
  type?: 'RECHARGE' | 'WITHDRAW'
  category?: 'IN' | 'OUT'
  page?: number
  limit?: number
}

/* ================= SERVICE ================= */

export const TransactionService = {

  /* ================= LIST ================= */

  async list(): Promise<Transaction[]> {
    try {
      const res = await api.get('/transactions')

      // 🔥 NORMALIZAÇÃO (CRÍTICO)
      return res.data.map((tx: any) => {

        const isCrypto = tx.method === 'CRYPTO'

        return {
          id: tx.id,
          type: tx.type,

          amount: isCrypto
            ? Number(tx.amount)
            : Number(tx.amount),

          currency: tx.currency,
          method: tx.method,

          network: tx.network || null,
          token: tx.token || null,
          txHash: tx.txHash || null,

          status: tx.status,

          description: tx.description,
          reference: tx.reference,

          createdAt: tx.createdAt,
          processedAt: tx.processedAt
        }
      })

    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Erro ao carregar transações'
      )
    }
  },

  /* ================= FILTER ================= */

  async listFiltered(params?: TransactionFilter): Promise<Transaction[]> {
    try {
      const res = await api.get('/transactions', { params })
      return res.data
    } catch (err: any) {
      throw new Error('Erro ao filtrar transações')
    }
  },

  /* ================= PAGINATION ================= */

  async paginate(page = 1, limit = 20): Promise<{
    data: Transaction[]
    page: number
    limit: number
  }> {
    try {
      const res = await api.get('/transactions', {
        params: { page, limit }
      })

      return {
        data: res.data,
        page,
        limit
      }

    } catch (err: any) {
      throw new Error('Erro ao paginar transações')
    }
  }
}