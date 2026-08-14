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
  Gear,
  MagnifyingGlass,
  X,
  Check
} from '@phosphor-icons/react'

type User = {
  fullName?: string
  phone: string
  email: string
  publicId: string
  balance: number
  role: "USER" | "AGENT" | "SUB_AGENT" | "ADMIN"
}

type ExtendedTransaction = Transaction & {
  metadata?: {
    phone?: string
    phoneNumber?: string
    planName?: string
    plan?: string
    partnerName?: string
    providerName?: string
    [key: string]: any
  }
}

const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: "UNITEL.PNG" },
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
  "5LINHAS": { logo: "CINCO.PNG" },
  "5 LINHAS": { logo: "CINCO.PNG" },
  CINCO: { logo: "CINCO.PNG" },
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

const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
)

const TYPE_META: Record<string, any> = {
  DEPOSIT: { label: 'Depósito', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  TRANSFER: { label: 'Transferência', icon: PaperPlaneTilt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  PAYMENT: { label: 'Pagamento', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-cyan-300', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Serviço', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  REFUND: { label: 'Reembolso', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-cyan-300', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-rose-400', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-cyan-300', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_IN: { label: 'Transf. Recebida', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_OUT: { label: 'Transf. Enviada', icon: PaperPlaneTilt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  KIXIKILA_IN: { label: 'Kixikila Recebida', icon: UsersThree, color: 'text-cyan-300', sign: '+', category: 'IN' },
  KIXIKILA_OUT: { label: 'Kixikila Enviada', icon: UsersThree, color: 'text-rose-400', sign: '-', category: 'OUT' }
}

export default function Transactions() {
  const navigate = useNavigate()

  const [items, setItems] = useState<ExtendedTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCriteria, setSearchCriteria] = useState<'ALL' | 'PHONE' | 'OPERATOR' | 'DATE' | 'ID'>('ALL')
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)

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
        setItems(data as ExtendedTransaction[])
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

  const getOperatorName = (tx: ExtendedTransaction) => {
  const sources = [
    tx?.metadata?.providerName,
    tx?.metadata?.partnerName,
    tx?.metadata?.serviceName,
    tx?.metadata?.serviceGroupName,
    tx?.metadata?.planName,
    tx?.metadata?.plan,
    tx?.description
  ]

  const rawName = sources
    .filter(Boolean)
    .join(" ")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()

  // TELECOMUNICAÇÕES
  if (
    rawName.includes("UNITEL") ||
    rawName.includes("BAZZA")
  ) {
    return "UNITEL"
  }

  if (rawName.includes("MOVICEL")) {
    return "MOVICEL"
  }

  if (rawName.includes("AFRICELL")) {
    return "AFRICELL"
  }

  if (rawName.includes("NETONE")) {
    return "NETONE"
  }

  // TELEVISÃO
  // TELEVISÃO
if (
  rawName.includes("DSTV") ||
  rawName.includes("FAMILIA/7D") ||
  rawName.includes("FAMILIA 7D") ||
  rawName.includes("FAMILIA MAIS")
) {
  return "DSTV"
}

  if (rawName.includes("ZAP")) {
    return "ZAP"
  }

  // SERVIÇOS PÚBLICOS
  if (rawName.includes("ENDE")) {
    return "ENDE"
  }

  if (rawName.includes("EPAL")) {
    return "EPAL"
  }

  if (rawName.includes("STAS")) {
    return "STAS"
  }

  // 5LINHAS
  if (
    rawName.includes("5LINHAS") ||
    rawName.includes("5 LINHAS") ||
    rawName.includes("CINCO")
  ) {
    return "5LINHAS"
  }

  // JOGOS E APOSTAS
  if (
    rawName.includes("PREMIERBET") ||
    rawName.includes("PBET")
  ) {
    return "PREMIERBET"
  }

  if (
    rawName.includes("BANTUBET") ||
    rawName.includes("BBET")
  ) {
    return "BANTUBET"
  }

  if (
    rawName.includes("ELEPHANTBET") ||
    rawName.includes("EBET")
  ) {
    return "ELEPHANTBET"
  }

  if (
    rawName.includes("AFRIBET") ||
    rawName.includes("ABET")
  ) {
    return "AFRIBET"
  }

  if (
    rawName.includes("MOBET")
  ) {
    return "MOBET"
  }

  if (
    rawName.includes("MELBET") ||
    rawName.includes("MGMBET")
  ) {
    return "MELBET"
  }

  if (
    rawName.includes("KWANZABET")
  ) {
    return "KWANZABET"
  }

  if (
    rawName.includes("888BETS") ||
    rawName.includes("888BET") ||
    rawName.includes("888")
  ) {
    return "888BETS"
  }

  // SERVIÇOS DIGITAIS / PARCEIROS
  if (
    rawName.includes("AMAZON") ||
    rawName.includes("INT_VCH2")
  ) {
    return "AMAZON"
  }

  if (rawName.includes("APPLE")) {
    return "APPLE"
  }

  if (
    rawName.includes("GOOGLE PLAY") ||
    rawName.includes("GOOGLEPLAY") ||
    rawName.includes("GOOGLE")
  ) {
    return "GOOGLE PLAY"
  }

  if (rawName.includes("NETFLIX")) {
    return "NETFLIX"
  }

  if (rawName.includes("SPOTIFY")) {
    return "SPOTIFY"
  }

  if (
    rawName.includes("PLAYSTATION") ||
    rawName.includes("TEAM")
  ) {
    return "PLAYSTATION"
  }

  if (rawName.includes("XBOX")) {
    return "XBOX"
  }

  if (rawName.includes("BOLT")) {
    return "BOLT"
  }

  if (rawName.includes("FLIXBUS")) {
    return "FLIXBUS"
  }

  return (
    tx?.metadata?.providerName ??
    tx?.metadata?.partnerName ??
    null
  )
}

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
      
      if (filter === 'IN' && meta?.category !== 'IN') return false
      if (filter === 'OUT' && meta?.category !== 'OUT') return false

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim()
        
        const description = (tx.description || '').toLowerCase()
        const typeLabel = (meta?.label || '').toLowerCase()
        const phone = (tx.metadata?.phone || tx.metadata?.phoneNumber || '').toLowerCase()
        const operator = (getOperatorName(tx) || '').toLowerCase()
        const plan = (tx.metadata?.planName || tx.metadata?.plan || '').toLowerCase()
        const txId = String(tx.id || '').toLowerCase()
        
        const dateFormatted = new Date(tx.createdAt).toLocaleDateString('pt-AO', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        }).toLowerCase()
        const dateShort = new Date(tx.createdAt).toLocaleDateString('pt-AO', {
          day: '2-digit', month: 'short'
        }).toLowerCase()

        if (searchCriteria === 'PHONE') {
          return phone.includes(query)
        }
        if (searchCriteria === 'OPERATOR') {
          return operator.includes(query)
        }
        if (searchCriteria === 'DATE') {
          return dateFormatted.includes(query) || dateShort.includes(query)
        }
        if (searchCriteria === 'ID') {
          return txId.includes(query)
        }

        const matchesQuery = 
          description.includes(query) ||
          typeLabel.includes(query) ||
          phone.includes(query) ||
          operator.includes(query) ||
          plan.includes(query) ||
          txId.includes(query) ||
          dateFormatted.includes(query) ||
          dateShort.includes(query)

        if (!matchesQuery) return false
      }

      return true
    })
  }, [items, filter, searchTerm, searchCriteria])

  const grouped = useMemo(() => {
    return filtered.reduce((acc: Record<string, ExtendedTransaction[]>, tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString('pt-AO', {
        day: '2-digit', month: 'short'
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(tx)
      return acc
    }, {})
  }, [filtered])

  const criteriaLabels: Record<string, string> = {
    ALL: 'Geral (Todos)',
    PHONE: 'Por Telefone',
    OPERATOR: 'Por Operadora',
    DATE: 'Por Data',
    ID: 'Por ID da Transação'
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] antialiased">
      {/* HEADER FIXO */}
      <div className="sticky top-0 z-10 bg-[#0a2533]/90 backdrop-blur-md px-5 py-5 flex items-center justify-between border-b border-cyan-500/10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-[#144863] border border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-cyan-600 hover:text-white transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} weight="bold" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-wider text-white">Histórico</h1>
        
        {/* BOTÃO DO FILTRO ESPECIAL TIPO FINTECH */}
        <button 
          onClick={() => setShowCriteriaModal(true)}
          className={`p-2 rounded-xl border transition-all relative cursor-pointer ${
            searchCriteria !== 'ALL' 
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
              : 'bg-[#144863] border-cyan-500/30 text-cyan-300 hover:bg-cyan-600 hover:text-white'
          }`}
          title="Filtro Especial Avançado"
        >
          <Funnel size={18} weight={searchCriteria !== 'ALL' ? 'fill' : 'bold'} />
          {searchCriteria !== 'ALL' && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#0a2533]" />
          )}
        </button>
      </div>

      {/* MODAL DE SELEÇÃO DE CRITÉRIO ESPECIAL */}
      {showCriteriaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0e364a] border border-cyan-500/30 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Filtro Especial</h3>
                <p className="text-[11px] text-cyan-200/70 mt-0.5">Selecione o critério de pesquisa:</p>
              </div>
              <button 
                onClick={() => setShowCriteriaModal(false)}
                className="p-1.5 rounded-full bg-[#144863] text-cyan-300 hover:text-white cursor-pointer"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {(['ALL', 'PHONE', 'OPERATOR', 'DATE', 'ID'] as const).map(criteria => (
                <button
                  key={criteria}
                  onClick={() => {
                    setSearchCriteria(criteria)
                    setShowCriteriaModal(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    searchCriteria === criteria 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                      : 'bg-[#144863] text-cyan-200/80 border border-cyan-500/20 hover:bg-[#124158] hover:text-white'
                  }`}
                >
                  <span>{criteriaLabels[criteria]}</span>
                  {searchCriteria === criteria && <Check size={16} weight="bold" />}
                </button>
              ))}
            </div>

            {searchCriteria !== 'ALL' && (
              <button
                onClick={() => {
                  setSearchCriteria('ALL')
                  setShowCriteriaModal(false)
                }}
                className="w-full py-2.5 rounded-xl bg-[#144863] text-cyan-300 hover:text-white text-[11px] font-bold transition-all border border-cyan-500/30 cursor-pointer"
              >
                Limpar Filtro Especial
              </button>
            )}
          </div>
        </div>
      )}

      <div className="px-5 py-6 space-y-6 pb-28">
        
        {/* CARD CENTRAL DE SALDO E PERFIL */}
        {isUserLoading ? (
          <div className="bg-[#0e364a] py-5 px-6 rounded-[2rem] border border-cyan-500/20 animate-pulse shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#144863]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#144863] rounded w-1/2" />
                <div className="h-3 bg-[#144863]/60 rounded w-1/3" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0e364a] py-5 px-6 rounded-[2rem] relative border border-cyan-500/25 shadow-2xl shadow-cyan-950/40">
            <div className="absolute top-5 right-5 flex flex-col items-end gap-2.5">
              <button 
                onClick={() => navigate('/settings')} 
                className="p-2 rounded-full bg-[#144863] border border-cyan-500/30 text-cyan-300 hover:text-white hover:bg-cyan-600 transition-all shadow-md cursor-pointer"
                title="Configurações"
              >
                <Gear size={20} weight="bold" />
              </button>
            </div>

            <div className="flex items-center gap-4 pr-12">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-14 h-14 rounded-full border border-cyan-500/30 overflow-hidden bg-[#144863] p-1 shadow-md">
                  <img src="/logo.png" className="w-full h-full object-contain rounded-full" alt="Logo" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold tracking-tight text-white uppercase truncate">
                    {user?.fullName?.toUpperCase() ?? user?.phone}
                  </h1>
                </div>
                <p className="text-cyan-200/70 text-[11px] font-medium mt-0.5 truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-cyan-300/60 font-mono font-bold tracking-wider uppercase">ID: {user?.publicId}</span>
                  <button onClick={() => navigator.clipboard.writeText(user?.publicId ?? '')} className="text-cyan-300/60 hover:text-cyan-200 transition-colors cursor-pointer">
                    <Copy size={13} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-cyan-500/15 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-cyan-300/60 uppercase tracking-widest font-black mb-0.5">Saldo Disponível</p>
                <span className="text-2xl font-black tracking-tight text-cyan-300">{formatCurrencyAOA(user?.balance ?? 0)}</span>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => navigate("/deposit")} className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#144863] border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-md">
                    <Wallet size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-cyan-200/70 tracking-wide">Depósito</span>
                </button>
                <button onClick={() => navigate("/withdraw")} className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#144863] border border-cyan-500/30 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-md">
                    <ArrowDown size={18} weight="bold" />
                  </div>
                  <span className="text-[8px] font-black uppercase text-cyan-200/70 tracking-wide">Saque</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BARRA DE PESQUISA COM INDICADOR DO FILTRO ATIVO */}
        <div className="space-y-2">
          {searchCriteria !== 'ALL' && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[10px] text-cyan-300 font-bold">
              <span>Filtrando: {criteriaLabels[searchCriteria]}</span>
              <button onClick={() => setSearchCriteria('ALL')} className="hover:text-white cursor-pointer">
                <X size={13} weight="bold" />
              </button>
            </div>
          )}
          
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-cyan-300/60">
              <MagnifyingGlass size={16} weight="bold" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                searchCriteria === 'PHONE' ? 'Digite o número de telefone...' :
                searchCriteria === 'OPERATOR' ? 'Digite a operadora (ex: Unitel, ZAP)...' :
                searchCriteria === 'DATE' ? 'Digite a data (ex: 04/08)...' :
                searchCriteria === 'ID' ? 'Digite o ID da transação...' :
                'Pesquisar por telefone, operadora, serviço, plano ou data...'
              }
              className="w-full bg-[#0e364a] border border-cyan-500/20 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 transition-all shadow-md"
            />
          </div>
        </div>

        {/* CONTROLE DE FLUXO RÁPIDO (TODOS / ENTRADAS / SAÍDAS) */}
        <div className="flex gap-2 bg-[#0e364a] p-1.5 rounded-2xl border border-cyan-500/20 shadow-md">
          {(['ALL', 'IN', 'OUT'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                filter === f 
                  ? 'bg-[#144863] text-white border border-cyan-500/40 shadow-sm' 
                  : 'text-cyan-200/70 hover:text-white hover:bg-[#124158]'
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
                  className="w-full flex justify-between items-center p-4 bg-[#0e364a] border border-cyan-500/20 rounded-2xl animate-pulse shadow-md"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#144863] shrink-0" />
                    <div className="space-y-2">
                      <div className="w-32 h-3 bg-[#144863] rounded-md" />
                      <div className="w-20 h-2 bg-[#144863]/60 rounded-md" />
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col items-end">
                    <div className="w-24 h-3 bg-[#144863] rounded-md" />
                    <div className="w-10 h-2 bg-[#144863]/60 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-10 bg-[#0e364a] border border-cyan-500/20 rounded-2xl text-xs text-cyan-200/70 font-medium shadow-md">
              Nenhuma transação encontrada para os critérios informados.
            </div>
          ) : Object.entries(grouped).map(([date, txs]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3 pt-2">
                <span className="text-[10px] text-cyan-300/60 font-mono font-black uppercase tracking-wider">{date}</span>
                <div className="h-[1px] flex-1 bg-cyan-500/15" />
              </div>

              {txs.map((tx) => {
                const meta = TYPE_META[tx.type] || { label: tx.type, icon: Clock, color: 'text-cyan-300/60', sign: '', category: 'ALL' }
                const Icon = meta.icon
                const isOut = meta.category === 'OUT'

                const operatorKey = getOperatorName(tx)
                const logoSrc = getOperatorLogo(operatorKey)

                return (
                  <button
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className="w-full flex justify-between items-center p-4 bg-[#0e364a] border border-cyan-500/20 rounded-2xl hover:border-cyan-400/50 hover:bg-[#124158] transition-all shadow-lg shadow-cyan-950/20 active:scale-[0.99] cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden border ${
                        logoSrc ? 'bg-white border-cyan-500/30' : (isOut ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300')
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
                        <p className="text-[10px] text-cyan-200/70 font-mono font-medium mt-0.5">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p className={`text-xs font-mono font-bold ${meta.color}`}>
                        {meta.sign}{formatCurrency(Number(tx.amount), tx.currency)}
                      </p>
                      <span className="inline-block text-[8px] text-cyan-300/70 font-black uppercase tracking-wide bg-[#144863] border border-cyan-500/30 px-1.5 py-0.5 rounded mt-1">
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