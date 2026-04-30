import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Eye, 
  EyeSlash, 
  EnvelopeSimple, 
  LockSimple, 
  ShieldCheck,
  UserPlus 
} from '@phosphor-icons/react'
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
    <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center px-6 selection:bg-emerald-500/30">
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />

      <div className="w-full max-w-[400px] animate-in fade-in duration-500">
        
        {/* LOGO CIRCULAR ESTILO LOGIN - TOTALMENTE PRETO */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden mb-4">
            <img 
              src="/logo.png" 
              className="w-full h-full object-cover scale-110" 
              alt="Logo Ematéia" 
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Abra sua conta</h1>
          <p className="text-xs text-gray-500 mt-2">Junte-se à nova era financeira</p>
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div className="bg-[#181A20] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TELEFONE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] ml-1">
                Telefone
              </label>
              <div className="flex group">
                <div className="flex items-center px-4 bg-[#1E2329] border border-white/10 border-r-0 rounded-l-2xl text-sm font-bold text-gray-400 group-focus-within:border-emerald-500/40 transition-all">
                  +244
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="923 000 000"
                  className="flex-1 h-14 bg-[#1E2329] border border-white/10 rounded-r-2xl px-4 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-[#474D57]"
                />
              </div>
            </div>

            {/* E-MAIL (Corrigido Fundo Branco) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] ml-1">
                E-mail de Acesso
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <EnvelopeSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474D57] group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    // CORREÇÃO: h-14 e bg-[#1E2329] definidos explicitamente
                    className="w-full h-14 bg-[#1E2329] border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-[#474D57]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={otpLoading || otpSent}
                  className="px-6 bg-emerald-500 text-black text-[10px] font-black uppercase rounded-2xl hover:bg-emerald-400 disabled:opacity-30 transition-all shadow-lg shadow-emerald-500/10"
                >
                  {otpSent ? 'OK' : otpLoading ? '...' : 'Validar'}
                </button>
              </div>
            </div>

            {/* OTP CODE */}
            {otpSent && (
              <div className="animate-in fade-in zoom-in duration-300">
                <input
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="DIGITE O CÓDIGO"
                  className="w-full h-14 bg-[#1E2329] border-2 border-emerald-500/20 rounded-2xl text-center text-emerald-500 font-mono font-bold tracking-[0.5em] outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            )}

            {/* SENHA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] ml-1">
                Senha de Segurança
              </label>
              <div className="relative group">
                <LockSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474D57] group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full h-14 bg-[#1E2329] border border-white/10 rounded-2xl pl-12 pr-12 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-[#474D57]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#474D57] hover:text-white transition-colors">
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR SENHA */}
            <div className="relative group">
              <LockSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474D57] group-focus-within:text-emerald-500 transition-colors" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full h-14 bg-[#1E2329] border border-white/10 rounded-2xl pl-12 pr-12 text-sm text-white outline-none focus:border-emerald-500/40 transition-all placeholder:text-[#474D57]"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#474D57] hover:text-white transition-colors">
                {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BOTÃO FINAL */}
            <button
              type="submit"
              disabled={registerLoading}
              className="w-full h-14 bg-[#FCD535] text-[#181A20] text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#f3ca2f] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {registerLoading ? (
                <div className="w-5 h-5 border-3 border-[#181A20]/20 border-t-[#181A20] rounded-full animate-spin" />
              ) : (
                <>
                  Concluir Cadastro
                  <UserPlus size={20} weight="bold" />
                </>
              )}
            </button>

            {/* LINK LOGIN */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-[#848E9C] text-[11px] font-medium tracking-wide">
                Já possui acesso?{' '}
                <Link 
                  to="/login-user" 
                  className="text-white font-bold hover:text-emerald-500 transition-colors no-underline"
                >
                  Entrar na plataforma
                </Link>
              </p>
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <footer className="mt-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-40 cursor-default">
            <ShieldCheck size={16} weight="bold" className="text-emerald-500" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white">
              Segurança de nível bancário ativada
            </span>
          </div>

          <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-[#474D57]">
            <Link to="/terms" className="hover:text-[#848E9C] transition-colors no-underline">Termos</Link>
            <Link to="/privacy-policy" className="hover:text-[#848E9C] transition-colors no-underline">Privacidade</Link>
            <Link to="/about" className="hover:text-[#848E9C] transition-colors no-underline">Suporte</Link>
          </div>
        </footer>

      </div>
    </div>
  )
}