import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { PasswordService } from '../services/password.service'

export default function Password() {
  const navigate = useNavigate()

  /* ================= STATE ================= */
  const [loginCurrent, setLoginCurrent] = useState('')
  const [loginNew, setLoginNew] = useState('')

  const [withdrawCurrent, setWithdrawCurrent] = useState('')
  const [withdrawNew, setWithdrawNew] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  /* ================= HELPERS ================= */
  function showError(text: string) {
    setMessage({ type: 'error', text })
  }

  function showSuccess(text: string) {
    setMessage({ type: 'success', text })
  }

  /* ================= ACTIONS ================= */

  async function handleLoginPasswordChange() {
    setMessage(null)

    if (!loginCurrent || !loginNew) {
      showError('Preencha todos os campos da senha de login')
      return
    }

    if (loginNew.length < 6) {
      showError('A nova senha de login deve ter pelo menos 6 caracteres')
      return
    }

    try {
      setLoading(true)

      await PasswordService.changeLoginPassword({
        currentPassword: loginCurrent,
        newPassword: loginNew,
      })

      showSuccess('Senha de login alterada com sucesso')
      setLoginCurrent('')
      setLoginNew('')
    } catch (err: any) {
      showError(
        err?.response?.data?.error ??
          'Erro ao alterar senha de login'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdrawPasswordChange() {
    setMessage(null)

    if (!withdrawNew) {
      showError('Informe a nova senha de levantamento')
      return
    }

    if (withdrawNew.length < 4) {
      showError(
        'A senha de levantamento deve ter pelo menos 4 dígitos'
      )
      return
    }

    try {
      setLoading(true)

      await PasswordService.changeWithdrawPassword({
        currentWithdrawPassword:
          withdrawCurrent || undefined,
        newWithdrawPassword: withdrawNew,
      })

      showSuccess('Senha de levantamento definida com sucesso')
      setWithdrawCurrent('')
      setWithdrawNew('')
    } catch (err: any) {
      showError(
        err?.response?.data?.error ??
          'Erro ao definir senha de levantamento'
      )
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-lg font-semibold">Senha</h1>
      </div>

      {/* FEEDBACK */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm
            ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message.text}
        </div>
      )}

      {/* ================= LOGIN PASSWORD ================= */}
      <div className="bg-white rounded-2xl p-5 shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-green-600" />
          <h2 className="font-semibold">
            Senha de login
          </h2>
        </div>

        <input
          type="password"
          placeholder="Senha atual"
          value={loginCurrent}
          onChange={e =>
            setLoginCurrent(e.target.value)
          }
          className="w-full h-11 rounded-xl border px-4 mb-3"
        />

        <input
          type="password"
          placeholder="Nova senha"
          value={loginNew}
          onChange={e => setLoginNew(e.target.value)}
          className="w-full h-11 rounded-xl border px-4 mb-4"
        />

        <button
          onClick={handleLoginPasswordChange}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold
            hover:bg-green-700 active:scale-95 disabled:opacity-60"
        >
          Alterar senha de login
        </button>
      </div>

      {/* ================= WITHDRAW PASSWORD ================= */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="text-green-600" />
          <h2 className="font-semibold">
            Senha de levantamento
          </h2>
        </div>

        <input
          type="password"
          placeholder="Senha atual (se existir)"
          value={withdrawCurrent}
          onChange={e =>
            setWithdrawCurrent(e.target.value)
          }
          className="w-full h-11 rounded-xl border px-4 mb-3"
        />

        <input
          type="password"
          placeholder="Nova senha de levantamento"
          value={withdrawNew}
          onChange={e =>
            setWithdrawNew(e.target.value)
          }
          className="w-full h-11 rounded-xl border px-4 mb-4"
        />

        <button
          onClick={handleWithdrawPasswordChange}
          disabled={loading}
          className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold
            hover:bg-green-700 active:scale-95 disabled:opacity-60"
        >
          Definir senha de levantamento
        </button>
      </div>
    </div>
  )
}
