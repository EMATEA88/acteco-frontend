import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { 
  ArrowLeft, 
  CheckCircle, 
  HourglassMedium, 
  XCircle,
  Receipt,
  CalendarBlank,
  Copy,
  ArrowSquareOut,
  Funnel
} from '@phosphor-icons/react'
import toast from 'react-hot-toast'

interface Withdrawal {
  id: number
  type: 'AOA' | 'USDT'
  amount: number
  fee: number
  status: string
  createdAt: string
  txHash?: string
}

export default function WithdrawHistory() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'AOA' | 'USDT'>('ALL')

  useEffect(() => {
    api.get('/withdrawals')
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Erro ao carregar histórico"))
      .finally(() => setLoading(false))
  }, [])

  const filteredItems = items.filter(i => filter === 'ALL' ? true : i.type === filter)

  function copy(tx?: string) {
    if (!tx) return
    navigator.clipboard.writeText(tx)
    toast.success("Hash copiada", { style: { background: '#161A1E', color: '#fff', fontSize: '12px' } })
  }

  function getStatusMeta(status: string) {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'APPROVED':
      case 'CONCLUÍDO':
        return { label: 'Concluído', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <CheckCircle size={18} weight="duotone" /> }
      case 'PENDING':
        return { label: 'Análise', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <HourglassMedium size={18} weight="duotone" /> }
      case 'REJECTED':
      case 'FAILED':
        return { label: 'Recusado', color: 'text-red-400', bg: 'bg-red-500/10', icon: <XCircle size={18} weight="duotone" /> }
      default:
        return { label: status, color: 'text-gray-400', bg: 'bg-white/5', icon: <Receipt size={18} /> }
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* HEADER FIXO */}
      <div className="sticky top-0 z-20 bg-[#0B0E11]/80 backdrop-blur-xl border-b border-white/5 px-5 py-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <div>
            <h1 className="text-lg font-bold">Histórico</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[2px]">Movimentações de Saída</p>
          </div>
        </div>

        {/* FILTROS RÁPIDOS */}
        <div className="flex gap-2 mt-6">
          {(['ALL', 'AOA', 'USDT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === t 
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                : 'bg-white/5 text-gray-400 border border-white/5'
              }`}
            >
              {t === 'ALL' ? 'Todos' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 pb-28 max-w-2xl mx-auto">
        {loading ? (
          /* SKELETON LOADING */
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 w-full bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <Funnel size={32} className="text-gray-600" />
            </div>
            <h3 className="text-gray-300 font-medium">Nenhum registro</h3>
            <p className="text-gray-500 text-xs mt-1">Não encontramos levantamentos para este filtro.</p>
          </div>
        ) : (
          /* LISTA PROFISSIONAL */
          <div className="space-y-4">
            {filteredItems.map(w => {
              const meta = getStatusMeta(w.status)
              return (
                <div 
                  key={w.id} 
                  className="group bg-[#161A1E] hover:bg-[#1C2127] border border-white/5 p-4 rounded-2xl transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${meta.bg} ${meta.color}`}>
                      {meta.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-[15px] font-bold text-white">
                            {w.type === 'USDT' ? `${w.amount} USDT` : `${Number(w.amount).toLocaleString('pt-AO')} AOA`}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <CalendarBlank size={12} className="text-gray-500" />
                            <span className="text-[11px] text-gray-500 font-medium">
                              {new Date(w.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${meta.bg} ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>

                      {/* DETALHES TÉCNICOS */}
                      <div className="mt-3 pt-3 border-t border-white/[0.03] flex items-center justify-between">
                        {w.type === 'AOA' ? (
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Receipt size={13} />
                            <span className="text-[11px]">Taxa: {Number(w.fee).toLocaleString()} Kz</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-[11px] text-gray-500 font-mono truncate max-w-[120px]">
                              {w.txHash || 'Processando hash...'}
                            </span>
                            {w.txHash && (
                              <div className="flex items-center gap-2">
                                <button onClick={() => copy(w.txHash)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white">
                                  <Copy size={14} />
                                </button>
                                <button onClick={() => window.open(`https://tronscan.org/#/transaction/${w.txHash}`, '_blank')} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-cyan-400">
                                  <ArrowSquareOut size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-gray-600 font-bold italic">ID: #{w.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}