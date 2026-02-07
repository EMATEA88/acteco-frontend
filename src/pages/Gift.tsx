import { useEffect, useState } from 'react'
import { GiftService } from '../services/gift.service'
import Toast from '../components/ui/Toast'

export default function Gift() {
  const [code, setCode] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] =
    useState<'success' | 'error'>('error')
  const [loading, setLoading] = useState(false)

  const isCodeValid = code.trim().length > 0

  async function redeem() {
    if (!isCodeValid || loading) return

    try {
      setLoading(true)

      const res = await GiftService.redeem(code.trim())

      // ✅ SUCESSO
      setToastType('success')
      setToastMessage(`Recebido ${res.data.amount} Kz`)
      setToastVisible(true)
      setCode('')
    } catch (e: any) {
      // ❌ ERRO
      setToastType('error')
      setToastMessage(
        e.response?.data?.error || 'Código inválido'
      )
      setToastVisible(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 2000)
    return () => clearTimeout(t)
  }, [toastVisible])

  return (
    <div className="min-h-screen bg-gray-50 px-5 pt-6 pb-28">
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          Presente
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Insira o código de presente para resgatar o valor disponível.
        </p>

        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Código de presente"
          className="w-full h-12 rounded-xl border border-gray-300 px-4 text-sm
                     focus:outline-none focus:ring-2 focus:ring-green-300"
        />

        <button
          onClick={redeem}
          disabled={loading}
          className={`
            mt-4 w-full h-12 rounded-xl font-medium transition
            ${
              !isCodeValid
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
            }
            ${loading ? 'opacity-70' : ''}
          `}
        >
          {loading ? 'A processar…' : 'Resgatar'}
        </button>
      </div>
    </div>
  )
}
