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
    } catch {
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
        return { color: "text-amber-500", icon: <Clock size={14} /> }
      case "PAID":
        return { color: "text-blue-400", icon: <ShieldCheck size={14} /> }
      case "RELEASED":
        return { color: "text-emerald-500", icon: <CheckCircle size={14} /> }
      case "CANCELLED":
        return { color: "text-red-500", icon: <XCircle size={14} /> }
      case "EXPIRED":
        return { color: "text-gray-500", icon: <WarningCircle size={14} /> }
      default:
        return { color: "text-white", icon: <Receipt size={14} /> }
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white/5 border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-lg font-semibold">Minhas Ordens</h1>
        </div>

        <div className="text-xs text-gray-400">
          Ativas: <span className="text-emerald-500 font-semibold">{activeCount}</span>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {STATUS_LIST.map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`
              px-4 py-1.5 text-xs rounded-lg border transition
              ${filter === item.id
                ? "bg-white text-black border-white"
                : "bg-[#111] text-gray-400 border-white/10"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="space-y-3">

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-16">
            Nenhum registo
          </div>
        )}

        {filtered.map(order => {
          const meta = getStatusMeta(order.status)

          return (
            <div
              key={order.id}
              onClick={() => navigate(`/otc/order/${order.id}`)}
              className="glass-card p-4 rounded-xl space-y-3 cursor-pointer"
            >

              {/* TOP */}
              <div className="flex justify-between items-center">

                <div>
                  <p className="text-sm font-semibold">
                    {order.asset.symbol} / {order.type}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    #{order.id}
                  </p>
                </div>

                <div className={`flex items-center gap-1 text-xs ${meta.color}`}>
                  {meta.icon}
                  {order.status}
                </div>

              </div>

              {/* INFO */}
              <div className="flex justify-between text-xs text-gray-400">

                <div>
                  <p className="text-gray-500">Valor</p>
                  <p className="text-white font-medium">
                    {order.totalAoa.toLocaleString()} AOA
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-500">Data</p>
                  <p>
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