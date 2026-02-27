import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationService } from "../services/notification.service"
import { connectSocket } from "../services/socket"
import {
  Info,
  Warning,
  CheckCircle,
  Bell,
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

/* ================= COMPONENT ================= */

export default function Notifications() {

  const { reset } = useNotification()   // ✅ AGORA ESTÁ NO LUGAR CERTO
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [toast, setToast] = useState<Toast | null>(null)

  /* ================= LOAD ================= */

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

  /* ================= INIT ================= */

  useEffect(() => {
    reset()        // limpa contador global
    load()
  }, [])

  /* ================= SOCKET ================= */

  useEffect(() => {

    const token = localStorage.getItem("token")
    if (!token) return

    const socket = connectSocket(token)

    const handler = (data: Toast) => {
      setToast(data)
      load()

      setTimeout(() => {
        setToast(null)
      }, 4000)
    }

    socket.on("notification:new", handler)

    return () => {
      socket.off("notification:new", handler)
    }

  }, [])

  /* ================= READ ================= */

  async function handleRead(notification: Notification) {

    if (!notification.isRead) {
      try {
        setProcessingId(notification.id)

        await NotificationService.markAsRead(notification.id)

        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id
              ? { ...n, isRead: true }
              : n
          )
        )

        setUnreadCount(prev => Math.max(prev - 1, 0))

      } finally {
        setProcessingId(null)
      }
    }

    if (notification.orderId) {
      navigate(`/otc/${notification.orderId}`)
    }
  }

  async function markAllAsRead() {

    if (unreadCount === 0) return

    try {
      await NotificationService.markAllAsRead()

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )

      setUnreadCount(0)

    } catch {}
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white p-6 space-y-4">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="h-20 bg-white/5 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">

      {toast && (
        <div
          onClick={() => {
            setToast(null)
            if (toast.orderId) navigate(`/otc/${toast.orderId}`)
          }}
          className="fixed top-6 right-6 z-[9999] bg-[#111827] border border-emerald-500/40 shadow-2xl rounded-2xl p-4 w-80 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <Bell size={20} className="text-emerald-400 mt-1" />
            <div>
              <p className="font-semibold text-sm">{toast.title}</p>
              <p className="text-xs text-gray-400 mt-1">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Bell size={20} className="text-emerald-400" />
          <h1 className="text-lg font-semibold">Notificações</h1>

          {unreadCount > 0 && (
            <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            Marcar todas
          </button>
        )}

      </div>

      <div className="px-6 py-8 max-w-xl mx-auto space-y-4 pb-28">

        {notifications.length === 0 && (
          <div className="flex flex-col items-center text-sm text-gray-400 gap-3 py-16">
            <Bell size={32} className="opacity-40" />
            Nenhuma notificação disponível
          </div>
        )}

        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => handleRead(n)}
            className={`
              bg-white/5 border border-white/10 rounded-2xl p-5
              hover:border-emerald-500/40 hover:bg-white/10
              transition cursor-pointer
              ${processingId === n.id ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <div className="flex items-start gap-4">

              <div className="mt-1">
                {renderIcon(n.type)}
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between gap-3">
                  <p className={`text-sm font-semibold ${n.isRead ? "text-gray-300" : "text-white"}`}>
                    {n.title}
                  </p>

                  {!n.isRead && (
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  {n.message}
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  {formatDate(n.createdAt)}
                </p>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

/* ================= HELPERS ================= */

function renderIcon(type: Notification["type"]) {

  const size = 20

  switch (type) {
    case "SUCCESS":
      return <CheckCircle size={size} weight="fill" className="text-emerald-500" />
    case "WARNING":
      return <Warning size={size} weight="fill" className="text-yellow-500" />
    case "SYSTEM":
      return <Bell size={size} weight="fill" className="text-blue-500" />
    default:
      return <Info size={size} weight="fill" className="text-gray-400" />
  }
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString()
  } catch {
    return ""
  }
}