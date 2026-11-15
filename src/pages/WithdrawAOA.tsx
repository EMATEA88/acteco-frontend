import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle,
  Info,
  Receipt,
  Wallet,
} from "@phosphor-icons/react"

import Toast from "../components/ui/Toast"
import { WithdrawalService } from "../services/withdrawal.service"
import { UserService } from "../services/user.service"

type ToastType = "success" | "error"

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
}

const WITHDRAWAL_FEE_PERCENT = 0.03
const MIN_WITHDRAWAL = 50
const MAX_WITHDRAWAL_TRANSACTION = 10_000_000
const MAX_WITHDRAWAL_DAILY = 25_000_000

const primaryButtonClass =
  "w-full min-h-14 rounded-xl bg-[#079CB3] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#0BACC2] active:bg-[#07899D] disabled:cursor-not-allowed disabled:bg-[#315365] disabled:text-[#91A9B4] disabled:shadow-none flex items-center justify-center gap-2"

const secondaryButtonClass =
  "w-full min-h-14 rounded-xl border border-[#315365] bg-[#102F3D] px-5 text-[15px] font-semibold text-[#D8E8EE] transition-colors hover:bg-[#153B4B] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"

const inputClass =
  "w-full h-14 rounded-xl border border-[#24566A] bg-[#0A2533] px-4 text-[16px] text-white outline-none transition-colors placeholder:text-[#7696A5] focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE]"

