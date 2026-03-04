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

  const [loginCurrent, setLoginCurrent] = useState('')
  const [loginNew, setLoginNew] = useState('')
  const [loginOtp, setLoginOtp] = useState('')

  const [withdrawCurrent, setWithdrawCurrent] = useState('')
  const [withdrawNew, setWithdrawNew] = useState('')
  const [withdrawOtp, setWithdrawOtp] = useState('')

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  function showError(text: string) {
    setMessage({ type: 'error', text })
  }

  function showSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  async function handleLoginPasswordChange() {
    setMessage(null)

    if (!loginCurrent || !loginNew || !loginOtp) {
      showError('Preencha todos os campos da senha de login e o código OTP')
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
        otp: loginOtp
      })

      showSuccess('Senha de login alterada com sucesso')

      setLoginCurrent('')
      setLoginNew('')
      setLoginOtp('')

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

    if (!withdrawNew || !withdrawOtp) {
      showError('Informe a nova senha de levantamento e o código OTP')
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
        otp: withdrawOtp
      })

      showSuccess('Senha de levantamento definida com sucesso')

      setWithdrawCurrent('')
      setWithdrawNew('')
      setWithdrawOtp('')

    } catch (err: any) {

      showError(
        err?.response?.data?.error ??
        'Erro ao definir senha de levantamento'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF]">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#1E2329] border-b border-[#2B3139] px-6 py-4 flex items-center gap-4">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-[#2B3139] hover:bg-[#3A424D] transition"
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
              flex items-center gap-3 text-sm rounded-2xl p-4 border
              ${message.type === 'success'
                ? 'bg-[#1E2329] text-[#FCD535] border-[#FCD535]/40'
                : 'bg-[#1E2329] text-[#EF4444] border-[#EF4444]/40'}
            `}
          >
            {message.type === 'success'
              ? <CheckCircle size={18} />
              : <AlertCircle size={18} />
            }

            {message.text}
          </div>
        )}

        {/* LOGIN CARD */}
        <div className="
          bg-[#1E2329]
          border border-[#2B3139]
          rounded-3xl
          p-8
          space-y-6
        ">

          <div className="flex items-center gap-3 text-[#FCD535]">
            <Lock size={20} />
            <h2 className="font-semibold">
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

          <Input
            type="text"
            placeholder="Código OTP enviado ao email"
            value={loginOtp}
            onChange={setLoginOtp}
          />

          <PrimaryButton
            onClick={handleLoginPasswordChange}
            loading={loading}
          >
            Alterar senha de login
          </PrimaryButton>

        </div>

        {/* WITHDRAW CARD */}
        <div className="
          bg-[#1E2329]
          border border-[#2B3139]
          rounded-3xl
          p-8
          space-y-6
        ">

          <div className="flex items-center gap-3 text-[#FCD535]">
            <Lock size={20} />
            <h2 className="font-semibold">
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

          <Input
            type="text"
            placeholder="Código OTP"
            value={withdrawOtp}
            onChange={setWithdrawOtp}
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

/* ================= COMPONENTES ================= */

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
        bg-[#1E2329]
        border border-[#2B3139]
        px-4 text-sm text-[#EAECEF]
        placeholder-[#848E9C]
        focus:border-[#FCD535]
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
        bg-[#FCD535] text-black
        hover:brightness-110 transition
        active:scale-95 disabled:opacity-50
      "
    >
      {loading ? 'Processando…' : children}
    </button>
  )
}