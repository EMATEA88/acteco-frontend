import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Gift,
  Info,
  Ticket,
} from "@phosphor-icons/react"

import { GiftService } from "../services/gift.service"
import Toast from "../components/ui/Toast"

type ToastType = "success" | "error"

const primaryButtonClass =
  "flex min-h-14 w-full items-center justify-center rounded-xl bg-[#079CB3] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#0BACC2] active:bg-[#07899D] disabled:cursor-not-allowed disabled:bg-[#315365] disabled:text-[#91A9B4]"

const secondaryButtonClass =
  "flex min-h-14 w-full items-center justify-center rounded-xl border border-[#315365] bg-[#102F3D] px-5 text-[15px] font-semibold text-[#D8E8EE] transition-colors hover:bg-[#153B4B] active:bg-[#1A4658]"

const inputClass =
  "h-14 w-full rounded-xl border border-[#24566A] bg-[#0A2533] px-4 pl-12 text-[16px] font-semibold uppercase tracking-[0.08em] text-white outline-none transition-colors placeholder:font-normal placeholder:tracking-normal placeholder:text-[#7696A5] focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE] disabled:cursor-not-allowed disabled:opacity-60"

export default function GiftPage() {
  const navigate = useNavigate()

  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<ToastType>("error")

  const isValid = code.trim().length > 0

  function showToast(message: string, type: ToastType = "error") {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  async function redeem() {
    if (!isValid || loading) return

    try {
      setLoading(true)

      const response = await GiftService.redeem(code.trim())

      showToast(
        `Código resgatado. Valor recebido: ${response.data.amount} Kz`,
        "success"
      )

      setCode("")
    } catch (error: any) {
      showToast(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          "Não foi possível resgatar o código."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!toastVisible) return

    const timer = window.setTimeout(() => {
      setToastVisible(false)
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [toastVisible, toastMessage])

  function handleCodeChange(value: string) {
    // Mantém o formato do código uniforme sem alterar o valor enviado ao serviço.
    setCode(value.toUpperCase().replace(/\s/g, ""))
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
            Resgatar presente
          </h1>
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#24566A] bg-[#103647] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-3 border-b border-[#24566A] px-5 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#079CB3]/15 text-[#19C5CE]">
              <Gift size={23} weight="duotone" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-white">
                Código de presente
              </h2>
              <p className="mt-0.5 text-[12px] text-[#A9C4CF]">
                Introduza o código para resgatar o valor
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <label
                htmlFor="gift-code"
                className="mb-2 block text-[14px] font-medium text-[#E5F0F4]"
              >
                Código
              </label>

              <div className="relative">
                <Ticket
                  size={19}
                  weight="regular"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8FB4C2]"
                />

                <input
                  id="gift-code"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  value={code}
                  onChange={event => handleCodeChange(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && isValid && !loading) {
                      void redeem()
                    }
                  }}
                  placeholder="EMT-XXXX"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => void redeem()}
              disabled={!isValid || loading}
              className={primaryButtonClass}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  A processar
                </>
              ) : (
                "Resgatar código"
              )}
            </button>
          </div>
        </section>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#24566A] bg-[#103647]/65 px-4 py-3.5">
          <Info
            size={19}
            weight="regular"
            className="mt-0.5 shrink-0 text-[#19C5CE]"
          />
          <p className="text-[12px] leading-5 text-[#A9C4CF]">
            Cada código pode ser utilizado uma única vez. Mantenha-o privado e
            não o partilhe com terceiros.
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
