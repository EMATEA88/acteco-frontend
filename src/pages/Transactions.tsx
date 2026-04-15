import { useEffect, useState, useMemo } from 'react'
import { TransactionService } from '../services/transaction.service'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Gift,
  Coins,
} from 'lucide-react'

type Transaction = {
  id: number
  type: string
  amount: number
  createdAt: string
}

const CACHE_KEY = 'transactions-cache'

const TYPE_META: Record<
  string,
  {
    label: string
    icon: any
    color: string
    sign: '+' | '-'
    category: 'IN' | 'OUT'
  }
> = {
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-[#FCD535]', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowDownCircle, color: 'text-red-500', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowDownCircle, color: 'text-red-500', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Pagamento Serviço', icon: ArrowDownCircle, color: 'text-red-500', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-[#FCD535]', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-[#FCD535]', sign: '+', category: 'IN' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowDownCircle, color: 'text-red-500', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro Investimento', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+', category: 'IN' },
  INVESTMENT_CANCEL_REFUND: { label: 'Cancelamento', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+', category: 'IN' },

  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-emerald-500', sign: '+', category: 'IN' }
}

export default function Transactions() {

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

  /* =========================
     FILTRO
  ========================= */
  const filtered = useMemo(() => {
    return items.filter(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta) return true
      if (filter === 'ALL') return true
      return meta.category === filter
    })
  }, [items, filter])

  /* =========================
     RESUMO
  ========================= */
  const summary = useMemo(() => {
    let totalIn = 0
    let totalOut = 0

    items.forEach(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta) return

      if (meta.category === 'IN') totalIn += Number(tx.amount)
      else totalOut += Number(tx.amount)
    })

    return {
      totalIn,
      totalOut,
      balance: totalIn - totalOut
    }
  }, [items])

  /* =========================
     AGRUPAR POR DATA
  ========================= */
  const grouped = useMemo(() => {
    return filtered.reduce((acc: any, tx) => {
      const date = new Date(tx.createdAt)
      const key = date.toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      if (!acc[key]) acc[key] = []
      acc[key].push(tx)
      return acc
    }, {})
  }, [filtered])

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-28">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#1E2329] border-b border-[#2B3139] px-6 py-4">
        <h1 className="text-lg font-semibold">
          Transações
        </h1>
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-3 gap-3 p-4">

        <div className="bg-[#1E2329] p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Entradas</p>
          <p className="text-emerald-500 font-bold">
            +{summary.totalIn.toLocaleString()} Kz
          </p>
        </div>

        <div className="bg-[#1E2329] p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Saídas</p>
          <p className="text-red-500 font-bold">
            -{summary.totalOut.toLocaleString()} Kz
          </p>
        </div>

        <div className="bg-[#1E2329] p-4 rounded-xl text-center">
          <p className="text-xs text-gray-400">Saldo</p>
          <p className="text-[#FCD535] font-bold">
            {summary.balance.toLocaleString()} Kz
          </p>
        </div>

      </div>

      {/* FILTRO */}
      <div className="flex gap-2 px-4 mb-4">
        {['ALL', 'IN', 'OUT'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 rounded text-sm ${
              filter === f
                ? 'bg-[#FCD535] text-black'
                : 'bg-[#1E2329]'
            }`}
          >
            {f === 'ALL' ? 'Todas' : f === 'IN' ? 'Entradas' : 'Saídas'}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="px-4 space-y-6">

        {loading && (
          <div className="text-center text-gray-500 mt-10">
            Carregando...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Nenhuma transação
          </div>
        )}

        {Object.entries(grouped).map(([date, txs]: any) => (
          <div key={date}>

            <p className="text-xs text-gray-400 mb-2">{date}</p>

            {txs.map((tx: Transaction) => {

              const meta = TYPE_META[tx.type] || {
                label: tx.type,
                icon: Wallet,
                color: 'text-gray-400',
                sign: '+',
                category: 'IN'
              }

              const Icon = meta.icon

              return (
                <div
                  key={tx.id}
                  className="bg-[#1E2329] rounded-xl p-4 mb-2 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={meta.color} size={20} />
                    <div>
                      <p className="text-sm">{meta.label}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <p className={`font-bold ${meta.color}`}>
                    {meta.sign}
                    {Number(tx.amount).toLocaleString()} Kz
                  </p>
                </div>
              )
            })}

          </div>
        ))}

      </div>

    </div>
  )
}