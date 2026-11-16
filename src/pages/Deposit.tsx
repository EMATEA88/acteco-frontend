
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

import {
  Bank,
  CurrencyCircleDollar,
  ClockCounterClockwise,
  Copy,
  CheckCircle,
  WhatsappLogo,
  CloudArrowUp,
  Check,
  BuildingOffice,
} from '@phosphor-icons/react'

import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'
import { RedotPayService } from '../services/redotpay.service'
import { api } from '../services/api'
import { IntelizeService, type IntelizeReference } from '../services/intelize.service'

type BankType = {
  id: number
  name: string
  bank: string
  iban: string
}

type QuoteType = {
  amount: string
  currency: string
  rate: string
  convertedAmount: string
  convertedCurrency: string
}

const baseButton =
  'w-full h-12 rounded-xl border border-[#2A6073] bg-[#103647] text-sm font-semibold text-[#D8EAF0] transition-colors hover:bg-[#16465A] focus:outline-none focus:ring-2 focus:ring-[#19C5CE]/40'

export default function DepositCoordinator() {
  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans antialiased pb-8">
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<SelectMethod />} />
        <Route path="/aoa" element={<DepositAOA />} />
        <Route path="/redotpay" element={<DepositRedotPay />} />
        <Route path="/entity" element={<DepositEntity />} />
        <Route path="/banks/:id" element={<DepositBanks />} />
      </Routes>
    </div>
  )
}

/* =====================================================
   COMPONENTES BASE
===================================================== */

function PageTitle({ title }: { title: string }) {
  return (
    <h1 className="mb-6 text-lg font-semibold tracking-tight text-white">
      {title}
    </h1>
  )
}

function BackButton({
  onClick,
  label = 'Voltar',
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseButton} mt-6`}
    >
      {label}
    </button>
  )
}

function PrimaryButton({
  children,
  onClick,
  loading,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Processando...
        </>
      ) : children}
    </button>
  )
}

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#16465A] ${className}`}
    />
  )
}

function BalanceCard({ balance }: { balance: number | null }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-[#24566A] bg-[#103647] p-4">
      <span className="text-xs text-[#A9C4CF]">
        Saldo disponível
      </span>

      {balance !== null ? (
        <span className="text-sm font-semibold text-white">
          {Number(balance).toLocaleString('pt-AO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} Kz
        </span>
      ) : (
        <Skeleton className="h-5 w-24" />
      )}
    </div>
  )
}

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6">
      {children}
    </main>
  )
}

/* =====================================================
   SELEÇÃO DO MÉTODO
===================================================== */

function SelectMethod() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <PageTitle title="Depositar fundos" />

        <button
          type="button"
          onClick={() => navigate('/recharge-history')}
          className="mb-6 flex items-center gap-2 text-xs font-medium text-[#A9C4CF] transition-colors hover:text-white"
        >
          <ClockCounterClockwise size={17} />
          Histórico
        </button>
      </div>

      <div className="space-y-3">

        <button
          type="button"
          onClick={() => navigate('/deposit/aoa')}
          className="flex w-full items-center gap-4 rounded-xl border border-[#24566A] bg-[#103647] p-4 text-left transition-colors hover:border-[#19C5CE]/50 hover:bg-[#16465A]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0a2533] text-[#19C5CE]">
            <Bank size={23} weight="regular" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Depósito em Kwanza
            </p>
            <p className="mt-1 text-xs text-[#A9C4CF]">
              Multicaixa, ATM e aplicação bancária
            </p>
          </div>

          <span className="text-lg text-[#19C5CE]">›</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/deposit/redotpay')}
          className="flex w-full items-center gap-4 rounded-xl border border-[#24566A] bg-[#103647] p-4 text-left transition-colors hover:border-[#19C5CE]/50 hover:bg-[#16465A]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0a2533] text-[#19C5CE]">
            <CurrencyCircleDollar size={23} weight="regular" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Depósito em criptomoedas
            </p>
            <p className="mt-1 text-xs text-[#A9C4CF]">
              USDT e USDC através da RedotPay
            </p>
          </div>

          <span className="text-lg text-[#19C5CE]">›</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/deposit/entity')}
          className="flex w-full items-center gap-4 rounded-xl border border-[#24566A] bg-[#103647] p-4 text-left transition-colors hover:border-[#19C5CE]/50 hover:bg-[#16465A]"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0a2533] text-[#19C5CE]">
            <BuildingOffice size={23} weight="regular" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              Pagamento por Entidade
            </p>
            <p className="mt-1 text-xs text-[#A9C4CF]">
              Deposite através de uma referência EMATEA
            </p>
          </div>
        </button>

      </div>

      <BackButton onClick={() => navigate(-1)} />
    </PageContainer>
  )
}

