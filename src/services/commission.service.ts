// src/services/commission.service.ts
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
  level: number          // 🔴 INT (1, 2, 3)
  fromUserId: number     // 🔴 CAMPO FALTANTE
  createdAt: string
}

/* ================= SERVICE ================= */

export const CommissionService = {
  getSummary() {
    return api.get<CommissionSummary>(
      '/commission/summary'
    )
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
