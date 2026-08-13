import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  ArrowLeft,
  Copy,
  Check,
  ShareNetwork,
  X,
  Printer
} from "@phosphor-icons/react"

import {
  TransactionService,
  type TransactionDetails as BaseTransactionDetails
} from "../services/transaction.service"

// Importe a função de impressão e utilitários que criámos (ajuste o caminho se necessário)
import {
  printReceipt,
  scanPrinters,
  type ThermalPrinterDevice
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

export interface TransactionDetails
  extends BaseTransactionDetails {
  serviceRequest?: {
    id: number
    planId: number
    serviceId?: number | null
    serviceGroupId?: number | null
    providerId?: number | null
    providerName?: string | null
    amount: number
    cost?: number | null
    profit?: number | null
    customerReference?: string | null
    customerName?: string | null
    partnerName?: string | null
    partnerId?: number | null
    serviceName?: string | null
    serviceGroupName?: string | null
    planName?: string | null
    status: string
    transactionId?: number | null
    externalProviderRef?: string | null
    externalTransactionId?: string | null
    providerResponse?:
      | Record<string, any>
      | string
      | null
    completedAt?: string | null
    providerFinalBalance?: number | null
    providerConfirmedAt?: string | null
    providerReconciledAt?: string | null
    providerOperationStatus?: string | null
    providerOperationCode?: number | null
    createdAt: string
    updatedAt: string
  }

  metadata?: {
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
  const { id } = useParams()

  const [loading, setLoading] =
    useState(true)

  const [transaction, setTransaction] =
    useState<TransactionDetails | null>(null)

  const [copied, setCopied] =
    useState(false)

  const [isPrinting, setIsPrinting] =
    useState(false)

  const [showPrinterModal, setShowPrinterModal] =
    useState(false)

  const [printers, setPrinters] =
    useState<ThermalPrinterDevice[]>([])

  const [isScanningPrinters, setIsScanningPrinters] =
    useState(false)

  const [selectedPrinter, setSelectedPrinter] =
    useState<ThermalPrinterDevice | null>(null)

  const [printerError, setPrinterError] =
    useState<string | null>(null)

  // ===================================================
  // CARREGAR TRANSAÇÃO
  // ===================================================

  useEffect(() => {
    if (!id) return

    TransactionService.details(Number(id))
      .then((data: any) => {
        console.log(
          "TRANSACTION DETAILS:",
          data
        )
        setTransaction(data)
      })
      .catch(console.error)
      .finally(() =>
        setLoading(false)
      )
  }, [id])

  // ===================================================
  // COPIAR ID
  // ===================================================

  const handleCopyId = () => {
    if (!transaction) return

    navigator.clipboard.writeText(
      String(transaction.id)
    )

    setCopied(true)

    setTimeout(
      () => setCopied(false),
      2000
    )
  }

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
      const devices = await scanPrinters()

      setPrinters(devices)

      if (devices.length === 0) {
        setPrinterError(
          "Nenhuma impressora Bluetooth foi encontrada. Verifique se a impressora está ligada e emparelhada com o telefone."
        )
      }
    } catch (error: any) {
      console.error(
        "Erro ao procurar impressoras:",
        error
      )

      setPrinterError(
        error?.message ||
          "Não foi possível procurar as impressoras Bluetooth."
      )
    } finally {
      setIsScanningPrinters(false)
    }
  }

  const handleSelectPrinter = async (
    printer: ThermalPrinterDevice
  ) => {
    if (!transaction) return

    setSelectedPrinter(printer)
    setIsPrinting(true)
    setPrinterError(null)

    try {
      await printReceipt(
        transaction,
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
    null

  const voucherValue =
    storedReceipt?.voucherValue ??
    extraInfo?.VoucherValue ??
    extraInfo?.voucherValue ??
    null

  const voucherUnits =
    storedReceipt?.voucherUnits ??
    extraInfo?.VoucherUnits ??
    extraInfo?.voucherUnits ??
    null

  const formattedAmount = transaction ? `${Number(
    transaction.amount
  ).toLocaleString(
    "pt-AO"
  )} ${transaction.currency}` : ""

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

  const isPaid =
    transaction?.status === "PAID" ||
    transaction?.status === "COMPLETED" ||
    serviceRequest?.status === "COMPLETED" ||
    storedReceipt?.status === "SUCCESS" ||
    storedReceipt?.status === "COMPLETED" ||
    providerResponse?.Status === "SUCCESS" ||
    providerResponse?.Status === "COMPLETED"

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#082f49] text-gray-100 antialiased flex flex-col fixed inset-0">

      {/* ============================================
          HEADER FIXO NO TOPO
      ============================================ */}

      <div className="px-5 py-4 flex items-center justify-between border-b border-[#0ea5e9]/20 bg-[#0c4a6e]/95 backdrop-blur-md shrink-0 z-50">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="p-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#7dd3fc] rounded-xl hover:bg-[#0ea5e9]/25 hover:text-white cursor-pointer transition"
          title="Voltar"
        >
          <ArrowLeft
            size={16}
            weight="bold"
          />
        </button>

        <h1 className="text-xs font-black uppercase tracking-wider text-white">
          Comprovativo de Venda
        </h1>

        <div className="flex items-center gap-2">

          <button
            onClick={handleCopyId}
            className="p-2 text-[#7dd3fc] hover:text-white relative cursor-pointer"
            title="Copiar ID"
          >
            {copied ? (
              <Check
                size={16}
                className="text-[#38bdf8]"
              />
            ) : (
              <ShareNetwork
                size={16}
              />
            )}
          </button>

          {/* BOTÃO X PARA FECHAR IMEDIATAMENTE (COM UM CLIQUE) */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#7dd3fc] hover:text-white rounded-xl hover:bg-[#0ea5e9]/25 cursor-pointer transition"
            title="Fechar"
          >
            <X
              size={16}
              weight="bold"
            />
          </button>

        </div>

      </div>

      {/* ============================================
          ÁREA DE CONTEÚDO COM SCROLL SEGURO E ESTÁVEL
      ============================================ */}

      <div
        onClick={() => navigate(-1)}
        className="flex-1 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 sm:p-6 bg-[#082f49]/80 backdrop-blur-sm cursor-pointer"
      >

        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#082f49] border border-[#0ea5e9]/30 rounded-3xl p-5 shadow-2xl flex flex-col items-center relative cursor-default my-auto text-gray-100"
        >

          {loading ? (

            /* SKELETON LOADER MODERNO E COMPACTO */
            <div className="w-full space-y-4 animate-pulse py-2">
              <div className="w-16 h-16 rounded-full bg-[#0c4a6e] mx-auto border border-[#0ea5e9]/30"></div>
              <div className="w-36 h-4 bg-[#0c4a6e] rounded-md mx-auto"></div>
              
              <div className="w-full space-y-3 border-t border-b border-[#0ea5e9]/20 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-20 h-3 bg-[#0c4a6e] rounded-sm"></div>
                    <div className="w-28 h-3 bg-[#0c4a6e] rounded-sm"></div>
                  </div>
                ))}
              </div>

              <div className="w-full h-10 bg-[#0c4a6e] rounded-xl"></div>
            </div>

          ) : !transaction ? (

            <div className="text-center py-8 text-sm font-bold text-[#7dd3fc] font-mono">
              Transação não encontrada.
            </div>

          ) : (

            <>
              {/* ========================================
                  LOGO
              ======================================== */}

              <div className="w-16 h-16 rounded-full bg-white shadow-lg mb-4 overflow-hidden flex items-center justify-center border border-[#0ea5e9]/30 shrink-0">
                <img
                  src={operatorLogoSrc}
                  alt={operatorName}
                  className="w-full h-full object-cover p-0"
                />
              </div>

              {/* ========================================
                  SUCESSO
              ======================================== */}

              {isPaid && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[#38bdf8] text-xs font-black">
                    ✓
                  </span>
                  <span className="text-[#38bdf8] text-[11px] font-black uppercase tracking-wide">
                    Transação Bem-Sucedida
                  </span>
                </div>
              )}

              {/* ========================================
                  TÍTULO
              ======================================== */}

              <h2 className="text-base font-black text-white mb-4">
                Comprovativo de Pagamento
              </h2>

              {/* ========================================
                  DADOS PRINCIPAIS
              ======================================== */}

              <div className="w-full space-y-3 border-t border-b border-[#0ea5e9]/20 py-4 text-xs">

                {/* ID OPERAÇÃO */}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#7dd3fc] font-medium">
                    ID Operação:
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        String(operationId)
                      )
                    }
                    className="flex items-center gap-1.5 font-mono font-bold text-white text-right hover:text-[#38bdf8] transition cursor-pointer"
                  >
                    {operationId}
                    <Copy
                      size={12}
                      className="text-[#7dd3fc]/70"
                    />
                  </button>
                </div>

                {/* REFERÊNCIA */}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#7dd3fc] font-medium">
                    Referência:
                  </span>
                  <span className="font-mono font-bold text-white text-right">
                    {customerReference}
                  </span>
                </div>

                {/* NOME DO CLIENTE */}
                {customerName && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[#7dd3fc] font-medium">
                      Nome Cliente:
                    </span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">
                      {customerName}
                    </span>
                  </div>
                )}

                {/* OPERADORA */}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#7dd3fc] font-medium">
                    Operadora:
                  </span>
                  <span className="font-bold text-white uppercase">
                    {operatorName}
                  </span>
                </div>

                {/* SERVIÇO / PLANO */}
                {(
                  storedReceipt?.plan ||
                  serviceRequest?.planName ||
                  serviceRequest?.serviceName ||
                  transaction.metadata?.planName
                ) && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[#7dd3fc] font-medium">
                      Serviço:
                    </span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">
                      {storedReceipt?.plan ??
                        serviceRequest?.planName ??
                        serviceRequest?.serviceName ??
                        transaction.metadata?.planName}
                    </span>
                  </div>
                )}

                {/* VALOR */}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#7dd3fc] font-medium">
                    Montante:
                  </span>
                  <span className="text-[#38bdf8] font-black text-sm">
                    {formattedAmount}
                  </span>
                </div>

                {/* DATA */}
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[#7dd3fc] font-medium">
                    Data:
                  </span>
                  <span className="font-mono text-[#7dd3fc] text-right text-[11px]">
                    {new Date(
                      transaction.createdAt
                    ).toLocaleString(
                      "pt-AO",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )}
                  </span>
                </div>

                {/* STATUS */}
                <div className="flex justify-between items-center">
                  <span className="text-[#7dd3fc] font-medium">
                    Estado:
                  </span>
                  <span
                    className={`font-black uppercase text-[11px] ${
                      isPaid
                        ? "text-[#38bdf8]"
                        : "text-amber-400"
                    }`}
                  >
                    {isPaid
                      ? "CONCLUÍDO"
                      : "PROCESSANDO"}
                  </span>
                </div>

              </div>

              {/* ========================================
                  PIN DE CARREGAMENTO
              ======================================== */}

              {voucherPin && (
                <div className="w-full mt-4 bg-[#0c4a6e] border border-[#0ea5e9]/40 rounded-2xl p-4 shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#38bdf8] text-[10px] font-black uppercase tracking-wider">
                      PIN DE CARREGAMENTO
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          String(voucherPin)
                        )
                      }
                      className="text-[#7dd3fc] hover:text-white cursor-pointer text-xs flex items-center gap-1 font-mono"
                    >
                      Copiar PIN
                      <Copy size={12} />
                    </button>
                  </div>
                  <div className="bg-[#082f49] border border-[#0ea5e9]/20 rounded-xl p-3 text-center">
                    <span className="font-mono font-black text-white text-base tracking-widest">
                      {String(voucherPin)}
                    </span>
                  </div>
                  {voucherUnits && (
                    <div className="mt-2 text-center text-[11px] text-[#7dd3fc]">
                      Unidades: <span className="font-bold text-white">{voucherUnits}</span>
                    </div>
                  )}
                </div>
              )}

              {/* BOTÃO DE IMPRESSÃO */}
              <div className="w-full mt-5">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:from-[#0369a1] hover:to-[#075985] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Printer size={18} weight="bold" />
                  {isPrinting ? "A imprimir..." : "Imprimir Recibo"}
                </button>
              </div>
            </>
          )}

        </div>

      </div>

      {/* ============================================
          MODAL DE SELEÇÃO DE IMPRESSORA BLUETOOTH
      ============================================ */}

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
                    Procurando impressoras...
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
                          await scanPrinters()

                        setPrinters(devices)

                        if (
                          devices.length === 0
                        ) {
                          setPrinterError(
                            "Nenhuma impressora Bluetooth foi encontrada."
                          )
                        }
                      } catch (error: any) {
                        setPrinterError(
                          error?.message ||
                            "Falha ao procurar impressoras."
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