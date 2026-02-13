// src/pages/Shop.tsx
import { useEffect, useState } from 'react'
import { ProductService } from '../services/product.service'

// imagens locais
import usdt from '../assets/products/usdt.png'
import usdc from '../assets/products/usdc.png'
import btc from '../assets/products/btc.png'
import bnb from '../assets/products/bnb.png'
import eur from '../assets/products/eur.png'
import trx from '../assets/products/trx.png'
import placeholder from '../assets/products/placeholder.png'

type Product = {
  id: number
  name: string
  price: number
  dailyIncome: number
  startedAt: string
  expiresAt: string
  isActive: boolean
  remainingDays: number
}

// 🔗 associação produto → imagem
const productImages: Record<string, string> = {
  USDT: usdt,
    USDC: usdc,
    BTC: btc,
    BNB: bnb,
    EUR: eur,
    TRX: trx,
}

function getProductImage(name: string) {
  const key = Object.keys(productImages).find(k =>
    name.toUpperCase().includes(k)
  )

  return key ? productImages[key] : placeholder
}

export default function Shop() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ProductService.myProducts()
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 p-5 text-white">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold"></h1>
        <p className="text-sm opacity-80">
          Products currently generating income
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm opacity-70">
          Loading your investments…
        </p>
      )}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <div className="bg-white/15 rounded-2xl p-5 text-sm opacity-90">
          You don’t have any active investments yet.
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {items.map(p => (
          <div
            key={p.id}
            className="bg-white text-blue-900 rounded-2xl overflow-hidden shadow-md"
          >
            {/* IMAGE */}
            <div className="h-36 w-full overflow-hidden">
              <img
                src={getProductImage(p.name)}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold uppercase">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.isActive
                      ? `${p.remainingDays} days remaining`
                      : 'Expired'}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    p.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {p.isActive ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </div>

              <div className="h-px bg-gray-200 my-3" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">
                    Daily income
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {p.dailyIncome} Kz
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Invested
                  </p>
                  <p className="text-sm font-semibold">
                    {p.price} Kz
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
