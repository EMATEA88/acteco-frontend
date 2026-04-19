import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react'
import { loginUser } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'

export default function LoginUser() {
  const navigate = useNavigate()
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
    try {
      setLoading(true)
      let finalIdentifier = identifier.trim()
      if (isPhone) {
        const clean = identifier.replace(/\s/g, '')
        if (clean.length !== 9) throw new Error('Número inválido')
        finalIdentifier = `+244${clean}`
      }
      const data = await loginUser(finalIdentifier, password)
      login(data.token, data.user)
      navigate('/home')
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Erro no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 selection:bg-green-500/30">
      
      {/* Background */}
      <div className="absolute top-0 -left-10 w-80 h-80 bg-green-900/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-10 w-80 h-80 bg-emerald-900/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-2xl z-10">
        
        {/* HEADER (INALTERADO) */}
        <div className="text-center mb-10 group">
          <div className="relative inline-block mb-4">
            <div className="relative w-24 h-24 rounded-full border-2 border-white/5 overflow-hidden bg-[#111111] flex items-center justify-center">
              <img 
                src="/logo.png" 
                className="w-full h-full object-contain p-1.5 rounded-full"
                alt="Logo EMATEA" 
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            EMATEA
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-sm tracking-wide uppercase">
            A nova era da sua gestão financeira
          </p>
        </div>

        {/* CARD AJUSTADO */}
        <div className="bg-[#161616] p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
          
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
                className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-xl p-3 text-sm outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2 md:col-span-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Palavra-passe
                </label>
                <Link to="/reset-password" className="text-xs font-bold text-green-500 hover:text-green-400 no-underline">
                  Recuperar
                </Link>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1a1a1a] border border-white/5 focus:border-green-500/40 rounded-xl p-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* BOTÃO */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-green-500 hover:text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Entrar na Plataforma
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Novo por aqui?{' '}
              <Link to="/register" className="text-white font-bold hover:text-green-500 no-underline">
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
            <Link to="/terms" className="hover:text-white no-underline">Termos</Link>
            <Link to="/privacy-policy" className="hover:text-white no-underline">Privacidade</Link>
            <Link to="/about" className="hover:text-white no-underline">Suporte</Link>
          </div>
        </footer>

      </div>
    </div>
  )
}