import { useState, useContext, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { 
  Eye, 
  EyeSlash, 
  ArrowRight, 
  User, 
  LockSimple, 
  ShieldCheck 
} from '@phosphor-icons/react'
import { loginUser } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'
import { toast } from 'sonner'

export default function LoginUser() {
  const { login } = useContext(AuthContext)

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const isPhone = /^\d+$/.test(identifier.replace(/\s/g, ''))

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 9)
    return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }

  function handleIdentifierChange(value: string) {
    if (/^\d*$/.test(value.replace(/\s/g, ''))) {
      setIdentifier(formatPhone(value))
    } else {
      setIdentifier(value)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (loading) return

    try {
      setLoading(true)
      let finalIdentifier = identifier.trim()
      
      if (isPhone) {
        const clean = identifier.replace(/\s/g, '')
        if (clean.length !== 9) {
           toast.error('O número deve ter 9 dígitos')
           setLoading(false)
           return
        }
        finalIdentifier = `+244${clean}`
      }

      if (!finalIdentifier) {
        toast.error('Introduza o seu e-mail ou telefone')
        setLoading(false)
        return
      }

      if (!password) {
        toast.error('Introduza a sua palavra-passe')
        setLoading(false)
        return
      }

      const data = await loginUser(finalIdentifier, password)
      await login(data.token)
      
      toast.success('Acesso autorizado. Bem-vindo de volta!')

      setTimeout(() => {
        window.location.href = '/home'
      }, 800)
      
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 404) {
        toast.error('E-mail ou telefone não encontrado.')
      } else if (status === 401) {
        toast.error('Palavra-passe incorreta.')
      } else {
        toast.error('Falha na autenticação. Verifique os dados.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] flex items-center justify-center px-6 selection:bg-emerald-500/30 relative overflow-hidden font-sans">
      
      {/* GLOW DE FUNDO (Sutil) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* LOGO (Exatamente igual ao Registro) */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden mb-6">
            <img 
              src="/logo.png" 
              className="w-full h-full object-cover scale-110" 
              alt="EMATEA Logo" 
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">EMATEA</h1>
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mt-2">
            Finance Management
          </p>
        </div>

        {/* CARD DE LOGIN */}
        <div className="bg-[#181A20] p-8 rounded-[2.5rem] border border-white/5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Detalhe de luz no topo do card */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* CAMPO: ACESSO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#848E9C] ml-1">
                Acesso à Conta
              </label>
              <div className="relative group">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474D57] group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => handleIdentifierChange(e.target.value)}
                  placeholder="E-mail ou Telefone"
                  className="w-full h-14 bg-[#1E2329] border border-white/5 focus:border-emerald-500/40 rounded-2xl pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-[#474D57]"
                />
              </div>
            </div>

            {/* CAMPO: SENHA */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#848E9C]">
                  Palavra-passe
                </label>
                <Link 
                  to="/reset-password" 
                  className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                >
                  Recuperar
                </Link>
              </div>
              
              <div className="relative group">
                <LockSimple size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#474D57] group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-14 bg-[#1E2329] border border-white/5 focus:border-emerald-500/40 rounded-2xl pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-[#474D57]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#474D57] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* BOTÃO PRINCIPAL */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#FCD535] text-[#181A20] hover:bg-[#f3ca2f] rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 shadow-[0_8px_24px_rgba(252,213,53,0.1)] mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-[#181A20]/20 border-t-[#181A20] rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar na Plataforma
                  <ArrowRight size={20} weight="bold" />
                </>
              )}
            </button>

            {/* LINK PARA REGISTRO */}
            <div className="text-center pt-4">
              <p className="text-[#848E9C] text-[11px] font-medium tracking-wide">
                Ainda não tem conta?{' '}
                <Link to="/register" className="text-white font-bold hover:text-emerald-500 transition-colors">
                  Criar conta gratuita
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* FOOTER & SECURITY */}
        <footer className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-30 group hover:opacity-100 transition-opacity">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white">Conexão Segura SSL de 256 bits</span>
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