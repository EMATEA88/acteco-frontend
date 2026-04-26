import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcChat } from "../../services/otcChat"
import { getSocket } from "../../services/socket" 
// CORREÇÃO DOS IMPORTS (Removido o espaço e chaves extras que causavam o erro)
import {   
  ImageSquare, 
  ArrowLeft, 
  PaperPlaneRight, 
  ShieldCheck,
  Check,
} from "@phosphor-icons/react"

export default function OtcChat() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const id = Number(orderId)

  const [messages, setMessages] = useState<any[]>([])
  const [status, setStatus] = useState("")
  const [typing, setTyping] = useState(false)
  const [online, setOnline] = useState(false) 
  const [text, setText] = useState("")
  const [uploading, setUploading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isClosed = ["RELEASED", "CANCELLED", "EXPIRED"].includes(status)

  useEffect(() => {
    async function load() {
      try {
        const data = await otcChat.get(id)
        if (!data) return
        setMessages(data?.conversation?.messages ?? [])
        setStatus(data?.status ?? "")
      } catch (err) { 
        console.error("Erro ao carregar chat", err) 
      }
    }
    if (id && !isNaN(id)) load()
  }, [id])

  useEffect(() => {
    if (!id || isNaN(id)) return

    const socket = getSocket()
    if (!socket) return
    socketRef.current = socket

    socket.emit("otc:join", id)
    socket.emit("otc:request-presence", id)
    socket.emit("otc:read", id)

    const onMessage = (msg: any) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
      socket.emit("otc:read", id)
    }

    const onStatus = (data: any) => {
      if (Number(data.orderId) === id) setStatus(data.status)
    }

    const onPresence = (data: { userId: number, isOnline: boolean }) => {
      setOnline(data.isOnline)
    }

    const onRead = () => {
      setMessages(prev => prev.map(m => ({ ...m, readAt: m.readAt || new Date() })))
    }

    socket.on("otc:new-message", onMessage)
    socket.on("otc:status-update", onStatus)
    socket.on("otc:typing", () => setTyping(true))
    socket.on("otc:stop-typing", () => setTyping(false))
    socket.on("presence:update", onPresence)
    socket.on("otc:messages-read", onRead)

    return () => {
      socket.off("otc:new-message", onMessage)
      socket.off("otc:status-update", onStatus)
      socket.off("otc:typing")
      socket.off("otc:stop-typing")
      socket.off("presence:update", onPresence)
      socket.off("otc:messages-read", onRead)
    }
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!text.trim() || isClosed) return
    const messageContent = text.trim()
    
    try {
      socketRef.current?.emit("otc:message", { 
        orderId: id, 
        message: messageContent 
      })
      socketRef.current?.emit("otc:stop-typing", id)
      setText("")
    } catch (err) {
      console.error("Falha ao enviar", err)
    }
  }

  const handleTyping = (val: string) => {
    setText(val)
    if (!socketRef.current) return
    socketRef.current.emit("otc:typing", id)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("otc:stop-typing", id)
    }, 2000)
  }

  const upload = async (file: File) => {
    if (!file || isClosed) return
    try {
      setUploading(true)
      await otcChat.uploadImage(id, file)
    } catch (err) { console.error(err) } finally { setUploading(false) }
  }

  const statusMap: any = {
    PENDING: { label: "Aguardando Pagamento", color: "text-yellow-500 bg-yellow-500/10" },
    PAID: { label: "Pago - Verificando", color: "text-blue-500 bg-blue-500/10" },
    RELEASED: { label: "Ordem Concluída", color: "text-emerald-500 bg-emerald-500/10" },
    CANCELLED: { label: "Cancelada", color: "text-red-500 bg-red-500/10" },
  }

  return (
    <div className="fixed inset-0 h-[100dvh] flex flex-col bg-[#0B0E11] text-[#EAECEF] overflow-hidden">
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 bg-[#181A20] border-b border-[#2B3139] z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:text-yellow-500">
            <ArrowLeft size={22} weight="bold" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-500/20 bg-[#1e2329] flex items-center justify-center overflow-hidden">
                <img src="/logo.png" className="w-full h-full object-cover" alt="Logo" />
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#181A20] transition-colors duration-500 ${online ? 'bg-[#02C076]' : 'bg-gray-600'}`} />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Suporte OTC</h1>
              <div className="text-[10px] font-medium tracking-wide uppercase">
                {typing ? (
                  <span className="text-[#02C076] animate-pulse">Digitando...</span>
                ) : (
                  <span className={online ? "text-[#02C076]" : "text-[#848E9C]"}>
                    {online ? 'Online' : 'Offline'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex px-2.5 py-1 rounded text-[11px] font-bold ${statusMap[status]?.color || 'bg-white/5'}`}>
            {statusMap[status]?.label || status || "CARREGANDO..."}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#0B0E11] p-4 space-y-6 scroll-smooth custom-scrollbar">
        <div className="mx-auto max-w-2xl bg-[#1E2329] border border-[#2B3139] p-3 rounded-lg flex items-start gap-3">
          <ShieldCheck size={20} className="text-[#02C076] shrink-0" weight="fill" />
          <p className="text-[11px] text-[#848E9C] leading-relaxed">
            <strong className="text-[#EAECEF]">Segurança:</strong> Transação protegida por custódia inteligente. O suporte está monitorando esta negociação.
          </p>
        </div>

        {messages.map((m) => {
          const isMe = !m.isAdmin;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}>
              <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 text-[13px] leading-relaxed shadow-sm
                  ${isMe 
                    ? "bg-[#FCD535] text-[#181A20] rounded-2xl rounded-tr-none font-medium" 
                    : "bg-[#2B3139] text-[#EAECEF] rounded-2xl rounded-tl-none"}
                `}>
                  {m.type === "IMAGE" ? (
                    <img src={m.content} className="rounded-lg max-w-full" alt="Evidência" />
                  ) : m.content}
                </div>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[9px] text-[#848E9C]">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <div className="flex items-center">
                      <Check size={10} weight="bold" className={m.readAt ? "text-blue-500" : "text-[#848E9C]"} />
                      {m.readAt && <Check size={10} weight="bold" className="text-blue-500 -ml-1.5" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      <div className="px-4 py-4 bg-[#0B0E11] flex-shrink-0 border-t border-white/5">
        <div className="max-w-4xl mx-auto relative flex items-center gap-2 bg-[#1E2329] border border-[#2B3139] rounded-xl px-3 py-1.5 focus-within:border-yellow-500 transition-all">
          <label className="p-2 text-[#848E9C] hover:text-white cursor-pointer">
            <ImageSquare size={24} />
            <input type="file" hidden accept="image/*" onChange={(e) => e.target.files && upload(e.target.files[0])} />
          </label>

          <input
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={isClosed ? "Chat encerrado" : "Digite aqui..."}
            disabled={isClosed}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#EAECEF] py-2"
          />

          <button onClick={send} disabled={!text.trim() || uploading || isClosed} className="p-2 text-yellow-500 disabled:text-[#474D57]">
            <PaperPlaneRight size={24} weight="fill" />
          </button>
        </div>
      </div>

      {uploading && (
        <div className="absolute inset-0 bg-[#0B0E11]/80 backdrop-blur-sm z-[200] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-[10px] font-bold text-yellow-500 uppercase">Enviando...</p>
        </div>
      )}
    </div>
  )
}