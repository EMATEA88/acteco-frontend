import { api } from './api'

export class RechargeService {
  static async create(amount: number) {
    const { data } = await api.post('/recharges', { amount })
    return data
  }
}
