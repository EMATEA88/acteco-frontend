import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash, ArrowLeft, PaperPlaneTilt, CheckCircle } from '@phosphor-icons/react'
import { requestResetOtp, resetPassword } from '../services/api'
import Toast from '../components/ui/Toast'

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
    if (!email) return showError('Informe o seu email institucional')
    try {
      setOtpLoading(true)
      await requestResetOtp(email)
      setOtpSent(true)
      showSuccess('Código de segurança enviado com sucesso')
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Erro ao processar solicitação')
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !code || !newPassword) return showError('Preencha todos os campos obrigatórios')

    try {
      setResetLoading(true)
      await resetPassword(email, newPassword, code)
      showSuccess('Segurança atualizada! Password redefinida.')
      setTimeout(() => navigate('/login-user'), 2000)
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Falha na redefinição')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 selection:bg-green-500/30">
      
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-white/5 overflow-hidden bg-[#111] flex items-center justify-center shadow-2xl">
              <img src="/logo.png" className="w-full h-full object-cover rounded-full" alt="EMATEA" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Redefinir Acesso
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Proteja a sua conta com uma nova password forte.
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleReset} className="space-y-6">
            
            {/* CAMPO DE EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                E-mail de Recuperação
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  disabled={otpSent}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="flex-1 bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 text-sm transition-all outline-none disabled:opacity-50"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={otpLoading}
                    className="bg-white text-black px-4 rounded-2xl font-bold text-xs hover:bg-green-500 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {otpLoading ? '...' : <PaperPlaneTilt size={18} />}
                  </button>
                )}
              </div>
            </div>

            {/* CAMPOS REVELADOS APÓS ENVIO DO OTP */}
            {otpSent && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Código de Verificação
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Introduza o código de 6 dígitos"
                    className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 text-sm transition-all outline-none text-center tracking-[0.5em] font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Nova Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 text-sm transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-green-600 text-white hover:bg-green-500 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-[0.98]"
                >
                  {resetLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Confirmar Nova Password
                      <CheckCircle size={20} weight="fill" />
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                to="/login-user"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                Voltar ao login
              </Link>
            </div>
          </form>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
            Sistema de Recuperação Seguro • EMATEA 2026
          </p>
        </footer>
      </div>
    </div>
  )
}