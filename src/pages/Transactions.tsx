import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  TransactionService,
  type Transaction
} from '../services/transaction.service'
import { UserService } from '../services/user.service'
import { formatCurrencyAOA } from "../utils/formatCurrency"
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
  ArrowDown,
  Copy,
  Gear
} from '@phosphor-icons/react'

type User = {
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
  role: "USER" | "AGENT" | "SUB_AGENT" | "ADMIN"
}

// Mapeamento exato de branding correspondente às imagens em src/assets/recharges/
const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: "UNITEL.PNG" },
  BAZZA: { logo: "UNITEL.PNG" },
  MOVICEL: { logo: "MOVICEL.PNG" },
  AFRICELL: { logo: "AFRICELL.PNG" },
  NETONE: { logo: "NETONE.PNG" },
  DSTV: { logo: "DSTV.PNG" },
  ZAP: { logo: "ZAP1.PNG" },
  ZAP_SAT: { logo: "ZAP1.PNG" },
  "ZAP FIBRA": { logo: "ZAP2.PNG" },
  ZAP_MEDIA: { logo: "ZAP2.PNG" },
  ZAP2: { logo: "ZAP2.PNG" },
  ENDE: { logo: "ENDE.PNG" },
  EPAL: { logo: "EPAL.PNG" },
  STAS: { logo: "STAS.PNG" },
  INT_VCH2: { logo: "AMAZON.PNG" },
  AMAZON: { logo: "AMAZON.PNG" },
  APPLE: { logo: "APPLE.PNG" },
  "GOOGLE PLAY": { logo: "GOOGLEPLAY.PNG" },
  GOOGLE: { logo: "GOOGLEPLAY.PNG" },
  NETFLIX: { logo: "NETFLIX.PNG" },
  SPOTIFY: { logo: "SPOTIFY.PNG" },
  PLAYSTATION: { logo: "TEAM.PNG" },
  TEAM: { logo: "TEAM.PNG" },
  XBOX: { logo: "XBOX.PNG" },
  BOLT: { logo: "BOLT.PNG" },
  FLIXBUS: { logo: "FLIXBUS.PNG" },
  PREMIERBET: { logo: "Premiebet.png" },
  PBET: { logo: "Premiebet.png" },
  BANTUBET: { logo: "BantuBet.png" },
  BBET: { logo: "BantuBet.png" },
  ELEPHANTBET: { logo: "Elephantbet.png" },
  EBET: { logo: "Elephantbet.png" },
  AFRIBET: { logo: "AfriBet.png" },
  ABET: { logo: "AfriBet.png" },
  MOBET: { logo: "Mobet.png" },
  MELBET: { logo: "MelBet.png" },
  MGMBET: { logo: "MelBet.png" },
  KWANZABET: { logo: "Kwanzabet.png" },
  "888BETS": { logo: "888Bets.png" },
  "888BET": { logo: "888Bets.png" },
  "888": { logo: "888Bets.png" }
}

// Carregamento glob estático do Vite para os assets de recargas
const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
)

