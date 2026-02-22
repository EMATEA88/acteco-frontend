import { useEffect, useRef, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { otcChatService } from "../../services/otcChat"
import { Clock } from "lucide-react"

export default function OtcChat() {

  const { orderId } = useParams<{ orderId: string }>()
  const id = Number(orderId)

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const [status, setStatus] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [sending, setSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    if (!id || isNaN(id)) return

    try {
      const data = await otcChatService.get(id)
      setMessages(data.conversation?.messages || [])
      setStatus(data.orderStatus)
      setExpiresAt(data.expiresAt)
    } catch (err) {
      console.error("Erro ao carregar chat", err)
    }
  }, [id])

  useEffect(() => {
    load()
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!expiresAt || status !== "PENDING") return

    const timer = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now()
      setTimeLeft(diff > 0 ? Math.floor(diff / 1000) : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt, status])

  const send = async () => {
    if (!text.trim() || sending || status !== "PENDING") return

    try {
      setSending(true)
      await otcChatService.send(id, text.trim())
      setText("")
      await load()
    } catch (err) {
      console.error("Erro ao enviar mensagem", err)
    } finally {
      setSending(false)
    }
  }

  const sendImage = async (file: File) => {
    if (!file || sending || status !== "PENDING") return

    try {
      setSending(true)
      await otcChatService.uploadImage(id, file)
      await load()
    } catch (err) {
      console.error("Erro ao enviar imagem", err)
    } finally {
      setSending(false)
    }
  }

  const isClosed =
    ["RELEASED", "CANCELLED", "EXPIRED"].includes(status)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="flex flex-col h-screen bg-[#0B1220] text-white">

      {/* HEADER FIXO */}
      <div className="
        sticky top-0 z-50
        bg-[#0F172A]
        border-b border-white/10
        px-5 py-4
        flex justify-between items-center
      ">

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10">
            <img
              src="/logo.png"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Ordem #{orderId}
            </p>
            <p className="text-xs text-gray-400">
              {status}
            </p>
          </div>
        </div>

        {status === "PENDING" && (
          <div className="
            flex items-center gap-2
            bg-white/5 border border-white/10
            px-3 py-1 rounded-full text-xs
          ">
            <Clock size={14} />
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        )}

      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`
                max-w-[75%]
                px-4 py-3
                rounded-2xl
                text-sm
                shadow-md
                ${m.isAdmin
                  ? "bg-white/10 border border-white/10"
                  : "bg-emerald-600"}
              `}
            >
              {m.type === "IMAGE" && m.content && (
                <img
                  src={m.content}
                  alt="Imagem"
                  className="rounded-xl mb-2 max-h-60 object-contain"
                />
              )}

              {m.type === "TEXT" && m.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT FIXO */}
      {!isClosed && (
        <div className="
          sticky bottom-0
          bg-[#0F172A]
          border-t border-white/10
          px-5 py-4
        ">

          <div className="flex items-center gap-3">

            {/* BOTÃO IMAGEM */}
            <label className="
              w-10 h-10
              flex items-center justify-center
              bg-white/5 border border-white/10
              rounded-full cursor-pointer
              hover:bg-white/10 transition
            ">
              📎
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) sendImage(file)
                }}
              />
            </label>

            {/* INPUT TEXTO */}
            <input
              disabled={sending}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Digite sua mensagem..."
              className="
                flex-1
                bg-white/5 border border-white/10
                px-4 py-3 rounded-full
                text-sm outline-none
                focus:border-emerald-500
              "
            />

            {/* BOTÃO ENVIAR */}
            <button
              disabled={sending}
              onClick={send}
              className="
                bg-emerald-600
                px-6 py-3 rounded-full
                font-medium
                transition
                hover:bg-emerald-700
                disabled:opacity-50
              "
            >
              Enviar
            </button>

          </div>
        </div>
      )}

    </div>
  )
}