import { api } from './api'

export const TeamService = {
  getSummary() {
    return api.get('/team')
  },

  getList() {
    return api.get('/team/list')
  },
}
