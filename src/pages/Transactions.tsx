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
  PaperPlaneTilt,
  UsersThree,
  Clock, // Ícone de fallback
} from '@phosphor-icons/react'

type Transaction = {
  id: number
  type: string
  amount: number
  createdAt: string
}

const CACHE_KEY = 'transactions-cache'

// Adicionado suporte para INTERNAL_TRANSFER e KIXIKILA
const TYPE_META: Record<string, any> = {
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-emerald-500', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-white', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-white', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Serviço', icon: Receipt, color: 'text-white', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-emerald-500', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-white', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowUpRight, color: 'text-white', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-emerald-500', sign: '+', category: 'IN' },
  
  // NOVOS TIPOS REGISTRADOS AQUI:
  INTERNAL_TRANSFER_IN: { label: 'Transf. Recebida', icon: ArrowDownLeft, color: 'text-cyan-400', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_OUT: { label: 'Transf. Enviada', icon: PaperPlaneTilt, color: 'text-white', sign: '-', category: 'OUT' },
  KIXIKILA_IN: { label: 'Kixikila Recebida', icon: UsersThree, color: 'text-emerald-500', sign: '+', category: 'IN' },
  KIXIKILA_OUT: { label: 'Kixikila Enviada', icon: UsersThree, color: 'text-white', sign: '-', category: 'OUT' }
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
      if (!meta) return filter === 'ALL' // Se não encontrar meta, só mostra em "Todos"
      if (filter === 'ALL') return true
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
        day: '2-digit', month: 'short'
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(tx)
      return acc
    }, {})
  }, [filtered])

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-lg font-semibold uppercase tracking-tighter italic">Transações</h1>

        <Funnel size={18} className="text-gray-500" />
      </div>

      {/* RESUMO */}
      <div className="bg-[#161A1F] border border-white/5 p-5 rounded-[2rem] space-y-4 shadow-2xl">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Saldo total</p>

        <h2 className="text-3xl text-emerald-500 font-normal">
          {summary.balance.toLocaleString()} <span className="text-sm">Kz</span>
        </h2>

        <div className="flex justify-between text-[10px] font-bold pt-3 border-t border-white/5">
          <span className="text-emerald-500 uppercase">Entradas: +{summary.totalIn.toLocaleString()}</span>
          <span className="text-gray-500 uppercase">Saídas: -{summary.totalOut.toLocaleString()}</span>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2">
        {(['ALL', 'IN', 'OUT'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-[#161A1F] text-gray-500 border border-white/5'
            }`}
          >
            {f === 'ALL' ? 'Todos' : f === 'IN' ? 'Entradas' : 'Saídas'}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="space-y-6">
        {loading && <p className="text-center text-gray-500 text-xs animate-pulse">Sincronizando registros...</p>}

        {!loading && Object.entries(grouped).length === 0 && (
          <div className="flex flex-col items-center gap-2 pt-10 opacity-20">
             <Receipt size={48} />
             <p className="text-xs uppercase font-bold">Nenhuma atividade encontrada</p>
          </div>
        )}

        {!loading && Object.entries(grouped).map(([date, txs]: any) => (
          <div key={date} className="space-y-3">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-2">{date}</p>

            {txs.map((tx: Transaction) => {
              // PROTEÇÃO: Caso o tipo não exista no meta, usa o fallback
              const meta = TYPE_META[tx.type] || { 
                label: tx.type, 
                icon: Clock, 
                color: 'text-gray-400', 
                sign: '', 
                category: 'ALL' 
              }
              const Icon = meta.icon

              return (
                <div
                  key={tx.id}
                  className="bg-[#161A1F] border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:bg-[#1c2127] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-[#0B0E11] rounded-full flex items-center justify-center border border-white/5 ${meta.color}`}>
                      <Icon size={18} weight="bold" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-200">{meta.label}</p>
                      <p className="text-[10px] text-gray-600 font-mono">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <span className={`text-sm font-bold ${meta.color}`}>
                    {meta.sign}{tx.amount.toLocaleString()} <span className="text-[10px]">Kz</span>
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}