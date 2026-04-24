import { api } from './api'

export class RechargeService {

  static async create(data: {
    amount: number
    currency: 'AOA' | 'USDT'
    method: 'BANK' | 'CRYPTO'
    txHash?: string
  }) {
    const response = await api.post('/recharges', data)
    return response.data
  }

  static async uploadProof(formData: FormData) {
    const { data } = await api.post('/recharges/upload-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }

  // 🔥 NOVO (CORRETO)
  static async getUserWallet() {
    const { data } = await api.get('/auth/me')
    return data.data.walletAddress
  }

  static async myHistory() {
    return api.get('/recharges/my')
  }

  static async listAll() {
    const { data } = await api.get('/recharges')
    return data
  }

  static async approve(id: number) {
    const { data } = await api.patch(`/recharges/${id}/approve`)
    return data
  }

  static async reject(id: number) {
    const { data } = await api.patch(`/recharges/${id}/reject`)
    return data
  }
}