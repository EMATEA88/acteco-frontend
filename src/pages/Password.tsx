import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  LockKey,
  Key,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
  EnvelopeSimple
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

  const [loadingLogin, setLoadingLogin] = useState(false)
  const [loadingWithdraw, setLoadingWithdraw] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    let timer: any
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  function showError(text: string) {
    setMessage({ type: 'error', text })
  }

  function showSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  async function handleSendOtp() {
    setMessage(null)
    try {
      setSendingOtp(true)
      
      // Insira aqui a chamada real do seu serviço de OTP, caso exista:
      // await PasswordService.sendOtp()

      showSuccess('Código OTP enviado com sucesso para o seu contacto.')
      setCountdown(60)
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Erro ao enviar código OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  async function handleLoginPasswordChange() {
    setMessage(null)

    if (!loginCurrent || !loginNew || !loginOtp)
      return showError('Preencha todos os campos obrigatórios.')

    if (loginNew.length < 6)
      return showError('A nova senha deve ter pelo menos 6 caracteres.')

    try {
      setLoadingLogin(true)

      await PasswordService.changeLoginPassword({
        currentPassword: loginCurrent,
        newPassword: loginNew,
        otp: loginOtp
      })

      showSuccess('Senha de login atualizada com sucesso!')
      setLoginCurrent('')
      setLoginNew('')
      setLoginOtp('')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Erro ao atualizar senha de login.')
    } finally {
      setLoadingLogin(false)
    }
  }

  async function handleWithdrawPasswordCodeChange() {
    setMessage(null)

    if (!withdrawNew || !withdrawOtp)
      return showError('Preencha a nova senha e o código OTP.')

    try {
      setLoadingWithdraw(true)

      await PasswordService.changeWithdrawPassword({
        currentWithdrawPassword: withdrawCurrent || undefined,
        newWithdrawPassword: withdrawNew,
        otp: withdrawOtp
      })

      showSuccess('Senha de saque configurada com sucesso!')
      setWithdrawCurrent('')
      setWithdrawNew('')
      setWithdrawOtp('')
    } catch (err: any) {
      showError(err?.response?.data?.error || 'Erro ao definir senha de saque.')
    } finally {
      setLoadingWithdraw(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white selection:bg-[#02C076]/20">

      {/* HEADER PROFISSIONAL */}
      <header className="sticky top-0 z-50 bg-[#0B0E11]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] rounded-xl text-gray-300 transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-sm sm:text-base font-black tracking-wider uppercase font-mono">
              Credenciais & Segurança
            </h1>
          </div>
          <div className="text-[#02C076] bg-[#02C076]/10 border border-[#02C076]/20 p-2 rounded-xl">
            <ShieldCheck size={20} />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 pb-28 space-y-6">

        {/* FEEDBACK GLOBAL DE ALERTAS */}
        {message && (
          <div className={`flex items-center gap-3 text-xs rounded-xl p-4 border
            ${message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {message.type === 'success'
              ? <CheckCircle size={18} className="shrink-0" />
              : <WarningCircle size={18} className="shrink-0" />
            }
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* CARTÃO: SENHA DE LOGIN */}
        <div className="bg-[#12161C] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[#02C076]">
                <LockKey size={16} />
              </div>
              <h2 className="text-sm font-bold tracking-wide">Senha de Login</h2>
            </div>
            <span className="text-[10px] uppercase font-mono text-gray-500 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.04]">
              Acesso à conta
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Senha Atual</label>
              <AuthInput type="password" value={loginCurrent} onChange={setLoginCurrent} placeholder="Insira a sua senha atual" />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Nova Senha</label>
              <AuthInput type="password" value={loginNew} onChange={setLoginNew} placeholder="Mínimo de 6 caracteres" />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Código de Verificação (OTP)</label>
              <div className="relative flex items-center">
                <AuthInput type="text" value={loginOtp} onChange={setLoginOtp} placeholder="Digite o código OTP" />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || countdown > 0}
                  className="absolute right-2.5 px-3 py-1.5 bg-[#02C076]/10 hover:bg-[#02C076]/20 border border-[#02C076]/30 text-[#02C076] text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <EnvelopeSimple size={14} />
                  <span>{sendingOtp ? 'A enviar...' : countdown > 0 ? `Reenviar (${countdown}s)` : 'Pedir OTP'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton onClick={handleLoginPasswordChange} loading={loadingLogin}>
              Atualizar Senha de Login
            </PrimaryButton>
          </div>
        </div>

        {/* CARTÃO: SENHA DE SAQUE */}
        <div className="bg-[#12161C] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-emerald-400">
                <Key size={16} />
              </div>
              <h2 className="text-sm font-bold tracking-wide">Senha de Saque</h2>
            </div>
            <span className="text-[10px] uppercase font-mono text-gray-500 bg-white/[0.02] px-2 py-1 rounded border border-white/[0.04]">
              Financeiro
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">
                Senha de Saque Atual <span className="text-gray-600">(Opcional)</span>
              </label>
              <AuthInput type="password" value={withdrawCurrent} onChange={setWithdrawCurrent} placeholder="Senha atual de transações" />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Nova Senha de Saque</label>
              <AuthInput type="password" value={withdrawNew} onChange={setWithdrawNew} placeholder="Defina a nova senha financeira" />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Código de Verificação (OTP)</label>
              <div className="relative flex items-center">
                <AuthInput type="text" value={withdrawOtp} onChange={setWithdrawOtp} placeholder="Digite o código OTP" />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || countdown > 0}
                  className="absolute right-2.5 px-3 py-1.5 bg-[#02C076]/10 hover:bg-[#02C076]/20 border border-[#02C076]/30 text-[#02C076] text-xs font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <EnvelopeSimple size={14} />
                  <span>{sendingOtp ? 'A enviar...' : countdown > 0 ? `Reenviar (${countdown}s)` : 'Pedir OTP'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <PrimaryButton onClick={handleWithdrawPasswordCodeChange} loading={loadingWithdraw}>
              Definir / Atualizar Senha de Saque
            </PrimaryButton>
          </div>
        </div>

      </main>
    </div>
  )
}

/* COMPONENTES AUXILIARES */

function AuthInput({ value, onChange, placeholder, type = "text" }: any) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="
        w-full h-11 rounded-xl
        bg-[#0B0E11]
        border border-white/[0.06]
        px-4 text-xs sm:text-sm text-gray-200
        outline-none
        transition-all
        placeholder:text-gray-600
        focus:border-[#02C076]
        focus:bg-[#161b22]
      "
    />
  )
}

function PrimaryButton({ children, onClick, loading }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full h-11 rounded-xl font-semibold text-xs sm:text-sm transition-all
        flex items-center justify-center gap-2 shadow-lg cursor-pointer
        ${loading
          ? 'bg-white/10 text-gray-500 cursor-not-allowed'
          : 'bg-[#02C076] text-black hover:bg-[#02b06a] hover:shadow-[#02C076]/25'
        }
      `}
    >
      {loading ? 'A processar transação...' : children}
    </button>
  )
}