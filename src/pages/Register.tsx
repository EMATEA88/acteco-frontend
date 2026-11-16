import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
  Wallet,
} from "lucide-react"
import Toast from "../components/ui/Toast"
import {
  api,
  requestRegisterOtp,
  registerUser,
} from "../services/api"
type AccountRole = "CLIENT" | "AGENT"
const TOTAL_STEPS = 7
const RESEND_SECONDS = 60
const inputClass =
  "w-full h-14 rounded-xl bg-[#0A2533] border border-[#24566A] px-4 text-[15px] text-white placeholder:text-[#7696A5] outline-none transition-colors focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE]"
const primaryButtonClass =
  "w-full h-12 sm:h-14 rounded-xl bg-[#079CB3] hover:bg-[#0BACC2] disabled:bg-[#315365] disabled:text-[#91A9B4] disabled:cursor-not-allowed text-white text-[15px] font-semibold tracking-wide transition-colors flex items-center justify-center"
export default function Register() {
  const navigate = useNavigate()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const otpRequestInFlight = useRef(false)
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<AccountRole>("CLIENT")
  const [fullName, setFullName] = useState("")
  const [nif, setNif] = useState("")
  const [nifLoading, setNifLoading] = useState(false)
  const [nifVerified, setNifVerified] = useState(false)
  const [nifError, setNifError] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  })
  const progress = ((step + 1) / TOTAL_STEPS) * 100
  useEffect(() => {
    if (!toast.visible) return
    const timer = setTimeout(() => {
      setToast(previous => ({
        ...previous,
        visible: false,
      }))
    }, 3500)
    return () => clearTimeout(timer)
  }, [toast.visible, toast.message])
  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft(previous => Math.max(previous - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft > 0])
  function notify(
    message: string,
    type: "success" | "error" = "error"
  ) {
    setToast({
      visible: true,
      message,
      type,
    })
  }
  async function handleVerifyNif() {
    const normalizedNif = nif.replace(/\s+/g, "").toUpperCase()
    if (!normalizedNif) {
      notify("Introduza o seu BI ou NIF.")
      return
    }
    if (nifLoading) return
    try {
      setNifLoading(true)
      setNifError("")
      setNifVerified(false)
      setFullName("")
      const { data } = await api.post<{
        success: boolean
        data?: {
          nif: string
          name: string
          status: string
          attribution?: {
            text: string
            url: string
          }
        }
      }>("/agt/verify-nif", { nif: normalizedNif })
      if (!data?.success || !data.data?.name?.trim()) {
        throw new Error("NIF_INVALID_RESPONSE")
      }
      if (data.data.status !== "active") {
        throw new Error("NIF_INACTIVE")
      }
      setNif(normalizedNif)
      setFullName(data.data.name.trim())
      setNifVerified(true)
      notify("Nome confirmado através da NIF.AO.", "success")
    } catch (error: any) {
      const status = error?.response?.status
      const code = error?.response?.data?.code
      const message =
        error?.message === "NIF_INACTIVE"
          ? "Este NIF não está ativo."
          : status === 404 || code === "NIF_NOT_FOUND"
            ? "Não foi encontrado um contribuinte com este número."
            : status === 429
              ? "Limite de consultas atingido. Aguarde antes de tentar novamente."
              : status >= 500
                ? "Serviço temporariamente indisponível. Tente novamente."
                : "Não foi possível confirmar o BI/NIF. Verifique o número e tente novamente."
      setNifVerified(false)
      setFullName("")
      setNifError(message)
      notify(message)
    } finally {
      setNifLoading(false)
    }
  }
  function goBack() {
    if (otpLoading || registerLoading) return
    if (step === 0) {
      navigate("/login")
      return
    }
    setStep(previous => previous - 1)
  }
  function validateCurrentStep() {
    switch (step) {
      case 0:
        return true
      case 1:
        if (!nif.trim()) {
          notify("Introduza o seu BI ou NIF.")
          return false
        }
        if (!nifVerified) {
          notify("Consulte e confirme o seu BI/NIF antes de continuar.")
          return false
        }
        if (fullName.trim().length < 3) {
          notify("O nome devolvido pela consulta é inválido.")
          return false
        }
        return true
      case 2:
        if (phone.length !== 9) {
          notify("Introduza um número de telefone válido.")
          return false
        }
        return true
      case 3:
        if (!password) {
          notify("Introduza a sua palavra-passe.")
          return false
        }
        return true
      case 4:
        if (password !== confirmPassword) {
          notify("As palavras-passe não coincidem.")
          return false
        }
        return true
      case 5:
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
          notify("Introduza um endereço de email válido.")
          return false
        }
        return true
      default:
        return true
    }
  }
  async function handleRequestOtp() {
    if (otpRequestInFlight.current) return
    const normalizedEmail = email.trim().toLowerCase()
    try {
      otpRequestInFlight.current = true
      setOtpLoading(true)
      await requestRegisterOtp(normalizedEmail)
      setEmail(normalizedEmail)
      setCode("")
      setSecondsLeft(RESEND_SECONDS)
      setStep(6)
      notify("Código enviado com sucesso.", "success")
      window.setTimeout(() => {
        otpRefs.current[0]?.focus()
      }, 100)
    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          "Não foi possível enviar o código de confirmação."
      )
    } finally {
      otpRequestInFlight.current = false
      setOtpLoading(false)
    }
  }
  async function handleContinue() {
    if (!validateCurrentStep()) return
    if (step === 5) {
      await handleRequestOtp()
      return
    }
    setStep(previous => Math.min(previous + 1, 6))
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
  async function handleConfirmRegistration(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (registerLoading || otpLoading || resendLoading) return
    if (code.length !== 6) {
      notify("Introduza os seis dígitos do código.")
      return
    }
    try {
      setRegisterLoading(true)
      await registerUser(
        `+244${phone}`,
        email,
        password,
        code,
        fullName.trim(),
        role
      )
      notify("Conta criada com sucesso.", "success")
      setTimeout(() => {
        navigate("/login")
      }, 1200)
    } catch (error: any) {
      notify(
        error?.response?.data?.message ??
          "Não foi possível criar a conta."
      )
    } finally {
      setRegisterLoading(false)
    }
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 6) {
      void handleConfirmRegistration(event)
      return
    }
    void handleContinue()
  }
  async function handleResendOtp() {
    if (
      secondsLeft > 0 ||
      otpLoading ||
      resendLoading ||
      otpRequestInFlight.current
    ) {
      return
    }
    const normalizedEmail = email.trim().toLowerCase()
    // Limpa o código anterior imediatamente ao solicitar um novo.
    setCode("")
    otpRefs.current[0]?.focus()
    try {
      otpRequestInFlight.current = true
      setResendLoading(true)
      await requestRegisterOtp(normalizedEmail)
      setEmail(normalizedEmail)
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
  const titles = [
    "Deseja ser um Agente ou Cliente?",
    "Qual é o seu nome completo?",
    "Qual é o seu número de telefone?",
    "Crie a sua palavra-passe.",
    "Confirme a sua palavra-passe.",
    "Qual é o seu endereço de email?",
    "Verificação de email",
  ]
  const isPasswordStep = step === 3 || step === 4
  return (
    <main className="min-h-[100dvh] bg-[#0A2533] text-white flex flex-col items-center justify-start sm:justify-center px-3 py-4 sm:px-6 sm:py-8">
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast(previous => ({ ...previous, visible: false }))
        }
      />
      <div className="w-full max-w-[460px]">
        {/* LOGÓTIPO */}
        <header className="text-center mb-5 sm:mb-8">
          <img
            src="/logo.png"
            alt="EMATEA"
            className="mx-auto h-14 w-14 sm:h-[68px] sm:w-[68px] rounded-full object-cover"
          />
          <h1 className="mt-3 text-xl font-bold tracking-wide text-white">
            EMATEA
          </h1>
        </header>
        {/* TÍTULO DA ETAPA — SEM SUBTÍTULO */}
        <div className="mb-4 px-1">
          <h2 className="text-center text-[22px] leading-snug font-semibold tracking-tight text-white sm:text-[24px]">
            {titles[step]}
          </h2>
        </div>
        {/* CARTÃO COMPACTO */}
        <section className="flex min-h-[250px] w-full flex-col rounded-2xl border border-[#24566A] bg-[#0E364A] px-4 py-4 shadow-lg shadow-black/10 sm:rounded-[22px] sm:px-6 sm:py-5">
          {/* PROGRESSO */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-sm font-medium text-[#D8E8EE]">
                Passo {step + 1} de {TOTAL_STEPS}
              </span>
              <span className="text-xs font-semibold text-[#8BDCE8]">
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="h-[6px] w-full rounded-full bg-[#294D5E] overflow-hidden"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
            >
              <div
                className="h-full rounded-full bg-[#19C5CE] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            {/* ETAPA 1 — TIPO DE CONTA */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole("CLIENT")}
                  aria-pressed={role === "CLIENT"}
                  className={`min-h-[112px] rounded-xl border px-3 py-3 flex flex-col items-center justify-center gap-2.5 transition-colors ${
                    role === "CLIENT"
                      ? "border-[#19C5CE] bg-[#17485B]"
                      : "border-[#31576A] bg-[#0A2533] hover:border-[#547A8C]"
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    role === "CLIENT"
                      ? "bg-[#0B6479]"
                      : "bg-[#163C4D]"
                  }`}>
                    <Wallet
                      size={29}
                      strokeWidth={1.7}
                      className="text-[#8BDCE8]"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-white">
                      Cliente
                    </span>
                    <span className="mt-1 block text-xs text-[#A9C9D5]">
                      Conta particular
                    </span>
                  </div>
                  {role === "CLIENT" && (
                    <Check
                      size={17}
                      className="text-[#19C5CE]"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("AGENT")}
                  aria-pressed={role === "AGENT"}
                  className={`min-h-[112px] rounded-xl border px-3 py-3 flex flex-col items-center justify-center gap-2.5 transition-colors ${
                    role === "AGENT"
                      ? "border-[#19C5CE] bg-[#17485B]"
                      : "border-[#31576A] bg-[#0A2533] hover:border-[#547A8C]"
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    role === "AGENT"
                      ? "bg-[#0B6479]"
                      : "bg-[#163C4D]"
                  }`}>
                    <BriefcaseBusiness
                      size={29}
                      strokeWidth={1.7}
                      className="text-[#8BDCE8]"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block text-sm font-semibold text-white">
                      Agente
                    </span>
                    <span className="mt-1 block text-xs text-[#A9C9D5]">
                      Conta profissional
                    </span>
                  </div>
                  {role === "AGENT" && (
                    <Check
                      size={17}
                      className="text-[#19C5CE]"
                    />
                  )}
                </button>
              </div>
            )}
            {/* ETAPA 2 — IDENTIFICAÇÃO E NOME */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="register-nif"
                    className="block text-sm font-medium text-[#D8E8EE]"
                  >
                    Bilhete de Identidade / NIF
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="register-nif"
                      type="text"
                      autoFocus
                      autoComplete="off"
                      maxLength={20}
                      value={nif}
                      disabled={nifLoading || nifVerified}
                      onChange={event => {
                        const value = event.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .toUpperCase()
                        setNif(value)
                        setNifVerified(false)
                        setFullName("")
                        setNifError("")
                      }}
                      onKeyDown={event => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          void handleVerifyNif()
                        }
                      }}
                      placeholder="Introduza o BI ou NIF"
                      className={`${inputClass} min-w-0 flex-1 uppercase disabled:opacity-70`}
                    />
                    <button
                      type="button"
                      onClick={() => void handleVerifyNif()}
                      disabled={!nif.trim() || nifLoading || nifVerified}
                      className="shrink-0 rounded-xl bg-[#079CB3] px-3 sm:px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0BACC2] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {nifLoading
                        ? "A consultar..."
                        : nifVerified
                          ? "Confirmado"
                          : "Consultar"}
                    </button>
                  </div>
                  {nifError && (
                    <p role="alert" className="text-xs text-[#F29B9B]">
                      {nifError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="register-full-name"
                    className="block text-sm font-medium text-[#D8E8EE]"
                  >
                    Nome completo
                  </label>
                  <div className="relative">
                    <UserRound
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#789EAE]"
                    />
                    <input
                      id="register-full-name"
                      type="text"
                      value={fullName}
                      readOnly
                      aria-readonly="true"
                      placeholder="O nome será preenchido após a consulta"
                      className={`${inputClass} pl-12 cursor-not-allowed opacity-90`}
                    />
                  </div>
                </div>
                {nifVerified && (
                  <p className="flex items-center gap-2 text-xs text-[#58D6C7]">
                    <Check size={15} />
                    Nome confirmado.
                  </p>
                )}
                <p className="text-[11px] text-[#8BAFBE]">
                  Dados:{" "}
                  <a
                    href="https://nif.ao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#19C5CE] underline underline-offset-2"
                  >
                    NIF.AO
                  </a>
                </p>
              </div>
            )}
            {/* ETAPA 3 — TELEFONE */}
            {step === 2 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#D8E8EE]">
                  Número de telefone
                </label>
                <div className="flex h-14 overflow-hidden rounded-xl border border-[#24566A] bg-[#0A2533] focus-within:border-[#19C5CE]">
                  <div className="flex items-center border-r border-[#24566A] px-4 text-sm font-semibold text-[#A9C9D5]">
                    +244
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoFocus
                    autoComplete="tel-national"
                    maxLength={9}
                    value={phone}
                    onChange={event =>
                      setPhone(
                        event.target.value.replace(/\D/g, "").slice(0, 9)
                      )
                    }
                    placeholder="923 000 000"
                    className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white placeholder:text-[#7696A5] outline-none"
                  />
                  <div className="flex items-center pr-4 text-[#789EAE]">
                    <Phone size={18} />
                  </div>
                </div>
              </div>
            )}
            {/* ETAPAS 4 E 5 — PALAVRA-PASSE */}
            {isPasswordStep && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#D8E8EE]">
                  {step === 3
                    ? "Palavra-passe"
                    : "Confirmar palavra-passe"}
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#789EAE]"
                  />
                  <input
                    type={
                      step === 3
                        ? showPassword ? "text" : "password"
                        : showConfirmPassword ? "text" : "password"
                    }
                    autoFocus
                    autoComplete={
                      step === 3 ? "new-password" : "new-password"
                    }
                    value={
                      step === 3 ? password : confirmPassword
                    }
                    onChange={event =>
                      step === 3
                        ? setPassword(event.target.value)
                        : setConfirmPassword(event.target.value)
                    }
                    placeholder="Introduza a palavra-passe"
                    className={`${inputClass} pl-12 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      step === 3
                        ? setShowPassword(value => !value)
                        : setShowConfirmPassword(value => !value)
                    }
                    aria-label="Mostrar ou ocultar palavra-passe"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8BAFBE] hover:text-white"
                  >
                    {(
                      step === 3
                        ? showPassword
                        : showConfirmPassword
                    ) ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
                {step === 4 && confirmPassword.length > 0 && (
                  <p className={`text-xs ${
                    password === confirmPassword
                      ? "text-[#58D6C7]"
                      : "text-[#F29B9B]"
                  }`}>
                    {password === confirmPassword
                      ? "As palavras-passe coincidem."
                      : "As palavras-passe ainda não coincidem."}
                  </p>
                )}
              </div>
            )}
            {/* ETAPA 6 — EMAIL */}
            {step === 5 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#D8E8EE]">
                  Endereço de email
                </label>
                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#789EAE]"
                  />
                  <input
                    type="email"
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>
            )}
            {/* ETAPA 7 — CONFIRMAÇÃO OTP */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-[#24566A] bg-[#0A2533] p-3">
                  <Mail
                    size={20}
                    className="shrink-0 text-[#19C5CE]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-[#8BAFBE]">
                      Código enviado para
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-white">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#D8E8EE]">
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
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={code[index] ?? ""}
                        onChange={event =>
                          handleCodeChange(event.target.value, index)
                        }
                        onKeyDown={event =>
                          handleCodeKeyDown(event, index)
                        }
                        onPaste={handleCodePaste}
                        aria-label={`Dígito ${index + 1}`}
                        className="h-12 min-w-0 rounded-lg border border-[#456B7D] bg-[#0A2533] text-center text-xl font-semibold text-white outline-none transition-colors focus:border-[#19C5CE] focus:ring-1 focus:ring-[#19C5CE]"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-xs leading-relaxed text-[#A9C9D5]">
                    Caso não receba o código em 30 segundos,
                    verifique também a pasta Spam ou Lixo eletrónico.
                  </p>
                  {secondsLeft > 0 ? (
                    <p className="text-sm text-[#A9C9D5]">
                      Reenviar código em{" "}
                      <span className="font-semibold text-[#19C5CE]">
                        {secondsLeft}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={
                        secondsLeft > 0 ||
                        otpLoading ||
                        resendLoading
                      }
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#19C5CE] transition-colors hover:text-[#75E3E9] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {resendLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#19C5CE]/30 border-t-[#19C5CE]" />
                          A reenviar código...
                        </>
                      ) : (
                        "Reenviar código"
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* BOTÃO PRINCIPAL */}
            <button
              type="submit"
              disabled={
                otpLoading ||
                resendLoading ||
                registerLoading ||
                (step === 4 &&
                  (!confirmPassword ||
                    password !== confirmPassword)) ||
                (step === 6 && code.length !== 6)
              }
              className={`${primaryButtonClass} mt-4 sm:mt-5`}
            >
              {otpLoading ? (
                "A enviar código..."
              ) : registerLoading ? (
                "A criar conta..."
              ) : step === 6 ? (
                "Confirmar e criar conta"
              ) : (
                "Continuar"
              )}
            </button>
          </form>
          {/* AÇÃO SECUNDÁRIA — SEM BOTÃO COM COR */}
          {step === 0 ? (
            <Link
              to="/login"
              className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl bg-transparent px-4 text-sm font-medium text-[#A9C9D5] transition-colors hover:text-white"
            >
              Já possui uma conta? Entrar
            </Link>
          ) : (
            <button
              type="button"
              onClick={goBack}
              disabled={otpLoading || resendLoading || registerLoading}
              className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl bg-transparent px-4 text-sm font-medium text-[#A9C9D5] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Voltar
            </button>
          )}
        </section>
      </div>
    </main>
  )
}