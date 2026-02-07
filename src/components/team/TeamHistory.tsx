import { useEffect, useState } from 'react'
import { CommissionService } from '../../services/commission.service'

type User = {
  id: number
  phone: string
  createdAt: string
}

/**
 * DTO real vindo da API
 * (não é o model Prisma)
 */
type CommissionHistoryItem = {
  id: number
  level: number
  amount: number
  createdAt: string
  fromUserId: number
}

type Props = {
  user: User | null
  onClose: () => void
}

export default function TeamHistory({ user, onClose }: Props) {
  const [history, setHistory] = useState<CommissionHistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    setLoading(true)

    CommissionService.getHistory()
      .then(res => {
        const data = res.data as CommissionHistoryItem[]

        const filtered = data.filter(
          c => c.fromUserId === user.id
        )

        setHistory(filtered)
      })
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-80 p-5">
        <p className="font-semibold text-gray-800 mb-1">
          Commission history
        </p>
        <p className="text-xs text-gray-500 mb-4">
          {user.phone}
        </p>

        <div className="space-y-3 text-sm">
          {loading && (
            <p className="opacity-60">Loading…</p>
          )}

          {!loading && history.length === 0 && (
            <p className="opacity-60">
              No commissions yet
            </p>
          )}

          {history.map(h => (
            <div
              key={h.id}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="text-gray-800">
                  Level {h.level}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(h.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="font-medium text-emerald-600">
                +{h.amount.toFixed(2)} Kz
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-xl text-sm"
        >
          Close
        </button>
      </div>
    </div>
  )
}
