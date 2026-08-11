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
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe]">

      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a2533]/90 backdrop-blur border-b border-cyan-500/10">
        <div className="max-w-xl mx-auto flex items-center gap-4 px-5 py-4">

          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-[#0e364a] border border-cyan-500/20 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-base font-bold text-white font-mono uppercase tracking-wider">Presentes</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6 pb-28 space-y-6">

        {/* CARD PRINCIPAL */}
        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-2xl p-4 space-y-4 shadow-lg shadow-cyan-950/20">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Gift size={18} className="text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Resgatar código</p>
              <p className="text-[11px] text-cyan-200/70 font-mono">
                Introduza o código recebido
              </p>
            </div>
          </div>

          {/* INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] text-cyan-200/60 uppercase font-mono">
              Código
            </label>

            <div className="relative">
              <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/60" />

              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="EMT-XXXX"
                className="
                  w-full h-11 rounded-xl
                  bg-[#0a2533]
                  border border-cyan-500/20
                  pl-9 pr-3 text-sm text-white
                  outline-none placeholder:text-cyan-200/30
                  focus:border-cyan-400/50
                  font-mono
                "
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={redeem}
            disabled={!isValid || loading}
            className={`w-full h-11 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer shadow-md
              ${!isValid
                ? 'bg-[#0a2533] border border-cyan-500/10 text-cyan-200/40 cursor-not-allowed'
                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-950/20'
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
        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-2xl p-4 flex gap-3 shadow-md shadow-cyan-950/10">
          <WarningCircle size={16} className="text-cyan-400 mt-0.5 shrink-0" />

          <p className="text-[11px] text-cyan-200/80 font-mono">
            Código é de uso único. Nunca partilhe com terceiros.
          </p>
        </div>

      </main>
    </div>
  )
}