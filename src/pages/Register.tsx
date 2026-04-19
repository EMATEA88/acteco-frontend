import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash, UserPlus } from '@phosphor-icons/react'
import { requestRegisterOtp, registerUser } from '../services/api'
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
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 3000)
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
    if (!email) return showError('Informe o e-mail')

    try {
      setOtpLoading(true)
      await requestRegisterOtp(email)
      setOtpSent(true)
      showSuccess('Código enviado')
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Erro ao enviar código')
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!phone || !email || !password || !confirmPassword || !code) {
      return showError('Preencha todos os campos')
    }

    if (password !== confirmPassword) {
      return showError('Passwords não coincidem')
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

      setTimeout(() => navigate('/login-user'), 1500)
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Erro no registo')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center px-5">

      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#111318] border border-white/5 flex items-center justify-center mb-3">
            <img src="/logo.png" className="w-full h-full object-contain p-1.5 rounded-full" />
          </div>

          <h1 className="text-lg font-semibold">Criar conta</h1>
          <p className="text-xs text-gray-500">Registo seguro</p>
        </div>

        {/* CARD */}
        <div className="bg-[#111318] border border-white/5 rounded-xl p-5">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* PHONE */}
            <div className="flex">
              <div className="flex items-center px-3 bg-[#0B0E11] border border-white/5 rounded-l-lg text-xs text-gray-400">
                +244
              </div>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="923000000"
                className="flex-1 h-11 bg-[#0B0E11] border border-white/5 border-l-0 rounded-r-lg px-3 text-sm outline-none"
              />
            </div>

            {/* EMAIL + OTP */}
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email"
                className="flex-1 h-11 bg-[#0B0E11] border border-white/5 rounded-lg px-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={otpLoading || otpSent}
                className="px-3 text-xs bg-white text-black rounded-lg disabled:opacity-50"
              >
                {otpSent ? 'OK' : otpLoading ? '...' : 'OTP'}
              </button>
            </div>

            {/* OTP */}
            {otpSent && (
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Código"
                className="w-full h-11 bg-[#0B0E11] border border-emerald-500/30 rounded-lg px-3 text-sm text-center tracking-widest outline-none"
              />
            )}

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-11 bg-[#0B0E11] border border-white/5 rounded-lg px-3 text-sm outline-none"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CONFIRM */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirmar password"
                className="w-full h-11 bg-[#0B0E11] border border-white/5 rounded-lg px-3 text-sm outline-none"
              />
              <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full h-11 rounded-lg bg-white text-black text-sm font-semibold hover:bg-emerald-500 hover:text-white transition flex items-center justify-center gap-2"
            >
              {registerLoading
                ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                : <>
                    Criar conta
                    <UserPlus size={16} />
                  </>
              }
            </button>

            {/* LOGIN */}
            <div className="text-center text-xs text-gray-500">
              Já tem conta?{' '}
              <Link to="/login-user" className="text-white">
                Entrar
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}