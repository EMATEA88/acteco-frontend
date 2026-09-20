import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, X, RefreshCw } from "lucide-react"

import Toast from "../components/ui/Toast"

import AccountTypeSelector from "../components/auth/AccountTypeSelector"
import RegisterForm from "../components/auth/RegisterForm"

import {
  requestRegisterOtp,
  registerUser
} from "../services/api"

export default function Register() {
  const navigate = useNavigate()

  const [role, setRole] = useState<"CLIENT" | "AGENT">("CLIENT")

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("")

  const [secondsLeft, setSecondsLeft] = useState(0)

  const [otpLoading, setOtpLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const [showOtpModal, setShowOtpModal] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error"
  })

  useEffect(() => {
    if (!toast.visible) return

    const timer = setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false
      }))
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast.visible])

  // Temporizador para reenvio do OTP
  useEffect(() => {
    if (secondsLeft <= 0) return

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [secondsLeft])

  function notify(
    message: string,
    type: "success" | "error" = "error"
  ) {
    setToast({
      visible: true,
      message,
      type
    })
  }

  // Envia o OTP para o email
  async function handleRequestOtp() {
    if (!email.includes("@")) {
      return notify("Informe um e-mail válido.")
    }

    try {
      setOtpLoading(true)

      await requestRegisterOtp(email)

      setSecondsLeft(60)
      setCode("")

      notify(
        "Código enviado com sucesso.",
        "success"
      )

      setShowOtpModal(true)

    } catch (err: any) {
      notify(
        err?.response?.data?.message ??
          "Erro ao enviar código."
      )
    } finally {
      setOtpLoading(false)
    }
  }

  // Primeira etapa:
  // valida os dados e envia automaticamente o OTP.
  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault()

    if (
      !fullName ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return notify("Preencha todos os campos.")
    }

    if (!email.includes("@")) {
      return notify("Informe um e-mail válido.")
    }

    if (password !== confirmPassword) {
      return notify("As senhas não coincidem.")
    }

    await handleRequestOtp()
  }

  // Segunda etapa:
  // confirma o OTP e cria a conta.
  async function handleConfirmRegistration(
    e: FormEvent
  ) {
    e.preventDefault()

    if (!code.trim()) {
      return notify(
        "Informe o código recebido no seu e-mail."
      )
    }

    try {
      setRegisterLoading(true)

      await registerUser(
        `+244${phone}`,
        email,
        password,
        code,
        fullName,
        role
      )

      setShowOtpModal(false)

      notify(
        "Conta criada com sucesso.",
        "success"
      )

      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (err: any) {
      notify(
        err?.response?.data?.message ??
          "Erro ao criar conta."
      )
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2533] flex items-center justify-center px-4 sm:px-6 text-[#e0f2fe] font-sans selection:bg-cyan-500/30">

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      <div className="w-full max-w-md py-8 sm:py-10 space-y-8 relative">

        {/* LUZ DE FUNDO */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/[0.06] rounded-full filter blur-[100px] pointer-events-none" />

        {/* CABEÇALHO */}
        <div className="text-center relative z-10">

          <img
            src="/logo.png"
            alt="EMATEA"
            className="mx-auto mb-4 h-16 w-16 rounded-full border border-cyan-500/30 shadow-md object-cover"
          />

          <h1 className="text-2xl font-black tracking-tight text-white font-mono">
            Criar Conta
          </h1>

          <p className="mt-2 text-xs text-cyan-200/70 font-mono uppercase tracking-widest">
            Plataforma Oficial EMATEA
          </p>

        </div>

        {/* CARD PRINCIPAL */}
        <div className="rounded-[2.5rem] border border-cyan-500/20 bg-[#0e364a] p-6 sm:p-8 shadow-2xl shadow-cyan-950/20 relative z-10">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <AccountTypeSelector
              value={role}
              onChange={setRole}
            />

            {/* DADOS DA CONTA */}
            <div className="[&_button[type=submit]]:hidden">
              <RegisterForm
                role={role}
              fullName={fullName}
              phone={phone}
              password={password}
              confirmPassword={confirmPassword}
              registerLoading={otpLoading}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onFullNameChange={setFullName}
              onPhoneChange={setPhone}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={
                setConfirmPassword
              }
              onTogglePassword={() =>
                setShowPassword(v => !v)
              }
                onToggleConfirmPassword={() =>
                  setShowConfirmPassword(v => !v)
                }
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">

              <label className="text-[10px] uppercase tracking-widest font-mono text-cyan-200/70 font-bold">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-200/40"
                />

                <input
                  type="email"
                  value={email}
                  onChange={e =>
                    setEmail(e.target.value)
                  }
                  placeholder="seuemail@exemplo.com"
                  className="w-full p-3.5 pl-11 rounded-xl bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-mono text-white transition-all duration-200 placeholder:text-cyan-200/30 focus:outline-none"
                />

              </div>

            </div>

            {/* ÚNICO BOTÃO DE CRIAÇÃO DA CONTA */}
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/30 active:scale-[0.98]"
            >
              {otpLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Enviando código...
                </>
              ) : (
                role === "AGENT"
                  ? "Criar conta de Agente"
                  : "Criar conta de Cliente"
              )}
            </button>

          </form>

          {/* LOGIN */}
          <div className="mt-6 border-t border-cyan-500/10 pt-5 text-center font-mono">

            <p className="text-xs text-cyan-200/70">
              Já possui conta?{" "}

              <Link
                to="/login"
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
              >
                Entrar
              </Link>
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          MODAL DE CONFIRMAÇÃO DO EMAIL
         ===================================================== */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6 overflow-y-auto">

          <div className="w-full max-w-md my-auto">

            <div className="relative rounded-3xl border border-cyan-500/20 bg-[#0e364a] p-6 sm:p-8 shadow-2xl shadow-black/40">

              {/* FECHAR */}
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                disabled={registerLoading}
                className="absolute right-4 top-4 w-9 h-9 rounded-full flex items-center justify-center text-cyan-200/50 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              {/* ÍCONE */}
              <div className="flex justify-center mb-5">

                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                  <Mail
                    size={24}
                    className="text-cyan-400"
                  />

                </div>

              </div>

              {/* TÍTULO */}
              <div className="text-center space-y-2">

                <h2 className="text-xl font-bold text-white font-mono">
                  Confirmar email
                </h2>

                <p className="text-xs text-cyan-200/70 font-mono leading-relaxed">
                  Enviámos um código de confirmação para:
                </p>

                <p className="text-sm font-semibold text-cyan-300 break-all">
                  {email}
                </p>

              </div>

              {/* FORM OTP */}
              <form
                onSubmit={handleConfirmRegistration}
                className="mt-6 space-y-5"
              >

                <div className="space-y-1.5">

                  <label className="text-[10px] uppercase tracking-widest font-mono text-cyan-200/70 font-bold">
                    Código de confirmação
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={e =>
                      setCode(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="000000"
                    autoFocus
                    className="w-full p-4 rounded-xl bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-center text-xl font-bold tracking-[0.5em] font-mono text-white transition-all duration-200 placeholder:text-cyan-200/20 focus:outline-none"
                  />

                </div>

                {/* CONFIRMAR */}
                <button
                  type="submit"
                  disabled={
                    registerLoading ||
                    code.length < 4
                  }
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
                >

                  {registerLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Confirmar e criar conta"
                  )}

                </button>

              </form>

              {/* REENVIO */}
              <div className="mt-5 text-center">

                {secondsLeft > 0 ? (

                  <p className="text-[11px] text-cyan-200/50 font-mono">

                    Poderá solicitar um novo código em{" "}

                    <span className="text-cyan-300 font-bold">
                      {secondsLeft}s
                    </span>

                  </p>

                ) : (

                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={otpLoading}
                    className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold transition-colors disabled:opacity-50"
                  >

                    <RefreshCw
                      size={14}
                      className={
                        otpLoading
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {otpLoading
                      ? "Enviando..."
                      : "Enviar novo código"}

                  </button>

                )}

              </div>

              {/* AVISO */}
              <p className="mt-5 text-[10px] text-cyan-200/40 text-center font-mono leading-relaxed">
                Verifique também a pasta de spam ou lixo eletrónico
                caso o código não apareça na caixa de entrada.
              </p>

              {/* VOLTAR */}
              {!registerLoading && (
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false)
                    setCode("")
                  }}
                  className="w-full mt-5 pt-4 border-t border-cyan-500/10 text-[11px] text-cyan-200/50 hover:text-cyan-300 font-mono transition-colors"
                >
                  Voltar e corrigir os dados
                </button>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  )
}