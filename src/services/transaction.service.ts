import { api } from './api'

export type Transaction = {
  id: number
  type: string
  amount: number
  createdAt: string
}

export type TransactionFilter = {
  type?: string
  category?: 'IN' | 'OUT'
  page?: number
  limit?: number
}

export const TransactionService = {

  // 🔥 LISTAGEM BASE (mantém compatibilidade)
  async list(): Promise<Transaction[]> {
    const res = await api.get('/transactions')
    return res.data
  },

  // 🚀 LISTAGEM COM FILTROS (RECOMENDADO)
  async listFiltered(params?: TransactionFilter): Promise<Transaction[]> {
    const res = await api.get('/transactions', { params })
    return res.data
  },

  // 📊 RESUMO FINANCEIRO
  async summary(): Promise<{
    totalIn: number
    totalOut: number
    balance: number
  }> {
    const res = await api.get('/transactions/summary')
    return res.data
  },

  // 📄 PAGINAÇÃO REAL (escala grande)
  async paginate(page = 1, limit = 20): Promise<{
    data: Transaction[]
    total: number
    page: number
    lastPage: number
  }> {
    const res = await api.get('/transactions', {
      params: { page, limit }
    })
    return res.data
  }

}