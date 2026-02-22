import { api } from "../services/api"

export interface OTCOrder {
  id: number
  assetId: number
  type: "BUY" | "SELL"
  quantity: number
  priceUsed: number
  totalAoa: number
  status: string
  expiresAt: string
  createdAt: string
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

  // ================= CREATE =================
  async createOrder(data: {
    assetId: number
    type: "BUY" | "SELL"
    quantity: number
  }) {
    const res = await api.post("/otc/orders", data)
    return res.data.data
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