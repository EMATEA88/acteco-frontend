import { useEffect, useState } from 'react'
import { api } from '../services/api'

/* =========================
   TYPES
========================= */

type TransactionType =
  | 'RECHARGE'
  | 'WITHDRAW'
  | 'TASK_INCOME'
  | 'GIFT'
  | 'COMMISSION'
  | 'DEBIT'

type Transaction = {
  id: number
  type: TransactionType
  amount: number
  createdAt: string
}

/* =========================
   COMPONENT
========================= */

export default function History() {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    api
      .get('/wallet/history')
      .then(res => {
        if (mounted) setItems(res.data)
      })
      .catch(() => {
        if (mounted) setError(true)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Histórico</h1>

      {/* LOADING */}
      {loading && (
        <p className="text-sm opacity-60">Carregando histórico…</p>
      )}

      {/* ERROR */}
      {!loading && error && (
        <p className="text-sm text-red-500">
          Não foi possível carregar o histórico
        </p>
      )}

      {/* EMPTY */}
      {!loading && !error && items.length === 0 && (
        <p className="text-sm opacity-60">
          Nenhuma movimentação encontrada
        </p>
      )}

      {/* LIST */}
      {!loading &&
        !error &&
        items.map(t => {
          const isPositive =
            t.type === 'RECHARGE' ||
            t.type === 'TASK_INCOME' ||
            t.type === 'GIFT' ||
            t.type === 'COMMISSION'

          return (
            <div
              key={t.id}
              className="bg-white p-3 rounded shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">{t.type}</p>
                <p className="text-xs text-gray-500">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>

              <p
                className={
                  isPositive
                    ? 'text-green-600 font-semibold'
                    : 'text-red-600 font-semibold'
                }
              >
                {isPositive ? '+' : '-'} {t.amount} Kz
              </p>
            </div>
          )
        })}
    </div>
  )
}
