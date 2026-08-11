import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationService } from "../services/notification.service"
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
    if (notification.orderId) navigate(`/otc/order/${notification.orderId}`)
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
      <div className="min-h-screen bg-[#0a2533] p-6 space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-[#0e364a] border border-cyan-500/10 rounded-[2rem] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">
      
      {/* TOAST DINÂMICO ESTILO iOS */}
      {toast && (
        <div
          onClick={() => {
            setToast(null)
            if (toast.orderId) navigate(`/otc/order/${toast.orderId}`)
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#0e364a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 rounded-3xl p-5 w-[90%] max-w-sm cursor-pointer animate-in slide-in-from-top-10 font-mono"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-950/30">
              <Bell size={20} weight="fill" className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black text-sm tracking-tight text-white">{toast.title}</p>
              <p className="text-xs text-cyan-200/70 line-clamp-1">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a2533]/90 backdrop-blur-xl border-b border-cyan-500/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-[#0e364a] border border-cyan-500/20 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Alertas</h1>
            {unreadCount > 0 && (
              <span className="bg-cyan-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-[10px] font-black font-mono uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <Checks size={18} />
            Ler Tudo
          </button>
        )}
      </header>

      <main className="px-6 py-8 max-w-xl mx-auto space-y-4 pb-32">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 opacity-40 font-mono">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-500/30 bg-[#0e364a]/30 flex items-center justify-center mb-4 text-cyan-400">
              <Bell size={32} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest italic text-cyan-200/70">Nenhuma nova mensagem</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleRead(n)}
              className={`
                relative bg-[#0e364a] border rounded-[2rem] p-6 font-mono
                transition-all cursor-pointer group active:scale-[0.98] shadow-xl shadow-cyan-950/20
                ${n.isRead ? "border-cyan-500/10 opacity-60 bg-[#0e364a]/50" : "border-cyan-500/30 hover:border-cyan-400/50"}
                ${processingId === n.id ? "opacity-30 pointer-events-none" : ""}
              `}
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/20 ${n.isRead ? 'bg-[#0a2533]' : 'bg-cyan-500/10'}`}>
                  {renderIcon(n.type, n.isRead)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-black tracking-tight ${n.isRead ? "text-cyan-200/60" : "text-white"}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <Circle size={10} weight="fill" className="text-cyan-400 animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-cyan-200/70 leading-relaxed font-medium">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-1.5 pt-3 opacity-60">
                    <Clock size={12} className="text-cyan-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-200/80">
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
      <footer className="fixed bottom-10 left-0 w-full text-center opacity-40 pointer-events-none font-mono">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-cyan-300">Secure Notification Bridge</p>
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
      return <CheckCircle size={size} weight={weight} className={isRead ? "text-cyan-200/30" : "text-cyan-400"} />
    case "WARNING":
      return <WarningOctagon size={size} weight={weight} className={isRead ? "text-cyan-200/30" : "text-amber-400"} />
    case "SYSTEM":
      return <Bell size={size} weight={weight} className={isRead ? "text-cyan-200/30" : "text-cyan-300"} />
    default:
      return <Info size={size} weight={weight} className={isRead ? "text-cyan-200/30" : "text-cyan-200"} />
  }
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
  } catch {
    return ""
  }
}