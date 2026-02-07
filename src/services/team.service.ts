import { api } from './api'

/* ================= TYPES ================= */

export type TeamSummary = {
  level1: number
  level2: number
  level3: number
}

export type TeamMember = {
  id: number
  phone: string
  level: 'level1' | 'level2' | 'level3'
  createdAt: string
}

/* ================= SERVICE ================= */

export const TeamService = {
  getSummary() {
    return api.get<TeamSummary>('/team')
  },

  getList() {
    return api.get<TeamMember[]>('/team/list')
  },
}
