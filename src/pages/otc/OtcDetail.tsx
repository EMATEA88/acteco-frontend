import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { otcService } from "../../services/otc"
import { useAuth } from "../../contexts/AuthContext"
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
      const assets = await otcService.listAssets()
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

  const isVerified =
    user?.isVerified === true ||
    user?.verification?.status === "VERIFIED"

  const userBalance = useMemo(() => {
    const balance = Number(user?.balance ?? 0)
    return isNaN(balance) ? 0 : balance
  }, [user])

  const price = useMemo(() => {
    if (!asset) return 0
    return type === "BUY"
      ? Number(asset.sellPrice)
      : Number(asset.buyPrice)
  }, [asset, type])

  const sanitizedQuantity = useMemo(() => {
    const numeric = Number(quantity)
    return isNaN(numeric) ? 0 : numeric
  }, [quantity])

  const total = useMemo(() => {
    return sanitizedQuantity * price
  }, [sanitizedQuantity, price])

  const isValidQuantity = sanitizedQuantity >= MIN_QUANTITY
  const hasBalance = type === "BUY" ? userBalance >= total : true

  const isButtonDisabled =
    loading ||
    !isValidQuantity ||
    !isVerified ||
    !hasBalance ||
    !asset

  const handleQuantityChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, "")
    setQuantity(sanitized)
  }

  const createOrder = async () => {
    if (isButtonDisabled) return

    try {
      setLoading(true)

      const order = await otcService.createOrder({
        assetId,
        type,
        quantity: sanitizedQuantity
      })

      navigate(`/otc/order/${order.id}`, { replace: true })

    } catch (err: any) {

      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message

      switch (message) {
        case "USER_NOT_VERIFIED":
          triggerToast("Conta não verificada")
          break
        case "INSUFFICIENT_BALANCE":
          triggerToast("Saldo insuficiente")
          break
        default:
          triggerToast("Erro ao criar ordem")
      }

    } finally {
      setLoading(false)
    }
  }

  if (assetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Carregando...
      </div>
    )
  }

  if (!asset) return null

  return (
    <>
      <div className="relative min-h-screen">

        {/* 🔝 HEADER STICKY */}
        <div className="
          sticky top-0 z-40
          bg-[#0B1220]
          border-b border-white/10
          px-6 pt-6 pb-4
          backdrop-blur-xl
        ">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold text-white">
              {asset.symbol}
            </h1>

            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium
              ${type === "BUY"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
              }`}>
              {type === "BUY" ? "COMPRAR" : "VENDER"}
            </div>
          </div>
        </div>


        {/* CONTEÚDO */}
        <div className="px-6 pt-8 pb-24 max-w-xl mx-auto space-y-8">

          {/* CARD PREÇO */}
          <div className="
            bg-white/5 border border-white/10
            rounded-3xl p-6 space-y-4
            transition-all duration-300
            hover:bg-white/10
          ">

            <div className="flex justify-between text-sm text-gray-400">
              <span>Preço atual</span>
              <span className="text-xl font-semibold text-white">
                {formatMoney(price)}
              </span>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Compra</span>
              <span>{formatMoney(asset.buyPrice)}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Venda</span>
              <span>{formatMoney(asset.sellPrice)}</span>
            </div>

            {type === "BUY" && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Seu saldo</span>
                <span>{formatMoney(userBalance)}</span>
              </div>
            )}
          </div>


          {/* QUANTIDADE */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">
              Quantidade
            </label>

            <div className="
              bg-white/5 border border-white/10
              rounded-2xl p-5 flex justify-between
              transition hover:bg-white/10
            ">
              <input
                type="text"
                value={quantity}
                onChange={e => handleQuantityChange(e.target.value)}
                placeholder={`Min ${MIN_QUANTITY}`}
                className="bg-transparent outline-none w-full text-white text-lg"
              />
              <span className="text-gray-400 text-sm">
                {asset.symbol}
              </span>
            </div>
          </div>


          {/* TOTAL */}
          <div className="
            bg-white/5 border border-white/10
            rounded-3xl p-6 flex justify-between
            transition hover:bg-white/10
          ">
            <span className="text-gray-400">
              Total estimado
            </span>

            <span className="text-xl font-semibold text-white">
              {formatMoney(total)}
            </span>
          </div>


          {/* BOTÃO */}
          <button
            onClick={createOrder}
            disabled={isButtonDisabled}
            className={`
              w-full py-4 rounded-3xl font-semibold transition-all duration-300
              ${type === "BUY"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"}
              ${isButtonDisabled
                ? "opacity-40 cursor-not-allowed"
                : "hover:scale-[1.02] shadow-[0_0_25px_rgba(16,185,129,0.2)]"}
            `}
          >
            {loading ? "Processando..." : `Confirmar ${type}`}
          </button>

        </div>

      </div>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
    </>
  )
}