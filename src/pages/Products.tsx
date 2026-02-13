import { useEffect, useState, useCallback } from 'react'
import { ProductService } from '../services/product.service'
import { productImages } from '../utils/productImages'
import Toast from '../components/ui/Toast'

interface Product {
  id: number
  name: string
  price: number
  dailyIncome: number
  durationDays: number
}

interface UserProduct {
  productId: number
}

const CACHE_KEY = 'products-cache'

type CacheShape = {
  products: Product[]
  ownedIds: number[]
}

export default function Products() {
  /* ================= CACHE INIT ================= */

  const cachedRaw = localStorage.getItem(CACHE_KEY)
  const cached: CacheShape | null = cachedRaw
    ? JSON.parse(cachedRaw)
    : null

  const [products, setProducts] = useState<Product[]>(
    cached?.products ?? []
  )

  const [ownedProductIds, setOwnedProductIds] = useState<Set<number>>(
    new Set(cached?.ownedIds ?? [])
  )

  const [buyingId, setBuyingId] = useState<number | null>(null)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] =
    useState<'success' | 'error'>('error')

  /* ================= BACKGROUND LOAD ================= */

  useEffect(() => {
    let mounted = true

    Promise.all([
      ProductService.list(),
      ProductService.myProducts(),
    ])
      .then(([productsRes, myProductsRes]) => {
        if (!mounted) return

        const ownedIds = myProductsRes.data.map(
          (p: UserProduct) => p.productId
        )

        setProducts(productsRes.data)
        setOwnedProductIds(new Set(ownedIds))

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            products: productsRes.data,
            ownedIds,
          })
        )
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  /* ================= TOAST AUTO-HIDE ================= */

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2000)
    return () => clearTimeout(t)
  }, [toastVisible])

  /* ================= BUY ================= */

  const handleBuy = useCallback(async (productId: number) => {
    try {
      setBuyingId(productId)

      await ProductService.buy(productId)

      setOwnedProductIds(prev => {
        const next = new Set(prev)
        next.add(productId)

        const current = localStorage.getItem(CACHE_KEY)
        if (current) {
          const parsed: CacheShape = JSON.parse(current)
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              ...parsed,
              ownedIds: [...new Set([...parsed.ownedIds, productId])],
            })
          )
        }

        return next
      })

      setToastType('success')
      setToastMessage('Compra realizada com sucesso')
      setToastVisible(true)
    } catch {
      setToastType('error')
      setToastMessage('Saldo insuficiente')
      setToastVisible(true)
    } finally {
      setBuyingId(null)
    }
  }, [])

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-muted px-5 pt-6 pb-28 animate-fadeZoom">
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <div className="grid grid-cols-1 gap-6">
        {products.map(p => {
          const productKey = p.name
            .split('-')[0]
            .trim()
            .toUpperCase()

          const alreadyOwned = ownedProductIds.has(p.id)
          const isBuying = buyingId === p.id

          const imageSrc =
            productImages[productKey] ??
            '/placeholder.webp'

          return (
            <div
              key={p.id}
              className="bg-surface rounded-2xl shadow-card overflow-hidden"
            >
              {/* 🔥 CONTAINER PROFISSIONAL DE IMAGEM */}
              <div className="w-full h-52 bg-white flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="p-5">
                <h2 className="font-semibold text-lg text-gray-900">
                  {p.name}
                </h2>

                <div className="text-sm mt-3 space-y-1 text-gray-600">
                  <p>
                    Preço:{' '}
                    <strong className="text-gray-900">
                      {p.price} Kz
                    </strong>
                  </p>
                  <p>
                    Rendimento diário: {p.dailyIncome} Kz
                  </p>
                  <p>Duração: {p.durationDays} dias</p>
                </div>

                <button
                  disabled={alreadyOwned || isBuying}
                  onClick={() => handleBuy(p.id)}
                  className={`
                    mt-5 w-full h-11 rounded-xl font-medium transition
                    ${
                      alreadyOwned
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
                    }
                  `}
                >
                  {alreadyOwned
                    ? 'Adquirido'
                    : isBuying
                    ? 'Processando…'
                    : 'Comprar'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
