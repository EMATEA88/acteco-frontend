import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcChat } from "../../services/otcChat"
import { connectSocket } from "../../services/socket"
import { 
  Clock, 
  ImageSquare, 
  ArrowLeft, 
  PaperPlaneRight, 
  ShieldCheck,
  WarningCircle
} from "@phosphor-icons/react"

export default function OtcChat() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const id = Number(orderId)

  const [messages, setMessages] = useState<any[]>([])
  const [status, setStatus] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [typing, setTyping] = useState(false)
  const [online, setOnline] = useState(true)
  // 🟢 Removido lastSeen para eliminar o aviso de variável não utilizada
  const [text, setText] = useState("")
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)

  const isClosed = ["RELEASED", "CANCELLED", "EXPIRED"].includes(status)

  /* ================= LOAD ================= */
  useEffect(() => {
    async function load() {
      try {
        const data = await otcChat.get(id)
        setMessages(data.conversation?.messages ?? [])
        setStatus(data.orderStatus ?? "")
        setExpiresAt(data.expiresAt ?? "")
      } catch (err) {
        console.error("Erro ao carregar chat")
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
      if (data.orderId === id) setStatus(data.status)
    })

    socket.on("otc:typing", () => setTyping(true))
    socket.on("otc:stop-typing", () => setTyping(false))

    socket.on("presence:update", (data: any) => {
      if (!data) return
      setOnline(data.isOnline)
      // 🟢 Removido o setLastSeen que causava o aviso
    })

    return () => {
      socket.off("otc:new-message"); socket.off("otc:status-update")
      socket.off("otc:typing"); socket.off("otc:stop-typing"); socket.off("presence:update")
    }
  }, [id])

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /* ================= TIMER ================= */
  const timeLeft = expiresAt ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)) : 0
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  /* ================= SEND ================= */
  const send = () => {
    if (!text.trim() || isClosed) return
    socketRef.current?.emit("otc:message", { orderId: id, message: text.trim() })
    setText("")
  }

  /* ================= IMAGE UPLOAD ================= */
  const upload = async (file: File) => {
    if (!file || isClosed) return
    try {
      setUploading(true)
      setPreview(URL.createObjectURL(file))
      await otcChat.uploadImage(id, file)
    } catch (err) {
      console.error("Erro no upload")
    } finally {
      setPreview(null); setUploading(false)
    }
  }

  const onlineLabel = typing ? "escrevendo..." : online ? "Online" : "Offline"

  const statusStyle = {
    PENDING: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    PAID: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    RELEASED: "bg-green-500/10 text-green-500 border-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
    EXPIRED: "bg-white/5 text-gray-500 border-white/5"
  }[status] || "bg-white/5 text-gray-500"

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.png" className="w-10 h-10 rounded-full border border-white/10 p-0.5 bg-[#111]" />
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${online ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            </div>
            <div>
              <p className="text-sm font-black tracking-tight uppercase">Suporte EMATEA</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${typing ? 'text-green-500 animate-pulse' : 'text-gray-500'}`}>
                {onlineLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle}`}>
            {status}
          </span>
          {status === "PENDING" && (
            <div className="flex items-center gap-1.5 text-orange-500 text-[10px] font-black italic">
              <Clock size={12} weight="fill" />
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
          )}
        </div>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6 no-scrollbar bg-[#0a0a0a]">
        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex items-center gap-3 opacity-60 max-w-sm mx-auto mb-4">
          <ShieldCheck size={20} weight="duotone" className="text-green-500" />
          <p className="text-[10px] font-medium uppercase tracking-tight text-center">
            Chat encriptado. Não partilhe dados sensíveis.
          </p>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isAdmin ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`relative px-5 py-3 rounded-3xl max-w-[85%] text-sm shadow-2xl ${
              m.isAdmin
                ? "bg-[#111] border border-white/5 text-gray-200 rounded-bl-none"
                : "bg-white text-black font-medium rounded-br-none"
            }`}>
              {m.type === "IMAGE" ? (
                <div className="p-1">
                  <img src={m.content} className="rounded-2xl max-w-full" alt="Envio de prova" />
                </div>
              ) : (
                <p className="leading-relaxed">{m.content}</p>
              )}
              <span className={`text-[8px] mt-1 block opacity-40 font-bold uppercase ${m.isAdmin ? 'text-left' : 'text-right'}`}>
                {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {preview && (
          <div className="flex justify-end animate-pulse">
            <div className="bg-white/10 p-2 rounded-3xl border border-white/5">
              <img src={preview} className="rounded-2xl max-w-[200px] opacity-40 grayscale" alt="Preview" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* INPUT AREA */}
      {!isClosed ? (
        <footer className="bg-[#0a0a0a] border-t border-white/5 px-6 py-6 backdrop-blur-xl">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <label className="p-3 bg-[#111] rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-95">
              <ImageSquare size={24} weight="duotone" />
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={(e) => e.target.files && upload(e.target.files[0])} 
              />
            </label>

            <div className="flex-1 relative flex items-center">
              <input
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  socketRef.current?.emit("otc:typing", id)
                }}
                onBlur={() => socketRef.current?.emit("otc:stop-typing", id)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Escreva para o operador..."
                className="w-full bg-[#111] border border-white/5 px-6 py-4 rounded-[2rem] outline-none text-sm placeholder:text-gray-700 focus:border-green-500/30 transition-all font-medium"
              />
            </div>

            <button
              onClick={send}
              disabled={uploading || !text.trim()}
              className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all active:scale-90 disabled:opacity-20 shadow-xl"
            >
              <PaperPlaneRight size={24} weight="fill" />
            </button>
          </div>
        </footer>
      ) : (
        <footer className="bg-[#111] p-6 text-center border-t border-white/5">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <WarningCircle size={20} weight="duotone" />
            <p className="text-xs font-black uppercase tracking-widest italic">Protocolo Encerrado</p>
          </div>
        </footer>
      )}
    </div>
  )
}