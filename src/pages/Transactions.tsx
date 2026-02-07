import { useEffect, useState } from 'react'
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
  type:
    | 'RECHARGE'
    | 'WITHDRAW'
    | 'TASK_INCOME'
    | 'GIFT'
    | 'COMMISSION'
    | 'DEBIT'
  amount: number
  createdAt: string
}

const CACHE_KEY = 'transactions-cache'

const TYPE_META: Record<
  Transaction['type'],
  {
    label: string
    icon: any
    color: string
    sign: '+' | '-'
  }
> = {
  RECHARGE: {
    label: 'Recarga',
    icon: Wallet,
    color: 'text-emerald-600',
    sign: '+',
  },
  WITHDRAW: {
    label: 'Levantamento',
    icon: ArrowDownCircle,
    color: 'text-red-500',
    sign: '-',
  },
  TASK_INCOME: {
    label: 'Renda diária',
    icon: Coins,
    color: 'text-blue-600',
    sign: '+',
  },
  COMMISSION: {
    label: 'Comissão',
    icon: ArrowUpCircle,
    color: 'text-indigo-600',
    sign: '+',
  },
  GIFT: {
    label: 'Presente',
    icon: Gift,
    color: 'text-pink-600',
    sign: '+',
  },
  DEBIT: {
    label: 'Débito',
    icon: ArrowDownCircle,
    color: 'text-gray-600',
    sign: '-',
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
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify(data)
        )
      })
      .catch(() => {
        // silencioso
      })

    return () => {
      mounted = false
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Nenhuma transação encontrada
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24 animate-fadeZoom">
      <h1 className="text-lg font-semibold">
        Histórico de Transações
      </h1>

      {items.map(tx => {
        const meta = TYPE_META[tx.type]
        const Icon = meta.icon

        return (
          <div
            key={tx.id}
            className="
              bg-white rounded-2xl p-4 shadow-card
              flex items-center justify-between
            "
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  bg-gray-100 ${meta.color}
                `}
              >
                <Icon size={20} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {meta.label}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(
                    tx.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <p
              className={`
                text-sm font-semibold
                ${meta.color}
              `}
            >
              {meta.sign}
              {tx.amount.toLocaleString()} Kz
            </p>
          </div>
        )
      })}
    </div>
  )
}
