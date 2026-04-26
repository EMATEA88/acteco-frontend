import { api } from "../services/api"

export interface OTCOrder {
  id: number
  assetId: number

  asset?: {
    id: number
    symbol: string
    buyPrice: number
    sellPrice: number
  }

  type: "BUY" | "SELL"
  quantity: number
  priceUsed: number
  totalAoa: number

  status:
    | "PENDING"
    | "PAID"
    | "RELEASED"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED"
    | "DISPUTED"

  createdAt: string
  completedAt?: string
}

export const otcService = {

  /* ================= ASSETS ================= */
  async listAssets() {
    const res = await api.get("/otc/assets")
    return res.data.data
  },

  /* ================= CREATE ORDER ================= */
  async createOrder(data: {
    assetId: number
    type: "BUY" | "SELL"
    quantity: number
  }) {
    const res = await api.post("/otc/orders", data)
    return res.data.data
  },

  /* ================= SELL INSTANT ================= */
  async sellInstant(data: {
    assetId: number
    quantity: number
  }) {
    const res = await api.post("/otc/sell", data)
    return res.data.data
  },

  /* ================= MY ORDERS ================= */
  async myOrders() {
    const res = await api.get("/otc/my-orders")
    return res.data.data
  },

  /* ================= GET ORDER ================= */
  async getOrder(id: number) {
    const res = await api.get(`/otc/orders/${id}`)
    return res.data.data
  },

  /* ================= ACTIONS ================= */

  async cancelOrder(id: number) {
    const res = await api.patch(`/otc/orders/${id}/cancel`)
    return res.data.data
  },

  async markAsPaid(id: number) {
    const res = await api.patch(`/otc/orders/${id}/pay`)
    return res.data.data
  }

}