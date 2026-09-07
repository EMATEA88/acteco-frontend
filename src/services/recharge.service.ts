import { api } from './api'

/* ================= TYPES ================= */

export interface WalletResponse {
  address: string
  network: string
  token: string
}

export interface RechargeHistory {
  id: number
  amount: number
  currency: string
  status: string
  createdAt: string
}

export interface USDTQuoteResponse {
  amount: string
  currency: string
  rate: string
  convertedAmount: string
  convertedCurrency: string
}

/* ================= SERVICE ================= */

export class RechargeService {

  /* ================= AOA (FIAT ONLY) ================= */

  static async create(amount: number) {
    const response = await api.post('/recharges', {
      amount: Number(amount),
      currency: 'AOA',
      method: 'BANK'
    })

    return response.data
  }

  /* ================= USDT → AOA QUOTE ================= */

  static async getQuote(amount: number): Promise<USDTQuoteResponse> {
    const { data } = await api.get('/redotpay/quote', {
      params: {
        amount: Number(amount)
      }
    })

    return data
  }

  /* ================= UPLOAD PROOF ================= */

  static async uploadProof(formData: FormData) {
    const { data } = await api.post('/recharges/upload-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return data
  }

  /* ================= WALLET (CRYPTO) ================= */

  static async getUserWallet(): Promise<WalletResponse> {
    const { data } = await api.get('/recharges/wallet')
    return data
  }

  /* ================= HISTORY ================= */

  static async myHistory(): Promise<RechargeHistory[]> {
    const { data } = await api.get('/recharges/my')
    return data
  }

  /* ================= ADMIN ================= */

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