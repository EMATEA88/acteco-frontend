import { api } from '../services/api'

export const ApplicationService = {

  async list() {
    const { data } = await api.get('/applications')
    return data
  },

  async create(amount: number, periodDays: number) {
    const { data } = await api.post('/applications', {
      amount,
      periodDays
    })
    return data
  }

}