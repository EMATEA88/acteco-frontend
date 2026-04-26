import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { useAuth } from "../../contexts/AuthContext"
import { 
  ArrowLeft,   
  Info,
  Wallet,
  Coins
} from "@phosphor-icons/react"
import Toast from "../../components/ui/Toast"

interface Asset {
  id: number
  symbol: string
  buyPrice: number
  sellPrice: number
  isActive?: boolean
}

const IMAGE_MAP: Record<string, string> = {
  USDT: "/assets/otc/usdt.png",
  USDC: "/assets/otc/usdc.png",
  BTC: "/assets/otc/btc.png",
  BNB: "/assets/otc/bnb.png",
  TRX: "/assets/otc/trx.png",
  EUR: "/assets/otc/eur.png",
}

export default function OtcDetail() {
  const { assetId: paramAssetId, type: paramType } = useParams()
  const assetId = Number(paramAssetId)
  const type = paramType === "BUY" ? "BUY" : "SELL"
  const navigate = useNavigate()
  const { user } = useAuth()

  const [asset, setAsset] = useState<Asset | null>(null)
  const [quantity, setQuantity] = useState("")
  const [loading, setLoading] = useState(false)
  const [assetLoading, setAssetLoading] = useState(true)

  const [toastMessage, setToastMessage] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState<"success" | "error">("error")

  const MIN_QUANTITY = 0.0001

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("pt-AO").format(value) + " AOA"

  const triggerToast = (msg: string, type: "success" | "error" = "error") => {
    setToastMessage(msg)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  const loadAsset = useCallback(async () => {
    try {
      const response = await otcService.listAssets()
      const assets = response?.data ?? response
      const found = assets.find((a: Asset) => a.id === assetId)

      if (!found) {
        navigate("/otc")
        return
      }
      setAsset(found)
    } catch {
      triggerToast("Erro ao carregar ativo")
    } finally {
      setAssetLoading(false)
    }
  }, [assetId, navigate])

  useEffect(() => {
    loadAsset()
  }, [loadAsset])

  const isVerified = useMemo(() => {
    if (!user) return false;
    const hasStatusVerified = (user as any)?.verification?.status === "VERIFIED";
    return user.isVerified === true || hasStatusVerified;
  }, [user]);

  // 🔥 1. ADICIONA balanceUSDT
  const userBalance = Number(user?.balance ?? 0)
  const userUSDT = Number(user?.balanceUSDT ?? 0)

  const price = useMemo(() => {
    if (!asset) return 0
    return type === "BUY" ? asset.sellPrice : asset.buyPrice
  }, [asset, type])

  const qty = Number(quantity) || 0
  const total = qty * price

  const isValid = qty >= MIN_QUANTITY

  // 🔥 2. CORRIGE VALIDAÇÃO (Valida AOA na compra e USDT na venda)
  const hasBalance =
    type === "BUY"
      ? userBalance >= total
      : userUSDT >= qty

  // 🔥 3. CORRIGE BOTÃO DISABLED
  const disabled = loading || !isValid || !isVerified || !hasBalance

  const createOrder = async () => {
    if (disabled) return
    try {
      setLoading(true)
      const res = await otcService.createOrder({
        assetId,
        type,
        quantity: qty
      })
      // 🔥 4. CORRIGE createOrder (Passa a resposta direta)
      const order = res
      navigate(`/otc/order/${order.id}`)
    } catch {
      triggerToast("Erro ao criar ordem")
    } finally {
      setLoading(false)
    }
  }

  if (assetLoading) return <div className="min-h-screen bg-[#0B0E11] animate-pulse" />
  if (!asset) return null

  const image = IMAGE_MAP[asset.symbol] ?? "/assets/otc/default.png"

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-2xl bg-[#161A1F] border border-white/5 active:scale-95 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border border-white/10 p-0.5 bg-gradient-to-b from-white/10 to-transparent">
            <img src={image} alt={asset.symbol} className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">{asset.symbol}</h1>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${type === 'BUY' ? 'text-emerald-500' : 'text-cyan-400'}`}>
              Solicitar {type === "BUY" ? "Compra" : "Venda"}
            </p>
          </div>
        </div>
      </div>

      {/* CARD DE PREÇO E SALDO */}
      <div className="bg-[#161A1F] p-6 rounded-[2rem] border border-white/5 shadow-2xl space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Cotação Atual</p>
            <p className="text-2xl font-bold tracking-tight text-white">{formatMoney(price)}</p>
          </div>
          <div className={`p-2 rounded-xl ${type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
            <Coins size={24} weight="duotone" />
          </div>
        </div>

        {/* 🟢 MOSTRAR SALDO AOA (Se for compra) */}
        {type === "BUY" && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-gray-500">
              <Wallet size={14} />
              <span className="text-[10px] font-bold uppercase">Saldo Disponível</span>
            </div>
            <span className="text-xs font-bold text-emerald-500">{formatMoney(userBalance)}</span>
          </div>
        )}

        {/* 🔥 5. MOSTRAR SALDO USDT (Se for venda) */}
        {type === "SELL" && (
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-gray-500">
              <Wallet size={14} />
              <span className="text-[10px] font-bold uppercase">{asset.symbol} Disponível</span>
            </div>
            <span className="text-xs font-bold text-cyan-400">
              {userUSDT.toFixed(2)} {asset.symbol}
            </span>
          </div>
        )}
      </div>

      {/* INPUT DE QUANTIDADE */}
      <div className="bg-[#161A1F] p-6 rounded-[2rem] border border-white/5 shadow-2xl space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Quantidade ({asset.symbol})</label>
            <span className="text-[10px] text-gray-600 font-bold">MIN: {MIN_QUANTITY}</span>
          </div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            className="w-full h-14 bg-[#0B0E11] border border-white/10 rounded-2xl px-4 text-lg font-bold outline-none focus:border-emerald-500 transition-all placeholder:text-gray-800"
          />
        </div>

        <div className="flex justify-between items-center py-4 border-t border-dashed border-white/10">
          <span className="text-xs text-gray-500 font-bold uppercase">Total Estimado</span>
          <span className={`text-xl font-black ${type === 'BUY' ? 'text-emerald-500' : 'text-cyan-400'}`}>
            {formatMoney(total)}
          </span>
        </div>
      </div>

      {/* BOTÃO DE AÇÃO */}
      <div className="fixed bottom-8 left-5 right-5">
        <button
          onClick={createOrder}
          disabled={disabled}
          className={`w-full h-16 rounded-[1.5rem] font-bold text-sm shadow-2xl transition-all active:scale-[0.98]
            ${type === "BUY" ? "bg-white text-black" : "bg-red-600 text-white"}
            ${disabled ? "opacity-20 grayscale cursor-not-allowed" : "opacity-100"}
          `}
        >
          {loading ? "Processando Ordem..." : `Confirmar Ordem de ${type === 'BUY' ? 'Compra' : 'Venda'}`}
        </button>
        
        {!isVerified && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-400 animate-bounce">
            <Info size={14} weight="bold" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Verificação KYC Necessária</span>
          </div>
        )}
      </div>

      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  )
}