import { useState, useRef } from "react"
import { useSupport } from "./useSupport"
import MessageBubble from "./MessageBubble"
import { useAuth } from "../../contexts/AuthContext"

export default function SupportPage() {
  const { conversation, loading, sendMessage } = useSupport()
  const { user } = useAuth()

  const [text, setText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  if (loading) return <div className="p-6">Carregando...</div>

  const handleSend = async () => {
    if (!text.trim()) return
    await sendMessage("TEXT", text)
    setText("")
  }

  const handleImage = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage("IMAGE", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAudio = async (file: File) => {
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage("AUDIO", reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-[85vh] p-6 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-4">
        {conversation?.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            currentUserId={user?.id ?? 0}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg p-2"
          placeholder="Digite sua mensagem..."
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Enviar
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          hidden
          onChange={(e) =>
            e.target.files && handleImage(e.target.files[0])
          }
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-300 px-3 rounded-lg"
        >
          📷
        </button>

        <input
          type="file"
          accept="audio/*"
          ref={audioInputRef}
          hidden
          onChange={(e) =>
            e.target.files && handleAudio(e.target.files[0])
          }
        />

        <button
          onClick={() => audioInputRef.current?.click()}
          className="bg-gray-300 px-3 rounded-lg"
        >
          🎤
        </button>
      </div>
    </div>
  )
}
