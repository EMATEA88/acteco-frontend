import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle,
  IdentificationCard,
  Wallet,
} from "@phosphor-icons/react"

import { TransferService } from "../services/transferService"
import { UserService } from "../services/user.service"
import Toast from "../components/ui/Toast"

type ToastType = "success" | "error"

const cardClass =
  "rounded-2xl border border-[#24566A] bg-[#103647] shadow-[0_14px_36px_rgba(0,0,0,0.16)]"

const inputClass =
  "h-14 w-full rounded-xl border border-[#24566A] bg-[#0A2533] px-4 text-[16px] font-medium text-white outline-none transition-colors placeholder:text-[#7696A5] focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE] disabled:cursor-not-allowed disabled:opacity-60"

const primaryButtonClass =
  "flex min-h-14 w-full items-center justify-center rounded-xl bg-[#079CB3] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#0BACC2] active:bg-[#07899D] disabled:cursor-not-allowed disabled:bg-[#315365] disabled:text-[#91A9B4]"

const secondaryButtonClass =
  "flex min-h-14 w-full items-center justify-center rounded-xl border border-[#315365] bg-[#102F3D] px-5 text-[15px] font-semibold text-[#D8E8EE] transition-colors hover:bg-[#153B4B] active:bg-[#1A4658] disabled:cursor-not-allowed disabled:opacity-60"

function formatAOA(value: number) {
  return new Intl.NumberFormat("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function Transfer() {
  const navigate = useNavigate()

  const [targetId, setTargetId] = useState("")
  const [amount, setAmount] = useState("")
  const [balanceAoa, setBalanceAoa] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<ToastType>("error")

  const amountNumber = Number(amount.replace(",", "."))
  const normalizedTargetId = targetId.trim()

  const validAmount =
    amount.trim() !== "" &&
    Number.isFinite(amountNumber) &&
    amountNumber > 0

  const canSubmit =
    normalizedTargetId.length > 0 &&
    validAmount &&
    amountNumber <= balanceAoa &&
    !balanceLoading &&
    !loading

  function showToast(message: string, type: ToastType = "error") {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  useEffect(() => {
    let active = true

    async function loadBalance() {
      try {
        const response = await UserService.me()
        const balance = Number(response?.balance ?? 0)

        if (active) {
          setBalanceAoa(Number.isFinite(balance) ? balance : 0)
        }
      } catch {
        if (active) {
          showToast("Não foi possível carregar o saldo da conta.")
        }
      } finally {
        if (active) setBalanceLoading(false)
      }
    }

    void loadBalance()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!toastVisible) return

    const timer = window.setTimeout(() => {
      setToastVisible(false)
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [toastVisible, toastMessage])

  async function handleTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading || balanceLoading) return

    if (!normalizedTargetId) {
      showToast("Introduza o ID da conta de destino.")
      return
    }

    if (!validAmount) {
      showToast("Introduza um valor válido para a transferência.")
      return
    }

    if (amountNumber > balanceAoa) {
      showToast("Saldo insuficiente para esta operação.")
      return
    }

    setLoading(true)

    try {
      await TransferService.internal(
        normalizedTargetId,
        amountNumber,
        "AOA"
      )

      setBalanceAoa(current => Math.max(0, current - amountNumber))
      setTargetId("")
      setAmount("")

      showToast("Transferência realizada com sucesso.", "success")

      window.setTimeout(() => {
        navigate("/profile")
      }, 1400)
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ??
          error?.response?.data?.error ??
          "Não foi possível concluir a transferência."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A2533] px-4 py-6 text-white sm:px-6 sm:py-10">
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <div className="mx-auto w-full max-w-[460px]">
        <header className="mb-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#19C5CE]">
          </p>
          <h1 className="mt-2 text-[25px] font-semibold tracking-tight text-white">
            Transferência
          </h1>
        </header>

        <section className={`${cardClass} mb-5 p-5 sm:p-6`}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#079CB3]/15 text-[#19C5CE]">
              <Wallet size={23} weight="duotone" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-[#A9C4CF]">
                Saldo disponível
              </p>
              <p className="mt-1 text-[24px] font-semibold leading-tight tracking-tight text-white tabular-nums">
                {balanceLoading ? "A carregar..." : formatAOA(balanceAoa)}
                {!balanceLoading && (
                  <span className="ml-2 text-[13px] font-medium text-[#19C5CE]">
                    AOA
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleTransfer} className={`${cardClass} space-y-5 p-5 sm:p-6`}>
          <div>
            <label
              htmlFor="recipient-id"
              className="mb-2 block text-[14px] font-medium text-[#E5F0F4]"
            >
              Conta de destino
            </label>

            <div className="relative">
              <IdentificationCard
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FB4C2]"
              />
              <input
                id="recipient-id"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={targetId}
                onChange={event => setTargetId(event.target.value)}
                placeholder="ID da conta"
                disabled={loading}
                required
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="transfer-amount"
              className="mb-2 block text-[14px] font-medium text-[#E5F0F4]"
            >
              Valor a transferir
            </label>

            <div className="relative">
              <input
                id="transfer-amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                placeholder="0,00"
                disabled={loading}
                required
                className={`${inputClass} pr-16 text-[20px] font-semibold tabular-nums`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#19C5CE]">
                AOA
              </span>
            </div>

            {validAmount && amountNumber > balanceAoa && (
              <p className="mt-2 text-[12px] text-[#F4A6A6]">
                O valor indicado ultrapassa o saldo disponível.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={primaryButtonClass}
          >
            {loading ? (
              <>
                <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                A processar transferência
              </>
            ) : (
              "Confirmar transferência"
            )}
          </button>
        </form>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#24566A] bg-[#103647]/65 px-4 py-3.5">
          <CheckCircle
            size={19}
            weight="regular"
            className="mt-0.5 shrink-0 text-[#35C99A]"
          />
          <p className="text-[12px] leading-5 text-[#A9C4CF]">
            As transferências entre contas EMATEA são disponibilizadas no saldo
            do destinatário após a confirmação da operação.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={loading}
          className={`${secondaryButtonClass} mt-5`}
        >
          Voltar
        </button>
      </div>
    </main>
  )
}
