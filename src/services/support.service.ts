import { api } from "./api"
import type { SupportConversation, MessageType } from "../pages/support/support.types"

export const SupportService = {
  async open(): Promise<SupportConversation> {
    const { data } = await api.post("/api/support/open")
    return data
  },

  async get(): Promise<SupportConversation> {
    const { data } = await api.get("/api/support")
    return data
  },

  async send(
    conversationId: number,
    type: MessageType,
    content: string
  ) {
    const { data } = await api.post("/api/support/send", {
      conversationId,
      type,
      content,
    })

    return data
  },
}
