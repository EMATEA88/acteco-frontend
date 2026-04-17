import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationService } from "../services/notification.service"
import { connectSocket } from "../services/socket"
import {
  Info,
  CheckCircle,
  Bell,
  ArrowLeft,
  Circle,
  Checks,
  WarningOctagon,
  Clock
} from "@phosphor-icons/react"
import { useNotification } from "../contexts/NotificationContext"

/* ================= TYPES ================= */

type Notification = {
  id: number
  type: "INFO" | "WARNING" | "SUCCESS" | "SYSTEM"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  orderId?: number
}

type Toast = {
  title: string
  message: string
  orderId?: number
}

export default function Notifications() {
  const { reset } = useNotification()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [toast, setToast] = useState<Toast | null>(null)

  async function load() {
    try {
      const res = await NotificationService.list({ limit: 50 })
      setNotifications(res.items || [])
      setUnreadCount(res.unread || 0)
    } catch {
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reset()
    load()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const socket = connectSocket(token)
    const handler = (data: Toast) => {
      setToast(data)
      load()
      setTimeout(() => setToast(null), 4000)
    }

    socket.on("notification:new", handler)
    return () => { socket.off("notification:new", handler) }
  }, [])

  async function handleRead(notification: Notification) {
    if (!notification.isRead) {
      try {
        setProcessingId(notification.id)
        await NotificationService.markAsRead(notification.id)
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(prev - 1, 0))
      } finally {
        setProcessingId(null)
      }
    }
    if (notification.orderId) navigate(`/otc/${notification.orderId}`)
  }

  async function markAllAsRead() {
    if (unreadCount === 0) return
    try {
      await NotificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-6 space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* TOAST DINÂMICO ESTILO iOS */}
      {toast && (
        <div
          onClick={() => {
            setToast(null)
            if (toast.orderId) navigate(`/otc/${toast.orderId}`)
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#111]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 w-[90%] max-w-sm cursor-pointer animate-in slide-in-from-top-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Bell size={20} weight="fill" className="text-black" />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight">{toast.title}</p>
              <p className="text-xs text-gray-400 line-clamp-1">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter uppercase">Alertas</h1>
            {unreadCount > 0 && (
              <span className="bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-500 hover:text-green-400 transition-colors"
          >
            <Checks size={18} />
            Ler Tudo
          </button>
        )}
      </header>

      <main className="px-6 py-8 max-w-xl mx-auto space-y-4 pb-32">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 opacity-20">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center mb-4">
              <Bell size={32} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest italic">Nenhuma nova mensagem</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleRead(n)}
              className={`
                relative bg-[#111] border rounded-[2rem] p-6
                transition-all cursor-pointer group active:scale-[0.98]
                ${n.isRead ? "border-white/5 opacity-60" : "border-green-500/20 shadow-lg shadow-green-500/5"}
                ${processingId === n.id ? "opacity-30 pointer-events-none" : ""}
              `}
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-[#0a0a0a]' : 'bg-green-500/10'}`}>
                  {renderIcon(n.type, n.isRead)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-black tracking-tight ${n.isRead ? "text-gray-400" : "text-white"}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <Circle size={10} weight="fill" className="text-green-500 animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-1.5 pt-3 opacity-40">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-10 left-0 w-full text-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">Secure Notification Bridge</p>
      </footer>
    </div>
  )
}

/* ================= HELPERS ================= */

function renderIcon(type: Notification["type"], isRead: boolean) {
  const size = 28
  const weight = isRead ? "light" : "duotone"

  switch (type) {
    case "SUCCESS":
      return <CheckCircle size={size} weight={weight} className={isRead ? "text-gray-600" : "text-green-500"} />
    case "WARNING":
      return <WarningOctagon size={size} weight={weight} className={isRead ? "text-gray-600" : "text-orange-500"} />
    case "SYSTEM":
      return <Bell size={size} weight={weight} className={isRead ? "text-gray-600" : "text-blue-500"} />
    default:
      return <Info size={size} weight={weight} className={isRead ? "text-gray-600" : "text-gray-400"} />
  }
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
  } catch {
    return ""
  }
}