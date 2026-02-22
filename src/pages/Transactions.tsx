import { useEffect, useState, useMemo } from 'react'
import { TransactionService } from '../services/transaction.service'
import type { TransactionType } from '../types/transaction.types'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Gift,
  Coins,
} from 'lucide-react'

type Transaction = {
  id: number
  type: TransactionType
  amount: number
  createdAt: string
}

const CACHE_KEY = 'transactions-cache'

const TYPE_META: Record<
  TransactionType,
  {
    label: string
    icon: any
    color: string
    bg: string
    sign: '+' | '-'
  }
> = {
  RECHARGE: {
    label: 'Recarga',
    icon: Wallet,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    sign: '+',
  },
  WITHDRAW: {
    label: 'Levantamento',
    icon: ArrowDownCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    sign: '-',
  },
  BUY_DEBIT: {
    label: 'Compra OTC',
    icon: ArrowDownCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    sign: '-',
  },
  SELL_CREDIT: {
    label: 'Venda OTC',
    icon: ArrowUpCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    sign: '+',
  },
  SERVICE_DEBIT: {
    label: 'Pagamento Serviço',
    icon: ArrowDownCircle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
    sign: '-',
  },
  REFUND: {
    label: 'Reembolso',
    icon: ArrowUpCircle,
    color: 'text-blue-400',
    bg: 'bg-blue-500/15',
    sign: '+',
  },
  COMMISSION: {
    label: 'Comissão',
    icon: Coins,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15',
    sign: '+',
  },
  GIFT: {
    label: 'Presente',
    icon: Gift,
    color: 'text-pink-400',
    bg: 'bg-pink-500/15',
    sign: '+',
  },
  INVESTMENT_DEBIT: {
    label: 'Investimento',
    icon: ArrowDownCircle,
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
    sign: '-',
  },
  INVESTMENT_CREDIT: {
    label: 'Lucro Investimento',
    icon: ArrowUpCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/15',
    sign: '+',
  },
  INVESTMENT_CANCEL_REFUND: {
    label: 'Cancelamento Invest.',
    icon: ArrowUpCircle,
    color: 'text-gray-400',
    bg: 'bg-gray-500/15',
    sign: '+',
  },
}

export default function Transactions() {

  const cached = localStorage.getItem(CACHE_KEY)
  const initial = cached ? JSON.parse(cached) : []

  const [items, setItems] = useState<Transaction[]>(initial)

  useEffect(() => {
    let mounted = true

    TransactionService.list()
      .then(data => {
        if (!mounted || !Array.isArray(data)) return
        setItems(data)
        localStorage.setItem(CACHE_KEY, JSON.stringify(data))
      })
      .catch(() => {})

    return () => { mounted = false }
  }, [])

  const grouped = useMemo(() => {
    return items.reduce((acc: any, tx) => {
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
  }, [items])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white pb-28">

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4">
        <h1 className="text-lg font-semibold tracking-wide">
          Histórico de Transações
        </h1>
      </div>

      <div className="px-6 py-6 space-y-8">

        {Object.entries(grouped).map(([date, txs]: any) => (
          <div key={date} className="space-y-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {date}
            </p>

            {txs.map((tx: Transaction) => {
              const meta = TYPE_META[tx.type]
              const Icon = meta.icon

              return (
                <div
                  key={tx.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-xl hover:bg-white/10 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${meta.bg} ${meta.color}`}>
                      <Icon size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {meta.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(tx.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <p className={`text-sm font-semibold ${meta.color}`}>
                    {meta.sign}
                    {tx.amount.toLocaleString()} Kz
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