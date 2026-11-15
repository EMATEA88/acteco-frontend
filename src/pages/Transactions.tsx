import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TransactionService,
  type Transaction,
  type TransactionPagination,
  type PendingPurchase,
} from '../services/transaction.service'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Gift,
  Coins,
  Receipt,
  Funnel,
  PaperPlaneTilt,
  Clock,
  MagnifyingGlass,
  X,
  Check,
  CalendarBlank,
  ListMagnifyingGlass,
} from '@phosphor-icons/react'

type ExtendedTransaction = Omit<
  Transaction,
  'createdAt' | 'processedAt' | 'metadata'
> & {
  createdAt: string | Date
  processedAt?: string | Date | null
  metadata?: Record<string, any> | null
}

type TransactionFilter = 'ALL' | 'IN' | 'OUT'
type SearchCriteria = 'ALL' | 'PHONE' | 'OPERATOR' | 'DATE' | 'ID'

const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: 'UNITEL.PNG' },
  MOVICEL: { logo: 'MOVICEL.PNG' },
  AFRICELL: { logo: 'AFRICELL.PNG' },
  NETONE: { logo: 'NETONE.PNG' },
  DSTV: { logo: 'DSTV.PNG' },
  ZAP: { logo: 'ZAP1.PNG' },
  ZAP_SAT: { logo: 'ZAP1.PNG' },
  'ZAP FIBRA': { logo: 'ZAP2.PNG' },
  ZAP_MEDIA: { logo: 'ZAP2.PNG' },
  ZAP2: { logo: 'ZAP2.PNG' },
  ENDE: { logo: 'ENDE.PNG' },
  EPAL: { logo: 'EPAL.PNG' },
  STAS: { logo: 'STAS.PNG' },
  '5LINHAS': { logo: 'CINCO.PNG' },
  '5 LINHAS': { logo: 'CINCO.PNG' },
  CINCO: { logo: 'CINCO.PNG' },
  INT_VCH2: { logo: 'AMAZON.PNG' },
  AMAZON: { logo: 'AMAZON.PNG' },
  APPLE: { logo: 'APPLE.PNG' },
  'GOOGLE PLAY': { logo: 'GOOGLEPLAY.PNG' },
  GOOGLE: { logo: 'GOOGLEPLAY.PNG' },
  NETFLIX: { logo: 'NETFLIX.PNG' },
  SPOTIFY: { logo: 'SPOTIFY.PNG' },
  PLAYSTATION: { logo: 'TEAM.PNG' },
  TEAM: { logo: 'TEAM.PNG' },
  XBOX: { logo: 'XBOX.PNG' },
  BOLT: { logo: 'BOLT.PNG' },
  FLIXBUS: { logo: 'FLIXBUS.PNG' },
  PREMIERBET: { logo: 'Premiebet.png' },
  PBET: { logo: 'Premiebet.png' },
  BANTUBET: { logo: 'BantuBet.png' },
  BBET: { logo: 'BantuBet.png' },
  ELEPHANTBET: { logo: 'Elephantbet.png' },
  EBET: { logo: 'Elephantbet.png' },
  AFRIBET: { logo: 'AfriBet.png' },
  ABET: { logo: 'AfriBet.png' },
  MOBET: { logo: 'Mobet.png' },
  MELBET: { logo: 'MelBet.png' },
  MGMBET: { logo: 'MelBet.png' },
  KWANZABET: { logo: 'Kwanzabet.png' },
  '888BETS': { logo: '888Bets.png' },
  '888BET': { logo: '888Bets.png' },
  '888': { logo: '888Bets.png' },
}

const rechargeImages = import.meta.glob<string>(
  '../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}',
  { eager: true, import: 'default' },
)

const emateaLogo = '/logo.png'

