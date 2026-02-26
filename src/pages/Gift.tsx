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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF]">

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#1E2329] border-b border-[#2B3139] px-6 py-4 flex items-center gap-3">
        <Gift size={20} className="text-[#FCD535]" />
        <h1 className="text-lg font-semibold tracking-wide">
          Resgatar Presente
        </h1>
      </div>

      <div className="px-6 py-10 max-w-xl mx-auto pb-28">

        <div className="
          bg-[#1E2329]
          border border-[#2B3139]
          rounded-3xl
          p-8
          space-y-6
        ">

          <div className="flex items-center gap-3 text-[#FCD535]">
            <Ticket size={20} />
            <p className="text-sm text-[#848E9C]">
              Insira o código de presente para resgatar o valor disponível.
            </p>
          </div>

          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Código de presente"
            className="
              w-full h-12 rounded-xl
              bg-[#1E2329]
              border border-[#2B3139]
              px-4 text-sm text-[#EAECEF]
              placeholder-[#848E9C]
              focus:border-[#FCD535]
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
                  ? 'bg-[#2B3139] text-[#848E9C] cursor-not-allowed'
                  : 'bg-[#FCD535] text-black hover:brightness-110 active:scale-95'
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