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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [ownedProductIds, setOwnedProductIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState<number | null>(null)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] =
    useState<'success' | 'error'>('error')

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [productsRes, myProductsRes] = await Promise.all([
          ProductService.list(),
          ProductService.myProducts(),
        ])

        if (!mounted) return

        setProducts(productsRes.data)

        setOwnedProductIds(
          new Set(
            myProductsRes.data.map(
              (p: UserProduct) => p.productId
            )
          )
        )
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2000)
    return () => clearTimeout(t)
  }, [toastVisible])

  const handleBuy = useCallback(async (productId: number) => {
    try {
      setBuyingId(productId)

      await ProductService.buy(productId)

      setOwnedProductIds(prev => {
        const next = new Set(prev)
        next.add(productId)
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

  if (loading) {
    return <div className="p-6 text-sm text-gray-500" />
  }

  return (
    <div className="min-h-screen bg-muted px-5 pt-6 pb-28 animate-fadeZoom">
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <div className="grid grid-cols-1 gap-6">
        {products.map(p => {
          const productKey = p.name
            .split('-')[0]
            .trim()
            .toUpperCase()

          const alreadyOwned = ownedProductIds.has(p.id)
          const isBuying = buyingId === p.id

          return (
            <div
              key={p.id}
              className="bg-surface rounded-2xl shadow-card overflow-hidden"
            >
              <img
                src={productImages[productKey] ?? '/placeholder.webp'}
                alt={p.name}
                className="w-full h-44 object-cover"
                loading="lazy"
              />

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
                  <p>Rendimento diário: {p.dailyIncome} Kz</p>
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
