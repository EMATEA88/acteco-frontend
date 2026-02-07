// src/services/commission.service.ts
import { api } from './api'

export const CommissionService = {
  getSummary() {
    return api.get('/commission/summary')
  },

  getDailySummary() {
    return api.get<{
      today: number
      yesterday: number
    }>('/commission/daily-summary')
  },

  getHistory() {
    return api.get('/commission/history')
  },
}
