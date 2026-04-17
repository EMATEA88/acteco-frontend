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
      if (!Array.isArray(data)) {
        toast.error("Falha na sincronização de mercado")
        return
      }
      const sorted = [...data].sort((a, b) =>
        ORDER.indexOf(a.symbol) - ORDER.indexOf(b.symbol)
      )
      setAssets(sorted)
    } catch {
      toast.error("Mercado OTC temporariamente offline")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Mapeando Ativos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM FIXO */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <CurrencyDollarSimple size={24} weight="duotone" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Mercado OTC</h1>
          </div>

          <button
            onClick={() => navigate("/otc/orders")}
            className="p-2.5 bg-white/5 border border-white/10 rounded-full hover:text-green-500 transition-all group"
          >
            <ClockCounterClockwise size={24} weight="duotone" className="group-hover:rotate-[-30deg] transition-transform" />
          </button>
        </div>
      </header>

      {/* LISTA DE ATIVOS */}
      <main className="px-6 pt-8 pb-32 space-y-6 max-w-xl mx-auto">
        
        {assets.map(asset => (
          <div
            key={asset.id}
            className="group relative bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 hover:border-green-500/20 overflow-hidden"
          >
            {/* EFEITO DE GLOW NO HOVER */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 rounded-full filter blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                
                {/* 🟢 CORREÇÃO: IMAGEM PERFEITAMENTE CIRCULAR */}
                <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-[#0a0a0a] shadow-xl flex items-center justify-center group-hover:border-green-500/30 transition-all shrink-0">
                  <img
                    src={IMAGE_MAP[asset.symbol] || "/assets/otc/default.png"}
                    alt={asset.symbol}
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>

                <h2 className="text-2xl font-black tracking-tight italic uppercase">{asset.symbol}</h2>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Preço em Tempo Real</p>
                <div className="flex items-center gap-2 text-green-500">
                  <span className="text-xs font-black italic uppercase animate-pulse">Live</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                </div>
              </div>
            </div>

            {/* BOX DE PREÇOS */}
            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div className="bg-[#0a0a0a] p-5 rounded-3xl border border-white/5 group-hover:border-green-500/10 transition-colors">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Cotação Compra</p>
                <p className="text-lg font-black text-green-500 tracking-tighter italic">
                  {asset.buyPrice.toLocaleString()} <span className="text-[9px] not-italic opacity-40">AOA</span>
                </p>
              </div>
              <div className="bg-[#0a0a0a] p-5 rounded-3xl border border-white/5 text-right group-hover:border-white/10 transition-colors">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Cotação Venda</p>
                <p className="text-lg font-black text-white tracking-tighter italic">
                  {asset.sellPrice.toLocaleString()} <span className="text-[9px] not-italic opacity-40">AOA</span>
                </p>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div className="flex gap-4 relative z-10">
              <button
                onClick={() => navigate(`/otc/${asset.id}/BUY`)}
                className="flex-1 h-14 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
              >
                Comprar
                <ArrowRight size={18} weight="bold" />
              </button>

              <button
                onClick={() => navigate(`/otc/${asset.id}/SELL`)}
                className="flex-1 h-14 bg-[#1a1a1a] text-white border border-white/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:border-transparent transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Vender
                <ShoppingCart size={18} weight="bold" />
              </button>
            </div>

          </div>
        ))}
      </main>

      <footer className="fixed bottom-10 left-0 w-full text-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">EMATEA Liquidity Protocol v4.0</p>
      </footer>

    </div>
  )
}