import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { 
  ArrowLeft, 
  Receipt, 
  Clock, 
  CheckCircle, 
  XCircle, 
  WarningCircle, 
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
  { id: "RELEASED", label: "Concluídas" },
  { id: "CANCELLED", label: "Canceladas" },
]

export default function OtcMyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState("ALL")

  const load = async () => {
    try {
      const data = await otcService.myOrders()
      setOrders(data || [])
    } catch (err) {
      setOrders([])
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

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
        return { color: "text-orange-400", bg: "bg-orange-500/10", icon: <Clock size={16} weight="duotone" /> }
      case "PAID":
        return { color: "text-blue-400", bg: "bg-blue-500/10", icon: <ShieldCheck size={16} weight="duotone" /> }
      case "RELEASED":
        return { color: "text-green-500", bg: "bg-green-500/10", icon: <CheckCircle size={16} weight="duotone" /> }
      case "CANCELLED":
        return { color: "text-red-500", bg: "bg-red-500/10", icon: <XCircle size={16} weight="duotone" /> }
      case "EXPIRED":
        return { color: "text-gray-500", bg: "bg-white/5", icon: <WarningCircle size={16} weight="duotone" /> }
      default:
        return { color: "text-white", bg: "bg-white/5", icon: <Receipt size={16} weight="duotone" /> }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER FIXO PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5">
        <div className="max-w-xl mx-auto flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Minhas Ordens</h1>
          </div>

          <div className="relative">
            <div className="bg-[#111] border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ativas</span>
              {activeCount > 0 && (
                <span className="bg-green-500 text-black text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {activeCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FILTROS SEGMENTADOS */}
        <div className="max-w-xl mx-auto flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {STATUS_LIST.map(item => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`
                whitespace-nowrap px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border
                ${filter === item.id 
                  ? "bg-white text-black border-white" 
                  : "bg-[#111] text-gray-500 border-white/5 hover:border-white/20"}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* LISTA DE ORDENS */}
      <main className="px-6 py-8 space-y-5 max-w-xl mx-auto pb-32">
        
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Receipt size={48} weight="thin" className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-center">Nenhum registo encontrado</p>
          </div>
        )}

        {filtered.map(order => {
          const meta = getStatusMeta(order.status)
          return (
            <div
              key={order.id}
              onClick={() => navigate(`/otc/order/${order.id}`)}
              className="group relative bg-[#111] border border-white/5 rounded-[2rem] p-6 transition-all duration-300 hover:border-green-500/20 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center group-hover:border-green-500/20 transition-colors`}>
                    <Receipt size={24} weight="duotone" className="text-green-500" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg tracking-tight italic uppercase">
                      {order.asset.symbol} <span className="text-[10px] not-italic text-gray-500 ml-1">/ {order.type}</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Protocol ID: #{order.id}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${meta.bg} ${meta.color} text-[9px] font-black uppercase tracking-widest border border-white/5`}>
                  {meta.icon}
                  {order.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Volume Total</p>
                  <p className="text-sm font-black tracking-tight italic">
                    {order.totalAoa.toLocaleString()} <span className="text-[9px] not-italic font-bold opacity-30">AOA</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Data de Emissão</p>
                  <p className="text-[10px] font-bold text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('pt-AO')}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </main>

      {/* FOOTER DE CONFORMIDADE */}
      <footer className="fixed bottom-10 left-0 w-full text-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Audit Trail v4.2 • EMATEA Protocol</p>
      </footer>

    </div>
  )
}