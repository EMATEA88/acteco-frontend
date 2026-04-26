import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { 
  ArrowLeft, 
  Receipt, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldCheck,
} from "@phosphor-icons/react"

interface Order {
  id: number
  type: "BUY" | "SELL"
  status: string
  totalAoa: number
  asset: {
    symbol: string
  }
  createdAt: string
}

const STATUS_LIST = [
  { id: "ALL", label: "Todas" },
  { id: "PENDING", label: "Pendentes" },
  { id: "PAID", label: "Pagas" },
  { id: "COMPLETED", label: "Concluídas" }, // 🟢 Atualizado de RELEASED para COMPLETED
  { id: "CANCELLED", label: "Canceladas" },
]

export default function OtcMyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState("ALL")

  const load = async () => {
    try {
      const data = await otcService.myOrders() as Order[];
      setOrders(data);
    } catch {
      setOrders([])
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  // 🟢 Mantendo ordens PENDING e PAID como ativas para o contador
  const activeCount = orders.filter(o => 
    o.status === "PENDING" || o.status === "PAID"
  ).length

  const filtered = orders.filter(o => {
    if (filter === "ALL") return true
    return o.status === filter
  })

  const getStatusMeta = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Aguardando", color: "text-amber-500", icon: <Clock size={14} /> }
      case "PAID":
        return { label: "Pago/Em Análise", color: "text-blue-400", icon: <ShieldCheck size={14} /> }
      case "COMPLETED": // 🟢 Unificado para COMPLETED
        return { label: "Concluída", color: "text-emerald-500", icon: <CheckCircle size={14} /> }
      case "CANCELLED":
        return { label: "Cancelada", color: "text-red-500", icon: <XCircle size={14} /> }
      default:
        return { label: status, color: "text-white", icon: <Receipt size={14} /> }
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white/5 border border-white/10 active:scale-90 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-lg font-semibold tracking-tight">Minhas Ordens</h1>
        </div>

        <div className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 uppercase font-bold tracking-widest">
          Ativas: <span className="text-emerald-500">{activeCount}</span>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 overflow-x-auto mb-6 no-scrollbar pb-2">
        {STATUS_LIST.map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`
              px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl border transition-all whitespace-nowrap
              ${filter === item.id
                ? "bg-white text-black border-white shadow-lg shadow-white/5"
                : "bg-[#161A1F] text-gray-500 border-white/5 hover:border-white/20"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* LISTA DE ORDENS */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-20 flex flex-col items-center gap-3">
            <Receipt size={40} weight="thin" />
            <p>Nenhuma ordem encontrada nesta categoria</p>
          </div>
        )}

        {filtered.map(order => {
          const meta = getStatusMeta(order.status)

          return (
            <div
              key={order.id}
              onClick={() => navigate(`/otc/order/${order.id}`)}
              className="bg-[#161A1F] border border-white/5 p-5 rounded-[1.5rem] space-y-4 cursor-pointer active:scale-[0.97] transition-all shadow-xl"
            >
              {/* TOP CARD */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                    {order.asset.symbol} 
                    <span className="text-[10px] text-gray-600">•</span> 
                    <span className={order.type === 'BUY' ? 'text-emerald-500' : 'text-red-500'}>
                      {order.type === 'BUY' ? 'Compra' : 'Venda'}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5 tracking-tighter">
                    #{order.id}
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 border border-white/5 text-[10px] font-black uppercase tracking-widest ${meta.color}`}>
                  {meta.icon}
                  {meta.label}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="h-px bg-white/5 w-full" />

              {/* BOTTOM CARD */}
              <div className="flex justify-between items-end">
                <div>
                  {/* 🟢 MELHORIA UX: Texto dinâmico baseado no tipo */}
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">
                    {order.type === "BUY" ? "Total a pagar" : "Total a receber"}
                  </p>
                  <p className="text-white font-black text-base">
                    {order.totalAoa.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">AOA</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Data</p>
                  <p className="text-gray-400 text-xs font-medium">
                    {new Date(order.createdAt).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}