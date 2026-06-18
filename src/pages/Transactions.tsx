import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TransactionService,
  type Transaction
} from '../services/transaction.service'
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
  Clock,
} from '@phosphor-icons/react'

const TYPE_META: Record<string, any> = {
  DEPOSIT: {
    label: 'Depósito',
    icon: ArrowDownLeft,
    color: 'text-emerald-500',
    sign: '+',
    category: 'IN'
  },
  TRANSFER: {
    label: 'Transferência',
    icon: PaperPlaneTilt,
    color: 'text-rose-500',
    sign: '-',
    category: 'OUT'
  },
  PAYMENT: {
    label: 'Pagamento',
    icon: Receipt,
    color: 'text-rose-500',
    sign: '-',
    category: 'OUT'
  },
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-emerald-500', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-rose-500', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-rose-500', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Serviço', icon: Receipt, color: 'text-rose-500', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-emerald-500', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-rose-500', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowUpRight, color: 'text-rose-500', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-emerald-500', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_IN: { label: 'Transf. Recebida', icon: ArrowDownLeft, color: 'text-emerald-500', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_OUT: { label: 'Transf. Enviada', icon: PaperPlaneTilt, color: 'text-rose-500', sign: '-', category: 'OUT' },
  KIXIKILA_IN: { label: 'Kixikila Recebida', icon: UsersThree, color: 'text-emerald-500', sign: '+', category: 'IN' },
  KIXIKILA_OUT: { label: 'Kixikila Enviada', icon: UsersThree, color: 'text-rose-500', sign: '-', category: 'OUT' }
}

export default function Transactions() {
  const navigate = useNavigate()

  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL')

  useEffect(() => {
    TransactionService.list()
      .then(data => {
        if (!Array.isArray(data))
          return

        setItems(data)
      })
      .catch(console.error)
      .finally(() =>
        setLoading(false)
      )
  }, [])

  function formatCurrency(amount: number, currency: string) {
    if (currency === 'USDT') {
      return `${amount.toFixed(2)} USDT`
    }
    return `${amount.toLocaleString()} Kz`
  }

  const filtered = useMemo(() => {
    return items.filter(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta) return filter === 'ALL'
      return filter === 'ALL' || meta.category === filter
    })
  }, [items, filter])

  const summary = useMemo(() => {
    let totalInAOA = 0; let totalOutAOA = 0
    let totalInUSDT = 0; let totalOutUSDT = 0

    items.forEach(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta) return
      const value = Number(tx.amount)

      if (tx.currency === 'USDT') {
        if (meta.category === 'IN') totalInUSDT += value
        else totalOutUSDT += value
      } else {
        if (meta.category === 'IN') totalInAOA += value
        else totalOutAOA += value
      }
    })

    return {
      AOA: { in: totalInAOA, out: totalOutAOA, balance: totalInAOA - totalOutAOA },
      USDT: { in: totalInUSDT, out: totalOutUSDT, balance: totalInUSDT - totalOutUSDT }
    }
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
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="sticky top-0 z-10 bg-[#0B0E11]/80 backdrop-blur-md px-5 py-6 flex items-center justify-between border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest italic">Histórico</h1>
        <Funnel size={18} weight="fill" className="text-gray-500" />
      </div>

      <div className="px-5 py-8 space-y-8 pb-20">
        
        {/* CARD DE RESUMO - FOCO EM SALDO DISPONÍVEL (EMERALD) */}
        <div className="bg-[#161A1F] border border-white/5 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
          
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Saldo Disponível</p>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-mono font-bold text-emerald-500">
              {summary.AOA.balance.toLocaleString()} <span className="text-xs">Kz</span>
            </h2>
            <h3 className="text-lg font-mono font-bold text-yellow-400">
              {summary.USDT.balance.toFixed(2)} <span className="text-[10px]">USDT</span>
            </h3>
          </div>

          <div className="flex justify-between items-center pt-5 mt-5 border-t border-white/5">
            <div className="text-left">
              <p className="text-[9px] text-gray-500 uppercase font-bold">Total Entradas (Kz)</p>
              <p className="text-emerald-500 font-bold text-xs">+{summary.AOA.in.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500 uppercase font-bold">Total Saídas (Kz)</p>
              <p className="text-rose-500 font-bold text-xs">-{summary.AOA.out.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2 bg-[#161A1F] p-1.5 rounded-2xl border border-white/5">
          {(['ALL', 'IN', 'OUT'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'IN' ? 'Entradas' : 'Saídas'}
            </button>
          ))}
        </div>

        {/* LISTAGEM */}
        <div className="space-y-8">
          {loading ? (
            <p className="text-center text-[10px] text-gray-500 animate-pulse tracking-widest">SINCRONIZANDO BLOCKCHAIN...</p>
          ) : Object.entries(grouped).map(([date, txs]: any) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">{date}</span>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              {txs.map((tx: Transaction) => {
                const meta = TYPE_META[tx.type] || { label: tx.type, icon: Clock, color: 'text-gray-400', sign: '', category: 'ALL' }
                const Icon = meta.icon
                const isOut = meta.category === 'OUT'

                return (
                  <div key={tx.id} className="group flex justify-between items-center p-4 bg-[#161A1F]/40 border border-white/5 rounded-2xl hover:bg-[#161A1F] transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner transition-colors ${isOut ? 'bg-rose-500/5 text-rose-500' : 'bg-emerald-500/5 text-emerald-500'}`}>
                        <Icon size={20} weight={isOut ? "fill" : "duotone"} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-100">{meta.label}</p>
                        <div className="flex flex-col">
                          <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                            {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-mono font-bold ${meta.color}`}>
                        {meta.sign}{formatCurrency(Number(tx.amount), tx.currency)}
                      </p>
                      <p className="text-[8px] text-gray-700 font-black uppercase tracking-tighter mt-1">{tx.currency}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}