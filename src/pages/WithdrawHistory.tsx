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
        return { 
          label: 'Concluído', 
          color: 'text-green-500', 
          bg: 'bg-green-500/10', 
          icon: <CheckCircle size={28} weight="duotone" /> 
        }
      case 'PENDING':
        return { 
          label: 'Em Processamento', 
          color: 'text-orange-500', 
          bg: 'bg-orange-500/10', 
          icon: <HourglassMedium size={28} weight="duotone" /> 
        }
      case 'REJECTED':
        return { 
          label: 'Recusado', 
          color: 'text-red-500', 
          bg: 'bg-red-500/10', 
          icon: <XCircle size={28} weight="duotone" /> 
        }
      default:
        return { 
          label: status, 
          color: 'text-gray-400', 
          bg: 'bg-white/5', 
          icon: <Receipt size={28} weight="duotone" /> 
        }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-12 pb-32 font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM */}
      <div className="flex items-center gap-4 mb-10 max-w-xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 bg-[#111] border border-white/5 rounded-full hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Movimentos</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Registo de levantamentos</p>
        </div>
      </div>

      <main className="max-w-xl mx-auto space-y-6">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold tracking-widest uppercase">Sincronizando...</p>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl">
            <ClockCounterClockwise size={48} weight="thin" className="mx-auto mb-4 opacity-20" />
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
              Sem registos de saída
            </p>
          </div>
        )}

        <div className="space-y-4">
          {items.map(w => {
            const meta = getStatusMeta(w.status)
            return (
              <div
                key={w.id}
                className="bg-[#111] border border-white/5 rounded-[2rem] p-6 shadow-2xl transition-all hover:border-white/10 group"
              >
                <div className="flex items-center gap-5">
                  {/* ÍCONE DE STATUS GRANDE (28px) */}
                  <div className={`w-14 h-14 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
                    {meta.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Montante</p>
                        <p className="text-lg font-black tracking-tight italic">
                          {Number(w.amount).toLocaleString()} <span className="text-[10px] not-italic opacity-30">Kz</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] font-black uppercase tracking-tighter ${meta.color}`}>
                          {meta.label}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Receipt size={14} className="text-gray-700" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase">
                          Taxa: <span className="text-white/40">{Number(w.fee).toLocaleString()} Kz</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <CalendarBlank size={14} className="text-gray-700" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase">
                          {new Date(w.createdAt).toLocaleDateString('pt-AO')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* FOOTER PROTOCOLO */}
      <footer className="mt-12 text-center opacity-20">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Audit Log Verified • EMATEA 2026</p>
      </footer>
    </div>
  )
}