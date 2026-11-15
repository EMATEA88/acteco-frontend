import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationService } from "../services/notification.service"
import {
  Info,
  CheckCircle,
  Bell,
  WarningOctagon,
  Clock,
  ArrowRight,
  BellSlash,
  ArrowClockwise,
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

export default function Notifications() {
  const { reset } = useNotification()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [actionError, setActionError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const res = await NotificationService.list({ limit: 50 })
      setNotifications(res.items || [])
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reset()
    void load()
  }, [reset, load])

  async function handleRead(notification: Notification) {
    setActionError("")

    if (!notification.isRead) {
      try {
        setProcessingId(notification.id)
        await NotificationService.markAsRead(notification.id)

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item
          )
        )
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error)
        setActionError("Não foi possível atualizar a notificação. Tente novamente.")
        return
      } finally {
        setProcessingId(null)
      }
    }

    if (notification.orderId) {
      navigate(`/otc/order/${notification.orderId}`)
    }
  }


  return (
    <div className="min-h-screen w-full bg-[#0a2533] text-[#e0f2fe] font-sans antialiased">
      <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-6">
        {actionError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
          >
            {actionError}
          </div>
        )}

        {loading ? (
          <div className="space-y-3" aria-label="A carregar notificações">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex min-h-28 animate-pulse items-start gap-4 rounded-xl border border-cyan-500/10 bg-[#0e364a] p-5"
              >
                <div className="h-11 w-11 shrink-0 rounded-lg bg-[#18506a]" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="h-4 w-2/5 rounded bg-[#18506a]" />
                  <div className="h-3 w-full rounded bg-[#18506a]/80" />
                  <div className="h-3 w-1/4 rounded bg-[#18506a]/70" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <section className="rounded-xl border border-cyan-500/15 bg-[#0e364a] px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-500/20 bg-[#0a2533] text-cyan-300">
              <Bell size={27} weight="regular" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Não foi possível carregar
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-cyan-100/65">
              Ocorreu um problema ao consultar as notificações. Verifique a ligação e tente novamente.
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500"
            >
              <ArrowClockwise size={17} weight="bold" />
              Tentar novamente
            </button>
          </section>
        ) : notifications.length === 0 ? (
          <section className="rounded-xl border border-cyan-500/15 bg-[#0e364a] px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-500/20 bg-[#0a2533] text-cyan-300">
              <BellSlash size={27} weight="regular" />
            </div>
            <h2 className="text-base font-semibold text-white">
              Não existem notificações
            </h2>
            <p className="mt-2 text-sm text-cyan-100/60">
              Quando houver novidades na sua conta, serão apresentadas aqui.
            </p>
          </section>
        ) : (
          <section aria-label="Lista de notificações">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300/80">
                Todas as Notificações
              </h2>
              <span className="text-xs tabular-nums text-cyan-100/45">
                {notifications.length} {notifications.length === 1 ? "registo" : "registos"}
              </span>
            </div>

            <div className="divide-y divide-cyan-500/10 overflow-hidden rounded-xl border border-cyan-500/15 bg-[#0e364a]">
              {notifications.map((notification) => {
                const meta = getNotificationMeta(notification.type)
                const isProcessing = processingId === notification.id

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleRead(notification)}
                    disabled={isProcessing}
                    className={`group flex w-full items-start gap-4 px-4 py-5 text-left transition-colors hover:bg-[#124158]/70 disabled:cursor-wait disabled:opacity-60 sm:px-5 ${
                      notification.isRead ? "bg-[#0e364a]" : "bg-[#103b50]"
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${meta.iconContainer}`}
                    >
                      {renderIcon(notification.type)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <span
                          className={`text-sm font-semibold leading-5 ${
                            notification.isRead ? "text-cyan-100/70" : "text-white"
                          }`}
                        >
                          {notification.title}
                        </span>

                        {!notification.isRead && (
                          <span className="inline-flex items-center rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                            Não lida
                          </span>
                        )}
                      </span>

                      <span className="mt-1.5 block text-sm leading-6 text-cyan-100/70">
                        {notification.message}
                      </span>

                      <span className="mt-3 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-cyan-100/45">
                          <Clock size={14} weight="regular" />
                          {formatDate(notification.createdAt)}
                        </span>

                        {notification.orderId && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 opacity-80 transition-opacity group-hover:opacity-100">
                            Ver operação
                            <ArrowRight size={14} weight="bold" />
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

/* ================= HELPERS ================= */

function getNotificationMeta(type: Notification["type"]) {
  switch (type) {
    case "SUCCESS":
      return {
        iconContainer: "border-emerald-500/20 bg-emerald-500/10",
      }
    case "WARNING":
      return {
        iconContainer: "border-amber-500/20 bg-amber-500/10",
      }
    case "SYSTEM":
      return {
        iconContainer: "border-cyan-500/20 bg-cyan-500/10",
      }
    default:
      return {
        iconContainer: "border-sky-500/20 bg-sky-500/10",
      }
  }
}

function renderIcon(type: Notification["type"]) {
  const size = 22

  switch (type) {
    case "SUCCESS":
      return <CheckCircle size={size} weight="regular" className="text-emerald-400" />
    case "WARNING":
      return <WarningOctagon size={size} weight="regular" className="text-amber-400" />
    case "SYSTEM":
      return <Bell size={size} weight="regular" className="text-cyan-300" />
    default:
      return <Info size={size} weight="regular" className="text-sky-300" />
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data indisponível"
  }

  return new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
}
