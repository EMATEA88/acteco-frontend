import { api } from './api'

export class RechargeService {
  static async create(amount: number) {
    const { data } = await api.post('/recharges', { amount })
    return data
  }

  static async myHistory() {
    const { data } = await api.get('/recharges/my')
    return { data }
  }

  static async listAll() {
    const { data } = await api.get('/recharges')
    return data
  }

  static async approve(id: number) {
    const { data } = await api.post(`/recharges/${id}/approve`)
    return data
  }

  static async reject(id: number) {
    const { data } = await api.post(`/recharges/${id}/reject`)
    return data
  }
}
