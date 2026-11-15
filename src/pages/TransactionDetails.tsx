import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import {
  ArrowLeft,
  Copy,
  X,
  Printer
} from "@phosphor-icons/react"

import {
  TransactionService,
  type TransactionDetails as BaseTransactionDetails
} from "../services/transaction.service"
import { api } from "../services/api"

// Importe a função de impressão e utilitários que criámos (ajuste o caminho se necessário)
import {
  getPairedPrinters,
  printReceipt,
  type PairedPrinter
} from "../services/printReceipt";

// =====================================================
// BRANDING DAS OPERADORAS / SERVIÇOS
// =====================================================

const providerBranding: Record<string, { logo: string }> = {
  UNITEL: {
    logo: "UNITEL.PNG"
  },
  MOVICEL: {
    logo: "MOVICEL.PNG"
  },
  AFRICELL: {
    logo: "AFRICELL.PNG"
  },
  NETONE: {
    logo: "NETONE.PNG"
  },
  DSTV: {
    logo: "DSTV.PNG"
  },
  ZAP: {
    logo: "ZAP1.PNG"
  },
  ZAP_SAT: {
    logo: "ZAP1.PNG"
  },
  "ZAP FIBRA": {
    logo: "ZAP2.PNG"
  },
  ZAP_MEDIA: {
    logo: "ZAP2.PNG"
  },
  ZAP2: {
    logo: "ZAP2.PNG"
  },
  ENDE: {
    logo: "ENDE.PNG"
  },
  EPAL: {
    logo: "EPAL.PNG"
  },
  STAS: {
    logo: "STAS.PNG"
  },
  INT_VCH2: {
    logo: "AMAZON.PNG"
  },
  AMAZON: {
    logo: "AMAZON.PNG"
  },
  APPLE: {
    logo: "APPLE.PNG"
  },
  "GOOGLE PLAY": {
    logo: "GOOGLEPLAY.PNG"
  },
  GOOGLE: {
    logo: "GOOGLEPLAY.PNG"
  },
  NETFLIX: {
    logo: "NETFLIX.PNG"
  },
  SPOTIFY: {
    logo: "SPOTIFY.PNG"
  },
  PLAYSTATION: {
    logo: "TEAM.PNG"
  },
  TEAM: {
    logo: "TEAM.PNG"
  },
  XBOX: {
    logo: "XBOX.PNG"
  },
  BOLT: {
    logo: "BOLT.PNG"
  },
  FLIXBUS: {
    logo: "FLIXBUS.PNG"
  },
  PREMIERBET: {
    logo: "Premiebet.png"
  },
  PBET: {
    logo: "Premiebet.png"
  },
  BANTUBET: {
    logo: "BantuBet.png"
  },
  BBET: {
    logo: "BantuBet.png"
  },
  ELEPHANTBET: {
    logo: "Elephantbet.png"
  },
  EBET: {
    logo: "Elephantbet.png"
  },
  AFRIBET: {
    logo: "AfriBet.png"
  },
  ABET: {
    logo: "AfriBet.png"
  },
  MOBET: {
    logo: "Mobet.png"
  },
  MELBET: {
    logo: "MelBet.png"
  },
  MGMBET: {
    logo: "MelBet.png"
  },
  KWANZABET: {
    logo: "Kwanzabet.png"
  },
  "888BETS": {
    logo: "888Bets.png"
  },
  "888BET": {
    logo: "888Bets.png"
  },
  "888": {
    logo: "888Bets.png"
  }
}

// =====================================================
// ASSETS
// =====================================================

const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
)

// =====================================================
// TIPAGEM DO RECIBO
// =====================================================

interface TransactionReceipt {
  provider?: string | null
  service?: string | null
  partner?: string | null
  plan?: string | null
  customerReference?: string | null
  customerName?: string | null
  voucherPin?: string | null
  voucherValue?: number | string | null
  voucherUnits?: string | null
  voucherVat?: number | string | null
  transactionId?: string | null
  orderId?: string | null
  amount?: number | null
  currency?: string | null
  status?: string | null
}

// =====================================================
// METADATA
// =====================================================

export type TransactionDetails = Omit<
  BaseTransactionDetails,
  "metadata"
> & {
  metadata?: (
    NonNullable<BaseTransactionDetails["metadata"]> & {
      categoryName?: string
      providerName?: string
      partnerName?: string
      planName?: string
      customerReference?: string
      amount?: number
      cost?: number
      profit?: number
      aki?: any
      extraInfo?: any
      receipt?: TransactionReceipt
    }
  ) | null
}

