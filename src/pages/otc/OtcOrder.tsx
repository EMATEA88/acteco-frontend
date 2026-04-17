import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { 
  Clock, 
  ChatTeardropText, 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck,
  Receipt,
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
    if (!id || isNaN(id)) return
    try {
      const res = await otcService.getOrder(id)
      setOrder(res)
    } catch {
      showToast("Erro ao sincronizar dados da ordem")
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

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

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
    } catch (err: any) {
      showToast(err?.response?.data?.error || "Operação recusada pelo sistema", "error")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER FIXO PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Ordem #{order.id}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.asset.symbol} Protocol</p>
          </div>
        </div>

        {!isClosed && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/otc/orders/${order.id}`)}
              className="relative p-3 bg-white/5 rounded-2xl hover:bg-blue-500/10 hover:text-blue-400 transition-all"
            >
              <ChatTeardropText size={24} weight="duotone" />
              {order.unreadMessages && order.unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0a0a0a]">
                  {order.unreadMessages}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 pb-32 space-y-8">
        
        {/* CRONÔMETRO DE SEGURANÇA */}
        {!isClosed && order.status === "PENDING" && (
          <div className="bg-[#111] border border-orange-500/20 rounded-[2.5rem] p-8 text-center shadow-[0_0_40px_rgba(249,115,22,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${(timeLeft/900)*100}%` }}></div>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-3">Expiração do Contrato</p>
            <div className="flex justify-center items-center gap-3 text-orange-500 font-black text-4xl tracking-tighter italic">
              <Clock size={32} weight="duotone" className="animate-pulse" />
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
          </div>
        )}

        {/* DETALHES DA TRANSAÇÃO (ESTILO RECIBO) */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Receipt size={80} weight="thin" />
          </div>

          <div className="flex items-center gap-4 relative z-10 border-b border-white/5 pb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${order.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              <Coin size={28} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Operação</p>
              <p className={`text-lg font-black tracking-tighter italic ${order.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                {order.type === 'BUY' ? 'COMPRA DIRETA' : 'VENDA DE ATIVO'}
              </p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            <Detail label="Quantidade" value={`${order.quantity} ${order.asset.symbol}`} />
            <Detail label="Preço Unitário" value={`${order.priceUsed.toLocaleString()} AOA`} />
            <Detail label="Volume Total" value={`${order.totalAoa.toLocaleString()} AOA`} highlight />
            <Detail label="Status da Ordem" value={order.status} isStatus />
          </div>
        </div>

        {/* AÇÕES DE RODAPÉ */}
        {!isClosed && order.status === "PENDING" && (
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => safeAction(() => otcService.markAsPaid(order.id), "Pagamento registado. Aguarde confirmação.")}
              disabled={processing}
              className="w-full h-16 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 shadow-xl"
            >
              Confirmar Pagamento
              <CheckCircle size={24} weight="fill" />
            </button>

            <button
              onClick={() => safeAction(() => otcService.cancelOrder(order.id), "Ordem cancelada permanentemente")}
              disabled={processing}
              className="w-full h-14 rounded-2xl bg-[#1a1a1a] text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
            >
              Cancelar Transação
            </button>
          </div>
        )}

        {/* INFO DE SEGURANÇA */}
        <div className="bg-[#111]/50 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
          <ShieldCheck size={28} weight="duotone" className="text-gray-600 flex-shrink-0" />
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            O sistema de custódia EMATEA protege ambos os lados. Não marque como "Pago" sem ter realizado a transferência real para evitar sanções na conta.
          </p>
        </div>
      </main>

      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  )
}

function Detail({ label, value, highlight, isStatus }: any) {
  return (
    <div className="flex justify-between items-end pb-2 border-b border-white/5">
      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
      <span className={`font-black tracking-tight ${highlight ? 'text-xl text-green-500 italic' : isStatus ? 'text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full' : 'text-sm text-white'}`}>
        {value}
      </span>
    </div>
  )
}