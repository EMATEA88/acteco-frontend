import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  EnvelopeSimple,
  Key,
  LockKey,
  WarningCircle,
} from '@phosphor-icons/react'
import { PasswordService } from '../services/password.service'
import { UserService } from '../services/user.service'
import { api } from '../services/api'

type Feedback = {
  type: 'success' | 'error'
  text: string
}

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
  const [sendingLoginOtp, setSendingLoginOtp] = useState(false)
  const [sendingWithdrawOtp, setSendingWithdrawOtp] = useState(false)

  const [loginCountdown, setLoginCountdown] = useState(0)
  const [withdrawCountdown, setWithdrawCountdown] = useState(0)

  const [userEmail, setUserEmail] = useState('')
  const [message, setMessage] = useState<Feedback | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await UserService.me()
        setUserEmail(user.email || '')
      } catch (error) {
        console.error('Erro ao carregar email do utilizador:', error)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (loginCountdown <= 0) return

    const timer = window.setTimeout(
      () => setLoginCountdown(current => Math.max(0, current - 1)),
      1000,
    )

    return () => window.clearTimeout(timer)
  }, [loginCountdown])

  useEffect(() => {
    if (withdrawCountdown <= 0) return

    const timer = window.setTimeout(
      () => setWithdrawCountdown(current => Math.max(0, current - 1)),
      1000,
    )

    return () => window.clearTimeout(timer)
  }, [withdrawCountdown])

  function showError(text: string) {
    setMessage({ type: 'error', text })
  }

  function showSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  async function handleSendOtp(type: 'RESET_PASSWORD' | 'WITHDRAW') {
    setMessage(null)

    if (!userEmail) {
      showError('A conta não possui um endereço de e-mail configurado.')
      return
    }

    const isLogin = type === 'RESET_PASSWORD'

    if (isLogin) {
      if (sendingLoginOtp || loginCountdown > 0) return
      setSendingLoginOtp(true)
    } else {
      if (sendingWithdrawOtp || withdrawCountdown > 0) return
      setSendingWithdrawOtp(true)
    }

    try {
      await api.post('/otp/send', {
        target: userEmail,
        type,
      })

      showSuccess(`Código de verificação enviado para ${userEmail}.`)

      if (isLogin) {
        setLoginCountdown(60)
      } else {
        setWithdrawCountdown(60)
      }
    } catch (error: any) {
      console.error('OTP_SEND_ERROR:', error?.response?.data || error)

      showError(
        error?.response?.data?.error || 'Não foi possível enviar o código de verificação.',
      )
    } finally {
      if (isLogin) {
        setSendingLoginOtp(false)
      } else {
        setSendingWithdrawOtp(false)
      }
    }
  }

  async function handleLoginPasswordChange() {
    setMessage(null)

    if (!loginCurrent || !loginNew || !loginOtp) {
      showError('Preencha todos os campos para atualizar a senha de acesso.')
      return
    }

    if (loginNew.length < 6) {
      showError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }

    try {
      setLoadingLogin(true)

      await PasswordService.changeLoginPassword({
        currentPassword: loginCurrent,
        newPassword: loginNew,
        otp: loginOtp,
      })

      showSuccess('Senha de acesso atualizada com sucesso.')
      setLoginCurrent('')
      setLoginNew('')
      setLoginOtp('')
    } catch (error: any) {
      showError(
        error?.response?.data?.error || 'Não foi possível atualizar a senha de acesso.',
      )
    } finally {
      setLoadingLogin(false)
    }
  }

  async function handleWithdrawPasswordChange() {
    setMessage(null)

    if (!withdrawNew || !withdrawOtp) {
      showError('Preencha a nova senha de levantamento e o código de verificação.')
      return
    }

    try {
      setLoadingWithdraw(true)

      await PasswordService.changeWithdrawPassword({
        currentWithdrawPassword: withdrawCurrent || undefined,
        newWithdrawPassword: withdrawNew,
        otp: withdrawOtp,
      })

      showSuccess('Senha de levantamento configurada com sucesso.')
      setWithdrawCurrent('')
      setWithdrawNew('')
      setWithdrawOtp('')
    } catch (error: any) {
      showError(
        error?.response?.data?.error || 'Não foi possível atualizar a senha de levantamento.',
      )
    } finally {
      setLoadingWithdraw(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0A2533] px-4 py-5 pb-28 text-[#E0F2FE] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
        <PasswordSection
          icon={<LockKey size={21} weight="regular" />}
          title="Senha de acesso"
          description="Utilizada para entrar na sua conta EMATEA."
        >
          <div className="space-y-4">
            <FormField label="Senha atual">
              <AuthInput
                type="password"
                value={loginCurrent}
                onChange={setLoginCurrent}
                placeholder="Introduza a senha atual"
                autoComplete="current-password"
              />
            </FormField>

            <FormField label="Nova senha">
              <AuthInput
                type="password"
                value={loginNew}
                onChange={setLoginNew}
                placeholder="Mínimo de 6 caracteres"
                autoComplete="new-password"
              />
            </FormField>

            <OtpField
              value={loginOtp}
              onChange={setLoginOtp}
              sending={sendingLoginOtp}
              countdown={loginCountdown}
              onRequest={() => handleSendOtp('RESET_PASSWORD')}
            />

            <PrimaryButton
              onClick={handleLoginPasswordChange}
              loading={loadingLogin}
              disabled={!loginCurrent || !loginNew || !loginOtp}
            >
              Atualizar senha de acesso
            </PrimaryButton>
          </div>
        </PasswordSection>

        {message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              message.type === 'success'
                ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
                : 'border-red-500/25 bg-red-500/10 text-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0" />
            ) : (
              <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <PasswordSection
          icon={<Key size={21} weight="regular" />}
          title="Senha de levantamento"
          description="Utilizada para confirmar operações de levantamento."
        >
          <div className="space-y-4">
            <FormField label="Senha atual (opcional)">
              <AuthInput
                type="password"
                value={withdrawCurrent}
                onChange={setWithdrawCurrent}
                placeholder="Introduza a senha atual, se já existir"
                autoComplete="current-password"
              />
            </FormField>

            <FormField label="Nova senha de levantamento">
              <AuthInput
                type="password"
                value={withdrawNew}
                onChange={setWithdrawNew}
                placeholder="Defina a nova senha"
                autoComplete="new-password"
              />
            </FormField>

            <OtpField
              value={withdrawOtp}
              onChange={setWithdrawOtp}
              sending={sendingWithdrawOtp}
              countdown={withdrawCountdown}
              onRequest={() => handleSendOtp('WITHDRAW')}
            />

            <PrimaryButton
              onClick={handleWithdrawPasswordChange}
              loading={loadingWithdraw}
              disabled={!withdrawNew || !withdrawOtp}
            >
              Guardar senha de levantamento
            </PrimaryButton>
          </div>
        </PasswordSection>

        <p className="px-1 text-center text-[11px] leading-5 text-[#7899A7]">
          Nunca partilhe as suas senhas ou códigos de verificação com terceiros.
        </p>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="min-w-32 rounded-lg border border-[#2A6073] bg-[#103647] px-6 py-3 text-sm font-medium text-[#D8EAF0] transition-colors hover:bg-[#16465A] focus:outline-none focus:ring-2 focus:ring-[#19C5CE]/50"
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  )
}

function PasswordSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#24566A] bg-[#103647] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.12)] sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-[#24566A]/80 pb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#079CB3]/15 text-[#19C5CE]">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-[#A9C4CF]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-[#C2D7DF]">
        {label}
      </label>
      {children}
    </div>
  )
}

function AuthInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  autoComplete?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={event => onChange(event.target.value)}
      className="h-12 w-full rounded-lg border border-[#2A6073] bg-[#0A2533] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#7899A7] focus:border-[#19C5CE] focus:ring-2 focus:ring-[#19C5CE]/15"
    />
  )
}

function OtpField({
  value,
  onChange,
  sending,
  countdown,
  onRequest,
}: {
  value: string
  onChange: (value: string) => void
  sending: boolean
  countdown: number
  onRequest: () => void
}) {
  const disabled = sending || countdown > 0

  return (
    <FormField label="Código de verificação">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder="Introduza o código recebido por e-mail"
        autoComplete="one-time-code"
        className="h-12 w-full rounded-lg border border-[#2A6073] bg-[#0A2533] px-4 text-sm text-white outline-none transition-colors placeholder:text-[#7899A7] focus:border-[#19C5CE] focus:ring-2 focus:ring-[#19C5CE]/15"
      />

      <button
        type="button"
        onClick={onRequest}
        disabled={disabled}
        className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#2A6073] bg-[#123D50] px-3 text-xs font-semibold text-[#BFEAF0] transition-colors hover:bg-[#164B60] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <EnvelopeSimple size={15} weight="regular" />
        {sending
          ? 'A enviar código...'
          : countdown > 0
            ? `Pode solicitar novamente em ${countdown}s`
            : 'Enviar código de verificação'}
      </button>
    </FormField>
  )
}

function PrimaryButton({
  children,
  onClick,
  loading,
  disabled = false,
}: {
  children: ReactNode
  onClick: () => void
  loading: boolean
  disabled?: boolean
}) {
  const isDisabled = loading || disabled

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#079CB3] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#08AEC4] focus:outline-none focus:ring-2 focus:ring-[#19C5CE]/50 focus:ring-offset-2 focus:ring-offset-[#103647] disabled:cursor-not-allowed disabled:bg-[#315968] disabled:text-[#9AB5BF]"
    >
      {loading ? 'A processar...' : children}
    </button>
  )
}
