import { useEffect, useState } from 'react'
import { RechargeService } from '../services/recharge.service'

type Recharge = {
  id: number
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  approvedAt?: string
}

type ApiResponse = {
  data: Recharge[]
}

export default function RechargeHistory() {
  const [items, setItems] = useState<Recharge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res: ApiResponse = await RechargeService.myHistory()
        setItems(res.data || [])
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <p className="p-6 text-sm opacity-60">
        Loading history…
      </p>
    )
  }

  return (
    <div className="p-6 pb-24">
      <h1 className="text-xl font-semibold mb-6">
        Recharge History
      </h1>

      {items.length === 0 && (
        <p className="text-sm opacity-60">
          No recharge records found
        </p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              bg-white
              rounded-2xl
              p-4
              shadow
              flex
              justify-between
              items-center
            "
          >
            <div>
              <p className="font-semibold">
                {item.amount.toLocaleString()} Kz
              </p>

              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                item.status === 'APPROVED'
                  ? 'bg-green-100 text-green-700'
                  : item.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
