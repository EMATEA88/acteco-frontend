import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  LockKey,
  Key,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'
import { PasswordService } from '../services/password.service'

export default function Password() {
  const navigate = useNavigate()

  const [loginCurrent, setLoginCurrent] = useState('')
  const [loginNew, setLoginNew] = useState('')
  const [loginOtp, setLoginOtp] = useState('')

  const [withdrawCurrent, setWithdrawCurrent] = useState('')
  const [withdrawNew, setWithdrawNew] = useState('')
  const [withdrawOtp, setWithdrawOtp] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  function showError(text: string) {
    setMessage({ type: 'error', text })
  }

  function showSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  async function handleLoginPasswordChange() {
    setMessage(null)

    if (!loginCurrent || !loginNew || !loginOtp)
      return showError('Preencha todos os campos')

    if (loginNew.length < 6)
      return showError('Senha mínima: 6 caracteres')

    try {
      setLoading(true)

      await PasswordService.changeLoginPassword({
        currentPassword: loginCurrent,
        newPassword: loginNew,
        otp: loginOtp
      })

      showSuccess('Senha atualizada')

      setLoginCurrent('')
      setLoginNew('')
      setLoginOtp('')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Erro')
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdrawPasswordChange() {
    setMessage(null)

    if (!withdrawNew || !withdrawOtp)
      return showError('Preencha os campos')

    try {
      setLoading(true)

      await PasswordService.changeWithdrawPassword({
        currentWithdrawPassword: withdrawCurrent || undefined,
        newWithdrawPassword: withdrawNew,
        otp: withdrawOtp
      })

      showSuccess('Senha de saque definida')

      setWithdrawCurrent('')
      setWithdrawNew('')
      setWithdrawOtp('')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0B0E11]/80 backdrop-blur border-b border-white/5">
        <div className="max-w-xl mx-auto flex items-center gap-4 px-5 py-4">

          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 rounded-full"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-bold">Credenciais</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 pb-28 space-y-6">

        {/* FEEDBACK */}
        {message && (
          <div className={`flex items-center gap-2 text-xs rounded-xl p-3 border
            ${message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
          >
            {message.type === 'success'
              ? <CheckCircle size={14} />
              : <WarningCircle size={14} />
            }
            {message.text}
          </div>
        )}

        {/* LOGIN */}
        <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 space-y-4">

          <SectionHeader icon={<LockKey size={16} />} title="Senha de Login" />

          <AuthInput value={loginCurrent} onChange={setLoginCurrent} placeholder="Senha atual" />
          <AuthInput value={loginNew} onChange={setLoginNew} placeholder="Nova senha" />
          <AuthInput value={loginOtp} onChange={setLoginOtp} placeholder="Código OTP" />

          <PrimaryButton onClick={handleLoginPasswordChange} loading={loading}>
            Atualizar
          </PrimaryButton>
        </div>

        {/* WITHDRAW */}
        <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 space-y-4">

          <SectionHeader icon={<Key size={16} />} title="Senha de Saque" />

          <AuthInput value={withdrawCurrent} onChange={setWithdrawCurrent} placeholder="Senha atual (opcional)" />
          <AuthInput value={withdrawNew} onChange={setWithdrawNew} placeholder="Nova senha" />
          <AuthInput value={withdrawOtp} onChange={setWithdrawOtp} placeholder="Código OTP" />

          <PrimaryButton onClick={handleWithdrawPasswordChange} loading={loading}>
            Definir
          </PrimaryButton>
        </div>

      </main>
    </div>
  )
}

/* HEADER DE SECÇÃO */

function SectionHeader({ icon, title }: any) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
      <div className="text-emerald-500">{icon}</div>
      <p className="text-sm font-semibold">{title}</p>
    </div>
  )
}

/* INPUT PADRÃO */

function AuthInput({ value, onChange, placeholder }: any) {
  return (
    <input
      type="password"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="
        w-full h-11 rounded-xl
        bg-[#0B0E11]
        border border-white/5
        px-4 text-sm
        outline-none
        focus:border-emerald-500/30
      "
    />
  )
}

/* BOTÃO PADRÃO */

function PrimaryButton({ children, onClick, loading }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full h-11 rounded-xl font-semibold text-sm transition-all
        flex items-center justify-center gap-2
        ${loading
          ? 'bg-white/10 text-gray-500'
          : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
        }
      `}
    >
      {loading ? 'Processando...' : children}
    </button>
  )
}