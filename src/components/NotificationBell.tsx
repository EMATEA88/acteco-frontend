import { useEffect, useState, useRef } from "react"
import { api } from "../services/api"
import { Bell } from "lucide-react"

interface Notification {
  id: number
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  /* ================= FETCH UNREAD ================= */

  async function fetchUnread() {
    try {
      const { data } = await api.get("/notifications/unread-count")
      setUnread(data.unread)
    } catch {
      setUnread(0)
    }
  }

  /* ================= FETCH LIST ================= */

  async function fetchNotifications() {
    try {
      const { data } = await api.get("/notifications?limit=20")
      setNotifications(data.items)
      setUnread(data.unread)
    } catch {
      setNotifications([])
    }
  }

  /* ================= MARK AS READ ================= */

  async function markAsRead(id: number) {
    try {
      await api.patch(`/notifications/${id}/read`)
      fetchNotifications()
    } catch {}
  }

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchUnread()
  }, [])

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ================= UI ================= */

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={22} />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl border z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b font-semibold">
            Notificações
          </div>

          {notifications.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              Nenhuma notificação
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                !n.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium text-sm">
                {n.title}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {n.message}
              </div>
            </div>
          ))}

          {notifications.length > 0 && (
            <div className="p-3 text-center text-sm">
              <button
                onClick={async () => {
                  await api.patch("/notifications/read-all")
                  fetchNotifications()
                }}
                className="text-blue-600 hover:underline"
              >
                Marcar todas como lidas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}