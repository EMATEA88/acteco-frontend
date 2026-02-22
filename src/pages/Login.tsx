import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash, Phone } from '@phosphor-icons/react'

import AuthLayout from '../layouts/AuthLayout'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'
import { AuthContext } from '../contexts/AuthContext'

export default function Login() {

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] =
    useState<'success' | 'error'>('error')

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2000)
    return () => clearTimeout(t)
  }, [toastVisible])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!phone || !password) {
      setToastType('error')
      setToastMessage('Preencha todos os campos')
      setToastVisible(true)
      return
    }

    try {
      setLoading(true)

      const response = await api.post('/auth/login', {
        phone: `+244${phone.replace(/\D/g, '')}`,
        password,
      })

      const { token, user } = response.data
      login(token, user)

      setToastType('success')
      setToastMessage('Login realizado com sucesso')
      setToastVisible(true)

      setTimeout(() => navigate('/'), 600)

    } catch (err: any) {

      setToastType('error')
      setToastMessage(
        err?.response?.data?.message ||
        'Telefone ou password inválidos'
      )
      setToastVisible(true)

    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Aceda à sua conta"
    >

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* PHONE */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Número de telefone
          </label>

          <div className="
            flex items-center gap-2
            h-12 rounded-xl
            bg-white/5
            border border-white/10
            px-3
            focus-within:border-emerald-500
            transition
          ">
            <Phone size={18} className="text-gray-400" />
            <span className="text-gray-400 text-sm">+244</span>
            <input
              type="tel"
              className="flex-1 bg-transparent outline-none text-sm text-white"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="
                w-full h-12 rounded-xl
                bg-white/5
                border border-white/10
                px-3 pr-12
                text-sm text-white
                outline-none
                focus:border-emerald-500
                transition
              "
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full h-12 rounded-xl font-semibold transition
            ${loading
              ? 'bg-emerald-500/60 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}
          `}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <div className="text-center">
          <Link
            to="/register"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            Criar uma conta
          </Link>
        </div>

      </form>
    </AuthLayout>
  )
}