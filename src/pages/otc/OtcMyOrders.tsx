import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"

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
  "ALL",
  "PENDING",
  "PAID",
  "RELEASED",
  "CANCELLED",
  "EXPIRED"
]

export default function OtcMyOrders() {

  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState("ALL")

  const load = async () => {
    const data = await otcService.myOrders()
    setOrders(data)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeCount =
    orders.filter(o =>
      o.status === "PENDING" ||
      o.status === "PAID"
    ).length

  const filtered = orders.filter(o => {
    if (filter === "ALL") return true
    return o.status === filter
  })

  const statusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-400"
      case "PAID":
        return "bg-blue-500/10 text-blue-400"
      case "RELEASED":
        return "bg-emerald-500/10 text-emerald-400"
      case "CANCELLED":
        return "bg-red-500/10 text-red-400"
      case "EXPIRED":
        return "bg-gray-500/10 text-gray-400"
      default:
        return "bg-white/5 text-white"
    }
  }

  return (
    <div className="relative min-h-screen">

      {/* 🔝 BLOCO FIXO */}
      <div className="
        sticky top-0 z-40
        bg-[#0B1220]
        border-b border-white/10
        px-6 pt-6 pb-4
        backdrop-blur-xl
      ">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-semibold text-white">
            Minhas Ordens
          </h1>

          <div className="relative">
            <span className="
              bg-white/5 border border-white/10
              text-white px-4 py-2 rounded-xl
            ">
              Ativas
            </span>

            {activeCount > 0 && (
              <span className="
                absolute -top-2 -right-2
                bg-red-600 text-white
                text-xs w-6 h-6
                flex items-center justify-center
                rounded-full
              ">
                {activeCount}
              </span>
            )}
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2 flex-wrap mt-4">
          {STATUS_LIST.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-4 py-1 text-xs rounded-full
                transition
                border border-white/10
                ${
                  filter === status
                    ? "bg-emerald-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

      </div>


      {/* 📜 LISTA */}
      <div className="px-6 pt-6 pb-24 space-y-5 max-w-xl mx-auto">

        {filtered.length === 0 && (
          <div className="text-gray-400 text-sm text-center">
            Nenhuma ordem encontrada.
          </div>
        )}

        {filtered.map(order => (

          <div
            key={order.id}
            onClick={() => navigate(`/otc/order/${order.id}`)}
            className="
              group
              bg-white/5
              border border-white/10
              rounded-3xl
              p-6
              transition-all duration-300
              hover:bg-white/10
              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
              cursor-pointer
            "
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="font-semibold text-lg text-white">
                  {order.asset.symbol} — {order.type}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  #{order.id}
                </p>
              </div>

              <span className={`
                px-3 py-1 text-xs rounded-full font-medium
                ${statusStyle(order.status)}
              `}>
                {order.status}
              </span>

            </div>

            <div className="mt-4 text-sm text-gray-400">
              Total:{" "}
              <span className="text-white font-semibold">
                {order.totalAoa.toLocaleString()} AOA
              </span>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}