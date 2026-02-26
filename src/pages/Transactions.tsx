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
    sign: '+' | '-'
  }
> = {
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-[#FCD535]', sign: '+' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowDownCircle, color: 'text-[#EF4444]', sign: '-' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowDownCircle, color: 'text-[#EF4444]', sign: '-' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+' },
  SERVICE_DEBIT: { label: 'Pagamento Serviço', icon: ArrowDownCircle, color: 'text-[#EF4444]', sign: '-' },
  REFUND: { label: 'Reembolso', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-[#FCD535]', sign: '+' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-[#FCD535]', sign: '+' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowDownCircle, color: 'text-[#EF4444]', sign: '-' },
  INVESTMENT_CREDIT: { label: 'Lucro Investimento', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+' },
  INVESTMENT_CANCEL_REFUND: { label: 'Cancelamento Invest.', icon: ArrowUpCircle, color: 'text-[#FCD535]', sign: '+' },
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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28">

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#1E2329] border-b border-[#2B3139] px-6 py-4">
        <h1 className="text-lg font-semibold tracking-wide">
          Histórico de Transações
        </h1>
      </div>

      <div className="px-6 py-6 space-y-8">

        {Object.entries(grouped).map(([date, txs]: any) => (
          <div key={date} className="space-y-4">

            <p className="text-xs text-[#848E9C] uppercase tracking-wide">
              {date}
            </p>

            {txs.map((tx: Transaction) => {
              const meta = TYPE_META[tx.type]
              const Icon = meta.icon

              return (
                <div
                  key={tx.id}
                  className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-5 flex items-center justify-between hover:bg-[#2B3139] transition"
                >
                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-full bg-[#0B0E11] border border-[#2B3139] flex items-center justify-center">
                      <Icon size={20} className={meta.color} />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {meta.label}
                      </p>
                      <p className="text-xs text-[#848E9C]">
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