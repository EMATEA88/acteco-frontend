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

  async function load() {
    try {
      const res = await NotificationService.list({ limit: 50 })
      setNotifications(res.items)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        A carregar notificações…
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center text-center text-sm text-gray-500 gap-2">
        <Bell size={28} className="text-gray-400" />
        Nenhuma notificação disponível
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3 pb-28">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`
            rounded-2xl p-4 shadow-sm border transition
            ${
              n.isRead
                ? 'bg-white border-gray-200'
                : 'bg-emerald-50 border-emerald-200'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {/* ICON */}
            <div className="mt-0.5">
              {renderIcon(n.type)}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {n.title}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {n.message}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {formatDate(n.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* =========================
   HELPERS
========================= */

function renderIcon(type: Notification['type']) {
  const size = 20

  switch (type) {
    case 'SUCCESS':
      return (
        <CheckCircle
          size={size}
          weight="fill"
          className="text-emerald-600"
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
          className="text-blue-600"
        />
      )

    default:
      return (
        <Info
          size={size}
          weight="fill"
          className="text-gray-500"
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
