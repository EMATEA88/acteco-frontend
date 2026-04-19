import { useEffect, useState } from 'react'
import { GiftService } from '../services/gift.service'
import { useNavigate } from 'react-router-dom'
import {
  Gift,
  Ticket,
  ArrowLeft,
  CheckCircle,
  WarningCircle
} from '@phosphor-icons/react'
import Toast from '../components/ui/Toast'

export default function GiftPage() {
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('error')

  const isValid = code.trim().length > 0

  async function redeem() {
    if (!isValid || loading) return

    try {
      setLoading(true)

      const res = await GiftService.redeem(code.trim())

      setToastType('success')
      setToastMessage(`Recebeu ${res.data.amount} Kz`)
      setToastVisible(true)

      setCode('')
    } catch (e: any) {
      setToastType('error')
      setToastMessage(e.response?.data?.error || 'Código inválido')
      setToastVisible(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!toastVisible) return
    const t = setTimeout(() => setToastVisible(false), 3000)
    return () => clearTimeout(t)
  }, [toastVisible])

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">

      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0B0E11]/80 backdrop-blur border-b border-white/5">
        <div className="max-w-xl mx-auto flex items-center gap-4 px-5 py-4">

          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 rounded-full"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-bold">Presentes</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 pb-28 space-y-6">

        {/* CARD PRINCIPAL */}
        <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 space-y-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Gift size={18} className="text-emerald-500" />
            </div>

            <div>
              <p className="text-sm font-semibold">Resgatar código</p>
              <p className="text-[11px] text-gray-500">
                Introduza o código recebido
              </p>
            </div>
          </div>

          {/* INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">
              Código
            </label>

            <div className="relative">
              <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="EMT-XXXX"
                className="
                  w-full h-11 rounded-xl
                  bg-[#0B0E11]
                  border border-white/5
                  pl-9 pr-3 text-sm
                  outline-none
                  focus:border-emerald-500/30
                "
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={redeem}
            disabled={!isValid || loading}
            className={`w-full h-11 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
              ${!isValid
                ? 'bg-white/10 text-gray-500'
                : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
              }
            `}
          >
            {loading ? 'Processando...' : (
              <>
                Resgatar
                <CheckCircle size={16} />
              </>
            )}
          </button>
        </div>

        {/* ALERTA */}
        <div className="bg-[#111318] border border-white/5 rounded-2xl p-4 flex gap-3">
          <WarningCircle size={16} className="text-gray-500 mt-0.5" />

          <p className="text-[11px] text-gray-400">
            Código é de uso único. Nunca partilhe com terceiros.
          </p>
        </div>

      </main>
    </div>
  )
}