const TYPE_META: Record<string, {
  label: string
  icon: any
  color: string
  sign: string
  category: 'IN' | 'OUT'
}> = {
  DEPOSIT: { label: 'Depósito', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  TRANSFER: { label: 'Transferência', icon: PaperPlaneTilt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  PAYMENT: { label: 'Pagamento', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  RECHARGE: { label: 'Recarga', icon: Wallet, color: 'text-cyan-300', sign: '+', category: 'IN' },
  WITHDRAW: { label: 'Levantamento', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  BUY_DEBIT: { label: 'Compra OTC', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  SELL_CREDIT: { label: 'Venda OTC', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  SERVICE_DEBIT: { label: 'Serviço', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  SERVICE_PURCHASE: { label: 'Compra de serviço', icon: Clock, color: 'text-amber-300', sign: '-', category: 'OUT' },
  WALLET_DEPOSIT: { label: 'Depósito', icon: Wallet, color: 'text-cyan-300', sign: '+', category: 'IN' },
  REFUND: { label: 'Reembolso', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  COMMISSION: { label: 'Comissão', icon: Coins, color: 'text-cyan-300', sign: '+', category: 'IN' },
  GIFT: { label: 'Presente', icon: Gift, color: 'text-rose-400', sign: '-', category: 'OUT' },
  INVESTMENT_DEBIT: { label: 'Investimento', icon: ArrowUpRight, color: 'text-rose-400', sign: '-', category: 'OUT' },
  INVESTMENT_CREDIT: { label: 'Lucro', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  TASK_REWARD: { label: 'Tarefa', icon: Coins, color: 'text-cyan-300', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_IN: { label: 'Transferência recebida', icon: ArrowDownLeft, color: 'text-cyan-300', sign: '+', category: 'IN' },
  INTERNAL_TRANSFER_OUT: { label: 'Transferência enviada', icon: PaperPlaneTilt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  FEE: { label: 'Taxa', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  CHARGE: { label: 'Taxa', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
  SERVICE_FEE: { label: 'Taxa de serviço', icon: Receipt, color: 'text-rose-400', sign: '-', category: 'OUT' },
}

const normalizeBrandKey = (value: string = '') =>
  value
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const DSTV_PLAN_PATTERNS = [
  /\bINICIAL(?:\s*\/?\s*7D)?\b/,
  /\bSELECT(?:\s*\/?\s*7D)?\b/,
  /\bDESPORTO(?:\s*\/?\s*7D)?\b/,
  /\bULTRA\b/,
  /\bFACIL(?:\s*\/?\s*7D)?\b/,
  /\bGRANDE\s+MAIS\b/,
  /\bPREMIUM\b/,
  /\bMEGA\b/,
  /\bFAMILIA(?:\s+MAIS)?(?:\s*\/?\s*7D)?\b/,
  /\bCHINA\b/,
  /\bFRENCH(?:\s+TCH|\s+CIS|\s+PLUS)?\b/,
  /\bINDIA\b/,
  /\bBU[EÉ]\s*\+?\s*INDIA\b/,
  /\bBOX\s+OFFICE\b/,
  /\bEXTRAVIEW\b/,
  /\bHD\s*[- ]?\s*PVR\b/,
]

export default function Transactions() {
  const navigate = useNavigate()
  const [items, setItems] = useState<ExtendedTransaction[]>([])
  const [pendingPurchases, setPendingPurchases] = useState<PendingPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TransactionFilter>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>('ALL')
  const [showCriteriaModal, setShowCriteriaModal] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<TransactionPagination | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  const TRANSACTIONS_PER_PAGE = 20

  useEffect(() => {
    let mounted = true

    const loadInitialTransactions = async () => {
      try {
        setLoading(true)
        const result = await TransactionService.paginate(1, TRANSACTIONS_PER_PAGE)
        if (!mounted) return

        setItems(result.transactions as ExtendedTransaction[])
        setPendingPurchases(result.pendingPurchases ?? [])
        setPagination(result.pagination)
        setPage(1)
      } catch (error) {
        console.error('TRANSACTION_HISTORY_LOAD_ERROR:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void loadInitialTransactions()
    return () => { mounted = false }
  }, [])

  // Atualiza o histórico a cada 30 segundos para refletir reconciliações.
  useEffect(() => {
    let mounted = true
    let refreshing = false

    const refreshTransactions = async () => {
      if (refreshing) return
      refreshing = true

      try {
        const result = await TransactionService.paginate(1, TRANSACTIONS_PER_PAGE)
        if (!mounted) return

        setItems(current => {
          const refreshedIds = new Set(result.transactions.map(tx => tx.id))
          const olderTransactions = current.filter(tx => !refreshedIds.has(tx.id))
          return [...(result.transactions as ExtendedTransaction[]), ...olderTransactions]
        })

        setPendingPurchases(current => {
          const refreshed = result.pendingPurchases ?? []
          const refreshedIds = new Set(refreshed.map(purchase => purchase.id))
          const olderPurchases = current.filter(purchase => !refreshedIds.has(purchase.id))
          return [...refreshed, ...olderPurchases]
        })

        setPagination(result.pagination)
      } catch (error) {
        console.error('TRANSACTION_HISTORY_REFRESH_ERROR:', error)
      } finally {
        refreshing = false
      }
    }

    const intervalId = window.setInterval(() => { void refreshTransactions() }, 30000)
    return () => {
      mounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const loadMoreTransactions = async () => {
    if (loadingMore || !pagination?.hasNextPage) return

    const nextPage = page + 1
    try {
      setLoadingMore(true)
      const result = await TransactionService.paginate(nextPage, TRANSACTIONS_PER_PAGE)

      setItems(current => {
        const existingIds = new Set(current.map(tx => tx.id))
        const newTransactions = (result.transactions as ExtendedTransaction[])
          .filter(tx => !existingIds.has(tx.id))
        return [...current, ...newTransactions]
      })

      setPendingPurchases(current => {
        const existingIds = new Set(current.map(purchase => purchase.id))
        const newPurchases = (result.pendingPurchases ?? [])
          .filter(purchase => !existingIds.has(purchase.id))
        return [...current, ...newPurchases]
      })

      setPagination(result.pagination)
      setPage(nextPage)
    } catch (error) {
      console.error('TRANSACTION_HISTORY_LOAD_MORE_ERROR:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USDT') return `${amount.toFixed(2)} USDT`
    return `${amount.toLocaleString('pt-AO')} Kz`
  }

  const getOperatorName = (tx: ExtendedTransaction): string | null => {
    const directProvider =
      tx?.metadata?.providerName ??
      tx?.metadata?.partnerName ??
      tx?.metadata?.provider ??
      null

    const sources = [
      tx?.metadata?.serviceName,
      tx?.metadata?.serviceGroupName,
      tx?.metadata?.planName,
      tx?.metadata?.plan,
      tx?.description,
      directProvider,
    ]

    const combinedBrandText = normalizeBrandKey(sources.filter(Boolean).join(' '))

    // Identificadores explícitos do fornecedor têm prioridade.
    if (combinedBrandText.includes('KWANZABET')) return 'KWANZABET'
    if (combinedBrandText.includes('DSTV')) return 'DSTV'

    if (directProvider) {
      const normalizedProvider = normalizeBrandKey(directProvider)
      const directMap: Record<string, string> = {
        UNITEL: 'UNITEL',
        BAZZA: 'UNITEL',
        MOVICEL: 'MOVICEL',
        AFRICELL: 'AFRICELL',
        NETONE: 'NETONE',
        DSTV: 'DSTV',
        ZAP: 'ZAP',
        'ZAP SAT': 'ZAP_SAT',
        'ZAP FIBRA': 'ZAP FIBRA',
        'ZAP MEDIA': 'ZAP_MEDIA',
        ENDE: 'ENDE',
        EPAL: 'EPAL',
        STAS: 'STAS',
        '5LINHAS': '5LINHAS',
        '5 LINHAS': '5 LINHAS',
        CINCO: 'CINCO',
        'INT VCH2': 'INT_VCH2',
        AMAZON: 'AMAZON',
        APPLE: 'APPLE',
        'GOOGLE PLAY': 'GOOGLE PLAY',
        GOOGLE: 'GOOGLE',
        NETFLIX: 'NETFLIX',
        SPOTIFY: 'SPOTIFY',
        PLAYSTATION: 'PLAYSTATION',
        TEAM: 'TEAM',
        XBOX: 'XBOX',
        BOLT: 'BOLT',
        FLIXBUS: 'FLIXBUS',
        PREMIERBET: 'PREMIERBET',
        PBET: 'PBET',
        BANTUBET: 'BANTUBET',
        BBET: 'BBET',
        ELEPHANTBET: 'ELEPHANTBET',
        EBET: 'EBET',
        AFRIBET: 'AFRIBET',
        ABET: 'ABET',
        MOBET: 'MOBET',
        MELBET: 'MELBET',
        MGMBET: 'MGMBET',
        KWANZABET: 'KWANZABET',
        '888BETS': '888BETS',
        '888BET': '888BET',
        '888': '888',
      }

      if (directMap[normalizedProvider]) return directMap[normalizedProvider]

      const brandingMatch = Object.keys(providerBranding).find(key => {
        const normalizedKey = normalizeBrandKey(key)
        return normalizedKey === normalizedProvider ||
          normalizedProvider.includes(normalizedKey) ||
          normalizedKey.includes(normalizedProvider)
      })
      if (brandingMatch) return brandingMatch
    }

    const rawName = normalizeBrandKey(sources.filter(Boolean).join(' '))

    if (rawName.includes('UNITEL') || rawName.includes('BAZZA')) return 'UNITEL'
    if (rawName.includes('MOVICEL')) return 'MOVICEL'
    if (rawName.includes('AFRICELL')) return 'AFRICELL'
    if (rawName.includes('NETONE')) return 'NETONE'

    // Os nomes curtos dos planos DStv só são considerados quando há
    // contexto de televisão no grupo/serviço ou quando a compra é de serviço.
    const serviceContext = normalizeBrandKey([
      tx?.metadata?.serviceGroupName,
      tx?.metadata?.serviceName,
      tx?.metadata?.category,
      tx?.metadata?.productType,
    ].filter(Boolean).join(' '))
    const isTelevisionContext =
      /\bTV\b/.test(serviceContext) ||
      serviceContext.includes('TELEVISAO') ||
      serviceContext.includes('DSTV') ||
      serviceContext.includes('DTH')

    const isDStvPlan = DSTV_PLAN_PATTERNS.some(pattern => pattern.test(rawName))
    const transactionType = String(tx?.type ?? '').toUpperCase()
    const isServiceTransaction =
      transactionType === 'SERVICE_PURCHASE' ||
      transactionType === 'RECHARGE' ||
      transactionType === 'PAYMENT'

    // Os novos nomes comerciais dos pacotes DStv podem chegar apenas na descrição
    // (ex.: "Compra de Inicial"), sem provider ou grupo de serviço nos metadados.
    const descriptionText = normalizeBrandKey(tx?.description ?? '')
    const isNamedDStvPackage =
      isDStvPlan &&
      /\bCOMPRA\s+DE\s+/.test(descriptionText)

    if (isNamedDStvPackage || (isDStvPlan && (isTelevisionContext || isServiceTransaction))) {
      return 'DSTV'
    }

    if (rawName.includes('ZAP FIBRA')) return 'ZAP FIBRA'
    if (rawName.includes('ZAP SAT')) return 'ZAP_SAT'
    if (rawName.includes('ZAP MEDIA')) return 'ZAP_MEDIA'
    if (rawName.includes('ZAP')) return 'ZAP'
    if (rawName.includes('ENDE')) return 'ENDE'
    if (rawName.includes('EPAL')) return 'EPAL'
    if (rawName.includes('STAS')) return 'STAS'

    if (rawName.includes('5LINHAS') || rawName.includes('5 LINHAS') || rawName.includes('CINCO')) {
      return '5LINHAS'
    }

    if (rawName.includes('PREMIERBET') || rawName.includes('PBET')) return 'PREMIERBET'
    if (rawName.includes('BANTUBET') || rawName.includes('BBET')) return 'BANTUBET'
    if (rawName.includes('ELEPHANTBET') || rawName.includes('EBET')) return 'ELEPHANTBET'
    if (rawName.includes('AFRIBET') || rawName.includes('ABET')) return 'AFRIBET'
    if (rawName.includes('MOBET')) return 'MOBET'
    if (rawName.includes('MELBET') || rawName.includes('MGMBET')) return 'MELBET'
    if (rawName.includes('KWANZABET')) return 'KWANZABET'
    if (rawName.includes('888BETS') || rawName.includes('888BET') || /\b888\b/.test(rawName)) return '888BETS'

    if (rawName.includes('AMAZON') || rawName.includes('INT VCH2')) return 'AMAZON'
    if (rawName.includes('APPLE')) return 'APPLE'
    if (rawName.includes('GOOGLE PLAY') || rawName.includes('GOOGLEPLAY') || rawName.includes('GOOGLE')) return 'GOOGLE PLAY'
    if (rawName.includes('NETFLIX')) return 'NETFLIX'
    if (rawName.includes('SPOTIFY')) return 'SPOTIFY'
    if (rawName.includes('PLAYSTATION')) return 'PLAYSTATION'
    if (rawName.includes('XBOX')) return 'XBOX'
    if (rawName.includes('BOLT')) return 'BOLT'
    if (rawName.includes('FLIXBUS')) return 'FLIXBUS'

    return directProvider ? String(directProvider) : null
  }

  const getOperatorLogo = (operatorKey: string | null) => {
    if (!operatorKey) return null

    const normalizedOperator = normalizeBrandKey(operatorKey)
    let brand = providerBranding[operatorKey.toUpperCase().trim()]

    if (!brand) {
      const matchingKey = Object.keys(providerBranding).find(key => {
        const normalizedKey = normalizeBrandKey(key)
        return normalizedKey === normalizedOperator ||
          normalizedOperator.includes(normalizedKey) ||
          normalizedKey.includes(normalizedOperator)
      })
      if (matchingKey) brand = providerBranding[matchingKey]
    }

    if (!brand?.logo) return null

    const targetFileName = brand.logo.toLowerCase().trim()
    for (const path in rechargeImages) {
      if (path.toLowerCase().endsWith(targetFileName)) return rechargeImages[path]
    }

    const targetWithoutExtension = targetFileName.replace(/\.[^/.]+$/, '')
    for (const path in rechargeImages) {
      const fileName = path.split('/').pop()?.toLowerCase().replace(/\.[^/.]+$/, '')
      if (fileName === targetWithoutExtension) return rechargeImages[path]
    }

    return null
  }

  const filtered = useMemo(() => {
    const pendingAsTransactions: ExtendedTransaction[] = pendingPurchases.map(purchase => ({
      id: purchase.id,
      type: 'SERVICE_PURCHASE',
      amount: purchase.amount,
      currency: purchase.currency,
      method: purchase.method,
      status: purchase.status,
      description: purchase.description,
      reference: purchase.reference,
      relatedPublicId: purchase.relatedPublicId,
      createdAt: purchase.createdAt,
      processedAt: purchase.processedAt,
      metadata: {
        ...(purchase.metadata ?? {}),
        source: 'SERVICE_REQUEST',
        pending: ['PENDING', 'IN_PROGRESS', 'PROVIDER_TIMEOUT'].includes(
          String(purchase.status).toUpperCase(),
        ),
        serviceRequestId: purchase.id,
      },
    } as ExtendedTransaction))

    const allItems = [...pendingAsTransactions, ...items].sort((a, b) => {
      const dateDifference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (dateDifference !== 0) return dateDifference
      return String(b.id).localeCompare(String(a.id), undefined, { numeric: true })
    })

    return allItems.filter(tx => {
      const meta = TYPE_META[tx.type]
      if (filter === 'IN' && meta?.category !== 'IN') return false
      if (filter === 'OUT' && meta?.category !== 'OUT') return false
      if (!searchTerm.trim()) return true

      const query = searchTerm.toLowerCase().trim()
      const description = String(tx.description || '').toLowerCase()
      const typeLabel = String(meta?.label || '').toLowerCase()
      const phone = String(tx.metadata?.phone || tx.metadata?.phoneNumber || '').toLowerCase()
      const operator = String(getOperatorName(tx) || '').toLowerCase()
      const plan = String(tx.metadata?.planName || tx.metadata?.plan || '').toLowerCase()
      const txId = String(tx.id || '').toLowerCase()
      const date = new Date(tx.createdAt)
      const dateFormatted = date.toLocaleDateString('pt-AO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      }).toLowerCase()
      const dateShort = date.toLocaleDateString('pt-AO', {
        day: '2-digit', month: 'short',
      }).toLowerCase()

      if (searchCriteria === 'PHONE') return phone.includes(query)
      if (searchCriteria === 'OPERATOR') return operator.includes(query)
      if (searchCriteria === 'DATE') return dateFormatted.includes(query) || dateShort.includes(query)
      if (searchCriteria === 'ID') return txId.includes(query)

      return description.includes(query) ||
        typeLabel.includes(query) ||
        phone.includes(query) ||
        operator.includes(query) ||
        plan.includes(query) ||
        txId.includes(query) ||
        dateFormatted.includes(query) ||
        dateShort.includes(query)
    })
  }, [items, pendingPurchases, filter, searchTerm, searchCriteria])

  const grouped = useMemo(() => filtered.reduce((acc, tx) => {
    const date = new Date(tx.createdAt).toLocaleDateString('pt-AO', {
      day: '2-digit', month: 'short',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(tx)
    return acc
  }, {} as Record<string, ExtendedTransaction[]>), [filtered])

  const criteriaLabels: Record<SearchCriteria, string> = {
    ALL: 'Pesquisa geral',
    PHONE: 'Telefone',
    OPERATOR: 'Operadora',
    DATE: 'Data',
    ID: 'ID da transação',
  }

  const getStatusMeta = (status: string) => {
    const normalized = String(status || '').toUpperCase()
    if (normalized === 'COMPLETED' || normalized === 'APPROVED' || normalized === 'SUCCESS') {
      return { label: 'Concluído', classes: 'text-emerald-300 bg-emerald-500/10 border-emerald-400/20' }
    }
    if (normalized === 'PENDING' || normalized === 'IN_PROGRESS') {
      return { label: 'Em processamento', classes: 'text-amber-300 bg-amber-500/10 border-amber-400/20' }
    }
    if (normalized === 'PROVIDER_TIMEOUT') {
      return { label: 'Em verificação', classes: 'text-orange-300 bg-orange-500/10 border-orange-400/20' }
    }
    if (normalized === 'REJECTED' || normalized === 'FAILED' || normalized === 'CANCELLED') {
      return { label: 'Não concluído', classes: 'text-rose-300 bg-rose-500/10 border-rose-400/20' }
    }
    return { label: normalized || 'Registado', classes: 'text-slate-300 bg-slate-500/10 border-slate-400/20' }
  }

  const criteriaPlaceholder =
    searchCriteria === 'PHONE' ? 'Pesquisar pelo número de telefone...' :
    searchCriteria === 'OPERATOR' ? 'Ex.: Unitel, DStv, ZAP...' :
    searchCriteria === 'DATE' ? 'Ex.: 15/11/2026 ou 15 nov...' :
    searchCriteria === 'ID' ? 'Introduza o ID da transação...' :
    'Pesquisar por serviço, operadora, plano, telefone ou data...'

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] antialiased">
      <main className="mx-auto w-full max-w-3xl space-y-5 px-4 pb-32 pt-5 sm:px-5">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300/55"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder={criteriaPlaceholder}
                aria-label="Pesquisar transações"
                className="h-12 w-full rounded-2xl border border-cyan-500/15 bg-[#0e364a] pl-11 pr-4 text-sm text-white shadow-lg shadow-black/10 outline-none transition placeholder:text-cyan-100/35 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowCriteriaModal(true)}
              aria-label="Opções de pesquisa"
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
                searchCriteria !== 'ALL'
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-300'
                  : 'border-cyan-500/20 bg-[#0e364a] text-cyan-300 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <Funnel size={18} weight="bold" />
              {searchCriteria !== 'ALL' && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0a2533] bg-cyan-300" />
              )}
            </button>
          </div>
          {searchCriteria !== 'ALL' && (
            <div className="flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-500/[0.07] px-3 py-2 text-[11px] text-cyan-200">
              <span>Critério ativo: <strong>{criteriaLabels[searchCriteria]}</strong></span>
              <button
                type="button"
                onClick={() => setSearchCriteria('ALL')}
                aria-label="Limpar critério"
                className="rounded-md p-1 text-cyan-300 hover:bg-white/5 hover:text-white"
              >
                <X size={14} weight="bold" />
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-cyan-500/15 bg-[#0e364a]/75 p-1.5">
          <div className="grid grid-cols-3 gap-1">
            {([
              ['ALL', 'Todos'],
              ['IN', 'Entradas'],
              ['OUT', 'Saídas'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                  filter === value
                    ? 'border border-cyan-300/20 bg-cyan-400/15 text-cyan-200 shadow-sm'
                    : 'text-cyan-100/50 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(index => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-3 rounded-2xl border border-cyan-500/10 bg-[#0e364a]/70 p-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-cyan-900/70" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-36 rounded bg-cyan-900/70" />
                    <div className="h-2.5 w-24 rounded bg-cyan-900/50" />
                  </div>
                  <div className="h-3 w-20 rounded bg-cyan-900/70" />
                </div>
              ))}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cyan-500/20 bg-[#0e364a]/45 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                <ListMagnifyingGlass size={27} weight="duotone" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">
                Nenhuma transação encontrada
              </h3>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-cyan-100/50">
                Não existem operações correspondentes aos filtros ou à pesquisa introduzida.
              </p>
              {(searchTerm || filter !== 'ALL' || searchCriteria !== 'ALL') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setFilter('ALL')
                    setSearchCriteria('ALL')
                  }}
                  className="mt-5 rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  Limpar pesquisa e filtros
                </button>
              )}
            </div>
          ) : (
            Object.entries(grouped).map(([date, transactions]) => (
              <div key={date} className="space-y-2.5">
                <div className="flex items-center gap-3 px-1">
                  <CalendarBlank size={14} weight="duotone" className="text-cyan-400/70" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200/65">
                    {date}
                  </h3>
                  <div className="h-px flex-1 bg-cyan-500/10" />
                  <span className="text-[10px] font-semibold tabular-nums text-cyan-100/35">
                    {transactions.length}
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-cyan-500/15 bg-[#0e364a]/75 shadow-lg shadow-black/10">
                  {transactions.map((tx, index) => {
                    const meta = TYPE_META[tx.type] || {
                      label: tx.type,
                      icon: Clock,
                      color: 'text-cyan-300/70',
                      sign: '',
                      category: 'OUT' as const,
                    }
                    const Icon = meta.icon
                    const isOut = meta.category === 'OUT'
                    const purchaseStatus = String(tx.status || '').toUpperCase()
                    const operatorKey = getOperatorName(tx)
                    const typeUpper = String(tx.type || '').toUpperCase()
                    const descriptionLower = String(tx.description || '').toLowerCase()

                    // Operações próprias da EMATEA mantêm o logótipo institucional.
                    const isEmateaOperation =
                      typeUpper.includes('DEPOSIT') ||
                      typeUpper.includes('WITHDRAW') ||
                      typeUpper === 'FEE' ||
                      typeUpper === 'CHARGE' ||
                      typeUpper === 'SERVICE_FEE' ||
                      (typeUpper === 'SERVICE_DEBIT' && descriptionLower.includes('taxa')) ||
                      descriptionLower.includes('wallet deposit') ||
                      descriptionLower.includes('depósito de carteira')

                    const logoSrc = isEmateaOperation
                      ? emateaLogo
                      : getOperatorLogo(operatorKey)

                    const statusMeta = getStatusMeta(purchaseStatus)
                    const dateTime = new Date(tx.createdAt)
                    const isServicePurchase = typeUpper === 'SERVICE_PURCHASE'

                    return (
                      <button
                        key={`${tx.type}-${tx.id}`}
                        type="button"
                        onClick={() => {
                          if (isServicePurchase) {
                            navigate(`/transactions/service/${tx.id}`)
                            return
                          }
                          navigate(`/transactions/${tx.id}`)
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#124158]/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400 ${
                          index !== transactions.length - 1 ? 'border-b border-cyan-500/10' : ''
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${
                            logoSrc
                              ? 'border-white/10 bg-white p-1.5'
                              : isOut
                                ? 'border-rose-400/20 bg-rose-500/10 text-rose-300'
                                : 'border-cyan-400/20 bg-cyan-500/10 text-cyan-300'
                          }`}>
                            {logoSrc ? (
                              <img
                                src={logoSrc}
                                alt={isEmateaOperation ? 'EMATEA' : operatorKey ?? 'Operadora'}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <Icon size={21} weight="duotone" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold tracking-tight text-white">
                              {tx.description?.trim() || meta.label}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-cyan-100/50">
                              <span className="font-mono">
                                {dateTime.toLocaleTimeString('pt-AO', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {operatorKey && (
                                <>
                                  <span className="h-1 w-1 rounded-full bg-cyan-400/40" />
                                  <span className="truncate font-semibold uppercase tracking-wide">
                                    {operatorKey === 'DSTV' ? 'DStv' : operatorKey.replace(/_/g, ' ')}
                                  </span>
                                </>
                              )}
                            </div>
                            {isServicePurchase && (
                              <span className={`mt-1.5 inline-flex rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${statusMeta.classes}`}>
                                {statusMeta.label}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className={`whitespace-nowrap font-mono text-[12px] font-black tabular-nums ${meta.color}`}>
                            {meta.sign}{formatCurrency(Number(tx.amount), tx.currency)}
                          </p>
                          {!isServicePurchase ? (
                            <span className="mt-1 inline-block rounded-md border border-cyan-500/15 bg-[#082b3b] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-cyan-200/55">
                              {tx.currency}
                            </span>
                          ) : (
                            <span className="mt-1 inline-block text-[9px] font-semibold text-cyan-100/35">
                              {meta.label}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {pagination?.hasNextPage && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => { void loadMoreTransactions() }}
              disabled={loadingMore}
              className="inline-flex min-h-12 min-w-56 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#147f98] via-[#13aeb8] to-[#20c8c2] px-6 py-3 text-sm font-extrabold tracking-wide text-white shadow-[0_10px_24px_rgba(19,174,184,0.20)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_14px_30px_rgba(19,174,184,0.28)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loadingMore ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  A carregar...
                </>
              ) : 'Carregar mais transações'}
            </button>
          </div>
        )}

      </main>

      {showCriteriaModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setShowCriteriaModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-search-title"
            className="w-full max-w-md space-y-4 rounded-3xl border border-cyan-500/20 bg-[#0e364a] p-5 shadow-2xl shadow-black/40"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/75">
                  Pesquisa avançada
                </p>
                <h3 id="transaction-search-title" className="mt-1 text-base font-black text-white">
                  Filtrar transações
                </h3>
                <p className="mt-1 text-xs text-cyan-100/50">
                  Escolha o campo que pretende pesquisar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCriteriaModal(false)}
                aria-label="Fechar"
                className="rounded-xl border border-cyan-500/15 bg-[#082b3b] p-2 text-cyan-200/70 transition hover:text-white"
              >
                <X size={17} weight="bold" />
              </button>
            </div>

            <div className="space-y-2">
              {(['ALL', 'PHONE', 'OPERATOR', 'DATE', 'ID'] as const).map(criteria => (
                <button
                  key={criteria}
                  type="button"
                  onClick={() => {
                    setSearchCriteria(criteria)
                    setShowCriteriaModal(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-xs font-bold transition ${
                    searchCriteria === criteria
                      ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200'
                      : 'border-cyan-500/10 bg-[#082b3b]/65 text-cyan-100/65 hover:border-cyan-500/25 hover:text-white'
                  }`}
                >
                  <span>{criteriaLabels[criteria]}</span>
                  {searchCriteria === criteria && <Check size={16} weight="bold" />}
                </button>
              ))}
            </div>

            {searchCriteria !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  setSearchCriteria('ALL')
                  setShowCriteriaModal(false)
                }}
                className="w-full rounded-xl border border-cyan-500/15 bg-[#082b3b] py-3 text-xs font-bold text-cyan-200/70 transition hover:text-white"
              >
                Repor pesquisa geral
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
