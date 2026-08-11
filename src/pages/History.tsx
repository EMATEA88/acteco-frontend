import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { 
  ArrowLeft, 
  ArrowsClockwise, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  Percent, 
  MinusCircle, 
  CalendarBlank, 
  Funnel,
} from '@phosphor-icons/react'
import toast from 'react-hot-toast'

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
  const navigate = useNavigate()
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    let mounted = true

    api
      .get('/wallet/history')
      .then(res => {
        if (mounted) setItems(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (mounted) {
          setError(true)
          toast.error("Erro ao carregar histórico")
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredItems = items.filter(t => {
    if (filter === 'ALL') return true
    if (filter === 'INCOME') {
      return t.type === 'RECHARGE' || t.type === 'TASK_INCOME' || t.type === 'GIFT' || t.type === 'COMMISSION'
    }
    if (filter === 'EXPENSE') {
      return t.type === 'WITHDRAW' || t.type === 'DEBIT'
    }
    return t.type === filter
  })

  function getTransactionMeta(type: TransactionType) {
    switch (type) {
      case 'RECHARGE':
        return {
          label: 'Depósito / Recarga',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: <ArrowDownLeft size={20} weight="duotone" />
        }
      case 'TASK_INCOME':
        return {
          label: 'Rendimento de Tarefa',
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/20',
          icon: <ArrowsClockwise size={20} weight="duotone" />
        }
      case 'GIFT':
        return {
          label: 'Bônus / Presente',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          icon: <Gift size={20} weight="duotone" />
        }
      case 'COMMISSION':
        return {
          label: 'Comissão de Rede',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: <Percent size={20} weight="duotone" />
        }
      case 'WITHDRAW':
        return {
          label: 'Levantamento',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          icon: <ArrowUpRight size={20} weight="duotone" />
        }
      case 'DEBIT':
      default:
        return {
          label: 'Débito / Saída',
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: <MinusCircle size={20} weight="duotone" />
        }
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
            <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Histórico Geral</h1>
            <p className="text-[10px] font-mono text-cyan-200/70 uppercase tracking-[0.2em]">Movimentações da Carteira</p>
          </div>
        </div>

        {/* FILTROS RÁPIDOS */}
        <div className="flex gap-2 mt-6 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'INCOME', label: 'Entradas' },
            { id: 'EXPENSE', label: 'Saídas' },
            { id: 'RECHARGE', label: 'Recargas' },
            { id: 'WITHDRAW', label: 'Saques' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id 
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950/40 border border-cyan-400/50' 
                : 'bg-[#0e364a] text-cyan-200/70 hover:text-white border border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 pb-28 max-w-2xl mx-auto relative z-10 space-y-4">

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 w-full bg-[#0e364a] rounded-[2rem] animate-pulse border border-cyan-500/10 shadow-xl" />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-[#0e364a] border border-red-500/20 rounded-[2rem] p-12 text-center shadow-xl">
            <p className="text-sm font-mono text-red-400">
              Não foi possível carregar o histórico
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-[#0e364a] border border-cyan-500/20 rounded-2xl mb-4 shadow-xl text-cyan-400">
              <Funnel size={32} weight="duotone" />
            </div>
            <h3 className="text-white font-mono font-bold tracking-tight">Nenhuma movimentação encontrada</h3>
            <p className="text-cyan-200/70 font-mono text-xs mt-1">Tente alterar os filtros ou realize transações na sua conta.</p>
          </div>
        )}

        {/* LIST */}
        {!loading && !error && filteredItems.map(t => {
          const isPositive =
            t.type === 'RECHARGE' ||
            t.type === 'TASK_INCOME' ||
            t.type === 'GIFT' ||
            t.type === 'COMMISSION'

          const meta = getTransactionMeta(t.type)

          return (
            <div
              key={t.id}
              className="group bg-[#0e364a] hover:bg-[#124158] border border-cyan-500/20 hover:border-cyan-400/50 p-5 rounded-[2rem] flex items-center justify-between transition-all duration-300 shadow-xl shadow-cyan-950/20"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${meta.bg} ${meta.color} ${meta.border}`}>
                  {meta.icon}
                </div>

                <div className="min-w-0">
                  <p className="font-mono font-bold text-white text-sm uppercase tracking-wider truncate">
                    {meta.label}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-cyan-200/70">
                    <CalendarBlank size={13} weight="duotone" className="text-cyan-300/70" />
                    <span className="text-[11px] font-mono font-medium uppercase tracking-wider">
                      {new Date(t.createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0 ml-4">
                <p
                  className={`text-base font-mono font-black tracking-tight ${
                    isPositive
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {isPositive ? '+' : '-'} {Number(t.amount).toLocaleString('pt-AO')} <span className="text-xs font-sans">Kz</span>
                </p>
                <span className="text-[10px] text-cyan-300/50 font-mono font-bold uppercase tracking-wider block mt-0.5">
                  ID: #{t.id}
                </span>
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}