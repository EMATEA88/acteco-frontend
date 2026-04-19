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
} from '@phosphor-icons/react'

type Transaction = {
  id: number
  type: string
  amount: number
  createdAt: string
}

const CACHE_KEY = 'transactions-cache'

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
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-emerald-500', sign: '+', category: 'IN' }
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
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl">
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-lg font-semibold">Transações</h1>

        <Funnel size={18} className="text-gray-500" />
      </div>

      {/* RESUMO (AJUSTADO) */}
      <div className="glass-card p-5 rounded-2xl space-y-4">

        <p className="text-xs text-gray-500">Saldo total</p>

        <h2 className="text-2xl text-emerald-500 font-medium">
          {summary.balance.toLocaleString()} Kz
        </h2>

        <div className="flex justify-between text-xs pt-3 border-t border-white/5">
          <span className="text-emerald-500">+{summary.totalIn.toLocaleString()}</span>
          <span className="text-white">-{summary.totalOut.toLocaleString()}</span>
        </div>

      </div>

      {/* FILTROS */}
      <div className="flex gap-2">
        {['ALL', 'IN', 'OUT'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`flex-1 py-2 rounded-xl text-xs ${
              filter === f
                ? 'bg-white text-black'
                : 'bg-white/5 text-gray-500'
            }`}
          >
            {f === 'ALL' ? 'Todos' : f === 'IN' ? 'Entradas' : 'Saídas'}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="space-y-6">

        {loading && (
          <p className="text-center text-gray-500 text-sm">
            Carregando transações...
          </p>
        )}

        {!loading && Object.entries(grouped).length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            Sem registros
          </p>
        )}

        {!loading && Object.entries(grouped).map(([date, txs]: any) => (
          <div key={date} className="space-y-3">

            <p className="text-xs text-gray-500">{date}</p>

            {txs.map((tx: Transaction) => {
              const meta = TYPE_META[tx.type]
              const Icon = meta.icon

              return (
                <div
                  key={tx.id}
                  className="glass-card p-3 rounded-xl flex justify-between items-center"
                >

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center">
                      <Icon size={16}/>
                    </div>

                    <div>
                      <p className="text-sm">{meta.label}</p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <span className={`text-sm ${meta.color}`}>
                    {meta.sign}{tx.amount.toLocaleString()} Kz
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