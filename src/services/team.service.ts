import { api } from './api'

/* ================= TYPES ================= */

export type TeamSummary = {
  level1: number
  level2: number
  level3: number
  total: number
}

export type TeamMember = {
  id: number
  phone: string
  createdAt: string
}

export type TeamListGrouped = {
  level1: TeamMember[]
  level2: TeamMember[]
  level3: TeamMember[]
}

/* ================= SERVICE ================= */

export const TeamService = {
  getSummary() {
    return api.get<TeamSummary>('/team')
  },

  getList() {
    return api.get<TeamListGrouped>('/team/list')
  },
}
