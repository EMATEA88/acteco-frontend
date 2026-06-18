import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ShieldCheck,
  UserPlus,
  Phone
} from 'lucide-react'
import { requestRegisterOtp, registerUser } from '../services/api'
import Toast from '../components/ui/Toast'

export default function Register() {
  const navigate = useNavigate()

  // States de Dados
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  // States de UI
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' })

  useEffect(() => {
    if (!toast.visible) return
    const t = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
    return () => clearTimeout(t)
  }, [toast.visible])

  const notify = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ visible: true, message, type })
  }

  async function handleRequestOtp() {
    if (!email || !email.includes('@')) return notify('Informe um e-mail válido')

    try {
      setOtpLoading(true)
      await requestRegisterOtp(email)
      setOtpSent(true)
      notify('Código enviado com sucesso!', 'success')
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Erro ao enviar código.')
    } finally {
      setOtpLoading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!phone || !email || !password || !code) return notify('Preencha todos os campos')
    if (password !== confirmPassword) return notify('As senhas não coincidem')

    try {
      setRegisterLoading(true)
      await registerUser(`+244${phone.replace(/\D/g, '')}`, email, password, code)
      notify('Conta criada com sucesso!', 'success')
      setTimeout(() => navigate('/login-user'), 2000)
    } catch (err: any) {
      notify(err?.response?.data?.message || 'Erro no registro')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white flex items-center justify-center px-6 antialiased selection:bg-blue-500/30">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />

      <div className="w-full max-w-[420px] py-12 animate-in fade-in duration-500 space-y-8">
        
        {/* BRANDING */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border border-white/10 shadow-xl overflow-hidden mb-4 bg-[#0a1428] p-1">
            <img 
              src="/logo.png" 
              className="w-full h-full object-cover rounded-full" 
              alt="Logo EMATEA" 
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Criar Nova Conta</h1>
          <p className="text-xs text-gray-400 mt-1">Junte-se à nova era financeira em Angola</p>
        </div>

        {/* CONTAINER DO FORMULÁRIO */}
        <div className="bg-[#0b1220] border border-white/[0.04] rounded-3xl p-6 lg:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* TELEFONE */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
                Telefone
              </label>
              <div className="flex group relative rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500 transition-all duration-200">
                <div className="flex items-center px-4 border-r border-white/[0.05] text-xs font-mono text-gray-500">
                  +244
                </div>
                <div className="absolute left-20 top-1/2 -translate-y-1/2 text-gray-600">
                  <Phone size={14} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="923 000 000"
                  className="flex-1 p-3.5 pl-10 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
              </div>
            </div>

            {/* E-MAIL COM VALIDAÇÃO INLINE */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
                E-mail de Acesso
              </label>
              <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500 pr-2 transition-all duration-200 group">
                <div className="pl-4 text-gray-600">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@ematea.com"
                  className="flex-1 p-3.5 pl-3 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading || otpSent}
                  className="h-8 px-4 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-blue-500 disabled:opacity-30 disabled:bg-transparent disabled:text-emerald-400 transition-all font-sans"
                >
                  {otpSent ? 'Validado' : otpLoading ? '...' : 'Validar'}
                </button>
              </div>
            </div>

            {/* CÓDIGO OTP ANIMADO */}
            {otpSent && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold ml-1">
                  Código de Verificação
                </label>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="DIGITE O CÓDIGO RECEBIDO"
                  className="w-full p-3.5 bg-[#070d1a] border-2 border-emerald-500/20 focus:border-emerald-500 rounded-xl text-center text-emerald-400 font-mono font-bold tracking-[0.5em] text-sm transition-all focus:outline-none"
                />
              </div>
            )}

            {/* SENHA */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
                Senha de Segurança
              </label>
              <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500 pr-4 transition-all duration-200">
                <div className="pl-4 text-gray-600">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="flex-1 p-3.5 pl-3 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-mono text-gray-400 font-bold ml-1">
                Confirmar Senha
              </label>
              <div className="flex items-center rounded-xl bg-[#070d1a] border border-white/[0.05] focus-within:border-blue-500 pr-4 transition-all duration-200">
                <div className="pl-4 text-gray-600">
                  <Lock size={14} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha digitada"
                  className="flex-1 p-3.5 pl-3 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 hover:text-white transition-colors">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* BOTÃO SUBMIT */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 pt-4 shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 disabled:opacity-50 active:scale-[0.99]"
            >
              {registerLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Criar Minha Conta
                  <UserPlus size={16} />
                </>
              )}
            </button>

            {/* VOLTAR PRO LOGIN */}
            <div className="mt-6 pt-4 border-t border-white/[0.03] text-center">
              <p className="text-gray-400 text-xs">
                Já possui acesso?{' '}
                <Link 
                  to="/login-user" 
                  className="text-blue-400 font-bold hover:text-blue-300 transition-colors no-underline"
                >
                  Entrar na plataforma
                </Link>
              </p>
            </div>

          </form>
        </div>

        {/* COMPACT FOOTER */}
        <footer className="flex flex-col items-center gap-4 pt-2">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck size={14} className="text-blue-400" />
            <span className="text-[9px] uppercase tracking-wider font-mono text-gray-400">
              Criptografia ponta a ponta ativa
            </span>
          </div>

          <div className="flex justify-center gap-6 text-[10px] font-mono text-gray-500">
            <Link to="/terms" className="hover:text-gray-400 transition-colors no-underline">Termos</Link>
            <Link to="/privacy-policy" className="hover:text-gray-400 transition-colors no-underline">Privacidade</Link>
            <Link to="/about" className="hover:text-gray-400 transition-colors no-underline">Suporte</Link>
          </div>
        </footer>

      </div>
    </div>
  )
}