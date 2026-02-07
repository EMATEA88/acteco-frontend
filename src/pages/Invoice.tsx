import { useEffect, useState } from 'react'
import { InvoiceService } from '../services/invoice.service'

type Transaction = {
  id: number
  type: string
  amount: number
  createdAt: string
}

export default function Invoice() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await InvoiceService.get()
        if (data?.transactions) {
          setTransactions(data.transactions)
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const total = transactions.reduce(
    (sum, t) => sum + t.amount,
    0
  )

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        A carregar fatura…
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Fatura
        </h1>
        <p className="text-sm text-gray-500">
          Resumo financeiro das suas transações
        </p>
      </div>

      {/* RESUMO */}
      <div className="bg-white rounded-2xl p-5 shadow-soft">
        <p className="text-sm text-gray-500">
          Total movimentado
        </p>
        <p className="text-2xl font-semibold text-emerald-600 mt-1">
          {total.toLocaleString()} Kz
        </p>
      </div>

      {/* LISTA */}
      {transactions.length === 0 ? (
        <div className="text-center text-sm text-gray-500">
          Nenhuma transação disponível
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-xl p-4 shadow-soft flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t.type}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {t.amount.toLocaleString()} Kz
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
