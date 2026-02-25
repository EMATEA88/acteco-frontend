import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { otcChat } from "../../services/otcChat"
import { connectSocket } from "../../services/socket"
import { Clock, ImagePlus } from "lucide-react"

export default function OtcChat() {

  const { orderId } = useParams<{ orderId: string }>()
  const id = Number(orderId)

  const [messages, setMessages] = useState<any[]>([])
  const [status, setStatus] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [typing, setTyping] = useState(false)
  const [online, setOnline] = useState(true)
  const [lastSeen, setLastSeen] = useState<Date | null>(null)
  const [text, setText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  const isClosed =
    ["RELEASED", "CANCELLED", "EXPIRED"].includes(status)

  /* ================= LOAD ================= */
  useEffect(() => {
    async function load() {
      try {
        const data = await otcChat.get(id)

        setMessages(data.conversation?.messages ?? [])
        setStatus(data.orderStatus ?? "")
        setExpiresAt(data.expiresAt ?? "")
      } catch (err) {
        console.error("Erro ao carregar chat:", err)
      }
    }

    if (id && !isNaN(id)) load()
  }, [id])

  /* ================= SOCKET ================= */
  useEffect(() => {

    if (!id || isNaN(id)) return

    const token = localStorage.getItem("token")
    if (!token) return

    const socket = connectSocket(token)
    socketRef.current = socket

    socket.emit("otc:join", id)

    socket.on("otc:new-message", (msg: any) => {
      setMessages(prev => [...prev, msg])
      socket.emit("otc:read", id)
    })

    socket.on("otc:status-update", (data: any) => {
      if (data.orderId === id) {
        setStatus(data.status)
      }
    })

    socket.on("otc:typing", () => setTyping(true))
    socket.on("otc:stop-typing", () => setTyping(false))

    socket.on("presence:update", (data: any) => {
      if (!data) return
      setOnline(data.isOnline)
      if (!data.isOnline) {
        setLastSeen(new Date())
      }
    })

    return () => {
      socket.off("otc:new-message")
      socket.off("otc:status-update")
      socket.off("otc:typing")
      socket.off("otc:stop-typing")
      socket.off("presence:update")
    }

  }, [id])

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ================= TIMER ================= */
  const timeLeft = expiresAt
    ? Math.max(
        0,
        Math.floor(
          (new Date(expiresAt).getTime() - Date.now()) / 1000
        )
      )
    : 0

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  /* ================= SEND ================= */
  const send = () => {
    if (!text.trim() || isClosed) return
    if (!socketRef.current) return

    socketRef.current.emit("otc:message", {
      orderId: id,
      message: text.trim()
    })

    setText("")
  }

  /* ================= IMAGE ================= */
  const upload = async (file: File) => {
    if (!file || isClosed) return

    try {
      setUploading(true)
      setPreview(URL.createObjectURL(file))

      await otcChat.uploadImage(id, file)

    } catch (err) {
      console.error("Erro upload:", err)
    } finally {
      setPreview(null)
      setUploading(false)
    }
  }

  /* ================= ONLINE LABEL ================= */
  const onlineLabel = typing
    ? "escrevendo..."
    : online
    ? "Online"
    : lastSeen
    ? `visto há ${Math.floor(
        (Date.now() - lastSeen.getTime()) / 60000
      )} min`
    : "Offline"

  const statusColor = {
    PENDING: "bg-orange-500/20 text-orange-400",
    PAID: "bg-blue-500/20 text-blue-400",
    RELEASED: "bg-emerald-500/20 text-emerald-400",
    CANCELLED: "bg-red-500/20 text-red-400",
    EXPIRED: "bg-gray-500/20 text-gray-400"
  }[status] || "bg-gray-500/20 text-gray-400"

  return (
    <div className="flex flex-col h-screen bg-[#0B1220] text-white">

      {/* HEADER */}
      <div className="bg-[#0F172A] border-b border-white/10 px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-semibold">
              EMATEA #{id}
            </p>
            <p className="text-xs text-green-400">
              {onlineLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs ${statusColor}`}>
            {status}
          </span>

          {status === "PENDING" && (
            <div className="flex items-center gap-2 text-orange-400 text-sm">
              <Clock size={14} />
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
          )}
        </div>

      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isAdmin ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`relative px-4 py-3 rounded-2xl max-w-[70%] text-sm shadow-md ${
                m.isAdmin
                  ? "bg-[#1E293B] border border-white/10"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600"
              }`}
            >
              {m.type === "IMAGE"
                ? <img src={m.content} className="rounded-xl max-w-full" />
                : m.content}
            </div>
          </div>
        ))}

        {preview && (
          <div className="flex justify-end">
            <img
              src={preview}
              className="rounded-xl max-w-[60%] opacity-50"
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      {!isClosed && (
        <div className="bg-[#0F172A] border-t border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">

            <label className="cursor-pointer">
              <ImagePlus size={20} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  e.target.files && upload(e.target.files[0])
                }
              />
            </label>

            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                socketRef.current?.emit("otc:typing", id)
              }}
              onBlur={() =>
                socketRef.current?.emit("otc:stop-typing", id)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && send()
              }
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-white/5 px-4 py-3 rounded-full outline-none"
            />

            <button
              onClick={send}
              disabled={uploading}
              className="bg-emerald-600 px-5 py-2 rounded-full"
            >
              Enviar
            </button>

          </div>
        </div>
      )}

    </div>
  )
}