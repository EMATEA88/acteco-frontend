// src/services/referral.service.ts
import { api } from './api'

/* ========================= */
/* TIPOS */
/* ========================= */

export interface TeamSummary {
  level1: number
  level2: number
  level3: number
  total: number
}

export interface TeamMember {
  id: number
  phone: string
  createdAt: string
}

export interface TeamList {
  level1: TeamMember[]
  level2: TeamMember[]
  level3: TeamMember[]
}

/* ========================= */
/* SERVICE */
/* ========================= */

export const ReferralService = {
  // 🔹 resumo (L1 / L2 / L3)
  getTeamSummary(): Promise<{ data: TeamSummary }> {
    return api.get('/team')
  },

  // 🔹 lista detalhada
  getTeamList(): Promise<{ data: TeamList }> {
    return api.get('/referral/list')
  },
}
