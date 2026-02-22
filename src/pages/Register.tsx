import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { api } from '../services/api'
import Toast from '../components/ui/Toast'
import { Phone } from '@phosphor-icons/react'

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

      <Toast
        visible={toastVisible}
        message={toastMessage}
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
        <input
          type="password"
          placeholder="Password"
          className="
            w-full h-12 rounded-xl
            bg-white/5
            border border-white/10
            px-3 text-sm text-white
            outline-none
            focus:border-emerald-500
          "
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* CONFIRM */}
        <input
          type="password"
          placeholder="Confirmar password"
          className="
            w-full h-12 rounded-xl
            bg-white/5
            border border-white/10
            px-3 text-sm text-white
            outline-none
            focus:border-emerald-500
          "
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        {/* INVITE */}
        <input
          type="text"
          placeholder="Código de convite"
          className="
            w-full h-12 rounded-xl
            bg-white/5
            border border-white/10
            px-3 text-sm text-white
            outline-none
            focus:border-emerald-500
          "
          value={inviteCode}
          onChange={e => setInviteCode(e.target.value)}
        />

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
          {loading ? 'Criando…' : 'Criar conta'}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            Já tenho conta
          </Link>
        </div>

      </form>
    </AuthLayout>
  )
}