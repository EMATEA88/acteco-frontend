import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

import Toast from "../components/ui/Toast"

import AccountTypeSelector from "../components/auth/AccountTypeSelector"
import OtpSection from "../components/auth/OtpSection"
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

  // NOVO EFFECT: Temporizador para o reenvio do OTP
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

  // FUNÇÃO RECONFIGURADA: Gerencia os segundos restantes ao enviar com sucesso
  async function handleRequestOtp() {
    if (!email.includes("@")) {
      return notify("Informe um e-mail válido.")
    }

    try {
      setOtpLoading(true)

      await requestRegisterOtp(email)

      setSecondsLeft(60)

      notify(
        "Código enviado com sucesso.",
        "success"
      )
    } catch (err: any) {
      notify(
        err?.response?.data?.message ??
          "Erro ao enviar código."
      )
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault()

    if (
      !fullName ||
      !phone ||
      !email ||
      !password ||
      !code
    ) {
      return notify("Preencha todos os campos.")
    }

    if (password !== confirmPassword) {
      return notify("As senhas não coincidem.")
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

      notify(
        "Conta criada com sucesso.",
        "success"
      )

      setTimeout(() => {
        navigate("/login-user")
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
    <div className="min-h-screen bg-[#070d1a] flex items-center justify-center px-6 text-white">

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      <div className="w-full max-w-md py-10 space-y-8">

        <div className="text-center">

          <img
            src="/logo.png"
            alt="EMATEA"
            className="mx-auto mb-4 h-16 w-16 rounded-full"
          />

          <h1 className="text-2xl font-bold">
            Criar Conta
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Plataforma Oficial EMATEA
          </p>

        </div>

        <div className="rounded-3xl border border-white/5 bg-[#0b1220] p-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <AccountTypeSelector
              value={role}
              onChange={setRole}
            />

            {/* COMPONENTE ATUALIZADO: Passa as novas propriedades para o OtpSection */}
            <OtpSection
              email={email}
              code={code}
              otpLoading={otpLoading}
              secondsLeft={secondsLeft}
              onEmailChange={setEmail}
              onCodeChange={setCode}
              onRequestOtp={handleRequestOtp}
            />

            <RegisterForm
              role={role}
              fullName={fullName}
              phone={phone}
              password={password}
              confirmPassword={confirmPassword}
              registerLoading={registerLoading}
              showPassword={showPassword}
              showConfirmPassword={
                showConfirmPassword
              }
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

          </form>

          <div className="mt-6 border-t border-white/5 pt-5 text-center">

            <p className="text-xs text-gray-400">
              Já possui conta?
            </p>

            <Link
              to="/login-user"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Entrar
            </Link>

          </div>

        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">

          <ShieldCheck size={14} />

          <span>
            Plataforma protegida por criptografia.
          </span>

        </div>

      </div>

    </div>
  )
}