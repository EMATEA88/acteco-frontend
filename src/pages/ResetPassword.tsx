
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

import Toast from "../components/ui/Toast"

import {
  requestResetOtp,
  resetPassword,
} from "../services/api"

const RESEND_SECONDS = 60

const inputClass =
  "w-full h-14 rounded-xl bg-[#0A2533] border border-[#24566A] px-4 text-[15px] text-white placeholder:text-[#7696A5] outline-none transition-colors focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE]"

const primaryButtonClass =
  "w-full h-14 rounded-xl bg-[#079CB3] hover:bg-[#0BACC2] disabled:bg-[#315365] disabled:text-[#91A9B4] disabled:cursor-not-allowed text-white text-[15px] font-semibold tracking-wide transition-colors flex items-center justify-center"

type ToastType = "success" | "error"

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
}

export default function ResetPassword() {
  const navigate = useNavigate()

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const otpRequestInFlight = useRef(false)
  const resetInFlight = useRef(false)

  const [step, setStep] = useState(0)

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [secondsLeft, setSecondsLeft] = useState(0)

  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  })

  const isBusy = otpLoading || resendLoading || resetLoading

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
    if (secondsLeft <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft(previous => Math.max(previous - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft > 0])

  function notify(
    message: string,
    type: ToastType = "error"
  ) {
    setToast({
      visible: true,
      message,
      type,
    })
  }

  function validateEmail() {
    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      notify("Introduza um endereço de email válido.")
      return false
    }

    return true
  }

  async function handleRequestOtp() {
    if (otpRequestInFlight.current || isBusy) return

    if (!validateEmail()) return

    const normalizedEmail = email.trim().toLowerCase()

    try {
      otpRequestInFlight.current = true
      setOtpLoading(true)

      await requestResetOtp(normalizedEmail)

      setEmail(normalizedEmail)
      setCode("")
      setSecondsLeft(RESEND_SECONDS)
      setStep(1)

      notify("Código de recuperação enviado com sucesso.", "success")

      window.setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 100)

    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          "Não foi possível enviar o código de recuperação."
      )
    } finally {
      otpRequestInFlight.current = false
      setOtpLoading(false)
    }
  }

  async function handleResendOtp() {
    if (
      secondsLeft > 0 ||
      otpLoading ||
      resendLoading ||
      resetLoading ||
      otpRequestInFlight.current
    ) {
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Limpa imediatamente o código anterior.
    setCode("")

    otpRefs.current[0]?.focus()

    try {
      otpRequestInFlight.current = true
      setResendLoading(true)

      await requestResetOtp(normalizedEmail)

      setSecondsLeft(RESEND_SECONDS)

      notify("Novo código enviado com sucesso.", "success")

      window.setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 100)

    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          "Não foi possível reenviar o código."
      )
    } finally {
      otpRequestInFlight.current = false
      setResendLoading(false)
    }
  }

  function handleCodeChange(value: string, index: number) {
    const digit = value.replace(/\D/g, "").slice(-1)

    const digits = code.split("")

    digits[index] = digit

    const nextCode = Array.from(
      { length: 6 },
      (_, position) => digits[position] ?? ""
    ).join("")

    setCode(nextCode)

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleCodeKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus()
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }

    if (event.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleCodePaste(
    event: React.ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault()

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)

    setCode(pastedCode)

    const focusIndex = Math.min(pastedCode.length, 5)

    otpRefs.current[focusIndex]?.focus()
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (resetInFlight.current || isBusy) return

    if (code.length !== 6) {
      notify("Introduza os seis dígitos do código de confirmação.")
      return
    }

    if (!newPassword.trim()) {
      notify("Introduza a sua nova palavra-passe.")
      return
    }

    try {
      resetInFlight.current = true
      setResetLoading(true)

      await resetPassword(
        email,
        newPassword,
        code
      )

      notify(
        "Palavra-passe redefinida com sucesso.",
        "success"
      )

      window.setTimeout(() => {
        navigate("/login", { replace: true })
      }, 1500)

    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          "Não foi possível redefinir a palavra-passe."
      )
    } finally {
      resetInFlight.current = false
      setResetLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (step === 0) {
      void handleRequestOtp()
      return
    }

    void handleReset(event)
  }

  function goBack() {
    if (isBusy) return

    if (step === 1) {
      setStep(0)
      setCode("")
      setNewPassword("")
      setSecondsLeft(0)
      return
    }

    navigate("/login")
  }

  return (
    <main className="min-h-screen bg-[#0A2533] text-white flex items-center justify-center px-4 py-8 sm:px-6">

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

      <div className="w-full max-w-[460px]">

        {/* CABEÇALHO */}

        <div className="text-center mb-8">

          <img
            src="/logo.png"
            alt="EMATEA"
            className="mx-auto mb-4 h-16 w-16 rounded-full border border-cyan-500/30 shadow-md object-cover"
          />

          <h1 className="text-2xl font-black tracking-tight text-white">
            Recuperar Acesso
          </h1>

          <p className="mt-2 text-xs text-cyan-200/70 uppercase tracking-widest">
            Plataforma Oficial EMATEA
          </p>

        </div>

        {/* CARD PRINCIPAL */}

        <div className="rounded-[2rem] border border-cyan-500/20 bg-[#0e364a] p-6 sm:p-8 shadow-2xl shadow-cyan-950/20">

          {/* PROGRESSO */}

          <div className="mb-8">

            <div className="flex justify-between text-[11px] font-semibold text-cyan-100 mb-3">

              <span>
                Passo {step + 1} de 2
              </span>

              <span>
                {step === 0 ? "50%" : "100%"}
              </span>

            </div>

            <div className="h-1.5 rounded-full bg-[#315365] overflow-hidden">

              <div
                className="h-full bg-[#19C5CE] rounded-full transition-all duration-500"
                style={{
                  width: step === 0 ? "50%" : "100%",
                }}
              />

            </div>

          </div>

          {/* VOLTAR */}

          <button
            type="button"
            onClick={goBack}
            disabled={isBusy}
            className="mb-6 text-cyan-200/70 hover:text-white transition-colors disabled:opacity-40"
            aria-label="Voltar"
          >
            <ArrowLeft size={21} />
          </button>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {step === 0 ? (

              <>
                <div className="space-y-2">

                  <h2 className="text-lg font-bold text-white">
                    Esqueceu a sua palavra-passe?
                  </h2>

                  <p className="text-xs text-cyan-100/70 leading-relaxed">
                    Introduza o email associado à sua conta.
                    Enviaremos um código para confirmar a sua identidade.
                  </p>

                </div>

                <div className="space-y-2">

                  <label className="text-xs font-semibold text-cyan-100">
                    Endereço de email
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-200/50"
                    />

                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      placeholder="exemplo@email.com"
                      disabled={isBusy}
                      className={`${inputClass} pl-12`}
                    />

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={isBusy}
                  className={primaryButtonClass}
                >
                  {otpLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      A enviar código...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </button>
              </>

            ) : (

              <>
                <div className="space-y-2">

                  <h2 className="text-lg font-bold text-white">
                    Verificação de email
                  </h2>

                  <p className="text-xs text-cyan-100/70 leading-relaxed">
                    Introduza o código de seis dígitos enviado para o seu email.
                  </p>

                </div>

                {/* EMAIL */}

                <div className="flex items-center gap-3 rounded-xl border border-[#24566A] bg-[#0A2533] p-4">

                  <Mail
                    size={19}
                    className="text-[#19C5CE] shrink-0"
                  />

                  <div className="min-w-0">

                    <p className="text-[10px] text-cyan-200/60">
                      Código enviado para
                    </p>

                    <p className="text-xs font-semibold text-white truncate">
                      {email}
                    </p>

                  </div>

                </div>

                {/* OTP */}

                <div className="space-y-3">

                  <label className="text-xs font-semibold text-cyan-100">
                    Código de confirmação
                  </label>

                  <div className="grid grid-cols-6 gap-2">

                    {Array.from({ length: 6 }).map((_, index) => (

                      <input
                        key={index}
                        ref={element => {
                          otpRefs.current[index] = element
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={code[index] ?? ""}
                        disabled={isBusy}
                        onChange={event =>
                          handleCodeChange(event.target.value, index)
                        }
                        onKeyDown={event =>
                          handleCodeKeyDown(event, index)
                        }
                        onPaste={handleCodePaste}
                        className="w-full h-12 rounded-xl bg-[#0A2533] border border-[#315D70] focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE] outline-none text-center text-lg font-bold text-white transition-colors disabled:opacity-50"
                      />

                    ))}

                  </div>

                </div>

                {/* NOVA PASSWORD */}

                <div className="space-y-2">

                  <label className="text-xs font-semibold text-cyan-100">
                    Nova palavra-passe
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-200/50"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={event => setNewPassword(event.target.value)}
                      placeholder="Introduza a nova palavra-passe"
                      disabled={isBusy}
                      className={`${inputClass} pl-12 pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(previous => !previous)}
                      disabled={isBusy}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-200/60 hover:text-white transition-colors"
                      aria-label={
                        showPassword
                          ? "Ocultar palavra-passe"
                          : "Mostrar palavra-passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>

                </div>

                {/* BOTÃO PRINCIPAL */}

                <button
                  type="submit"
                  disabled={isBusy || code.length !== 6 || !newPassword}
                  className={primaryButtonClass}
                >
                  {resetLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      A redefinir palavra-passe...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} className="mr-2" />
                      Confirmar e redefinir
                    </>
                  )}
                </button>

                {/* REENVIO */}

                <div className="text-center">

                  {secondsLeft > 0 ? (

                    <p className="text-[11px] text-cyan-200/60">
                      Poderá solicitar um novo código em{" "}
                      <span className="text-cyan-300 font-bold">
                        {secondsLeft}s
                      </span>
                    </p>

                  ) : (

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors disabled:opacity-50"
                    >
                      <RefreshCw
                        size={14}
                        className={resendLoading ? "animate-spin" : ""}
                      />

                      {resendLoading
                        ? "A enviar..."
                        : "Reenviar código"}
                    </button>

                  )}

                </div>

              </>

            )}

          </form>

          {/* VOLTAR AO LOGIN */}

          <div className="mt-6 pt-5 border-t border-cyan-500/10 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs text-cyan-200/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Voltar ao login
            </Link>

          </div>

        </div>

        <footer className="mt-8 text-center">

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-300/40">
                                        EMATEA 2026
          </p>

        </footer>

      </div>

    </main>
  )
}
