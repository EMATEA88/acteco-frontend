import { api } from './api'

/* ================= TYPES ================= */

export type Transaction = {
  id: number
  type: 'DEPOSIT' | 'WITHDRAW'
  amount: number
  currency: 'AOA' | 'USDT'
  status: string
  description?: string
  reference?: string
  createdAt: string
  processedAt?: string
}

export type TransactionFilter = {
  type?: 'DEPOSIT' | 'WITHDRAW'
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
      return res.data
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