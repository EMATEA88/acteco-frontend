// src/pages/WithdrawHistory.tsx
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Withdrawal {
  id: number
  amount: number
  fee: number
  status: string
  createdAt: string
}

export default function WithdrawHistory() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/withdrawals')
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">Histórico de retiradas</h1>
      </div>

      {loading && <p className="text-sm opacity-60">Carregando…</p>}

      {!loading && items.length === 0 && (
        <p className="text-sm opacity-60">
          Nenhuma retirada encontrada
        </p>
      )}

      <div className="space-y-3">
        {items.map(w => (
          <div
            key={w.id}
            className="bg-white rounded-xl p-4 shadow-sm text-sm"
          >
            <p>
              <b>Valor:</b> {w.amount.toLocaleString()} Kz
            </p>
            <p>
              <b>Taxa:</b> {w.fee.toLocaleString()} Kz
            </p>
            <p>
              <b>Status:</b> {w.status}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(w.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

