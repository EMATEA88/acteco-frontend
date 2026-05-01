import { useEffect, useState, useCallback, useMemo } from "react"
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
  status: "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "EXPIRED" | "DISPUTED"
  quantity: number
  priceUsed: number
  totalAoa: number
  completedAt?: string
  unreadMessages?: number
  asset?: { symbol: string }
}

function money(v: any) {
  return Number(v || 0).toLocaleString('pt-AO')
}

export default function OtcOrder() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const id = Number(orderId)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [toastMessage, setToastMessage] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState<"success" | "error">("error")

  const showToast = (msg: string, type: "success" | "error" = "error") => {
    setToastMessage(msg)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  // ✅ MELHORIA #1: MAPEAMENTO DE CORES PROFISSIONAL
  const statusConfig = useMemo(() => {
    if (!order) return { color: "gray", label: "..." }
    
    const configs: Record<string, { color: string; label: string }> = {
      PENDING: { color: "amber", label: "Pendente" },
      PAID: { color: "blue", label: "Pago" },
      COMPLETED: { color: "emerald", label: "Concluído" },
      CANCELLED: { color: "red", label: "Cancelado" },
      EXPIRED: { color: "gray", label: "Expirado" },
      DISPUTED: { color: "orange", label: "Em Disputa" }
    }
    
    return configs[order.status] || { color: "gray", label: order.status }
  }, [order])

  const isClosed = useMemo(() => 
    order ? ["COMPLETED", "CANCELLED", "EXPIRED"].includes(order.status) : false
  , [order])

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

  // ✅ MELHORIA #2: POLLING CONTROLADO (Para se estiver fechada)
  useEffect(() => {
    load()
    if (isClosed) return

    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [load, isClosed])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  if (!order) return null

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
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {order.asset?.symbol || "USDT"} • Mercado OTC
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/otc/chat/${order.id}`)}
          className="relative p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 transition-all active:scale-90"
        >
          <ChatTeardropText size={18} weight="fill" />
          {Number(order.unreadMessages) > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-bold">
              {order.unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* DETALHES DA ORDEM */}
      <div className="bg-[#161A1F] p-6 rounded-2xl border border-white/5 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              order.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
            }`}>
              <Coin size={20} weight="fill" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Tipo</p>
              <p className="text-sm font-bold uppercase">{order.type === 'BUY' ? 'Compra' : 'Venda'}</p>
            </div>
          </div>

          <div className="text-right">
            {/* ✅ CORREÇÃO VISUAL DINÂMICA */}
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border border-${statusConfig.color}-500/20 bg-${statusConfig.color}-500/10 text-${statusConfig.color}-500`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Detail label="Quantidade" value={`${order.quantity} ${order.asset?.symbol || "USDT"}`} />
          <Detail label="Cotação" value={`${money(order.priceUsed)} AOA`} />
          <Detail label="Total" value={`${money(order.totalAoa)} AOA`} highlight />
        </div>

        {/* ✅ FEEDBACK DE SUCESSO OU ESPERA */}
        {order.status === "PAID" && (
          <div className="pt-2">
            <p className="text-[11px] text-blue-400 text-center font-medium bg-blue-500/5 py-2 rounded-lg border border-blue-500/10">
              Aguardando aprovação da administração...
            </p>
          </div>
        )}

        {order.status === "COMPLETED" && (
          <div className="pt-2">
            <p className="text-[11px] text-emerald-500 text-center font-bold bg-emerald-500/5 py-2 rounded-lg border border-emerald-500/10">
              Ordem concluída com sucesso!
            </p>
          </div>
        )}
      </div>

      {/* AÇÕES (Bloqueadas se closed ou processing) */}
      {!isClosed && order.status === "PENDING" && (
        <div className="space-y-3">
          <button
            onClick={() => {
              const action = order.type === "BUY" ? otcService.markAsPaid : otcService.markSellPaid;
              safeAction(() => action(order.id), "Enviado para análise")
            }}
            disabled={processing || isClosed}
            className="w-full h-14 bg-white text-black rounded-2xl font-black text-sm active:scale-95 transition-all shadow-xl disabled:opacity-50"
          >
            {processing ? "Processando..." : order.type === "BUY" ? "Já realizei o pagamento" : "Já enviei o ativo"}
          </button>

          <button
            onClick={() => safeAction(() => otcService.cancelOrder(order.id), "Ordem cancelada")}
            disabled={processing || isClosed}
            className="w-full h-12 bg-transparent border border-white/10 rounded-2xl text-gray-500 text-[10px] font-black uppercase tracking-widest active:bg-white/5 transition-all disabled:opacity-30"
          >
            Cancelar operação
          </button>
        </div>
      )}

      {/* INFO FOOTER */}
      <div className="bg-white/5 p-4 rounded-2xl flex gap-3 border border-white/5">
        <ShieldCheck size={20} className="text-gray-500 shrink-0"/>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Proteção Escrow ativa. Os ativos estão retidos com segurança até a confirmação de ambas as partes.
        </p>
      </div>

      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  )
}

function Detail({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">{label}</span>
      <span className={`text-sm ${highlight ? "text-emerald-500 font-black" : "text-white font-bold"}`}>
        {value}
      </span>
    </div>
  )
}