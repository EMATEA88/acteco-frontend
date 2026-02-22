import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { PasswordService } from '../services/password.service'

export default function Password() {

  const navigate = useNavigate()

  /* ================= STATE ================= */

  const [loginCurrent, setLoginCurrent] = useState('')
  const [loginNew, setLoginNew] = useState('')

  const [withdrawCurrent, setWithdrawCurrent] = useState('')
  const [withdrawNew, setWithdrawNew] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  /* ================= HELPERS ================= */

  function showError(text: string) {
    setMessage({ type: 'error', text })
  }

  function showSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  /* ================= ACTIONS ================= */

  async function handleLoginPasswordChange() {
    setMessage(null)

    if (!loginCurrent || !loginNew) {
      showError('Preencha todos os campos da senha de login')
      return
    }

    if (loginNew.length < 6) {
      showError('A nova senha deve ter pelo menos 6 caracteres')
      return
    }

    try {
      setLoading(true)

      await PasswordService.changeLoginPassword({
        currentPassword: loginCurrent,
        newPassword: loginNew,
      })

      showSuccess('Senha de login alterada com sucesso')
      setLoginCurrent('')
      setLoginNew('')

    } catch (err: any) {
      showError(
        err?.response?.data?.error ??
        'Erro ao alterar senha de login'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdrawPasswordChange() {
    setMessage(null)

    if (!withdrawNew) {
      showError('Informe a nova senha de levantamento')
      return
    }

    if (withdrawNew.length < 4) {
      showError('A senha deve ter pelo menos 4 dígitos')
      return
    }

    try {
      setLoading(true)

      await PasswordService.changeWithdrawPassword({
        currentWithdrawPassword:
          withdrawCurrent || undefined,
        newWithdrawPassword: withdrawNew,
      })

      showSuccess('Senha de levantamento definida com sucesso')
      setWithdrawCurrent('')
      setWithdrawNew('')

    } catch (err: any) {
      showError(
        err?.response?.data?.error ??
        'Erro ao definir senha de levantamento'
      )
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white">

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4 flex items-center gap-4">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-lg font-semibold tracking-wide">
          Segurança de Senha
        </h1>

      </div>

      <div className="px-6 py-8 space-y-8 max-w-xl mx-auto pb-28">

        {/* FEEDBACK */}
        {message && (
          <div
            className={`
              flex items-center gap-3 text-sm rounded-2xl p-4
              ${message.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/15 text-red-400 border border-red-500/20'}
            `}
          >
            {message.type === 'success'
              ? <CheckCircle size={18} />
              : <AlertCircle size={18} />
            }

            {message.text}
          </div>
        )}

        {/* LOGIN PASSWORD CARD */}
        <div className="
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-8
          shadow-2xl
          space-y-6
        ">

          <div className="flex items-center gap-3 text-emerald-400">
            <Lock size={20} />
            <h2 className="font-semibold text-white">
              Senha de login
            </h2>
          </div>

          <Input
            type="password"
            placeholder="Senha atual"
            value={loginCurrent}
            onChange={setLoginCurrent}
          />

          <Input
            type="password"
            placeholder="Nova senha"
            value={loginNew}
            onChange={setLoginNew}
          />

          <PrimaryButton
            onClick={handleLoginPasswordChange}
            loading={loading}
          >
            Alterar senha de login
          </PrimaryButton>

        </div>

        {/* WITHDRAW PASSWORD CARD */}
        <div className="
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-8
          shadow-2xl
          space-y-6
        ">

          <div className="flex items-center gap-3 text-emerald-400">
            <Lock size={20} />
            <h2 className="font-semibold text-white">
              Senha de levantamento
            </h2>
          </div>

          <Input
            type="password"
            placeholder="Senha atual (se existir)"
            value={withdrawCurrent}
            onChange={setWithdrawCurrent}
          />

          <Input
            type="password"
            placeholder="Nova senha de levantamento"
            value={withdrawNew}
            onChange={setWithdrawNew}
          />

          <PrimaryButton
            onClick={handleWithdrawPasswordChange}
            loading={loading}
          >
            Definir senha de levantamento
          </PrimaryButton>

        </div>

      </div>
    </div>
  )
}

/* ============================= */
/* COMPONENTES REUTILIZÁVEIS */
/* ============================= */

function Input({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="
        w-full h-12 rounded-xl
        bg-white/5
        border border-white/10
        px-4 text-sm text-white
        focus:ring-2 focus:ring-emerald-500
        focus:border-emerald-500
        outline-none
        transition
      "
    />
  )
}

function PrimaryButton({
  children,
  onClick,
  loading,
}: {
  children: React.ReactNode
  onClick: () => void
  loading: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        w-full h-12 rounded-xl font-semibold
        bg-emerald-600 text-white
        hover:bg-emerald-700 transition
        active:scale-95 disabled:opacity-50
      "
    >
      {loading ? 'Processando…' : children}
    </button>
  )
}