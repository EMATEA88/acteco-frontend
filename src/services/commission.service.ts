import { api } from './api'

/* ================= TYPES ================= */

export type CommissionSummary = {
  level1: number
  level2: number
  level3: number
  total: number
}

export type CommissionDailySummary = {
  today: number
  yesterday: number
}

export type CommissionHistoryItem = {
  id: number
  amount: number
  level: 'level1' | 'level2' | 'level3'
  createdAt: string
}

/* ================= SERVICE ================= */

export const CommissionService = {
  getSummary() {
    return api.get<CommissionSummary>('/commission/summary')
  },

  getDailySummary() {
    return api.get<CommissionDailySummary>(
      '/commission/daily-summary'
    )
  },

  getHistory() {
    return api.get<CommissionHistoryItem[]>(
      '/commission/history'
    )
  },
}