// =====================================================
// PARSER DE DADOS AKI
// =====================================================

function parseJsonValue(
  value: unknown
): any {
  if (
    value === null ||
    value === undefined
  ) {
    return null
  }

  if (
    typeof value === "object"
  ) {
    return value
  }

  if (
    typeof value === "string"
  ) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  return null
}

// =====================================================
// COMPONENTE
// =====================================================

export default function TransactionDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const [loading, setLoading] =
    useState(true)

  const [transaction, setTransaction] =
    useState<TransactionDetails | null>(null)

  const [isStandaloneRequest, setIsStandaloneRequest] =
    useState(false)

  const [loadError, setLoadError] =
    useState<string | null>(null)
  const [isPrinting, setIsPrinting] =
    useState(false)

  const [showPrinterModal, setShowPrinterModal] =
    useState(false)

  const [printers, setPrinters] =
    useState<PairedPrinter[]>([])

  const [isScanningPrinters, setIsScanningPrinters] =
    useState(false)

  const [selectedPrinter, setSelectedPrinter] =
    useState<PairedPrinter | null>(null)

  const [printerError, setPrinterError] =
    useState<string | null>(null)

  // ===================================================
  // CARREGAR TRANSAÇÃO
  // ===================================================

  useEffect(() => {
    let mounted = true

    const loadDetails = async () => {
      if (!id || !Number.isFinite(Number(id))) {
        setLoadError("Identificador inválido.")
        setLoading(false)
        return
      }

      setLoading(true)
      setLoadError(null)
      setTransaction(null)
      setIsStandaloneRequest(false)

      const isServiceRequestRoute =
        location.pathname.startsWith("/transactions/service/")

      // A rota específica evita confundir o ID do ServiceRequest
      // com o ID de outra Transaction.
      if (!isServiceRequestRoute) {
        try {
          const data = await TransactionService.details(Number(id))

          if (!mounted) return

          setTransaction(data)
          setLoading(false)
          return
        } catch (transactionError) {
          console.warn(
            "A transação não foi encontrada. A procurar ServiceRequest:",
            transactionError
          )
        }
      }

      // Para pedidos sem Transaction, procura pelo endpoint autenticado
      // na listagem autenticada já existente no backend.
      
      try {
        const { data } = await api.get(
          `/transactions/service/${Number(id)}`
        )

        if (!mounted) return

        const request = data?.serviceRequest ?? data

        if (!request || Number(request.id) !== Number(id)) {
          throw new Error("Pedido de serviço não encontrado.")
        }

        const status = String(
          request.status ?? data.status ?? "PENDING"
        ).toUpperCase()

        const providerName =
          request.providerName ??
          request.partnerName ??
          request.serviceName ??
          "EMATEA"

        const normalized = {
          ...data,
          id: Number(request.id),
          type: "SERVICE_PURCHASE",
          amount: Number(request.amount ?? data.amount ?? 0),
          currency: data.currency ?? "AOA",
          method: data.method ?? "SERVICE",
          status,
          description:
            data.description ??
            request.planName ??
            request.serviceName ??
            request.serviceGroupName ??
            "Compra de serviço",
          reference:
            data.reference ??
            request.customerReference ??
            null,
          relatedPublicId: String(request.id),
          createdAt: request.createdAt,
          processedAt:
            request.completedAt ??
            data.processedAt ??
            null,
          metadata: {
            ...(data.metadata ?? {}),
            providerName,
            partnerName: request.partnerName ?? null,
            planName: request.planName ?? null,
            customerReference:
              request.customerReference ?? null,
            customerName: request.customerName ?? null,
          },
          serviceRequest: request,
        } as unknown as TransactionDetails

        setTransaction(normalized)
        setIsStandaloneRequest(true)

      } catch (requestError: any) {
        console.error(
          "TRANSACTION_DETAILS_LOAD_ERROR:",
          requestError
        )

        if (mounted) {
          setLoadError(
            requestError?.response?.data?.error ||
            requestError?.message ||
            "Não foi possível carregar os detalhes deste pedido."
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
 {
        if (mounted) setLoading(false)
      }
    }

    loadDetails()

    return () => {
      mounted = false
    }
  }, [id, location.pathname])

  // ===================================================
  // IMPRESSÃO BLUETOOTH
  // ===================================================

  const handlePrint = async () => {
    if (!transaction) return

    setPrinterError(null)
    setPrinters([])
    setSelectedPrinter(null)
    setShowPrinterModal(true)
    setIsScanningPrinters(true)

    try {
      const devices = await getPairedPrinters()

      setPrinters(devices)

      if (devices.length === 0) {
        setPrinterError(
          "Nenhuma impressora emparelhada foi encontrada. Verifique se a impressora está ligada e emparelhada com o telefone."
        )
      }
    } catch (error: any) {
      console.error(
        "Erro ao obter impressoras emparelhadas:",
        error
      )

      setPrinterError(
        error?.message ||
          "Não foi possível obter as impressoras emparelhadas."
      )
    } finally {
      setIsScanningPrinters(false)
    }
  }

  const handleSelectPrinter = async (
    printer: PairedPrinter
  ) => {
    if (!transaction) return

    setSelectedPrinter(printer)
    setIsPrinting(true)
    setPrinterError(null)

    try {
      await printReceipt(
  {
    ...transaction,
    serviceRequest: transaction.serviceRequest ?? undefined,
    metadata: transaction.metadata ?? undefined,
  },
  printer
)

      setShowPrinterModal(false)
    } catch (error: any) {
      console.error(
        "Erro ao imprimir:",
        error
      )

      setPrinterError(
        error?.message ||
          "Não foi possível imprimir o recibo."
      )
    } finally {
      setIsPrinting(false)
    }
  }

  // ===================================================
  // OPERADORA
  // ===================================================

  const getOperatorName = () => {
    const receipt =
      transaction?.metadata?.receipt

    const serviceRequest =
      transaction?.serviceRequest

    const rawName = (
      receipt?.provider ??
      receipt?.partner ??
      serviceRequest?.providerName ??
      serviceRequest?.partnerName ??
      transaction?.metadata?.partnerName ??
      transaction?.metadata?.providerName ??
      transaction?.description ??
      ""
    ).toUpperCase()

    if (
      rawName.includes("UNITEL")
    ) {
      return "UNITEL"
    }

    if (
      rawName.includes("MOVICEL")
    ) {
      return "MOVICEL"
    }

    if (
      rawName.includes("AFRICELL")
    ) {
      return "AFRICELL"
    }

    if (
      rawName.includes("BAZZA")
    ) {
      return "BAZZA"
    }

    if (
      rawName.includes("DSTV")
    ) {
      return "DSTV"
    }

    if (
      rawName.includes("ZAP")
    ) {
      return "ZAP"
    }

    if (
      rawName.includes("ENDE")
    ) {
      return "ENDE"
    }

    if (
      rawName.includes("EPAL")
    ) {
      return "EPAL"
    }

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

    return (
      receipt?.provider ??
      receipt?.partner ??
      serviceRequest?.providerName ??
      serviceRequest?.partnerName ??
      transaction?.metadata?.partnerName ??
      transaction?.metadata?.providerName ??
      "EMATEA"
    )
  }

  // ===================================================
  // LOGO
  // ===================================================

  const getOperatorLogo = (
    operatorKey: string
  ) => {
    const brand =
      providerBranding[
        operatorKey
          .toUpperCase()
          .trim()
      ]

    if (!brand) {
      return "/logo.png"
    }

    const targetFileName =
      brand.logo.toLowerCase()

    for (
      const path in rechargeImages
    ) {
      if (
        path
          .toLowerCase()
          .endsWith(targetFileName)
      ) {
        return rechargeImages[path]
      }
    }

    return "/logo.png"
  }

  // ===================================================
  // DADOS DO RECIBO (SEGURO PARA O SKELETON)
  // ===================================================

  const storedReceipt =
    transaction?.metadata?.receipt ?? null

  const serviceRequest =
    transaction?.serviceRequest ?? null

  const providerResponse =
    parseJsonValue(
      serviceRequest?.providerResponse
    )

  const rawExtraInfo =
    transaction?.metadata?.extraInfo ??
    providerResponse?.Transaction_ExtraInfo ??
    providerResponse?.transaction_ExtraInfo ??
    providerResponse?.ExtraInfo ??
    providerResponse?.extraInfo ??
    null

  const extraInfo =
    parseJsonValue(rawExtraInfo)

  const customerName =
    storedReceipt?.customerName ??
    serviceRequest?.customerName ??
    extraInfo?.CustomerName ??
    extraInfo?.customerName ??
    null

  const voucherPin =
  storedReceipt?.voucherPin ??
  extraInfo?.VoucherPIN ??
  extraInfo?.voucherPIN ??
  (
    typeof extraInfo === "string" &&
    extraInfo.trim() !== ""
      ? extraInfo.trim()
      : null
  )

  const voucherUnits =
    storedReceipt?.voucherUnits ??
    extraInfo?.VoucherUnits ??
    extraInfo?.voucherUnits ??
    null

  const operatorName =
    getOperatorName()

  const operatorLogoSrc =
    getOperatorLogo(
      operatorName
    )

  const operationId =
    storedReceipt?.transactionId ??
    transaction?.externalId ??
    serviceRequest?.externalProviderRef ??
    transaction?.id

  const customerReference =
    storedReceipt?.customerReference ??
    serviceRequest?.customerReference ??
    transaction?.metadata?.customerReference ??
    transaction?.reference ??
    "-"

  const purchaseStatus = String(
    serviceRequest?.status ?? transaction?.status ?? ""
  ).toUpperCase()

  const isProviderTimeout = purchaseStatus === "PROVIDER_TIMEOUT"
  const isRejected = purchaseStatus === "REJECTED"
  const isProcessing =
    purchaseStatus === "PENDING" ||
    purchaseStatus === "IN_PROGRESS"

  // O estado persistido do ServiceRequest é a fonte de verdade.
  // Um recibo/providerResponse antigo nunca pode transformar REJECTED em sucesso.
  const isPaid = serviceRequest
    ? String(serviceRequest.status ?? "").toUpperCase() === "COMPLETED"
    : transaction?.status
      ? ["PAID", "COMPLETED"].includes(String(transaction.status).toUpperCase())
      : ["SUCCESS", "COMPLETED"].includes(String(storedReceipt?.status ?? "").toUpperCase()) ||
        ["SUCCESS", "COMPLETED"].includes(String(providerResponse?.Status ?? "").toUpperCase())

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="fixed inset-0 flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#071f2d] text-slate-100 antialiased">

      {/* Área de conteúdo: começa no topo e ocupa a largura disponível */}
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-xl px-3 py-3 sm:px-5 sm:py-5">
          {loading ? (
            <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b3043] p-5 shadow-2xl shadow-black/20 sm:p-7">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded bg-white/10" />
                    <div className="h-5 w-48 max-w-full rounded bg-white/10" />
                    <div className="h-3 w-32 rounded bg-white/10" />
                  </div>
                </div>
                <div className="h-28 rounded-2xl bg-white/[0.06]" />
                <div className="space-y-4 rounded-2xl bg-white/[0.04] p-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="flex justify-between gap-4">
                      <div className="h-3 w-24 rounded bg-white/10" />
                      <div className="h-3 w-32 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
                <div className="h-12 rounded-xl bg-white/10" />
              </div>
            </section>
          ) : !transaction ? (
            <section className="rounded-3xl border border-rose-400/20 bg-[#0b3043] px-6 py-12 text-center shadow-2xl shadow-black/20">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-300">
                <X size={26} weight="bold" />
              </div>
              <h2 className="text-base font-bold text-white">
                Não foi possível abrir a operação
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                {loadError || "Transação ou pedido não encontrado."}
              </p>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-bold text-[#062331] transition hover:bg-cyan-400"
              >
                Voltar ao histórico
              </button>
            </section>
          ) : (
            <section className="overflow-hidden rounded-3xl border border-cyan-300/15 bg-[#0b3043] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">

              {/* Identificação do serviço e estado da operação */}
              <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/70 bg-white p-1.5">
                    <img
                      src={operatorLogoSrc}
                      alt={`Logótipo ${operatorName}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/75">
                      Comprovativo de pagamento
                    </p>
                    <h2 className="mt-1 truncate text-lg font-extrabold text-white sm:text-xl">
                      {operatorName}
                    </h2>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {storedReceipt?.plan ??
                        serviceRequest?.planName ??
                        serviceRequest?.serviceName ??
                        transaction.metadata?.planName ??
                        transaction.description ??
                        "Operação EMATEA"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.08em] ${
                      isPaid
                        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                        : isProviderTimeout
                          ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
                          : isRejected
                            ? "border-rose-400/25 bg-rose-400/10 text-rose-300"
                            : "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isPaid
                        ? "bg-emerald-300"
                        : isProviderTimeout
                          ? "bg-amber-300"
                          : isRejected
                            ? "bg-rose-300"
                            : "bg-cyan-300"
                    }`} />
                    {isPaid
                      ? "Concluído"
                      : isProviderTimeout
                        ? "Em verificação"
                        : isRejected
                          ? "Rejeitado"
                          : isProcessing
                            ? "Em processamento"
                            : purchaseStatus || "Por confirmar"}
                  </span>
                </div>
              </div>

              {/* Valor em destaque */}
              <div className="border-b border-white/[0.07] bg-gradient-to-br from-[#0d3b50] via-[#0b3549] to-[#0a2d40] px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/65">
                  Valor da operação
                </p>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {Number(transaction.amount).toLocaleString("pt-AO")}
                  </span>
                  <span className="text-sm font-bold text-cyan-300">
                    {transaction.currency}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    {new Date(transaction.createdAt).toLocaleString("pt-AO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  <span className="font-mono">
                    ID #{transaction.id}
                  </span>
                </div>
              </div>

              {/* Dados organizados em grelha */}
              <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-200">
                    Detalhes da operação
                  </h3>
                  <span className="text-[10px] font-medium text-slate-500">
                    Informação do pagamento
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#08283a]/75 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Referência
                    </p>
                    <p className="mt-2 break-all font-mono text-sm font-bold text-slate-100">
                      {customerReference}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#08283a]/75 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      ID da operação
                    </p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(String(operationId))}
                      className="mt-2 inline-flex max-w-full items-center gap-2 text-left font-mono text-sm font-bold text-cyan-200 transition hover:text-white"
                      title="Copiar identificador da operação"
                    >
                      <span className="truncate">{operationId}</span>
                      <Copy size={13} className="shrink-0" />
                    </button>
                  </div>

                  {customerName && (
                    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#08283a]/75 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Nome do cliente
                      </p>
                      <p className="mt-2 break-words text-sm font-bold text-slate-100">
                        {customerName}
                      </p>
                    </div>
                  )}

                  <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#08283a]/75 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Operadora / parceiro
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-100">
                      {operatorName}
                    </p>
                  </div>

                  {(storedReceipt?.plan ||
                    serviceRequest?.planName ||
                    serviceRequest?.serviceName ||
                    transaction.metadata?.planName) && (
                    <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#08283a]/75 p-3 sm:col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Serviço / pacote
                      </p>
                      <p className="mt-2 break-words text-sm font-bold text-slate-100">
                        {storedReceipt?.plan ??
                          serviceRequest?.planName ??
                          serviceRequest?.serviceName ??
                          transaction.metadata?.planName}
                      </p>
                    </div>
                  )}
                </div>

                {isProviderTimeout && (
                  <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4">
                    <p className="text-xs font-bold text-amber-200">
                      Operação em verificação
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-100/75">
                      O tempo de monitorização foi excedido. A operadora ainda não confirmou o resultado. Este estado não significa que a compra foi rejeitada ou reembolsada.
                    </p>
                  </div>
                )}

                {isRejected && (
                  <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/[0.07] p-4">
                    <p className="text-xs font-bold text-rose-200">
                      Operação rejeitada
                    </p>
                    <p className="mt-1 text-xs leading-5 text-rose-100/75">
                      A operação foi confirmada como rejeitada.
                    </p>
                  </div>
                )}

                {voucherPin && (
                  <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-300">
                          PIN de carregamento
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Código disponibilizado pelo serviço
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(String(voucherPin))}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[11px] font-bold text-cyan-200 transition hover:bg-cyan-300/20"
                      >
                        <Copy size={13} />
                        Copiar PIN
                      </button>
                    </div>
                    <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#061f2e]/80 px-4 py-4 text-center">
                      <span className="break-all font-mono text-xl font-black tracking-[0.18em] text-white">
                        {String(voucherPin)}
                      </span>
                    </div>
                    {voucherUnits && (
                      <p className="mt-3 text-center text-xs text-slate-400">
                        Unidades: <strong className="text-slate-100">{voucherUnits}</strong>
                      </p>
                    )}
                  </div>
                )}

                {!isStandaloneRequest && (
                  <div className="mt-4 border-t border-white/[0.07] pt-4">
                    <button
                      type="button"
                      onClick={handlePrint}
                      disabled={isPrinting}
                      className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#087f9b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#076b82] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Printer size={18} weight="bold" />
                      {isPrinting ? "A preparar impressão..." : "Imprimir comprovativo"}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mt-2 flex min-h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-transparent px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/[0.04] hover:text-white"
                >
                  <ArrowLeft size={17} weight="bold" />
                  Voltar
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {showPrinterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-3xl bg-[#082f49] border border-[#0ea5e9]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#0ea5e9]/20">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Selecionar impressora
                </h3>

                <p className="text-[10px] text-[#7dd3fc] mt-1">
                  Escolha uma impressora Bluetooth emparelhada
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPrinterModal(false)
                  setPrinterError(null)
                }}
                disabled={isPrinting}
                className="p-2 rounded-xl text-[#7dd3fc] hover:text-white hover:bg-[#0ea5e9]/20 transition disabled:opacity-50 cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* CONTEÚDO */}
            <div className="p-5">

              {isScanningPrinters && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-9 h-9 border-2 border-[#38bdf8]/30 border-t-[#38bdf8] rounded-full animate-spin" />

                  <p className="text-xs font-bold text-white mt-4">
                    A procurar impressoras...
                  </p>

                  <p className="text-[10px] text-[#7dd3fc] mt-1">
                    Aguarde alguns segundos
                  </p>
                </div>
              )}

              {!isScanningPrinters &&
                printers.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {printers.map((printer) => {
                      const isSelected =
                        selectedPrinter?.address ===
                        printer.address

                      return (
                        <button
                          key={printer.address}
                          type="button"
                          onClick={() =>
                            handleSelectPrinter(
                              printer
                            )
                          }
                          disabled={isPrinting}
                          className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer ${
                            isSelected
                              ? "bg-[#0284c7]/30 border-[#38bdf8]"
                              : "bg-[#0c4a6e] border-[#0ea5e9]/20 hover:border-[#38bdf8]/60 hover:bg-[#0c4a6e]/80"
                          } disabled:opacity-50`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#082f49] border border-[#0ea5e9]/30 flex items-center justify-center shrink-0">
                              <Printer
                                size={19}
                                weight="bold"
                                className="text-[#38bdf8]"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-black text-white truncate">
                                {printer.name ||
                                  "Impressora Bluetooth"}
                              </p>

                              <p className="text-[10px] text-[#7dd3fc] font-mono mt-1">
                                {printer.address}
                              </p>
                            </div>

                            {isSelected && (
                              <div className="text-[#38bdf8]">
                                ✓
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

              {!isScanningPrinters &&
                printers.length === 0 &&
                !printerError && (
                  <div className="text-center py-8">
                    <Printer
                      size={32}
                      className="mx-auto text-[#7dd3fc]/50"
                    />

                    <p className="text-xs font-bold text-white mt-3">
                      Nenhuma impressora encontrada
                    </p>

                    <p className="text-[10px] text-[#7dd3fc] mt-1">
                      Verifique o Bluetooth e o emparelhamento.
                    </p>
                  </div>
                )}

              {printerError && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-400/20">
                  <p className="text-[11px] leading-relaxed text-red-300 text-center">
                    {printerError}
                  </p>
                </div>
              )}

              {isPrinting && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#38bdf8]/30 border-t-[#38bdf8] rounded-full animate-spin" />

                  <span className="text-[11px] font-bold text-[#7dd3fc]">
                    A imprimir recibo...
                  </span>

                </div>
              )}

              {!isScanningPrinters &&
                !isPrinting && (
                  <button
                    type="button"
                    onClick={async () => {
                      setPrinterError(null)
                      setPrinters([])
                      setIsScanningPrinters(true)

                      try {
                        const devices =
                          await getPairedPrinters()

                        setPrinters(devices)

                        if (
                          devices.length === 0
                        ) {
                          setPrinterError(
                            "Nenhuma impressora emparelhada foi encontrada."
                          )
                        }
                      } catch (error: any) {
                        setPrinterError(
                          error?.message ||
                            "Falha ao obter impressoras emparelhadas."
                        )
                      } finally {
                        setIsScanningPrinters(false)
                      }
                    }}
                    className="w-full mt-4 py-3 rounded-xl bg-[#0c4a6e] border border-[#0ea5e9]/30 text-[#7dd3fc] text-[11px] font-black uppercase tracking-wide hover:bg-[#0ea5e9]/20 hover:text-white transition cursor-pointer"
                  >
                    Procurar novamente
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
