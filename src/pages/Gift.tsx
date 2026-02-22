import { useEffect, useState } from 'react'
import { GiftService } from '../services/gift.service'
import Toast from '../components/ui/Toast'
import { Gift, Ticket } from 'lucide-react'

export default function GiftPage() {

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

      setToastType('success')
      setToastMessage(`Recebido ${res.data.amount} Kz`)
      setToastVisible(true)
      setCode('')

    } catch (e: any) {

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
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white">

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <Gift size={20} className="text-emerald-400" />
        <h1 className="text-lg font-semibold tracking-wide">
          Resgatar Presente
        </h1>
      </div>

      <div className="px-6 py-10 max-w-xl mx-auto pb-28">

        <div className="
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-8
          shadow-2xl
          space-y-6
        ">

          <div className="flex items-center gap-3 text-emerald-400">
            <Ticket size={20} />
            <p className="text-sm text-gray-300">
              Insira o código de presente para resgatar o valor disponível.
            </p>
          </div>

          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Código de presente"
            className="
              w-full h-12 rounded-xl
              bg-white/5
              border border-white/10
              px-4 text-sm text-white
              focus:ring-2 focus:ring-emerald-500
              focus:border-emerald-500
              outline-none
              transition
            "
          />

          <button
            onClick={redeem}
            disabled={!isCodeValid || loading}
            className={`
              w-full h-12 rounded-xl font-semibold transition
              ${
                !isCodeValid
                  ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }
              ${loading ? 'opacity-60' : ''}
            `}
          >
            {loading ? 'A processar…' : 'Resgatar Código'}
          </button>

        </div>

      </div>
    </div>
  )
}