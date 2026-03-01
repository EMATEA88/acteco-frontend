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

  function getStatusColor(status: string) {
    switch (status) {
      case 'SUCCESS':
        return 'text-emerald-400'
      case 'PENDING':
        return 'text-yellow-400'
      case 'REJECTED':
        return 'text-red-400'
      default:
        return 'text-[#EAECEF]'
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] p-6 pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-[#EAECEF] hover:text-[#FCD535] transition"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="text-2xl font-semibold text-[#EAECEF]">
          Histórico de retiradas
        </h1>
      </div>

      {loading && (
        <p className="text-sm text-[#848E9C]">
          Carregando…
        </p>
      )}

      {!loading && items.length === 0 && (
        <div className="
          bg-[#1E2329] border border-[#2B3139]
          rounded-2xl p-6 text-center
          text-[#848E9C]
        ">
          Nenhuma retirada encontrada
        </div>
      )}

      <div className="space-y-4">

        {items.map(w => (
          <div
            key={w.id}
            className="
              bg-[#1E2329]
              border border-[#2B3139]
              rounded-2xl
              p-5
              text-sm
            "
          >
            <div className="flex justify-between mb-2">
              <span className="text-[#848E9C]">Valor</span>
              <span className="font-semibold text-[#EAECEF]">
                {Number(w.amount).toLocaleString()} Kz
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-[#848E9C]">Taxa</span>
              <span className="text-red-400">
                {Number(w.fee).toLocaleString()} Kz
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-[#848E9C]">Status</span>
              <span className={`font-medium ${getStatusColor(w.status)}`}>
                {w.status}
              </span>
            </div>

            <div className="text-xs text-[#6B7280] mt-3">
              {new Date(w.createdAt).toLocaleString()}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}