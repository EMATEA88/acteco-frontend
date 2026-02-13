import { useNavigate } from 'react-router-dom'
import { productImages } from '../utils/productImages'

interface FeaturedProduct {
  id: number
  name: string
}

const featuredProducts: FeaturedProduct[] = [
  { id: 1, name: 'USDT' },
  { id: 2, name: 'USDC' },
  { id: 3, name: 'TRX' },
  { id: 4, name: 'BNB' },
  { id: 5, name: 'BTC' },
]

export default function FeaturedProducts() {
  const navigate = useNavigate()

  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-blue-800 mb-3">
        Produtos em Destaque
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

        {featuredProducts.map((p) => {
          const productKey = p.name.toUpperCase()
          const imageSrc = productImages[productKey]

          return (
            <button
              key={p.id}
              onClick={() => navigate('/products')}
              className="
                relative
                min-w-[170px] h-28
                rounded-2xl
                overflow-hidden
                shadow-lg
                border border-blue-300
                transition hover:scale-105
              "
            >
              {/* IMAGEM COBRINDO 100% */}
              <img
                src={imageSrc}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay leve para contraste */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Nome */}
              <div className="relative z-10 h-full flex items-end p-3">
                <span className="text-xs font-semibold text-white">
                  {p.name}
                </span>
              </div>
            </button>
          )
        })}

      </div>
    </section>
  )
}
