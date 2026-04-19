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
            <div className="w-9 h-9 bg-[#161A1F] rounded-xl"/>
            <div className="w-32 h-4 bg-[#161A1F] rounded"/>
          </div>
          <div className="w-9 h-9 bg-[#161A1F] rounded-xl"/>
        </div>

        <p className="text-xs text-gray-500">Carregando mercado OTC...</p>

        {/* LISTA FAKE */}
        {[1,2,3].map(i => (
          <div key={i} className="bg-[#161A1F] p-4 rounded-2xl space-y-4 border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-full"/>
                <div className="space-y-2">
                  <div className="w-16 h-3 bg-white/5 rounded"/>
                  <div className="w-12 h-2 bg-white/5 rounded"/>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-white/5 rounded-xl"/>
              <div className="h-12 bg-white/5 rounded-xl"/>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 selection:bg-cyan-500/20">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-inner">
            <CurrencyDollarSimple size={22} className="text-cyan-400"/>
          </div>
          <h1 className="text-lg font-medium tracking-tight">Mercado OTC</h1>
        </div>

        <button
          onClick={() => navigate("/otc/orders")}
          className="p-2.5 rounded-2xl bg-[#161A1F] border border-white/5 text-gray-500 hover:text-white transition active:scale-95"
        >
          <ClockCounterClockwise size={18} />
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4">
        {assets.map(asset => (
          <div
            key={asset.id}
            className="bg-[#161A1F] p-5 rounded-[1.75rem] space-y-5 border border-white/5 shadow-2xl transition group active:scale-[0.98]"
          >
            {/* HEADER CARD */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* LOGOTIPO CIRCULADO - RESOLVIDO */}
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#0B0E11] border border-white/10 p-0.5 shadow-inner relative">
                    {/* Brilho Neon Sutil no Fundo */}
                    <div className="absolute inset-0 rounded-full border border-cyan-500/10 blur-sm scale-105" />
                  <img
                    src={IMAGE_MAP[asset.symbol]}
                    className="w-full h-full object-cover rounded-full relative z-10" // object-cover resolve o quadrado
                    alt={asset.symbol}
                  />
                </div>

                <div>
                  <p className="font-medium text-sm text-white">{asset.symbol}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cotação Real</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live</span>
              </div>
            </div>

            {/* PREÇOS */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-[#0B0E11] border border-white/5 rounded-2xl p-4 shadow-inner">
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Taxa de Compra</p>
                <p className="text-sm font-semibold text-emerald-500">
                  {asset.buyPrice.toLocaleString()} AOA
                </p>
              </div>

              <div className="bg-[#0B0E11] border border-white/5 rounded-2xl p-4 text-right shadow-inner">
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Taxa de Venda</p>
                <p className="text-sm font-semibold text-white">
                  {asset.sellPrice.toLocaleString()} AOA
                </p>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => navigate(`/otc/${asset.id}/BUY`)}
                className="flex-1 h-12 bg-white text-black rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-opacity active:opacity-80 active:scale-95 shadow-lg"
              >
                Comprar <ArrowRight size={16} weight="bold" />
              </button>

              <button
                onClick={() => navigate(`/otc/${asset.id}/SELL`)}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-gray-300 flex items-center justify-center gap-2 active:bg-white/10 transition active:scale-95"
              >
                Vender <ShoppingCart size={16} weight="bold" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}