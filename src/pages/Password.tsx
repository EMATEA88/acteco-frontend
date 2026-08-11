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
import { UserService } from '../services/user.service'
import { api } from '../services/api'

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

  const [userEmail, setUserEmail] = useState('')

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await UserService.me()

        setUserEmail(user.email || '')
      } catch (err) {
        console.error(
          'Erro ao carregar email do utilizador:',
          err
        )
      }
    }

    loadUser()
  }, [])

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

  async function handleSendOtp(type: 'RESET_PASSWORD' | 'WITHDRAW') {
    setMessage(null)

    if (!userEmail) {
      return showError('A conta não possui um email configurado.')
    }

    try {
      setSendingOtp(true)

      await api.post('/otp/send', {
        target: userEmail,
        type
      })

      showSuccess(
        `Código OTP enviado para ${userEmail}.`
      )

      setCountdown(60)
    } catch (err: any) {
      console.error('OTP_SEND_ERROR:', err?.response?.data || err)

      showError(
        err?.response?.data?.error ||
        'Erro ao enviar código OTP.'
      )
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
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">

      {/* HEADER PROFISSIONAL */}
      <header className="sticky top-0 z-50 bg-[#0a2533]/90 backdrop-blur-xl border-b border-cyan-500/10">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-[#0e364a] border border-cyan-500/20 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">
              Credenciais & Segurança
            </h1>
          </div>
          <div className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 p-2.5 rounded-2xl shadow-sm">
            <ShieldCheck size={22} weight="fill" />
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 pb-32 space-y-6 relative">

        {/* LUZ DE FUNDO */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/[0.06] rounded-full filter blur-[100px] pointer-events-none"></div>

        {/* FEEDBACK GLOBAL DE ALERTAS */}
        {message && (
          <div className={`flex items-center gap-3 text-xs rounded-2xl p-4 border font-mono shadow-lg animate-in slide-in-from-top-4
            ${message.type === 'success'
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-cyan-950/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-950/20'
            }`}
          >
            {message.type === 'success'
              ? <CheckCircle size={18} weight="fill" className="shrink-0 text-cyan-400" />
              : <WarningCircle size={18} weight="fill" className="shrink-0 text-red-400" />
            }
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* CARTÃO: SENHA DE LOGIN */}
        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-cyan-950/20 relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                <LockKey size={20} weight="duotone" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider font-mono text-white">Senha de Login</h2>
            </div>
            <span className="text-[10px] uppercase font-mono text-cyan-200/70 bg-[#0a2533] px-3 py-1 rounded-full border border-cyan-500/20">
              Acesso à conta
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-cyan-200/70 mb-1.5 ml-1">Senha Atual</label>
              <AuthInput type="password" value={loginCurrent} onChange={setLoginCurrent} placeholder="Insira a sua senha atual" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-cyan-200/70 mb-1.5 ml-1">Nova Senha</label>
              <AuthInput type="password" value={loginNew} onChange={setLoginNew} placeholder="Mínimo de 6 caracteres" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-cyan-200/70 mb-1.5 ml-1">Código de Verificação (OTP)</label>
              <div className="relative flex items-center">
                <AuthInput type="text" value={loginOtp} onChange={setLoginOtp} placeholder="Digite o código OTP" />
                <button
                  type="button"
                  onClick={() => handleSendOtp('RESET_PASSWORD')}
                  disabled={sendingOtp || countdown > 0}
                  className="absolute right-2 px-3.5 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <EnvelopeSimple size={14} weight="bold" />
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
        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl shadow-cyan-950/20 relative z-10">
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                <Key size={20} weight="duotone" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider font-mono text-white">Senha de Saque</h2>
            </div>
            <span className="text-[10px] uppercase font-mono text-cyan-200/70 bg-[#0a2533] px-3 py-1 rounded-full border border-cyan-500/20">
              Financeiro
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-cyan-200/70 mb-1.5 ml-1">
                Senha de Saque Atual <span className="text-cyan-200/40 font-normal lowercase">(Opcional)</span>
              </label>
              <AuthInput type="password" value={withdrawCurrent} onChange={setWithdrawCurrent} placeholder="Senha atual de transações" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-cyan-200/70 mb-1.5 ml-1">Nova Senha de Saque</label>
              <AuthInput type="password" value={withdrawNew} onChange={setWithdrawNew} placeholder="Defina a nova senha financeira" />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest font-mono text-cyan-200/70 mb-1.5 ml-1">Código de Verificação (OTP)</label>
              <div className="relative flex items-center">
                <AuthInput type="text" value={withdrawOtp} onChange={setWithdrawOtp} placeholder="Digite o código OTP" />
                <button
                  type="button"
                  onClick={() => handleSendOtp('WITHDRAW')}
                  disabled={sendingOtp || countdown > 0}
                  className="absolute right-2 px-3.5 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <EnvelopeSimple size={14} weight="bold" />
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
        w-full h-14 rounded-2xl
        bg-[#0a2533]
        border border-cyan-500/20
        px-5 text-sm font-mono text-white
        outline-none
        transition-all
        placeholder:text-cyan-200/30
        focus:border-cyan-400
        focus:ring-4 focus:ring-cyan-500/10
      "
    />
  )
}

function PrimaryButton({ children, onClick, loading }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full h-16 rounded-2xl font-black font-mono text-xs uppercase tracking-widest transition-all
        flex items-center justify-center gap-2 shadow-xl cursor-pointer
        ${loading
          ? 'bg-cyan-500/10 text-cyan-200/40 border border-cyan-500/10 cursor-not-allowed shadow-none'
          : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-950/30 hover:shadow-cyan-950/50 active:scale-[0.98]'
        }
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  )
}