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
  MagnifyingGlass,
  X,
  Check
} from '@phosphor-icons/react'

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

  const normalizeBrandKey = (value: string = "") =>
  value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const getOperatorName = (tx: ExtendedTransaction) => {
    /**
     * Prioridade 1: providerName/partnerName vindo do backend.
     * Isso é mais confiável do que tentar adivinhar a operadora
     * somente pelo texto do plano.
     */
    const directProvider =
      tx?.metadata?.providerName ??
      tx?.metadata?.partnerName ??
      null

    if (directProvider) {
      const normalizedProvider = normalizeBrandKey(directProvider)

      const directMap: Record<string, string> = {
        UNITEL: "UNITEL",
        BAZZA: "UNITEL",
        MOVICEL: "MOVICEL",
        AFRICELL: "AFRICELL",
        NETONE: "NETONE",
        DSTV: "DSTV",
        ZAP: "ZAP",
        "ZAP SAT": "ZAP_SAT",
        "ZAP FIBRA": "ZAP FIBRA",
        "ZAP MEDIA": "ZAP_MEDIA",
        ENDE: "ENDE",
        EPAL: "EPAL",
        STAS: "STAS",
        "5LINHAS": "5LINHAS",
        "5 LINHAS": "5 LINHAS",
        CINCO: "CINCO",
        INT_VCH2: "INT_VCH2",
        AMAZON: "AMAZON",
        APPLE: "APPLE",
        "GOOGLE PLAY": "GOOGLE PLAY",
        GOOGLE: "GOOGLE",
        NETFLIX: "NETFLIX",
        SPOTIFY: "SPOTIFY",
        PLAYSTATION: "PLAYSTATION",
        TEAM: "TEAM",
        XBOX: "XBOX",
        BOLT: "BOLT",
        FLIXBUS: "FLIXBUS",
        PREMIERBET: "PREMIERBET",
        PBET: "PBET",
        BANTUBET: "BANTUBET",
        BBET: "BBET",
        ELEPHANTBET: "ELEPHANTBET",
        EBET: "EBET",
        AFRIBET: "AFRIBET",
        ABET: "ABET",
        MOBET: "MOBET",
        MELBET: "MELBET",
        MGMBET: "MGMBET",
        KWANZABET: "KWANZABET",
        "888BETS": "888BETS",
        "888BET": "888BET",
        "888": "888",
      }

      if (directMap[normalizedProvider]) {
        return directMap[normalizedProvider]
      }

      const brandingMatch = Object.keys(providerBranding).find(key => {
        const normalizedKey = normalizeBrandKey(key)
        return (
          normalizedKey === normalizedProvider ||
          normalizedProvider.includes(normalizedKey) ||
          normalizedKey.includes(normalizedProvider)
        )
      })

      if (brandingMatch) {
        return brandingMatch
      }
    }

    /**
     * Prioridade 2: identificação pelo conteúdo da transação.
     * Incluímos o plano, serviço, grupo e descrição para cobrir
     * transações antigas que não tenham providerName gravado.
     */
    const sources = [
      tx?.metadata?.serviceName,
      tx?.metadata?.serviceGroupName,
      tx?.metadata?.planName,
      tx?.metadata?.plan,
      tx?.description,
      tx?.metadata?.providerName,
      tx?.metadata?.partnerName,
    ]

    const rawName = sources
      .filter(Boolean)
      .join(" ")
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // TELECOMUNICAÇÕES
    if (rawName.includes("UNITEL") || rawName.includes("BAZZA")) {
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
    if (
      rawName.includes("DSTV") ||
      rawName.includes("FAMILIA/7D") ||
      rawName.includes("FAMILIA 7D") ||
      rawName.includes("FAMILIA MAIS")
    ) {
      return "DSTV"
    }

    if (rawName.includes("ZAP FIBRA")) {
      return "ZAP FIBRA"
    }

    if (rawName.includes("ZAP SAT")) {
      return "ZAP_SAT"
    }

    if (rawName.includes("ZAP MEDIA")) {
      return "ZAP_MEDIA"
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
    if (rawName.includes("PREMIERBET") || rawName.includes("PBET")) {
      return "PREMIERBET"
    }

    if (rawName.includes("BANTUBET") || rawName.includes("BBET")) {
      return "BANTUBET"
    }

    if (rawName.includes("ELEPHANTBET") || rawName.includes("EBET")) {
      return "ELEPHANTBET"
    }

    if (rawName.includes("AFRIBET") || rawName.includes("ABET")) {
      return "AFRIBET"
    }

    if (rawName.includes("MOBET")) {
      return "MOBET"
    }

    if (rawName.includes("MELBET") || rawName.includes("MGMBET")) {
      return "MELBET"
    }

    if (rawName.includes("KWANZABET")) {
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
    if (rawName.includes("AMAZON") || rawName.includes("INT VCH2")) {
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

    if (rawName.includes("PLAYSTATION")) {
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

    return directProvider ?? null
  }

  const getOperatorLogo = (operatorKey: string | null) => {
    if (!operatorKey) return null

    const normalizedOperator = normalizeBrandKey(operatorKey)

    /**
     * Primeiro tenta a chave exata.
     */
    let brand = providerBranding[operatorKey.toUpperCase().trim()]

    /**
     * Depois tenta uma correspondência normalizada.
     */
    if (!brand) {
      const matchingKey = Object.keys(providerBranding).find(key => {
        const normalizedKey = normalizeBrandKey(key)

        return (
          normalizedKey === normalizedOperator ||
          normalizedOperator.includes(normalizedKey) ||
          normalizedKey.includes(normalizedOperator)
        )
      })

      if (matchingKey) {
        brand = providerBranding[matchingKey]
      }
    }

    if (!brand?.logo) return null

    const targetFileName = brand.logo.toLowerCase().trim()

    /**
     * Procura o arquivo físico dentro de assets/recharges,
     * ignorando maiúsculas/minúsculas no nome/caminho.
     */
    for (const path in rechargeImages) {
      if (path.toLowerCase().endsWith(targetFileName)) {
        return rechargeImages[path]
      }
    }

    /**
     * Fallback: compara somente o nome sem extensão.
     */
    const targetWithoutExtension = targetFileName.replace(/\.[^/.]+$/, "")

    for (const path in rechargeImages) {
      const fileName = path
        .split("/")
        .pop()
        ?.toLowerCase()
        .replace(/\.[^/.]+$/, "")

      if (fileName === targetWithoutExtension) {
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
      <div className="sticky top-0 z-10 bg-[#0a2533] px-5 py-4 flex items-center justify-between border-b border-cyan-500/10">
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

            <div className="space-y-1.5 pt-1">
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
        {/* PESQUISA */}
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
              className="w-full bg-[#0e364a] border border-cyan-500/15 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 transition-all shadow-md"
            />
          </div>
        </div>

        {/* CONTROLE DE FLUXO RÁPIDO (TODOS / ENTRADAS / SAÍDAS) */}
        <div className="flex border-b border-cyan-500/15">
          {(['ALL', 'IN', 'OUT'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                filter === f 
                  ? 'text-cyan-300 border-cyan-400' 
                  : 'text-cyan-200/45 border-transparent hover:text-cyan-200'
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
                  className="w-full flex justify-between items-center py-4 border-b border-cyan-500/10 animate-pulse"
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
            <div className="text-center py-12 border-y border-cyan-500/10 text-xs text-cyan-200/55 font-medium">
              Nenhuma transação encontrada para os critérios informados.
            </div>
          ) : Object.entries(grouped).map(([date, txs]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] text-cyan-300/60 font-mono font-black uppercase tracking-wider">{date}</span>
                <div className="h-px flex-1 bg-cyan-500/10" />
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
                    className="w-full flex justify-between items-center py-3.5 border-b border-cyan-500/10 hover:bg-[#0e364a]/55 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border ${
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