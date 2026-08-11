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
    toast.success("Hash copiada", { style: { background: '#0e364a', color: '#fff', fontSize: '12px', border: '1px solid rgba(6, 182, 212, 0.2)' } })
  }

  function getStatusMeta(status: string) {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'APPROVED':
      case 'CONCLUÍDO':
        return { label: 'Concluído', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle size={18} weight="duotone" /> }
      case 'PENDING':
        return { label: 'Análise', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <HourglassMedium size={18} weight="duotone" /> }
      case 'REJECTED':
      case 'FAILED':
        return { label: 'Recusado', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle size={18} weight="duotone" /> }
      default:
        return { label: status, color: 'text-cyan-200/70', bg: 'bg-cyan-500/5', border: 'border-cyan-500/10', icon: <Receipt size={18} /> }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.06] rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-20 bg-[#0a2533]/90 backdrop-blur-xl border-b border-cyan-500/10 px-6 py-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Histórico</h1>
            <p className="text-[10px] font-mono text-cyan-200/70 uppercase tracking-[0.2em]">Movimentações de Saída</p>
          </div>
        </div>

        {/* FILTROS RÁPIDOS */}
        <div className="flex gap-2 mt-6">
          {(['ALL', 'AOA', 'USDT'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                filter === t 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/40 border border-cyan-400/50' 
                : 'bg-[#0e364a] text-cyan-200/70 hover:text-white border border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {t === 'ALL' ? 'Todos' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 pb-28 max-w-2xl mx-auto relative z-10">
        {loading ? (
          /* SKELETON LOADING */
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 w-full bg-[#0e364a] rounded-[2rem] animate-pulse border border-cyan-500/10 shadow-xl" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-[#0e364a] border border-cyan-500/20 rounded-2xl mb-4 shadow-xl">
              <Funnel size={32} weight="duotone" className="text-cyan-400" />
            </div>
            <h3 className="text-white font-mono font-bold tracking-tight">Nenhum registro</h3>
            <p className="text-cyan-200/70 font-mono text-xs mt-1">Não encontramos levantamentos para este filtro.</p>
          </div>
        ) : (
          /* LISTA PROFISSIONAL */
          <div className="space-y-4">
            {filteredItems.map(w => {
              const meta = getStatusMeta(w.status)
              return (
                <div 
                  key={w.id} 
                  className="group bg-[#0e364a] hover:bg-[#124158] border border-cyan-500/20 hover:border-cyan-400/50 p-5 rounded-[2rem] transition-all duration-300 shadow-xl shadow-cyan-950/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border ${meta.bg} ${meta.color} ${meta.border}`}>
                      {meta.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-base font-mono font-black text-white tracking-tight">
                            {w.type === 'USDT' ? `${w.amount} USDT` : `${Number(w.amount).toLocaleString('pt-AO')} AOA`}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <CalendarBlank size={13} weight="duotone" className="text-cyan-300/70" />
                            <span className="text-[11px] text-cyan-200/70 font-mono font-medium">
                              {new Date(w.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-3 py-1 rounded-xl font-black font-mono uppercase tracking-wider border ${meta.bg} ${meta.color} ${meta.border} shadow-sm`}>
                          {meta.label}
                        </span>
                      </div>

                      {/* DETALHES TÉCNICOS */}
                      <div className="mt-4 pt-3 border-t border-cyan-500/10 flex items-center justify-between">
                        {w.type === 'AOA' ? (
                          <div className="flex items-center gap-2 text-cyan-200/70 font-mono">
                            <Receipt size={14} weight="duotone" className="text-cyan-400" />
                            <span className="text-xs">Taxa: {Number(w.fee).toLocaleString()} Kz</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-xs text-cyan-200/70 font-mono truncate max-w-[150px]">
                              {w.txHash || 'Processando hash...'}
                            </span>
                            {w.txHash && (
                              <div className="flex items-center gap-1">
                                <button onClick={() => copy(w.txHash)} className="p-1.5 bg-[#0a2533] hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition-colors text-cyan-300 hover:text-white cursor-pointer" title="Copiar Hash">
                                  <Copy size={14} weight="bold" />
                                </button>
                                <button onClick={() => window.open(`https://tronscan.org/#/transaction/${w.txHash}`, '_blank')} className="p-1.5 bg-[#0a2533] hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition-colors text-cyan-300 hover:text-cyan-200 cursor-pointer" title="Ver no Tronscan">
                                  <ArrowSquareOut size={14} weight="bold" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-cyan-300/50 font-mono font-bold uppercase tracking-wider">ID: #{w.id}</span>
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