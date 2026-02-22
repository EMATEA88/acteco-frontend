import { api } from './api'

export const KYCService = {

  // ================= ADMIN =================

  list: (page = 1, limit = 20) =>
    api.get(`/admin/kyc?page=${page}&limit=${limit}`),

  approve: (userId: number) =>
    api.patch(`/admin/kyc/${userId}/approve`),

  reject: (userId: number, reason: string) =>
    api.patch(`/admin/kyc/${userId}/reject`, { reason }),

  // ================= USER =================

  submit: (data: FormData) =>
    api.post('/kyc/submit', data),

  status: () =>
    api.get('/kyc/status')

}
