import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { useAuth } from "../../contexts/AuthContext"
import { 
  ArrowLeft,  
  Wallet, 
  ChartLineUp, 
  TrendUp, 
  TrendDown,
  Info,
  CheckCircle,
  Swap
} from "@phosphor-icons/react"
import Toast from "../../components/ui/Toast"

interface Asset {
  id: number
  symbol: string
  buyPrice: number
  sellPrice: number
  isActive?: boolean
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

  const triggerToast = (message: string, type: "success" | "error" = "error") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  const loadAsset = useCallback(async () => {
    if (!assetId || isNaN(assetId)) {
      navigate("/otc")
      return
    }
    try {
      setAssetLoading(true)
      const response = await otcService.listAssets()
      const assets = response?.data ?? response
      const found = assets.find((a: Asset) => a.id === assetId)
      if (!found || found.isActive === false) {
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

  const isVerified = user?.isVerified === true || user?.verification?.status === "VERIFIED"

  const userBalance = useMemo(() => {
    const balance = Number(user?.balance ?? 0)
    return isNaN(balance) ? 0 : balance
  }, [user])

  const price = useMemo(() => {
    if (!asset) return 0
    return type === "BUY" ? Number(asset.sellPrice) : Number(asset.buyPrice)
  }, [asset, type])

  const sanitizedQuantity = useMemo(() => {
    const numeric = Number(quantity)
    return isNaN(numeric) ? 0 : numeric
  }, [quantity])

  const total = useMemo(() => sanitizedQuantity * price, [sanitizedQuantity, price])

  const isValidQuantity = sanitizedQuantity >= MIN_QUANTITY
  const hasBalance = type === "BUY" ? userBalance >= total : true

  const isButtonDisabled = loading || !isValidQuantity || !isVerified || !hasBalance || !asset

  const handleQuantityChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, "")
    setQuantity(sanitized)
  }

  const createOrder = async () => {
    if (loading) return
    if (!isVerified) return triggerToast("Conta não verificada")
    if (!isValidQuantity) return triggerToast(`Quantidade mínima: ${MIN_QUANTITY}`)
    if (!hasBalance && type === "BUY") return triggerToast("Saldo insuficiente")

    try {
      setLoading(true)
      const response = await otcService.createOrder({ assetId, type, quantity: sanitizedQuantity })
      const order = response?.data ?? response
      navigate(`/otc/order/${order.id}`, { replace: true })
    } catch (err: any) {
      triggerToast(err?.response?.data?.message || "Erro ao criar ordem")
    } finally {
      setLoading(false)
    }
  }

  if (assetLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!asset) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">{asset.symbol}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Trade Engine v4.2</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          type === "BUY" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {type === "BUY" ? "Compra" : "Venda"}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 pb-32 space-y-8 relative">
        
        {/* CARD DE COTAÇÃO PRINCIPAL */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ChartLineUp size={80} weight="thin" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Cotação Atual de {type === 'BUY' ? 'Saída' : 'Entrada'}</p>
              <h2 className="text-4xl font-black tracking-tighter italic text-white leading-none">
                {formatMoney(price)}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Preço de Mercado (Buy)</p>
                <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                  <TrendUp size={16} /> {formatMoney(asset.buyPrice)}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Preço de Mercado (Sell)</p>
                <div className="flex items-center gap-2 justify-end text-red-500 font-bold text-sm">
                   {formatMoney(asset.sellPrice)} <TrendDown size={16} />
                </div>
              </div>
            </div>

            {type === "BUY" && (
              <div className="bg-green-500/5 border border-green-500/10 p-4 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-2 text-green-400">
                  <Wallet size={18} weight="duotone" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Saldo Disponível</span>
                </div>
                <span className="text-sm font-black italic">{formatMoney(userBalance)}</span>
              </div>
            )}
          </div>
        </div>

        {/* INPUT DE QUANTIDADE */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1">Quantidade de {asset.symbol}</label>
            <div className="bg-[#111] border border-white/5 rounded-[1.8rem] p-6 flex items-center justify-between group focus-within:border-green-500/30 transition-all">
              <input
                type="text"
                value={quantity}
                onChange={e => handleQuantityChange(e.target.value)}
                placeholder={`Mínimo: ${MIN_QUANTITY}`}
                className="bg-transparent outline-none w-full text-white text-2xl font-black italic placeholder:text-gray-800 placeholder:not-italic"
              />
              <div className="bg-[#0a0a0a] px-4 py-2 rounded-xl border border-white/5 text-xs font-black text-gray-400">
                {asset.symbol}
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-[1.8rem] p-6 flex justify-between items-center relative overflow-hidden">
             <div className="absolute left-0 top-0 h-full w-1 bg-green-500 opacity-20"></div>
             <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Total Estimado</p>
                <p className="text-2xl font-black text-white tracking-tighter italic">
                  {formatMoney(total)}
                </p>
             </div>
             <Swap size={32} weight="duotone" className="text-gray-800" />
          </div>
        </div>

        {/* BOTÃO DE AÇÃO */}
        <button
          onClick={createOrder}
          disabled={isButtonDisabled}
          className={`
            w-full h-16 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl
            ${type === "BUY" ? "bg-white text-black hover:bg-green-500 hover:text-white" : "bg-red-600 text-white hover:bg-red-700"}
            ${isButtonDisabled ? "opacity-20 grayscale cursor-not-allowed" : "active:scale-[0.98]"}
          `}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Confirmar {type === 'BUY' ? 'Compra' : 'Venda'}
              <CheckCircle size={24} weight="fill" />
            </>
          )}
        </button>

        {/* INFO DE VERIFICAÇÃO */}
        {!isVerified && (
          <div className="bg-orange-500/5 border border-orange-500/10 p-5 rounded-[2rem] flex items-start gap-4">
            <Info size={24} weight="duotone" className="text-orange-500 shrink-0" />
            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
              Esta operação requer <span className="text-orange-400 font-bold">Verificação KYC</span> concluída. Por favor, submeta os seus documentos para desbloquear o motor de trocas OTC.
            </p>
          </div>
        )}

      </main>

      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  )
}