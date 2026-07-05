import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import toast from "react-hot-toast"
import { NotificationService } from "../services/notification.service"
import type { ReactNode } from "react"

interface NotificationContextType {
  unread: number
  refresh: () => Promise<void>
  reset: () => void
}

const NotificationContext =
  createContext<NotificationContextType | null>(null)

export function NotificationProvider({
  children
}: {
  children: ReactNode
}) {

  const [unread, setUnread] = useState(0)

  async function refresh() {
    try {
      const data = await NotificationService.list()
      setUnread(data.unread ?? 0)
    } catch {
      setUnread(0)
    }
  }

  function reset() {
    setUnread(0)
  }

  useEffect(() => {
    refresh().catch(() => {
      toast.error("Erro ao carregar notificações")
    })
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        unread,
        refresh,
        reset
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    )
  }

  return context
}