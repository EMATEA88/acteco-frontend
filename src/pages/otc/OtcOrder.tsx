import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import {  
  ChatTeardropText, 
  ArrowLeft,  
  ShieldCheck,
  Coin,
} from "@phosphor-icons/react"
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
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  if (!order) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isClosed = ["RELEASED", "CANCELLED", "EXPIRED"].includes(order.status)

  const safeAction = async (fn: () => Promise<any>, msg: string) => {
    if (processing || isClosed) return
    try {
      setProcessing(true)
      await fn()
      showToast(msg, "success")
      await load()
    } catch {
      showToast("Operação falhou")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-base font-semibold">Ordem #{order.id}</h1>
            <p className="text-[10px] text-gray-500">{order.asset.symbol}</p>
          </div>
        </div>

        {!isClosed && (
          <button
            onClick={() => navigate(`/otc/orders/${order.id}`)}
            className="p-2 rounded-xl bg-white/5 border border-white/10"
          >
            <ChatTeardropText size={18} />
          </button>
        )}
      </div>

      {/* TIMER */}
      {!isClosed && order.status === "PENDING" && (
        <div className="glass-card p-4 rounded-2xl text-center">
          <p className="text-xs text-gray-500 mb-1">Expira em</p>
          <p className="text-lg font-bold text-amber-500">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </div>
      )}

      {/* DETALHES */}
      <div className="glass-card p-5 rounded-2xl space-y-4">

        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            order.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}>
            <Coin size={18}/>
          </div>

          <p className="text-sm font-semibold">
            {order.type === 'BUY' ? 'Compra' : 'Venda'}
          </p>
        </div>

        <Detail label="Quantidade" value={`${order.quantity} ${order.asset.symbol}`} />
        <Detail label="Preço" value={`${order.priceUsed.toLocaleString()} AOA`} />
        <Detail label="Total" value={`${order.totalAoa.toLocaleString()} AOA`} highlight />
        <Detail label="Status" value={order.status} />

      </div>

      {/* AÇÕES */}
      {!isClosed && order.status === "PENDING" && (
        <div className="space-y-3">

          <button
            onClick={() => safeAction(() => otcService.markAsPaid(order.id), "Pagamento confirmado")}
            disabled={processing}
            className="w-full h-12 bg-white text-black rounded-xl font-semibold"
          >
            Confirmar pagamento
          </button>

          <button
            onClick={() => safeAction(() => otcService.cancelOrder(order.id), "Cancelado")}
            disabled={processing}
            className="w-full h-11 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs"
          >
            Cancelar
          </button>

        </div>
      )}

      {/* INFO */}
      <div className="glass-card p-4 rounded-2xl flex gap-3">
        <ShieldCheck size={18} className="text-gray-500"/>
        <p className="text-xs text-gray-500">
          Não marque como pago sem transferência real.
        </p>
      </div>

      <Toast message={toastMessage} visible={toastVisible} type={toastType} />

    </div>
  )
}

function Detail({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? "text-emerald-500 font-semibold" : "font-medium"}>
        {value}
      </span>
    </div>
  )
}