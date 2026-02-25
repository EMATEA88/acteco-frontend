import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import {
  requestResetOtp,
  resetPassword
} from '../services/api'
import Toast from '../components/ui/Toast'
import { Eye, EyeSlash } from '@phosphor-icons/react'

export default function ResetPassword() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const [otpLoading, setOtpLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

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
      await requestResetOtp(email)
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

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !code || !newPassword) {
      showError('Preencha todos os campos')
      return
    }

    try {
      setResetLoading(true)

      await resetPassword(email, newPassword, code)

      showSuccess('Password redefinida com sucesso')

      setTimeout(() => navigate('/login'), 1000)

    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
        'Erro ao redefinir password'
      )
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Redefinir Password"
      subtitle="Recupere o acesso à sua conta"
    >

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <form onSubmit={handleReset} className="space-y-5">

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
            {otpLoading ? 'Enviando...' : 'Enviar código'}
          </button>
        </div>

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Código recebido"
              className="input-dark"
              value={code}
              onChange={e => setCode(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nova password"
                className="input-dark pr-12"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="
                w-full h-12 rounded-xl font-semibold
                bg-emerald-600 hover:bg-emerald-700
                active:scale-95 transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {resetLoading ? 'Redefinindo…' : 'Redefinir password'}
            </button>
          </>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            Voltar ao login
          </Link>
        </div>

      </form>
    </AuthLayout>
  )
}