import { useEffect, useState } from "react"
import { otcService } from "../../services/otc"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import toast from "react-hot-toast"

type Asset = {
  id: number
  symbol: string
  buyPrice: number
  sellPrice: number
}

const ORDER = [
  "USDT",
  "USDC",
  "TRX",
  "EUR",
  "BNB",
  "BTC",
]

const IMAGE_MAP: Record<string, string> = {
  USDT: "/assets/otc/usdt.png",
  USDC: "/assets/otc/usdc.png",
  TRX: "/assets/otc/trx.png",
  EUR: "/assets/otc/eur.png",
  BNB: "/assets/otc/bnb.png",
  BTC: "/assets/otc/btc.png",
}

export default function OtcPage() {

  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await otcService.listAssets()

      if (!Array.isArray(data)) {
        toast.error("Erro ao carregar ativos")
        return
      }

      const sorted = [...data].sort((a, b) =>
        ORDER.indexOf(a.symbol) - ORDER.indexOf(b.symbol)
      )

      setAssets(sorted)

    } catch {
      toast.error("Falha ao buscar mercado OTC")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Carregando mercado OTC...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">

      {/* 🔝 BLOCO FIXO (igual MyOrders) */}
      <div className="
        sticky top-0 z-40
        bg-[#0B1220]
        border-b border-white/10
        px-6 pt-6 pb-4
        backdrop-blur-xl
      ">

        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-semibold text-white">
            OTC Market
          </h1>

          <button
            onClick={() => navigate("/otc/orders")}
            className="
              bg-white/5
              border border-white/10
              text-white
              px-4 py-2
              rounded-xl
              hover:bg-white/10
              transition
            "
          >
            Minhas Ordens
          </button>

        </div>
      </div>


      {/* 📜 LISTA */}
      <div className="px-6 pt-6 pb-24 space-y-6 max-w-xl mx-auto">

        {assets.map(asset => (
          <div
            key={asset.id}
            className="
              group
              bg-white/5
              border border-white/10
              rounded-3xl
              overflow-hidden
              transition-all duration-300
              hover:bg-white/10
              hover:scale-[1.02]
              hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]
            "
          >

            {/* HEADER CARD */}
            <div className="flex items-center justify-between px-6 pt-6">
              <h2 className="text-xl font-semibold text-white">
                {asset.symbol}
              </h2>

              <ArrowUpRight
                size={18}
                className="text-emerald-400 opacity-0 group-hover:opacity-100 transition"
              />
            </div>

            {/* IMAGEM */}
            <div className="flex justify-center py-6">
              <img
                src={
                  IMAGE_MAP[asset.symbol] ||
                  "/assets/otc/default.png"
                }
                alt={asset.symbol}
                className="
                  h-28 object-contain
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />
            </div>

            {/* PREÇOS */}
            <div className="px-6 pb-6 space-y-4">

              <div className="flex justify-between text-sm text-gray-400">
                <span>Preço Compra</span>
                <span className="text-emerald-400 font-semibold">
                  {asset.buyPrice.toLocaleString()} AOA
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Preço Venda</span>
                <span className="text-red-400 font-semibold">
                  {asset.sellPrice.toLocaleString()} AOA
                </span>
              </div>

              {/* BOTÕES */}
              <div className="flex gap-3 pt-4">

                <button
                  onClick={() =>
                    navigate(`/otc/${asset.id}/BUY`)
                  }
                  className="
                    flex-1
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                    hover:scale-105
                  "
                >
                  Comprar
                </button>

                <button
                  onClick={() =>
                    navigate(`/otc/${asset.id}/SELL`)
                  }
                  className="
                    flex-1
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                    hover:scale-105
                  "
                >
                  Vender
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}