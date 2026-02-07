import { useNavigate } from 'react-router-dom'
import { productImages } from '../utils/productImages'

interface FeaturedProduct {
  id: number
  name: string
}

const featuredProducts: FeaturedProduct[] = [
  { id: 1, name: 'PET - Etileno' },
  { id: 2, name: 'PEAD - Polietileno' },
  { id: 3, name: 'PVC - Policlorreto' },
]

export default function FeaturedProducts() {
  const navigate = useNavigate()

  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Featured recycling products
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {featuredProducts.map((p) => {
          const productKey = p.name.split('-')[0].trim().toUpperCase()

          return (
            <button
              key={p.id}
              onClick={() => navigate('/products')}
              className="
                relative min-w-[180px] h-24
                rounded-xl overflow-hidden
                shadow-sm
                text-left
              "
            >
              <img
                src={productImages[productKey]}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 h-full p-3 flex items-end text-white">
                <span className="text-xs font-medium">
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
