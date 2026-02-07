import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { NotificationService } from '../services/notification.service'

type Notification = {
  id: number
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'SYSTEM'
  isRead: boolean
}

const POLL_INTERVAL = 30000

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [hasSystem, setHasSystem] = useState(false)
  const isOnline = useRef(true)

  async function load() {
    if (!isOnline.current) return

    try {
      const response = await NotificationService.list({ limit: 10 })

      const items: Notification[] = response.items

      const unread = items.filter(n => !n.isRead)

      setUnreadCount(unread.length)

      const systemUnread = unread.some(n => n.type === 'SYSTEM')

      setHasSystem(systemUnread)
    } catch {
      isOnline.current = false
      setUnreadCount(0)
      setHasSystem(false)
    }
  }

  useEffect(() => {
    load()

    const interval = setInterval(load, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Bell
        size={22}
        className={`
          transition
          ${
            hasSystem
              ? 'text-red-600 animate-pulse'
              : 'text-gray-700'
          }
        `}
      />

      {unreadCount > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            bg-red-600 text-white text-xs
            w-5 h-5 rounded-full
            flex items-center justify-center
          "
        >
          {unreadCount}
        </span>
      )}
    </div>
  )
}
