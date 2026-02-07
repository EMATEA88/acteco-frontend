import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const inviteFromUrl = searchParams.get('invite') || ''

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState(inviteFromUrl)

  const [loading, setLoading] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!inviteCode.trim()) {
      setToastMessage('O código de convite é obrigatório')
      setToastVisible(true)
      return
    }

    if (!phone || !password || !confirmPassword) {
      setToastMessage('Preencha todos os campos')
      setToastVisible(true)
      return
    }

    if (password !== confirmPassword) {
      setToastMessage('As passwords não coincidem')
      setToastVisible(true)
      return
    }

    try {
      setLoading(true)

      await api.post('/auth/register', {
        phone: `+244${phone.replace(/\D/g, '')}`,
        password,
        inviteCode: inviteCode.trim(),
      })

      navigate('/login')
    } catch (err: any) {
      setToastMessage(
        err?.response?.data?.message ||
          'Erro ao criar conta'
      )
      setToastVisible(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Registe-se para começar"
    >
      {/* TOAST */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de telefone
          </label>

          <div className="flex items-center rounded-xl border border-gray-300 px-3 h-12 focus-within:ring-2 focus-within:ring-emerald-500">
            <span className="text-gray-500 text-sm mr-2">
              +244
            </span>
            <input
              type="tel"
              placeholder="Digite seu número"
              className="flex-1 h-full outline-none text-sm"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Digite sua password"
            className="
              w-full h-12 rounded-xl border border-gray-300
              px-3 text-sm outline-none
              focus:ring-2 focus:ring-emerald-500
            "
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar password
          </label>
          <input
            type="password"
            placeholder="Confirme sua password"
            className="
              w-full h-12 rounded-xl border border-gray-300
              px-3 text-sm outline-none
              focus:ring-2 focus:ring-emerald-500
            "
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Invitation Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de convite
          </label>
          <input
            type="text"
            placeholder="Código de convite"
            className="
              w-full h-12 rounded-xl border border-gray-300
              px-3 text-sm outline-none
              focus:ring-2 focus:ring-emerald-500
            "
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full h-12 rounded-xl font-semibold transition
            ${
              loading
                ? 'bg-emerald-400 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            }
          `}
        >
          {loading ? 'Criando…' : 'Criar conta'}
        </button>

        {/* Login link */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-emerald-600 font-medium"
          >
            Já tenho conta
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
