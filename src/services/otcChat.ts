import { api } from "./api"

export interface OTCChatMessage {
  id: number
  content: string
  isAdmin: boolean
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO"
  createdAt: string
}

export interface OTCConversation {
  orderStatus: string
  expiresAt: string
  conversation: {
    id: number
    messages: OTCChatMessage[]
  }
}

export const otcChatService = {

  async get(orderId: number): Promise<OTCConversation> {
    const { data } = await api.get(`/api/otc/chat/${orderId}`)
    return data
  },

  async send(orderId: number, content: string) {
    const { data } = await api.post(
      `/api/otc/chat/${orderId}`,
      { content }
    )
    return data
  },

  async uploadImage(orderId: number, file: File) {
    const form = new FormData()
    form.append("image", file)

    const { data } = await api.post(
      `/api/otc/chat/${orderId}/image`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    )

    return data
  },

  async cancel(orderId: number) {
    const { data } =
      await api.patch(`/otc/orders/${orderId}/cancel`)
    return data
  },

  async release(orderId: number) {
    const { data } =
      await api.patch(`/otc/orders/${orderId}/release`)
    return data
  },

  async dispute(orderId: number) {
    const { data } =
      await api.patch(`/otc/orders/${orderId}/dispute`)
    return data
  },

  async markAsPaid(orderId: number) {
    const { data } =
      await api.patch(`/otc/orders/${orderId}/pay`)
    return data
  }

}