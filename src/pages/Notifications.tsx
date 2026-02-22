import { useEffect, useState } from 'react'
import { NotificationService } from '../services/notification.service'
import {
  Info,
  Warning,
  CheckCircle,
  Bell,
} from '@phosphor-icons/react'

type Notification = {
  id: number
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'SYSTEM'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function Notifications() {

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  async function load() {
    try {
      const res = await NotificationService.list({ limit: 50 })
      setNotifications(res.items || [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  async function handleRead(notification: Notification) {

    if (notification.isRead) return

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
    } finally {
      setProcessingId(null)
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter(n => !n.isRead)

    if (unread.length === 0) return

    try {
      await Promise.all(
        unread.map(n =>
          NotificationService.markAsRead(n.id)
        )
      )

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
    } catch {
      // silencioso
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white p-6 space-y-4">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="h-20 bg-white/5 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white">

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Bell size={20} className="text-emerald-400" />
          <h1 className="text-lg font-semibold tracking-wide">
            Notificações
          </h1>

          {unreadCount > 0 && (
            <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition"
          >
            Marcar todas
          </button>
        )}

      </div>

      <div className="px-6 py-8 max-w-xl mx-auto space-y-4 pb-28">

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center text-sm text-gray-400 gap-3 py-16">
            <Bell size={32} className="opacity-40" />
            Nenhuma notificação disponível
          </div>
        )}

        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => handleRead(n)}
            className={`
              bg-white/5
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              p-5
              transition
              cursor-pointer
              hover:border-emerald-500/40
              hover:bg-white/10
              ${processingId === n.id ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className="flex items-start gap-4">

              <div className="mt-1">
                {renderIcon(n.type)}
              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between gap-3">
                  <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-300' : 'text-white'}`}>
                    {n.title}
                  </p>

                  {!n.isRead && (
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </div>

                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
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

function renderIcon(type: Notification['type']) {

  const size = 20

  switch (type) {
    case 'SUCCESS':
      return (
        <CheckCircle
          size={size}
          weight="fill"
          className="text-emerald-500"
        />
      )

    case 'WARNING':
      return (
        <Warning
          size={size}
          weight="fill"
          className="text-yellow-500"
        />
      )

    case 'SYSTEM':
      return (
        <Bell
          size={size}
          weight="fill"
          className="text-blue-500"
        />
      )

    default:
      return (
        <Info
          size={size}
          weight="fill"
          className="text-gray-400"
        />
      )
  }
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString()
  } catch {
    return ''
  }
}