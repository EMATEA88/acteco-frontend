import { useEffect, useState } from "react"
import { otcService } from "../../services/otc"
import { useNavigate } from "react-router-dom"
import { 
  ArrowRight, 
  ShoppingCart, 
  CurrencyDollarSimple,  
  ClockCounterClockwise 
} from "@phosphor-icons/react"
import toast from "react-hot-toast"

type Asset = {
  id: number
  symbol: string
  buyPrice: number
  sellPrice: number
}

const ORDER = ["USDT", "USDC", "TRX", "EUR", "BNB", "BTC"]

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
      const sorted = [...data].sort((a, b) =>
        ORDER.indexOf(a.symbol) - ORDER.indexOf(b.symbol)
      )
      setAssets(sorted)
    } catch {
      toast.error("Mercado OTC offline")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse">

      {/* HEADER FAKE */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl"/>
          <div className="w-32 h-4 bg-white/5 rounded"/>
        </div>
        <div className="w-9 h-9 bg-white/5 rounded-xl"/>
      </div>

      {/* TEXTO */}
      <p className="text-xs text-gray-500">
        Carregando mercado OTC...
      </p>

      {/* LISTA FAKE */}
      {[1,2,3].map(i => (
        <div key={i} className="glass-card p-4 rounded-2xl space-y-4">

          {/* HEADER CARD */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full"/>
              <div>
                <div className="w-16 h-3 bg-white/5 rounded mb-2"/>
                <div className="w-12 h-2 bg-white/5 rounded"/>
              </div>
            </div>
            <div className="w-10 h-3 bg-white/5 rounded"/>
          </div>

          {/* PREÇOS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-white/5 rounded-xl"/>
            <div className="h-12 bg-white/5 rounded-xl"/>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-white/5 rounded-xl"/>
            <div className="flex-1 h-10 bg-white/5 rounded-xl"/>
          </div>

        </div>
      ))}

    </div>
  )
}

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CurrencyDollarSimple size={20} className="text-emerald-500"/>
          </div>
          <h1 className="text-lg font-bold">Mercado OTC</h1>
        </div>

        <button
          onClick={() => navigate("/otc/orders")}
          className="p-2 rounded-xl bg-white/5 border border-white/10"
        >
          <ClockCounterClockwise size={18} />
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4">

        {assets.map(asset => (
          <div
            key={asset.id}
            className="glass-card p-4 rounded-2xl space-y-4"
          >

            {/* HEADER CARD */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0B0E11] border border-white/10">
                  <img
                    src={IMAGE_MAP[asset.symbol]}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold text-sm">{asset.symbol}</p>
                  <p className="text-[10px] text-gray-500">Tempo real</p>
                </div>
              </div>

              <span className="text-[10px] text-emerald-500 font-semibold">
                ● LIVE
              </span>
            </div>

            {/* PREÇOS */}
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-[#0B0E11] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-1">Compra</p>
                <p className="text-sm font-bold text-emerald-500">
                  {asset.buyPrice.toLocaleString()} AOA
                </p>
              </div>

              <div className="bg-[#0B0E11] border border-white/5 rounded-xl p-3 text-right">
                <p className="text-[10px] text-gray-500 mb-1">Venda</p>
                <p className="text-sm font-bold">
                  {asset.sellPrice.toLocaleString()} AOA
                </p>
              </div>

            </div>

            {/* BOTÕES */}
            <div className="flex gap-3">

              <button
                onClick={() => navigate(`/otc/${asset.id}/BUY`)}
                className="flex-1 h-10 bg-white text-black rounded-xl font-semibold text-xs flex items-center justify-center gap-1"
              >
                Comprar <ArrowRight size={14}/>
              </button>

              <button
                onClick={() => navigate(`/otc/${asset.id}/SELL`)}
                className="flex-1 h-10 bg-[#1a1a1a] border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
              >
                Vender <ShoppingCart size={14}/>
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}