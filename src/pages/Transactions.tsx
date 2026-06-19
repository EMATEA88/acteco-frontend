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
    color: 'text-emerald-700',
    sign: '+',
    category: 'IN'
  },
  TRANSFER: {
    label: 'Transferência',
    icon: PaperPlaneTilt,
    color: 'text-rose-600',
    sign: '-',
    category: 'OUT'
  },
  PAYMENT: {
    label: 'Pagamento',
    icon: Receipt,
    color: 'text-rose-600',
    sign: '-',
    category: 'OUT'
  },
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-emerald-700', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-rose-600', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-rose-600', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-emerald-700', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Serviço', icon: Receipt, color: 'text-rose-600', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso', icon: ArrowDownLeft, color: 'text-emerald-700', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-emerald-700', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-rose-600', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowUpRight, color: 'text-rose-600', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro', icon: ArrowDownLeft, color: 'text-emerald-700', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-emerald-700', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_IN: { label: 'Transf. Recebida', icon: ArrowDownLeft, color: 'text-emerald-700', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_OUT: { label: 'Transf. Enviada', icon: PaperPlaneTilt, color: 'text-rose-600', sign: '-', category: 'OUT' },
  KIXIKILA_IN: { label: 'Kixikila Recebida', icon: UsersThree, color: 'text-emerald-700', sign: '+', category: 'IN' },
  KIXIKILA_OUT: { label: 'Kixikila Enviada', icon: UsersThree, color: 'text-rose-600', sign: '-', category: 'OUT' }
}

export default function Transactions() {
  const navigate = useNavigate()

  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL')

  useEffect(() => {
    TransactionService.list()
      .then(data => {
        if (!Array.isArray(data)) return
        setItems(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
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
    <div className="min-h-screen bg-[#F2F4F7] text-[#111827] antialiased">
      
      {/* HEADER FIXO - ALTO CONTRASTE */}
      <div className="sticky top-0 z-10 bg-[#F2F4F7]/80 backdrop-blur-md px-5 py-5 flex items-center justify-between border-b border-[#D1D5DB]">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-[#E4E7EB] text-gray-800 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          <ArrowLeft size={16} weight="bold" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-wider text-gray-950">Histórico</h1>
        <div className="p-2 text-gray-700">
          <Funnel size={18} weight="fill" />
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 pb-28">
        
        {/* CARD DE RESUMO REESTRUTURADO PARA MODO CLARO */}
        <div className="bg-[#FCFCFD] border border-[#E4E7EB] p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-[40px]" />
          
          <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1.5">Saldo Líquido Geral</p>
          
          <div className="space-y-0.5">
            <h2 className="text-2xl font-mono font-black text-emerald-700 tracking-tight">
              {summary.AOA.balance.toLocaleString()} <span className="text-xs font-sans font-bold text-gray-500">Kz</span>
            </h2>
            <h3 className="text-base font-mono font-black text-amber-700 tracking-tight">
              {summary.USDT.balance.toFixed(2)} <span className="text-[10px] font-sans font-bold text-gray-500">USDT</span>
            </h3>
          </div>

          <div className="flex justify-between items-center pt-4 mt-5 border-t border-gray-100 font-mono text-xs">
            <div className="text-left">
              <p className="text-[9px] text-gray-500 uppercase font-sans font-bold tracking-wide">Total Entradas (Kz)</p>
              <p className="text-emerald-700 font-black mt-0.5">+{summary.AOA.in.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500 uppercase font-sans font-bold tracking-wide">Total Saídas (Kz)</p>
              <p className="text-rose-600 font-black mt-0.5">-{summary.AOA.out.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* CONTROLE DE FILTROS TOTALMENTE VISÍVEL */}
        <div className="flex gap-2 bg-[#FCFCFD] p-1.5 rounded-2xl border border-[#E4E7EB] shadow-sm">
          {(['ALL', 'IN', 'OUT'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                filter === f 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'IN' ? 'Entradas' : 'Saídas'}
            </button>
          ))}
        </div>

        {/* LISTAGEM DE TRANSAÇÕES */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-[10px] text-gray-600 font-mono font-black animate-pulse tracking-widest py-6">
              CARREGANDO ATIVIDADES...
            </p>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-10 bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl text-xs text-gray-600 font-medium">
              Nenhuma transação encontrada para este filtro.
            </div>
          ) : Object.entries(grouped).map(([date, txs]: any) => (
            <div key={date} className="space-y-3">
              
              {/* DIVISOR DE DATAS */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] text-gray-700 font-mono font-black uppercase tracking-wider">{date}</span>
                <div className="h-[1px] flex-1 bg-gray-300" />
              </div>

              {/* CARDS DE MOVIMENTAÇÃO */}
              {txs.map((tx: Transaction) => {
                const meta = TYPE_META[tx.type] || { label: tx.type, icon: Clock, color: 'text-gray-700', sign: '', category: 'ALL' }
                const Icon = meta.icon
                const isOut = meta.category === 'OUT'

                return (
                  <div key={tx.id} className="flex justify-between items-center p-4 bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl hover:bg-gray-50/50 transition-all shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                        isOut ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        <Icon size={18} weight="bold" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-950 truncate tracking-tight">{meta.label}</p>
                        <p className="text-[10px] text-gray-600 font-mono font-medium mt-0.5">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p className={`text-xs font-mono font-black ${meta.color}`}>
                        {meta.sign}{formatCurrency(Number(tx.amount), tx.currency)}
                      </p>
                      <span className="inline-block text-[8px] text-gray-600 font-black uppercase tracking-wide bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded mt-1">
                        {tx.currency}
                      </span>
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