import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react'
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

  async function handleSubmit(e: React.FormEvent) {
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
      
      // Salva os dados no contexto
      await login(data.token, data.user)
      
      toast.success('Acesso autorizado. Bem-vindo de volta!')

      // Pequeno delay para o toast ser lido e então força o refresh total
      // para garantir que os dados da conta (saldo, etc) sejam atualizados
      setTimeout(() => {
        window.location.href = '/home'
      }, 800)
      
    } catch (err: any) {
      const status = err?.response?.status
      const message = err?.response?.data?.message

      // Tratamento de erro profissional e específico
      if (status === 404) {
        toast.error('E-mail ou telefone inexistente na nossa base de dados.')
      } else if (status === 401) {
        toast.error('Palavra-passe errada. Tente novamente ou recupere-a.')
      } else {
        toast.error(message || 'Falha na autenticação. Verifique os seus dados.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 selection:bg-emerald-500/30 font-normal relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 -left-10 w-80 h-80 bg-emerald-900/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-emerald-900/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-2xl z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10 group">
          <div className="relative inline-block mb-4">
            <div className="relative w-24 h-24 rounded-full border-2 border-white/5 overflow-hidden bg-[#111111] flex items-center justify-center shadow-2xl">
              <img 
                src="/logo.png" 
                className="w-full h-full object-contain p-1.5 rounded-full"
                alt="Logo EMATEA" 
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-medium tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            EMATEA
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-[10px] tracking-[0.2em] uppercase">
            A nova era da sua gestão financeira
          </p>
        </div>

        {/* CARD DE LOGIN */}
        <div className="bg-[#161616] p-6 md:p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

            {/* IDENTIFIER */}
            <div className="space-y-2 md:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Acesso à Conta
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                placeholder="E-mail ou Telemóvel"
                className="w-full bg-[#1a1a1a] border border-white/5 focus:border-emerald-500/40 rounded-2xl p-3.5 text-sm outline-none transition-all placeholder:text-gray-700"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2 md:col-span-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Palavra-passe
                </label>
                <Link 
                  to="/reset-password" 
                  className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 no-underline uppercase tracking-wider"
                >
                  Recuperar
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1a1a1a] border border-white/5 focus:border-emerald-500/40 rounded-2xl p-3.5 text-sm outline-none transition-all placeholder:text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* BOTÃO ENTRAR */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white h-14 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-xl shadow-black/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Entrar na Plataforma
                    <ArrowRight size={18} weight="bold" />
                  </>
                )}
              </button>
            </div>

          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[11px] font-medium uppercase tracking-wider">
              Novo por aqui?{' '}
              <Link to="/register" className="text-white font-bold hover:text-emerald-500 no-underline">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-10 text-center">
          <div className="flex justify-center gap-6 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-700">
            <Link to="/terms" className="hover:text-white transition-colors no-underline">Termos</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors no-underline">Privacidade</Link>
            <Link to="/about" className="hover:text-white transition-colors no-underline">Suporte</Link>
          </div>
        </footer>

      </div>
    </div>
  )
}