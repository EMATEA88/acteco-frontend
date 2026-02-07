import { useNavigate } from 'react-router-dom'
import { productImages } from '../utils/productImages'

interface FeaturedProduct {
  id: number
  name: string
  dailyIncome: number
  durationDays: number
}

const featuredProducts: FeaturedProduct[] = [
  { id: 1, name: 'PET - Etileno', dailyIncome: 210, durationDays: 180 },
  { id: 2, name: 'PEAD - Polietileno', dailyIncome: 525, durationDays: 180 },
  { id: 3, name: 'PVC - Policlorreto', dailyIncome: 1050, durationDays: 180 },
]

export default function FeaturedProducts() {
  const navigate = useNavigate()

  return (
    <div className="px-4 mt-6">
      <h2 className="text-lg font-semibold mb-3">Product services</h2>

      <div className="space-y-4">
        {featuredProducts.map(p => {
          const productKey = p.name.split('-')[0].trim().toUpperCase()

          return (
            <div
              key={p.id}
              className="relative h-36 rounded-2xl overflow-hidden shadow"
            >
              <img
                src={productImages[productKey]}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative z-10 p-4 text-white">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm mt-1">
                  {p.dailyIncome} Kz / dia · {p.durationDays} dias
                </p>

                <button
                  onClick={() => navigate('/products')}
                  className="mt-3 px-4 py-1.5 bg-green-500 rounded-full text-sm font-medium"
                >
                  Investir agora
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
