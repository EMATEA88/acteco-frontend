import { api } from "../services/api"

export interface OTCOrder {
  id: number
  assetId: number
  type: "BUY" | "SELL"
  quantity: number
  priceUsed: number
  totalAoa: number
  status: "PENDING" | "PAID" | "RELEASED" | "CANCELLED" | "EXPIRED" | "DISPUTED" | "COMPLETED"
  expiresAt?: string
  createdAt: string
  network?: string
  walletAddress?: string
}

export const otcService = {

  // ================= ASSETS =================
  async listAssets() {
    const res = await api.get("/otc/assets")
    if (Array.isArray(res.data)) {
      return res.data
    }
    return res.data.data
  },

  // ================= CREATE (ORDEM PENDENTE - COMPRA) =================
  async createOrder(data: {
    assetId: number
    type: "BUY" | "SELL"
    quantity: number
  }) {
    const res = await api.post("/otc/orders", data)
    return res.data.data
  },

  // ================= SELL (VENDA INSTANTÂNEA) =================
  // Nova função para conectar com a rota que acabamos de criar
  async sellInstant(data: {
    assetId: number
    quantity: number
  }) {
    const res = await api.post("/otc/sell", data)
    return res.data // Retorna { success: true, message: "...", data: order }
  },

  // ================= MY ORDERS =================
  async myOrders() {
    const res = await api.get("/otc/my-orders")
    return res.data.data
  },

  // ================= GET ORDER =================
  async getOrder(id: number) {
    const res = await api.get(`/otc/orders/${id}`)
    return res.data.data
  },

  // ================= ACTIONS =================
  async cancelOrder(id: number) {
    const res = await api.patch(`/otc/orders/${id}/cancel`)
    return res.data.data
  },

  // Nota: Verifique se no seu backend a rota de release é essa mesma, 
  // geralmente usada pelo Admin para liberar o ativo.
  async releaseOrder(id: number) {
    const res = await api.patch(`/otc/orders/${id}/release`)
    return res.data.data
  },

  async disputeOrder(id: number) {
    const res = await api.patch(`/otc/orders/${id}/dispute`)
    return res.data.data
  },

  async markAsPaid(id: number) {
    const res = await api.patch(`/otc/orders/${id}/pay`)
    return res.data.data
  }

}