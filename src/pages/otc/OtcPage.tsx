import { useEffect, useState, useCallback } from "react"
import { otcService } from "../../services/otc"
import { api } from "../../services/api"
import { useNavigate } from "react-router-dom"
import { 
  ArrowRight, 
  ShoppingCart, 
  CurrencyDollarSimple,  
  ClockCounterClockwise,
  Wallet 
} from "@phosphor-icons/react"
import { toast } from "sonner" // Alterado para Sonner conforme sua configuração global
import { SkeletonPage } from "../../components/ui/Skeleton"

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
  const [userData, setUserData] = useState({ balance: 0, balanceUSDT: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [assetsData, userRes] = await Promise.all([
        otcService.listAssets(),
        api.get("/users/me")
      ])

      const assetsArray = assetsData?.data ?? assetsData;

      const sorted = [...assetsArray].sort((a, b) =>
        ORDER.indexOf(a.symbol) - ORDER.indexOf(b.symbol)
      )

      setAssets(sorted)
      setUserData({
        balance: userRes.data.balance || 0,
        balanceUSDT: userRes.data.balanceUSDT || 0
      })
    } catch (err) {
      console.error(err)
      toast.error("Erro ao carregar dados do mercado")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
     return <SkeletonPage title="Carregando Mercado OTC..." />
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32">

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

      {/* CARD DE SALDOS - ATUALIZADO */}
      <div className="bg-gradient-to-br from-[#161A1F] to-[#0B0E11] border border-white/5 rounded-[1.75rem] p-5 mb-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-gray-400">
          <Wallet size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Meus Saldos</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border-r border-white/5">
            {/* Alterado para Saldo Disponível conforme solicitado */}
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Saldo Disponível (AOA)</p>
            <p className="text-lg font-semibold text-white">
              {Number(userData.balance).toLocaleString('pt-AO')} <span className="text-[10px] text-gray-500 font-normal">Kz</span>
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Carteira (USDT)</p>
            <p className="text-lg font-semibold text-cyan-400">
              {Number(userData.balanceUSDT).toFixed(2)} <span className="text-[10px] text-gray-500 font-normal">USDT</span>
            </p>
          </div>
        </div>
      </div>

      {/* LISTA DE ATIVOS OTC */}
      <div className="space-y-4">
        {assets.map(asset => (
          <div
            key={asset.id}
            className="bg-[#161A1F] p-5 rounded-[1.75rem] space-y-5 border border-white/5 shadow-2xl transition group active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#0B0E11] border border-white/10 p-0.5 shadow-inner">
                  <img
                    src={IMAGE_MAP[asset.symbol] || "/assets/otc/default.png"}
                    className="w-full h-full object-cover rounded-full"
                    alt={asset.symbol}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">{asset.symbol}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cotação em AOA</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-[#0B0E11] border border-white/5 rounded-2xl p-4 shadow-inner">
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Você Paga</p>
                <p className="text-sm font-semibold text-emerald-500">
                  {asset.sellPrice.toLocaleString('pt-AO')} AOA
                </p>
              </div>

              <div className="bg-[#0B0E11] border border-white/5 rounded-2xl p-4 text-right shadow-inner">
                <p className="text-[10px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Você vende</p>
                <p className="text-sm font-semibold text-white">
                  {asset.buyPrice.toLocaleString('pt-AO')} AOA
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  if (userData.balance <= 0) {
                    toast.error("Saldo AOA insuficiente para comprar")
                    return
                  }
                  navigate(`/otc/${asset.id}/BUY`, {
                    state: { asset, type: "BUY", balanceAOA: userData.balance }
                  })
                }}
                className="flex-1 h-12 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition shadow-lg"
              >
                Comprar <ArrowRight size={16} weight="bold" />
              </button>

              <button
                onClick={() => {
                  if (userData.balanceUSDT <= 0) {
                    toast.error("Saldo de ativos insuficiente para vender")
                    return
                  }
                  navigate(`/otc/${asset.id}/SELL`, {
                    state: { asset, type: "SELL", balanceCrypto: userData.balanceUSDT }
                  })
                }}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center justify-center gap-2 active:bg-white/10 transition active:scale-95"
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