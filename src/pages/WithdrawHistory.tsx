import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { 
  ArrowLeft, 
  ClockCounterClockwise, 
  CheckCircle, 
  HourglassMedium, 
  XCircle,
  Receipt,
  CalendarBlank
} from '@phosphor-icons/react'

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

  function getStatusMeta(status: string) {
  switch (status) {
    case 'SUCCESS':
    case 'APPROVED': // 👈 agora fica verde também
      return { 
        label: 'Concluído', 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        icon: <CheckCircle size={18} /> 
      }

    case 'PENDING':
      return { 
        label: 'Pendente', 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/10', 
        icon: <HourglassMedium size={18} /> 
      }

    case 'REJECTED':
      return { 
        label: 'Recusado', 
        color: 'text-red-400', 
        bg: 'bg-red-500/10', 
        icon: <XCircle size={18} /> 
      }

    default:
      return { 
        label: status, 
        color: 'text-gray-400', 
        bg: 'bg-white/5', 
        icon: <Receipt size={18} /> 
      }
  }
}

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-8 pb-28">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-semibold">Levantamentos</h1>
        </div>

        <ClockCounterClockwise size={18} className="text-gray-500" />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <div className="glass-card p-5 rounded-2xl text-center text-sm text-gray-400">
          Sem levantamentos ainda
        </div>
      )}

      {/* LISTA */}
      <div className="space-y-3">
        {items.map(w => {
          const meta = getStatusMeta(w.status)

          return (
            <div
              key={w.id}
              className="glass-card p-4 rounded-2xl flex items-center gap-3"
            >
              {/* ICON */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.bg} ${meta.color}`}>
                {meta.icon}
              </div>

              {/* CONTENT */}
              <div className="flex-1">

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {Number(w.amount).toLocaleString()} Kz
                  </span>

                  <span className={`text-xs px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Receipt size={12} />
                    {Number(w.fee).toLocaleString()} Kz
                  </div>

                  <div className="flex items-center gap-1">
                    <CalendarBlank size={12} />
                    {new Date(w.createdAt).toLocaleDateString('pt-AO')}
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}