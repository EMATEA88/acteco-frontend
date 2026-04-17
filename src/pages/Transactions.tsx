import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransactionService } from '../services/transaction.service'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Gift,
  Coins,
  Receipt,
  ArrowLeft,
  Funnel,
  ArrowsLeftRight // Importação corrigida aqui
} from '@phosphor-icons/react'

type Transaction = {
  id: number
  type: string
  amount: number
  createdAt: string
}

const CACHE_KEY = 'transactions-cache'

const TYPE_META: Record<string, any> = {
  RECHARGE: { label: 'Recarga de Saldo', icon: Wallet, color: 'text-green-400', bg: 'bg-green-500/10', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-white', bg: 'bg-white/5', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-white', bg: 'bg-white/5', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-green-400', bg: 'bg-green-500/10', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Pagamento de Serviço', icon: Receipt, color: 'text-white', bg: 'bg-white/5', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso Recebido', icon: ArrowDownLeft, color: 'text-green-400', bg: 'bg-green-500/10', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-green-400', bg: 'bg-green-500/10', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente Enviado', icon: Gift, color: 'text-white', bg: 'bg-white/5', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento em Curso', icon: ArrowUpRight, color: 'text-white', bg: 'bg-white/5', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro de Investimento', icon: ArrowDownLeft, color: 'text-green-400', bg: 'bg-green-500/10', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Recompensa de Tarefa', icon: Coins, color: 'text-green-400', bg: 'bg-green-500/10', sign: '+', category: 'IN' }
}

export default function Transactions() {
  const navigate = useNavigate()
  const cached = localStorage.getItem(CACHE_KEY)
  const initial = cached ? JSON.parse(cached) : []

  const [items, setItems] = useState<Transaction[]>(initial)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL')

  useEffect(() => {
    TransactionService.list()
      .then(data => {
        if (!Array.isArray(data)) return
        setItems(data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return items.filter(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta || filter === 'ALL') return true
      return meta.category === filter
    })
  }, [items, filter])

  const summary = useMemo(() => {
    let totalIn = 0; let totalOut = 0
    items.forEach(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta) return
      if (meta.category === 'IN') totalIn += Number(tx.amount)
      else totalOut += Number(tx.amount)
    })
    return { totalIn, totalOut, balance: totalIn - totalOut }
  }, [items])

  const grouped = useMemo(() => {
    return filtered.reduce((acc: any, tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString('pt-AO', {
        day: '2-digit', month: 'long'
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(tx)
      return acc
    }, {})
  }, [filtered])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase">Histórico</h1>
        </div>
        <Funnel size={24} weight="light" className="text-gray-500" />
      </div>

      <main className="max-w-xl mx-auto pb-32">
        
        {/* RESUMO DE FLUXO */}
        <div className="p-6">
          <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ArrowsLeftRight size={80} weight="thin" />
            </div>
            
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Balanço do Período</p>
            <h2 className="text-3xl font-black tracking-tighter italic mb-8">
              {summary.balance.toLocaleString()} Kz
            </h2>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Entradas</p>
                <p className="text-green-400 font-bold text-sm">+{summary.totalIn.toLocaleString()} Kz</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Saídas</p>
                <p className="text-white font-bold text-sm">-{summary.totalOut.toLocaleString()} Kz</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTROS SEGMENTADOS */}
        <div className="flex gap-2 px-6 mb-8">
          {['ALL', 'IN', 'OUT'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-black' : 'bg-[#111] text-gray-500 border border-white/5'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'IN' ? 'Entradas' : 'Saídas'}
            </button>
          ))}
        </div>

        {/* LISTA DE TRANSAÇÕES */}
        <div className="px-6 space-y-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-bold tracking-widest">A Sincronizar...</p>
            </div>
          ) : Object.entries(grouped).length === 0 ? (
            <div className="text-center py-20 text-gray-600 font-medium font-mono text-xs uppercase tracking-widest">Nenhum registo encontrado</div>
          ) : (
            Object.entries(grouped).map(([date, txs]: any) => (
              <div key={date} className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] ml-2 font-mono">
                  {date}
                </h3>

                <div className="space-y-3">
                  {txs.map((tx: Transaction) => {
                    const meta = TYPE_META[tx.type] || { label: tx.type, icon: Receipt, color: 'text-gray-400', bg: 'bg-white/5', sign: '', category: 'IN' }
                    const Icon = meta.icon
                    return (
                      <div
                        key={tx.id}
                        className="bg-[#111]/50 border border-white/5 rounded-[1.8rem] p-5 flex justify-between items-center group active:scale-[0.98] transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {/* ÍCONES GRANDES E DUOTONE */}
                          <div className={`w-14 h-14 rounded-2xl ${meta.bg} flex items-center justify-center ${meta.color}`}>
                            <Icon size={28} weight="duotone" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight leading-tight">{meta.label}</p>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                              {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-sm font-black tracking-tight ${meta.color}`}>
                            {meta.sign}{Number(tx.amount).toLocaleString()}
                          </p>
                          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic">Kwanza</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}