import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash, UserPlus, PaperPlaneTilt, ShieldCheck } from '@phosphor-icons/react'
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
    if (!email) return showError('Informe o seu e-mail para validar')
    try {
      setOtpLoading(true)
      await requestRegisterOtp(email)
      setOtpSent(true)
      showSuccess('Código de validação enviado!')
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Falha ao enviar código')
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone || !email || !password || !confirmPassword || !code) {
      return showError('Todos os campos são obrigatórios')
    }
    if (password !== confirmPassword) {
      return showError('As palavras-passe não coincidem')
    }

    try {
      setRegisterLoading(true)
      await registerUser(
        `+244${phone.replace(/\D/g, '')}`,
        email,
        password,
        code
      )
      showSuccess('Bem-vindo à EMATEA! Conta criada.')
      setTimeout(() => navigate('/login-user'), 2000)
    } catch (err: any) {
      showError(err?.response?.data?.message || 'Erro na criação da conta')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-10 selection:bg-green-500/30">
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      {/* BACKGROUND GLOW SUTIL */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-600/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-white/5 overflow-hidden bg-[#111] flex items-center justify-center shadow-2xl">
              <img src="/logo.png" className="w-full h-full object-cover rounded-full" alt="EMATEA" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Criar Conta
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Junte-se à nova era da tecnologia financeira.
          </p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="bg-[#111111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* TELEFONE */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Telemóvel</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold border-r border-white/10 pr-3">+244</span>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="923 000 000"
                  className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 pl-20 text-sm transition-all outline-none"
                />
              </div>
            </div>

            {/* EMAIL + OTP */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">E-mail</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="flex-1 bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 text-sm transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading || otpSent}
                  className={`px-4 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 ${otpSent ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-white text-black hover:bg-green-500 hover:text-white disabled:opacity-50'}`}
                >
                  {otpLoading ? '...' : otpSent ? <ShieldCheck size={20} /> : <PaperPlaneTilt size={20} />}
                </button>
              </div>
            </div>

            {/* CAMPO DE CÓDIGO (SÓ APARECE OU DESTACA APÓS O ENVIO) */}
            {otpSent && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-500 ml-1">Código de Verificação</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Introduza o código recebido"
                  className="w-full bg-[#1a1a1a] border border-green-500/30 focus:border-green-500/60 rounded-2xl p-4 text-sm transition-all outline-none font-bold tracking-[0.2em] text-center"
                />
              </div>
            )}

            {/* PASSWORDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 text-sm outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Confirmar</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-2xl p-4 text-sm outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* BOTÃO SUBMIT */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-white text-black hover:bg-green-500 hover:text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {registerLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  Concluir Registo
                  <UserPlus size={20} weight="bold" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Já tem uma conta?{' '}
                <Link to="/login-user" className="text-green-500 font-bold hover:underline">Entrar agora</Link>
              </p>
            </div>
          </form>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.4em] leading-relaxed">
            Ao registar-se, concorda com os nossos <br/> Termos e Políticas de Privacidade.
          </p>
        </footer>
      </div>
    </div>
  )
}