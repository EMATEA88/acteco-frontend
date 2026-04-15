import { api } from './api'

export async function getCompanyDashboard() {
  const { data } = await api.get('/dashboard/company')
  return data
}