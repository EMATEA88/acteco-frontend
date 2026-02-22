import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { Clock, MessageCircle } from "lucide-react"
import Toast from "../../components/ui/Toast"

interface Order {
  id: number
  type: "BUY" | "SELL"
  status: string
  quantity: number
  priceUsed: number
  totalAoa: number
  expiresAt: string
  unreadMessages?: number
  asset: { symbol: string }
}

export default function OtcOrder() {

  const { orderId } = useParams()
  const navigate = useNavigate()
  const id = Number(orderId)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  const [toastMessage, setToastMessage] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState<"success" | "error">("error")

  const showToast = (msg: string, type: "success" | "error" = "error") => {
    setToastMessage(msg)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  const load = useCallback(async () => {
    if (!id || isNaN(id)) return

    try {
      const res = await otcService.getOrder(id)
      setOrder(res)
    } catch {
      showToast("Erro ao carregar ordem")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    if (!order?.expiresAt) return

    const timer = setInterval(() => {
      const diff = new Date(order.expiresAt).getTime() - Date.now()
      setTimeLeft(diff > 0 ? Math.floor(diff / 1000) : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [order?.expiresAt])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Carregando...
      </div>
    )
  }

  if (!order) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const isClosed =
    ["RELEASED", "CANCELLED", "EXPIRED"].includes(order.status)

  const safeAction = async (
    fn: () => Promise<any>,
    msg: string
  ) => {
    if (processing || isClosed) return

    try {
      setProcessing(true)
      await fn()
      showToast(msg, "success")
      await load()
    } catch (err: any) {
      showToast(
        err?.response?.data?.error || "Erro na operação",
        "error"
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white">

        {/* HEADER FIXO */}
        <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-4 py-3 flex justify-between items-center">

          <div>
            <p className="text-sm font-semibold">
              Ordem #{order.id}
            </p>
            <p className="text-xs text-gray-400">
              {order.asset.symbol}
            </p>
          </div>

          {!isClosed && (
            <div className="flex items-center gap-2">

              {order.status === "PENDING" && (
                <>
                  <TopButton
                    color="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() =>
                      safeAction(
                        () => otcService.markAsPaid(order.id),
                        "Pagamento marcado com sucesso"
                      )
                    }
                    disabled={processing}
                  >
                    Pago
                  </TopButton>

                  <TopButton
                    color="bg-red-600 hover:bg-red-700"
                    onClick={() =>
                      safeAction(
                        () => otcService.cancelOrder(order.id),
                        "Ordem cancelada"
                      )
                    }
                    disabled={processing}
                  >
                    Cancelar
                  </TopButton>
                </>
              )}

              {/* CHAT CORRIGIDO */}
              <button
                onClick={() => navigate(`/otc/orders/${order.id}`)}
                className="relative bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-xl transition"
              >
                <MessageCircle size={16} />

                {order.unreadMessages &&
                  order.unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {order.unreadMessages}
                    </span>
                  )}
              </button>

            </div>
          )}
        </div>

        <div className="px-6 py-8 max-w-xl mx-auto space-y-8">

          {!isClosed && order.status === "PENDING" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center shadow-xl">
              <p className="text-sm text-gray-400 mb-2">
                Tempo restante
              </p>
              <div className="flex justify-center items-center gap-2 text-red-500 font-bold text-2xl">
                <Clock size={20} />
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <Detail label="Tipo" value={order.type} />
            <Detail label="Quantidade" value={order.quantity} />
            <Detail label="Preço" value={`${order.priceUsed} AOA`} />
            <Detail label="Total" value={`${order.totalAoa} AOA`} />
          </div>

        </div>
      </div>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
      />
    </>
  )
}

function TopButton({
  children,
  onClick,
  color,
  disabled,
}: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        text-xs px-3 py-2 rounded-xl font-medium text-white transition
        ${color}
        ${disabled ? "opacity-40 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  )
}

function Detail({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm border-b border-white/5 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}