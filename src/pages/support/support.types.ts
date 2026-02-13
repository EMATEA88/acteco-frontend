export type MessageType = "TEXT" | "IMAGE" | "AUDIO"

export interface SupportMessage {
  id: number
  senderId: number
  isAdmin: boolean
  type: MessageType
  content: string
  createdAt: string
}

export interface SupportConversation {
  id: number
  messages: SupportMessage[]
}
