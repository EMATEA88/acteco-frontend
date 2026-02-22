import { api } from '../services/api'

export const ServiceService = {

  async listPartners() {
    const { data } = await api.get('/services/partners')
    return data
  },

  async listPlans(partnerId: number) {
    const { data } = await api.get(`/services/partners/${partnerId}/plans`)
    return data
  },

  async buy(planId: number) {
    const { data } = await api.post('/services/pay', { planId })
    return data
  },

  async myRequests() {
    const { data } = await api.get('/services/my-requests')
    return data
  }

}
