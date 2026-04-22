import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { useAuth } from "../../contexts/AuthContext"
import { 
  ArrowLeft,  
  TrendUp, 
  TrendDown,
  Info
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
    new Intl.NumberFormat("pt-AO").format(value) + " Kz"

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

  // 🟢 CORREÇÃO DO ERRO DE BUILD: Verificação segura para 'verification'
  const isVerified = useMemo(() => {
    if (!user) return false;
    const hasStatusVerified = (user as any)?.verification?.status === "VERIFIED";
    return user.isVerified === true || hasStatusVerified;
  }, [user]);

  const userBalance = Number(user?.balance ?? 0)

  const price = useMemo(() => {
    if (!asset) return 0
    return type === "BUY" ? asset.sellPrice : asset.buyPrice
  }, [asset, type])

  const qty = Number(quantity) || 0
  const total = qty * price

  const isValid = qty >= MIN_QUANTITY
  const hasBalance = type === "BUY" ? userBalance >= total : true

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

      const order = res?.data ?? res
      navigate(`/otc/order/${order.id}`)

    } catch {
      triggerToast("Erro ao criar ordem")
    } finally {
      setLoading(false)
    }
  }

  if (assetLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5"/>
          <div className="w-10 h-10 rounded-full bg-white/5"/>
          <div>
            <div className="w-20 h-3 bg-white/5 rounded mb-2"/>
            <div className="w-16 h-2 bg-white/5 rounded"/>
          </div>
        </div>
        <p className="text-xs text-gray-500">Carregando ativo...</p>
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="h-4 w-24 bg-white/5 rounded"/>
          <div className="h-6 w-32 bg-white/5 rounded"/>
        </div>
      </div>
    )
  }

  if (!asset) return null

  const image = IMAGE_MAP[asset.symbol] ?? "/assets/otc/default.png"

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 border border-white/10"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#0B0E11]">
          <img
            src={image}
            alt={asset.symbol}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-lg font-semibold">{asset.symbol}</h1>
          <p className="text-xs text-gray-500">
            {type === "BUY" ? "Compra" : "Venda"}
          </p>
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl space-y-3">
        <div>
          <p className="text-xs text-gray-500">Preço atual</p>
          <p className="text-xl font-semibold">{formatMoney(price)}</p>
        </div>

        <div className="flex justify-between text-xs">
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendUp size={14} />
            {formatMoney(asset.buyPrice)}
          </div>
          <div className="flex items-center gap-1 text-red-500">
            {formatMoney(asset.sellPrice)}
            <TrendDown size={14} />
          </div>
        </div>

        {type === "BUY" && (
          <div className="flex justify-between text-xs pt-2 border-t border-white/5">
            <span className="text-gray-500">Saldo</span>
            <span className="text-emerald-500 font-medium">{formatMoney(userBalance)}</span>
          </div>
        )}
      </div>

      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Quantidade</p>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Min: ${MIN_QUANTITY}`}
            className="w-full h-11 bg-[#0B0E11] border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total</span>
          <span className="font-semibold text-emerald-500">{formatMoney(total)}</span>
        </div>
      </div>

      <button
        onClick={createOrder}
        disabled={disabled}
        className={`w-full h-12 rounded-xl font-semibold text-sm transition
          ${type === "BUY" ? "bg-white text-black" : "bg-red-600 text-white"}
          ${disabled && "opacity-30"}
        `}
      >
        {loading ? "Processando..." : `Confirmar ${type}`}
      </button>

      {!isVerified && (
        <div className="glass-card p-4 rounded-xl flex gap-3 text-xs text-gray-500">
          <Info size={16} />
          Conta não verificada (KYC necessário)
        </div>
      )}

      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  )
}