import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeSlash } from '@phosphor-icons/react'

import AuthLayout from '../layouts/AuthLayout'
import { loginUser } from '../services/api'
import Toast from '../components/ui/Toast'
import { AuthContext } from '../contexts/AuthContext'

export default function Login() {

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [identifier, setIdentifier] = useState('')
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

    if (!identifier || !password) {
      setToastType('error')
      setToastMessage('Preencha todos os campos')
      setToastVisible(true)
      return
    }

    try {
      setLoading(true)

      const data = await loginUser(identifier, password)

      login(data.token, data.user)

      setToastType('success')
      setToastMessage('Login realizado com sucesso')
      setToastVisible(true)

      setTimeout(() => navigate('/'), 600)

    } catch (err: any) {
      setToastType('error')
      setToastMessage(
        err?.response?.data?.message ||
        'Credenciais inválidas'
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

        {/* IDENTIFIER */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Email ou Telefone
          </label>

          <input
            type="text"
            className="
              w-full h-12 rounded-xl
              bg-[#111827]
              border border-gray-700
              px-3 text-sm text-white
              placeholder-gray-500
              outline-none
              focus:border-emerald-500
              transition
            "
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="ex: user@email.com ou 923000000"
          />
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
                bg-[#111827]
                border border-gray-700
                px-3 pr-12
                text-sm text-white
                placeholder-gray-500
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

        <div className="text-center mt-2">
  <Link
    to="/reset-password"
    className="text-sm text-gray-400 hover:text-emerald-400 transition"
  >
    Esqueci a password
  </Link>
</div>

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