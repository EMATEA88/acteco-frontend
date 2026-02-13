import { useEffect, useState } from 'react'
import type { SupportConversation, MessageType } from './support.types'
import { SupportService } from '../../services/support.service'

export function useSupport() {
  const [conversation, setConversation] = useState<SupportConversation | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await SupportService.open()
    setConversation(data)
    setLoading(false)
  }

  async function refresh() {
    const data = await SupportService.get()
    setConversation(data)
  }

  async function sendMessage(type: MessageType, content: string) {
    if (!conversation) return
    await SupportService.send(conversation.id, type, content)
    await refresh()
  }

  useEffect(() => {
    load()
  }, [])

  return { conversation, loading, sendMessage }
}
