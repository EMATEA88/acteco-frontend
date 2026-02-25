import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import AuthLayout from '../layouts/AuthLayout'
import {
  requestRegisterOtp,
  registerUser
} from '../services/api'
import Toast from '../components/ui/Toast'

export default function Register() {

  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [otpLoading, setOtpLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] =
    useState<'success' | 'error'>('success')

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2500)
    return () => clearTimeout(t)
  }, [toastVisible])

  function showError(msg: string) {
    setToastType('error')
    setToastMessage(msg)
    setToastVisible(true)
  }

  function showSuccess(msg: string) {
    setToastType('success')
    setToastMessage(msg)
    setToastVisible(true)
  }

  async function handleRequestOtp() {

    if (!email) {
      showError('Informe o email')
      return
    }

    try {
      setOtpLoading(true)
      await requestRegisterOtp(email)
      setOtpSent(true)
      showSuccess('Código enviado para o email')
    } catch (err: any) {
      showError(
        err?.response?.data?.message || 'Erro ao enviar código'
      )
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!phone || !email || !password || !confirmPassword || !code) {
      showError('Preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      showError('As passwords não coincidem')
      return
    }

    try {
      setRegisterLoading(true)

      await registerUser(
        `+244${phone.replace(/\D/g, '')}`,
        email,
        password,
        code
      )

      showSuccess('Conta criada com sucesso')

      setTimeout(() => navigate('/login'), 1000)

    } catch (err: any) {
      showError(
        err?.response?.data?.message || 'Erro ao criar conta'
      )
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Registe-se para começar"
    >

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          type="text"
          placeholder="Telefone"
          className="input-dark"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email"
            className="input-dark flex-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button
            type="button"
            onClick={handleRequestOtp}
            disabled={otpLoading}
            className="
              px-4 rounded-xl text-sm font-medium
              bg-emerald-600 hover:bg-emerald-700
              active:scale-95 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {otpLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>

        {otpSent && (
          <input
            type="text"
            placeholder="Código recebido"
            className="input-dark"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
        )}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="input-dark pr-12"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar password"
            className="input-dark pr-12"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={registerLoading}
          className="
            w-full h-12 rounded-xl font-semibold
            bg-emerald-600 hover:bg-emerald-700
            active:scale-95 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {registerLoading ? 'Criando…' : 'Criar conta'}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            Já tenho conta
          </Link>
        </div>

      </form>
    </AuthLayout>
  )
}