import { api } from './api'

export const WithdrawalService = {
  create: (amount: number) =>
    api.post('/withdrawals', { amount }),
}