export default function WithdrawAOA() {
  const navigate = useNavigate()

  const requestInFlight = useRef(false)
  const withdrawInFlight = useRef(false)

  const [amount, setAmount] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const [accountLoading, setAccountLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  })

  useEffect(() => {
    if (!toast.visible) return

    const timer = window.setTimeout(() => {
      setToast(previous => ({
        ...previous,
        visible: false,
      }))
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [toast.visible, toast.message])

  useEffect(() => {
    let mounted = true

    async function loadAccount() {
      try {
        const user = await UserService.me()

        if (!mounted) return

        setBalance(Number(user.balance) || 0)
        setEmail(user.email || "")
      } catch (error: any) {
        if (!mounted) return

        notify(
          error?.response?.data?.message ??
            error?.response?.data?.error ??
            "Não foi possível carregar os dados da conta."
        )
      } finally {
        if (mounted) setAccountLoading(false)
      }
    }

    void loadAccount()

    return () => {
      mounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const gross = Number(amount) || 0
    const fee = gross * WITHDRAWAL_FEE_PERCENT

    return {
      gross,
      fee,
      net: gross - fee,
    }
  }, [amount])

  const amountIsValid =
    stats.gross >= MIN_WITHDRAWAL &&
    stats.gross <= MAX_WITHDRAWAL_TRANSACTION &&
    (balance === null || stats.gross <= balance)

  function notify(message: string, type: ToastType = "error") {
    setToast({
      visible: true,
      message,
      type,
    })
  }

  function formatCurrency(value: number) {
    return `${value.toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Kz`
  }

  function validateAmount() {
    if (!amount.trim()) {
      notify("Introduza o valor que pretende levantar.")
      return false
    }

    if (!Number.isFinite(stats.gross) || stats.gross <= 0) {
      notify("Introduza um valor válido.")
      return false
    }

    if (stats.gross < MIN_WITHDRAWAL) {
      notify("O valor mínimo para levantamento é de 50 Kz.")
      return false
    }

    if (stats.gross > MAX_WITHDRAWAL_TRANSACTION) {
      notify("O limite por operação é de 10.000.000 Kz.")
      return false
    }

    if (balance !== null && stats.gross > balance) {
      notify("O saldo disponível é insuficiente.")
      return false
    }

    return true
  }

  async function handleRequestOtp() {
    if (requestInFlight.current || withdrawInFlight.current) return
    if (!validateAmount()) return

    try {
      requestInFlight.current = true
      setOtpLoading(true)

      await WithdrawalService.requestOtp()

      setOtp("")
      setOtpSent(true)
      notify("Código de confirmação enviado para o seu email.", "success")
    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          error?.response?.data?.error ??
          error?.message ??
          "Não foi possível enviar o código de confirmação."
      )
    } finally {
      requestInFlight.current = false
      setOtpLoading(false)
    }
  }

  async function handleWithdraw() {
    if (withdrawInFlight.current || requestInFlight.current) return
    if (!validateAmount()) return

    if (!otp.trim()) {
      notify("Introduza o código de confirmação.")
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      notify("O código de confirmação deve conter 6 dígitos.")
      return
    }

    if (!email) {
      notify("Não foi possível identificar o email da sua conta.")
      return
    }

    try {
      withdrawInFlight.current = true
      setLoading(true)

      await WithdrawalService.create(stats.gross, otp, email)

      notify("Pedido de levantamento submetido com sucesso.", "success")

      setAmount("")
      setOtp("")
      setOtpSent(false)

      try {
        const user = await UserService.me()
        setBalance(Number(user.balance) || 0)
      } catch {
        // O pedido já foi submetido; uma falha ao atualizar o saldo
        // não deve ser apresentada como falha do levantamento.
      }

      window.setTimeout(() => {
        navigate("/profile", { replace: true })
      }, 1200)
    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          error?.response?.data?.error ??
          error?.message ??
          "Não foi possível concluir o levantamento."
      )
    } finally {
      withdrawInFlight.current = false
      setLoading(false)
    }
  }

  function handleAmountChange(value: string) {
    // Mantém apenas números e um separador decimal.
    const normalized = value.replace(",", ".")
    if (!/^\d*\.?\d*$/.test(normalized)) return
    setAmount(normalized)
  }

  return (
    <main className="min-h-screen bg-[#0A2533] px-4 py-6 text-white sm:px-6 sm:py-10">
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast(previous => ({
            ...previous,
            visible: false,
          }))
        }
      />

      <div className="mx-auto w-full max-w-[460px]">
        <header className="mb-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#19C5CE]">
            Conta bancária
          </p>
          <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">
            Levantamento
          </h1>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#24566A] bg-[#103647] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-3 border-b border-[#24566A] px-5 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#079CB3]/15 text-[#19C5CE]">
              <Wallet size={23} weight="duotone" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-white">
                Levantamento em Kwanza
              </h2>
              <p className="mt-0.5 text-[12px] text-[#A9C4CF]">
                Transferência para a sua conta bancária
              </p>
            </div>

            <span className="rounded-full border border-[#1C9DAD]/30 bg-[#079CB3]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#5DDAE3]">
              AOA
            </span>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-xl border border-[#24566A] bg-[#0A2533]/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#A9C4CF]">
                  Saldo disponível
                </span>
                <Wallet size={17} className="text-[#19C5CE]" />
              </div>

              <div className="mt-2 text-[22px] font-semibold tracking-tight text-white tabular-nums">
                {accountLoading
                  ? "A carregar..."
                  : formatCurrency(balance ?? 0)}
              </div>
            </div>

            <div>
              <label
                htmlFor="withdrawal-amount"
                className="mb-2 block text-[14px] font-medium text-[#E5F0F4]"
              >
                Valor a levantar
              </label>

              <div className="relative">
                <input
                  id="withdrawal-amount"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={event => handleAmountChange(event.target.value)}
                  placeholder="0,00"
                  disabled={otpSent || loading || accountLoading}
                  className={`${inputClass} pr-14 text-[20px] font-semibold tabular-nums`}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#8FB4C2]">
                  Kz
                </span>
              </div>

              <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px] text-[#8FB4C2]">
                <span>Mínimo: 50 Kz</span>
                <span>Máximo por operação: 10.000.000 Kz</span>
              </div>
            </div>

            {stats.gross > 0 && (
              <div className="rounded-xl border border-[#24566A] bg-[#0A2533]/55 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Receipt size={18} className="text-[#19C5CE]" />
                  <h3 className="text-[13px] font-semibold text-white">
                    Resumo da operação
                  </h3>
                </div>

                <div className="space-y-3 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#A9C4CF]">Valor solicitado</span>
                    <span className="font-medium tabular-nums text-white">
                      {formatCurrency(stats.gross)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#A9C4CF]">Taxa de serviço (3%)</span>
                    <span className="font-medium tabular-nums text-[#F2B66D]">
                      −{formatCurrency(stats.fee)}
                    </span>
                  </div>

                  <div className="border-t border-[#24566A] pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-[#19C5CE]">
                        Valor a receber
                      </span>
                      <span className="text-[17px] font-semibold tabular-nums text-white">
                        {formatCurrency(stats.net)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 rounded-xl bg-[#0A2533]/45 px-4 py-3">
              <Info size={18} className="mt-0.5 shrink-0 text-[#19C5CE]" />
              <p className="text-[12px] leading-5 text-[#A9C4CF]">
                O valor a receber já considera a taxa de serviço de 3%. O limite
                diário de levantamento é de{" "}
                <strong className="font-semibold text-white">
                  {MAX_WITHDRAWAL_DAILY.toLocaleString("pt-AO")} Kz
                </strong>.
              </p>
            </div>

            {otpSent && (
              <div className="space-y-3 border-t border-[#24566A] pt-5">
                <div>
                  <label
                    htmlFor="withdrawal-otp"
                    className="mb-2 block text-[14px] font-medium text-[#E5F0F4]"
                  >
                    Código de confirmação
                  </label>

                  <input
                    id="withdrawal-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={event =>
                      setOtp(
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    disabled={loading}
                    className={`${inputClass} text-center text-[21px] font-semibold tracking-[0.45em] tabular-nums`}
                  />

                  <p className="mt-2 text-[12px] text-[#8FB4C2]">
                    Código enviado para {email || "o email associado à conta"}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading || loading}
                  className="w-full py-2 text-[13px] font-medium text-[#48C8D2] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {otpLoading ? "A enviar código..." : "Reenviar código"}
                </button>
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={
                  accountLoading ||
                  otpLoading ||
                  loading ||
                  !amount ||
                  !amountIsValid
                }
                className={primaryButtonClass}
              >
                {otpLoading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    A enviar código
                  </>
                ) : (
                  "Continuar"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={loading || otpLoading || otp.length !== 6}
                className={primaryButtonClass}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    A processar
                  </>
                ) : (
                  <>
                    <CheckCircle size={19} weight="bold" />
                    Confirmar levantamento
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={loading || otpLoading}
          className={`${secondaryButtonClass} mt-4`}
        >
          Voltar
        </button>
      </div>
    </main>
  )
}