/* CORES RECALIBRADAS PARA O NOVO PADRÃO ESCURO PREMIUM */
const TYPE_META: Record<string, any> = {
  DEPOSIT: {
    label: 'Depósito',
    icon: ArrowDownLeft,
    color: 'text-emerald-400',
    sign: '+',
    category: 'IN'
  },
  TRANSFER: {
    label: 'Transferência',
    icon: PaperPlaneTilt,
    color: 'text-rose-400',
    sign: '-',
    category: 'OUT'
  },
  PAYMENT: {
    label: 'Pagamento',
    icon: Receipt,
    color: 'text-rose-400',
    sign: '-',
    category: 'OUT'
  },
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-emerald-400', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-emerald-400', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Serviço', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso', icon: ArrowDownLeft, color: 'text-emerald-400', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-emerald-400', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-rose-400', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro', icon: ArrowDownLeft, color: 'text-emerald-400', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-emerald-400', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_IN: { label: 'Transf. Recebida', icon: ArrowDownLeft, color: 'text-emerald-400', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_OUT: { label: 'Transf. Enviada', icon: PaperPlaneTilt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  KIXIKILA_IN: { label: 'Kixikila Recebida', icon: UsersThree, color: 'text-emerald-400', sign: '+', category: 'IN' },
  KIXIKILA_OUT: { label: 'Kixikila Enviada', icon: UsersThree, color: 'text-rose-400', sign: '-', category: 'OUT' }
}

export default function Transactions() {
  const navigate = useNavigate()

  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL')

  // Buscar dados da wallet do usuário logado (exatamente igual ao perfil)
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await UserService.me()
      return res as User
    },
    staleTime: 1000 * 60 * 5
  })

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

  // Identifica o nome da operadora da transação com base no metadata ou descrição
  const getOperatorName = (tx: any) => {
    const rawName = (
      tx?.metadata?.partnerName ?? 
      tx?.metadata?.providerName ?? 
      tx?.description ?? 
      ""
    ).toUpperCase()

    if (rawName.includes("UNITEL") || rawName.includes("BAZZA")) return "UNITEL"
    if (rawName.includes("MOVICEL")) return "MOVICEL"
    if (rawName.includes("AFRICELL")) return "AFRICELL"
    if (rawName.includes("BAZZA")) return "BAZZA"
    if (rawName.includes("DSTV")) return "DSTV"
    if (rawName.includes("ZAP")) return "ZAP"
    if (rawName.includes("ENDE")) return "ENDE"
    if (rawName.includes("EPAL")) return "EPAL"
    if (rawName.includes("PREMIERBET") || rawName.includes("PBET")) return "PREMIERBET"
    if (rawName.includes("BANTUBET") || rawName.includes("BBET")) return "BANTUBET"
    if (rawName.includes("ELEPHANTBET") || rawName.includes("EBET")) return "ELEPHANTBET"

    return tx?.metadata?.partnerName ?? tx?.metadata?.providerName ?? null
  }

  // Resolve o logo da operadora usando os assets locais
  const getOperatorLogo = (operatorKey: string | null) => {
    if (!operatorKey) return null
    const brand = providerBranding[operatorKey.toUpperCase().trim()]
    if (!brand) return null

    const targetFileName = brand.logo.toLowerCase()
    for (const path in rechargeImages) {
      if (path.toLowerCase().endsWith(targetFileName)) {
        return rechargeImages[path]
      }
    }
    return null
  }

  const filtered = useMemo(() => {
    return items.filter(tx => {
      const meta = TYPE_META[tx.type]
      if (!meta) return filter === 'ALL'
      return filter === 'ALL' || meta.category === filter
    })
  }, [items, filter])

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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] antialiased">
      
      {/* HEADER FIXO - NOVO PADRÃO ESCURO */}
      <div className="sticky top-0 z-10 bg-[#0B0E11]/90 backdrop-blur-md px-5 py-5 flex items-center justify-between border-b border-white/[0.05]">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/[0.03] border border-white/[0.05] text-gray-300 rounded-xl hover:bg-white/[0.08] transition-colors shadow-sm"
        >
          <ArrowLeft size={16} weight="bold" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-wider text-white">Histórico</h1>
        <div className="p-2 text-emerald-400">
          <Funnel size={18} weight="fill" />
        </div>
      </div>

      <div className="px-5 py-6 space-y-6 pb-28">
        
        {/* CARD CENTRAL DE SALDO E PERFIL IDÊntICO AO DA TELA DE PERFIL */}
        {isUserLoading ? (
          <div className="bg-[#161A1E] py-5 px-6 rounded-[2rem] border border-white/[0.04] animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800/60 rounded w-1/3" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#161A1E] py-5 px-6 rounded-[2rem] relative border border-white/[0.04] shadow-2xl">
            
            {/* BOTÃO DE SETTINGS NO CANTO SUPERIOR DIREITO */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-2.5">
              <button 
                onClick={() => navigate('/settings')} 
                className="p-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                title="Configurações"
              >
                <Gear size={20} weight="bold" />
              </button>
            </div>

            <div className="flex items-center gap-4 pr-12">
              {/* LOGÓTIPO DA APLICAÇÃO (IGUAL AO PERFIL) */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-14 h-14 rounded-full border border-white/[0.08] overflow-hidden bg-white/[0.02] p-1">
                  <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="Logo" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold tracking-tight text-white uppercase truncate">
                    {user?.fullName?.toUpperCase() ?? user?.phone}
                  </h1>
                </div>
                <p className="text-gray-400 text-[11px] font-medium mt-0.5 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-500 font-mono font-bold tracking-wider uppercase">ID: {user?.publicId}</span>
                  <button onClick={() => navigator.clipboard.writeText(user?.publicId ?? '')} className="text-gray-500 hover:text-emerald-400 transition-colors">
                    <Copy size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            {/* SALDO DISPONÍVEL DA WALLET */}
            <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between">
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mb-0.5">Saldo Disponível</p>
                <span className="text-2xl font-black tracking-tight text-emerald-400">{formatCurrencyAOA(user?.balance ?? 0)}</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/deposit")} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Wallet size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-gray-500 tracking-wide">Depósito</span>
                </button>
                <button onClick={() => navigate("/withdraw")} className="flex flex-col items-center gap-1 group">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <ArrowDown size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-gray-500 tracking-wide">Saque</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTROLE DE FILTROS TOTALMENTE ADAPTADO */}
        <div className="flex gap-2 bg-[#161A1E] p-1.5 rounded-2xl border border-white/[0.04] shadow-md">
          {(['ALL', 'IN', 'OUT'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                filter === f 
                  ? 'bg-white/[0.06] text-white border border-white/[0.05] shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'IN' ? 'Entradas' : 'Saídas'}
            </button>
          ))}
        </div>

        {/* LISTAGEM DE TRANSAÇÕES */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div 
                  key={n} 
                  className="w-full flex justify-between items-center p-4 bg-[#161A1E] border border-white/[0.03] rounded-2xl animate-pulse"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-white/[0.06] shrink-0" />
                    <div className="space-y-2">
                      <div className="w-32 h-3 bg-white/[0.06] rounded-md" />
                      <div className="w-20 h-2 bg-white/[0.04] rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col items-end">
                    <div className="w-24 h-3 bg-white/[0.06] rounded-md" />
                    <div className="w-10 h-2 bg-white/[0.04] rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-10 bg-[#161A1E] border border-white/[0.04] rounded-2xl text-xs text-gray-400 font-medium">
              Nenhuma transação encontrada para este filtro.
            </div>
          ) : Object.entries(grouped).map(([date, txs]: any) => (
            <div key={date} className="space-y-3">
              
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] text-gray-400 font-mono font-black uppercase tracking-wider">{date}</span>
                <div className="h-[1px] flex-1 bg-white/[0.08]" />
              </div>

              {txs.map((tx: Transaction) => {
                const meta = TYPE_META[tx.type] || { label: tx.type, icon: Clock, color: 'text-gray-400', sign: '', category: 'ALL' }
                const Icon = meta.icon
                const isOut = meta.category === 'OUT'

                const operatorKey = getOperatorName(tx)
                const logoSrc = getOperatorLogo(operatorKey)

                return (
                  <button
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className="w-full flex justify-between items-center p-4 bg-[#161A1E] border border-white/[0.03] rounded-2xl hover:bg-[#1c2127] transition-all shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden border ${
                        logoSrc ? 'bg-white border-white/[0.1]' : (isOut ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')
                      }`}>
                        {logoSrc ? (
                          <img 
                            src={logoSrc} 
                            alt={operatorKey ?? "Operadora"} 
                            className="w-full h-full object-cover p-0" 
                          />
                        ) : (
                          <Icon size={18} weight="bold" />
                        )}
                      </div>

                      <div className="min-w-0 text-left">
                        <p className="text-xs font-bold text-white truncate tracking-tight">
                          {tx.description?.trim() || meta.label}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono font-medium mt-0.5">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p className={`text-xs font-mono font-bold ${meta.color}`}>
                        {meta.sign}{formatCurrency(Number(tx.amount), tx.currency)}
                      </p>
                      <span className="inline-block text-[8px] text-gray-400 font-black uppercase tracking-wide bg-white/[0.04] border border-white/[0.05] px-1.5 py-0.5 rounded mt-1">
                        {tx.currency}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}