/* =====================================================
   DEPÓSITO POR ENTIDADE
===================================================== */

function DepositEntity() {
  const navigate = useNavigate()

  const [referenceData, setReferenceData] =
    useState<IntelizeReference | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  async function loadReference() {
    try {
      setLoading(true)
      setError(false)

      const data = await IntelizeService.getReference()
      setReferenceData(data)
    } catch (err: any) {
      console.error(
        'Erro ao carregar referência Intelize:',
        err.response?.data || err
      )
      setReferenceData(null)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        setError(false)

        const data = await IntelizeService.getReference()

        if (active) {
          setReferenceData(data)
        }
      } catch (err: any) {
        console.error(
          'Erro ao carregar referência Intelize:',
          err.response?.data || err
        )

        if (active) {
          setReferenceData(null)
          setError(true)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  async function copyReference() {
    if (!referenceData?.reference) return

    try {
      await navigator.clipboard.writeText(referenceData.reference)
      setCopied(true)
      toast.success('Referência copiada.')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Não foi possível copiar a referência.')
    }
  }

  return (
    <PageContainer>
      <PageTitle title="Pagamento por Entidade" />

      <div className="mb-5 rounded-xl border border-[#24566A] bg-[#103647] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0a2533] text-[#19C5CE]">
            <BuildingOffice size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              EMATEA LDA
            </p>
            <p className="mt-1 text-xs text-[#A9C4CF]">
              Pagamento por referência
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 rounded-xl border border-[#24566A] bg-[#103647] p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-center">
          <p className="text-sm font-semibold text-white">
            Não foi possível carregar os dados
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#A9C4CF]">
            Ocorreu um problema ao consultar a sua referência. Tente novamente.
          </p>
          <div className="mt-5">
            <PrimaryButton onClick={loadReference}>
              Tentar novamente
            </PrimaryButton>
          </div>
        </div>
      ) : !referenceData?.isActive ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">
          <p className="text-sm font-semibold text-white">
            Referência indisponível
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#A9C4CF]">
            Neste momento, a sua referência não está ativa. Contacte o suporte
            para obter assistência.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#24566A] bg-[#103647] p-4">
          <div>
            <p className="text-xs text-[#A9C4CF]">
              Entidade
            </p>
            <p className="mt-1 text-base font-semibold text-white">
              {referenceData.entityCode}
            </p>
          </div>

          <div className="my-4 border-t border-[#24566A]" />

          <div>
            <p className="text-xs text-[#A9C4CF]">
              Beneficiário
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              EMATEA LDA
            </p>
          </div>

          <div className="my-4 border-t border-[#24566A]" />

          <div>
            <p className="mb-2 text-xs text-[#A9C4CF]">
              A sua referência de pagamento
            </p>

            <div className="flex items-center gap-3 rounded-lg border border-[#24566A] bg-[#0a2533] p-3">
              <span className="min-w-0 flex-1 break-all text-lg font-bold tracking-wider text-white">
                {referenceData.reference}
              </span>

              <button
                type="button"
                onClick={copyReference}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#103647] text-[#19C5CE] transition-colors hover:bg-[#16465A]"
                aria-label="Copiar referência"
              >
                {copied ? (
                  <CheckCircle size={21} weight="fill" />
                ) : (
                  <Copy size={21} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-[#24566A] bg-[#103647] p-4">
        <p className="text-xs font-semibold text-white">
          Informação
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#A9C4CF]">
          Utilize os dados apresentados para identificar o pagamento destinado
          à sua conta EMATEA. A referência está associada ao seu registo.
        </p>
      </div>

      <BackButton onClick={() => navigate('/deposit')} />
    </PageContainer>
  )
}

/* =====================================================
   DEPÓSITO AOA
===================================================== */

function DepositAOA() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    UserService.me()
      .then(user => setBalance(Number(user.balance || 0)))
      .catch(() => {})
  }, [])

  async function submit() {
    if (!amount || Number(amount) <= 0) {
      toast.error('Introduza um valor válido.')
      return
    }

    if (!Number.isFinite(Number(amount))) {
      toast.error('Valor inválido.')
      return
    }

    try {
      setLoading(true)

      const res = await RechargeService.create(Number(amount))

      navigate(`/deposit/banks/${res.id}`)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        'Não foi possível iniciar o depósito.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle title="Depósito bancário" />

      <BalanceCard balance={balance} />

      <div className="rounded-xl border border-[#24566A] bg-[#103647] p-4">

        <label className="mb-2 block text-xs font-medium text-[#A9C4CF]">
          Valor do depósito
        </label>

        <div className="relative">
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={e =>
              setAmount(
                e.target.value === ''
                  ? ''
                  : Number(e.target.value)
              )
            }
            placeholder="0,00"
            className="h-14 w-full rounded-lg border border-[#24566A] bg-[#0a2533] px-4 pr-16 text-xl font-semibold text-white outline-none transition-colors placeholder:text-[#668997] focus:border-[#19C5CE]"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#19C5CE]">
            AOA
          </span>
        </div>

        <p className="mt-2 text-[11px] text-[#A9C4CF]">
          Introduza o valor que pretende adicionar à sua conta.
        </p>

      </div>

      <div className="mt-5">
        <PrimaryButton
          onClick={submit}
          loading={loading}
          disabled={!amount || Number(amount) <= 0}
        >
          Continuar
        </PrimaryButton>
      </div>

      <BackButton onClick={() => navigate('/deposit')} />
    </PageContainer>
  )
}

/* =====================================================
   DEPÓSITO REDOTPAY
===================================================== */

function DepositRedotPay() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [quote, setQuote] = useState<QuoteType | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)

  useEffect(() => {
    UserService.me()
      .then(user => setBalance(Number(user.balance || 0)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const value = Number(amount)

    if (!value || value <= 0) {
      setQuote(null)
      setQuoteLoading(false)
      return
    }

    let active = true

    setQuoteLoading(true)

    const timer = setTimeout(async () => {
      try {
        const result = await RechargeService.getQuote(value)

        if (active) {
          setQuote(result)
        }
      } catch (error) {
        console.error('Erro ao obter cotação:', error)

        if (active) {
          setQuote(null)
        }
      } finally {
        if (active) {
          setQuoteLoading(false)
        }
      }
    }, 400)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [amount])

  async function submit() {
    if (!amount || Number(amount) <= 0) {
      toast.error('Introduza um valor válido.')
      return
    }

    try {
      setLoading(true)

      const response = await RedotPayService.createDeposit({
        amount: Number(amount),
      })

      const gateway = response.gateway

      if (!gateway) {
        throw new Error('Resposta inválida da RedotPay.')
      }

      const checkoutUrl =
        gateway.data?.checkoutUrl ??
        gateway.data?.cashierUrl ??
        gateway.data?.payUrl

      if (!checkoutUrl) {
        toast.error('Não foi possível obter o endereço de pagamento.')
        return
      }

      window.location.href = checkoutUrl

    } catch (error) {
      console.error('Erro RedotPay:', error)
      toast.error('Não foi possível criar o pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageTitle title="Depósito com RedotPay" />

      <BalanceCard balance={balance} />

      <div className="rounded-xl border border-[#24566A] bg-[#103647] p-4">

        <label className="mb-2 block text-xs font-medium text-[#A9C4CF]">
          Valor a depositar
        </label>

        <div className="relative">
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => {
              setAmount(
                e.target.value === ''
                  ? ''
                  : Number(e.target.value)
              )
            }}
            placeholder="0,00"
            className="h-14 w-full rounded-lg border border-[#24566A] bg-[#0a2533] px-4 pr-20 text-xl font-semibold text-white outline-none transition-colors placeholder:text-[#668997] focus:border-[#19C5CE]"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#19C5CE]">
            USDT
          </span>
        </div>

      </div>

      {amount && Number(amount) > 0 && (
        <div className="mt-4 rounded-xl border border-[#24566A] bg-[#103647] p-4">

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">
              Resumo da conversão
            </h3>

            {quoteLoading && (
              <span className="flex items-center gap-2 text-[10px] text-[#19C5CE]">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#19C5CE]/30 border-t-[#19C5CE]" />
                Atualizando
              </span>
            )}
          </div>

          {quote ? (
            <>
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <p className="mb-1 text-[11px] text-[#A9C4CF]">
                    Valor enviado
                  </p>

                  <p className="text-base font-semibold text-white">
                    {Number(quote.amount).toLocaleString('pt-AO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    })}
                  </p>

                  <p className="text-xs text-[#19C5CE]">
                    {quote.currency}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-[11px] text-[#A9C4CF]">
                    Valor convertido
                  </p>

                  <p className="text-base font-semibold text-white">
                    {Number(quote.convertedAmount).toLocaleString('pt-AO', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>

                  <p className="text-xs text-[#19C5CE]">
                    {quote.convertedCurrency}
                  </p>
                </div>

              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#24566A] pt-3">
                <span className="text-xs text-[#A9C4CF]">
                  Taxa de conversão
                </span>

                <span className="text-xs font-semibold text-white">
                  1 USDT = {Number(quote.rate).toLocaleString('pt-AO')} AOA
                </span>
              </div>
            </>
          ) : !quoteLoading ? (
            <p className="py-2 text-center text-xs text-[#A9C4CF]">
              Não foi possível obter a cotação.
            </p>
          ) : (
            <Skeleton className="h-14 w-full" />
          )}

        </div>
      )}

      <div className="mt-5">
        <PrimaryButton
          onClick={submit}
          loading={loading}
          disabled={!amount || Number(amount) <= 0 || quoteLoading || !quote}
        >
          Continuar para pagamento
        </PrimaryButton>
      </div>

      <BackButton onClick={() => navigate('/deposit')} />
    </PageContainer>
  )
}

/* =====================================================
   DADOS BANCÁRIOS E COMPROVATIVO
===================================================== */

function DepositBanks() {
  const params = useParams()
  const navigate = useNavigate()

  const rechargeId = Number(params.id)

  const [banks, setBanks] = useState<BankType[]>([])
  const [banksLoading, setBanksLoading] = useState(true)
  const [copied, setCopied] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let active = true

    async function loadBanks() {
      try {
        const response = await api.get('/bank')

        if (active) {
          setBanks(response.data)
        }
      } catch (error) {
        console.error('Erro ao carregar bancos:', error)
        toast.error('Não foi possível carregar os dados bancários.')
      } finally {
        if (active) {
          setBanksLoading(false)
        }
      }
    }

    loadBanks()

    return () => {
      active = false
    }
  }, [])

  async function copyIBAN(bank: BankType) {
    try {
      await navigator.clipboard.writeText(bank.iban)

      setCopied(bank.id)
      toast.success('IBAN copiado.')

      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Não foi possível copiar o IBAN.')
    }
  }

  async function handleDirectUpload() {
    if (!file) {
      toast.error('Selecione o comprovativo.')
      return
    }

    if (!rechargeId || isNaN(rechargeId)) {
      toast.error('Identificação do depósito inválida.')
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('rechargeId', String(rechargeId))
      formData.append('file', file)

      await RechargeService.uploadProof(formData)

      setIsDone(true)
      toast.success('Comprovativo enviado com sucesso.')

    } catch (error: any) {
      console.error('Erro ao enviar comprovativo:', error.response?.data)

      toast.error(
        error.response?.data?.message ||
        'Não foi possível enviar o comprovativo.'
      )
    } finally {
      setUploading(false)
    }
  }

  function handleWhatsAppSupport() {
    const phoneNumber = '244928270636'

    const message =
      `Olá! Preciso de assistência relativamente ao depósito ID: ${rechargeId}.`

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  if (isDone) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center rounded-xl border border-[#24566A] bg-[#103647] px-6 py-12 text-center">

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <Check size={30} weight="bold" />
          </div>

          <h2 className="text-lg font-semibold text-white">
            Comprovativo enviado
          </h2>

          <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#A9C4CF]">
            O comprovativo foi recebido e aguarda validação.
          </p>

          <div className="mt-6 w-full">
            <PrimaryButton onClick={() => navigate('/recharge-history')}>
              Consultar histórico
            </PrimaryButton>
          </div>

          <BackButton
            onClick={() => navigate('/deposit')}
            label="Voltar aos depósitos"
          />

        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageTitle title="Dados para depósito" />

      <div className="mb-4 rounded-lg border border-[#24566A] bg-[#103647] px-4 py-3">
        <p className="text-xs text-[#A9C4CF]">
          Referência do depósito
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          #{rechargeId}
        </p>
      </div>

      {/* CONTAS BANCÁRIAS */}

      <div className="space-y-3">

        {banksLoading ? (
          <>
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </>
        ) : banks.length === 0 ? (
          <div className="rounded-xl border border-[#24566A] bg-[#103647] p-5 text-center">
            <p className="text-sm font-medium text-white">
              Dados bancários indisponíveis
            </p>
            <p className="mt-1 text-xs text-[#A9C4CF]">
              Não foi possível obter as contas para depósito.
            </p>
          </div>
        ) : (
          banks.map(bank => (
            <div
              key={bank.id}
              className="overflow-hidden rounded-xl border border-[#24566A] bg-[#103647]"
            >

              <div className="border-b border-[#24566A] px-4 py-3">
                <p className="text-sm font-semibold text-white">
                  {bank.bank || bank.name || 'Banco'}
                </p>
              </div>

              <div className="space-y-4 p-4">

                <div>
                  <p className="mb-1 text-[11px] text-[#A9C4CF]">
                    Beneficiário
                  </p>

                  <p className="text-sm font-medium text-white">
                    {bank.name || 'EMATEA GESTÃO'}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[11px] text-[#A9C4CF]">
                    IBAN
                  </p>

                  <div className="flex items-center gap-2 rounded-lg border border-[#24566A] bg-[#0a2533] p-3">

                    <span className="min-w-0 flex-1 break-all text-xs font-medium leading-relaxed text-white">
                      {bank.iban}
                    </span>

                    <button
                      type="button"
                      onClick={() => copyIBAN(bank)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#103647] text-[#19C5CE] transition-colors hover:bg-[#16465A]"
                      aria-label="Copiar IBAN"
                    >
                      {copied === bank.id ? (
                        <CheckCircle size={19} weight="fill" />
                      ) : (
                        <Copy size={19} />
                      )}
                    </button>

                  </div>
                </div>

              </div>
            </div>
          ))
        )}

      </div>

      {/* COMPROVATIVO */}

      <div className="mt-5 rounded-xl border border-[#24566A] bg-[#103647] p-4">

        <h3 className="text-sm font-semibold text-white">
          Comprovativo de pagamento
        </h3>

        <p className="mt-1 text-xs text-[#A9C4CF]">
          Anexe a imagem do comprovativo da transferência.
        </p>

        <input
          type="file"
          id="bank-proof"
          hidden
          accept="image/png,image/jpeg,image/jpg"
          onChange={e => {
            const selected = e.target.files?.[0] || null

            if (selected && selected.size > 5 * 1024 * 1024) {
              toast.error('O ficheiro não pode ultrapassar 5 MB.')
              e.target.value = ''
              setFile(null)
              return
            }

            setFile(selected)
          }}
        />

        <label
          htmlFor="bank-proof"
          className="mt-4 flex cursor-pointer flex-col items-center rounded-lg border border-dashed border-[#32758A] bg-[#0a2533] px-4 py-6 text-center transition-colors hover:border-[#19C5CE]"
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#103647] text-[#19C5CE]">
            <CloudArrowUp size={24} />
          </div>

          <span className="text-xs font-semibold text-white">
            {file ? 'Ficheiro selecionado' : 'Selecionar comprovativo'}
          </span>

          <span className="mt-1 max-w-full break-all text-[11px] text-[#A9C4CF]">
            {file ? file.name : 'PNG ou JPG · Máximo 5 MB'}
          </span>
        </label>

        {file && (
          <div className="mt-4">
            <PrimaryButton
              onClick={handleDirectUpload}
              loading={uploading}
              disabled={banksLoading || banks.length === 0}
            >
              Enviar comprovativo
            </PrimaryButton>
          </div>
        )}

      </div>

      {/* SUPORTE */}

      <button
        type="button"
        onClick={handleWhatsAppSupport}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
      >
        <WhatsappLogo size={19} weight="fill" />
        Contactar suporte
      </button>

      <BackButton
        onClick={() => navigate('/deposit/aoa')}
      />

    </PageContainer>
  )
}
