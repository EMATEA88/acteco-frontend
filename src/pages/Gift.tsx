import { useEffect, useState } from 'react'
import { GiftService } from '../services/gift.service'
import { useNavigate } from 'react-router-dom'
import { 
  Gift, 
  Ticket, 
  ArrowLeft, 
  CheckCircle, 
  WarningCircle, 
  Sparkle 
} from '@phosphor-icons/react'
import Toast from '../components/ui/Toast'

export default function GiftPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('error')
  const [loading, setLoading] = useState(false)

  const isCodeValid = code.trim().length > 0

  async function redeem() {
    if (!isCodeValid || loading) return

    try {
      setLoading(true)
      const res = await GiftService.redeem(code.trim())

      setToastType('success')
      setToastMessage(`Excelente! Recebeu ${res.data.amount} Kz`)
      setToastVisible(true)
      setCode('')
    } catch (e: any) {
      setToastType('error')
      setToastMessage(e.response?.data?.error || 'Código de presente inválido')
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6 py-5">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase">Presentes</h1>
          <Sparkle size={24} weight="fill" className="text-green-500" />
        </div>
      </header>

      <main className="px-6 py-12 max-w-xl mx-auto pb-32 relative">
        
        {/* LUZ DE FUNDO */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          
          {/* ICONE CENTRAL GRANDE */}
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="w-24 h-24 rounded-[2rem] bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.15)] animate-bounce-slow">
              <Gift size={48} weight="duotone" className="text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Resgatar Reward</h2>
              <p className="text-gray-500 text-sm font-medium">Insira o seu código exclusivo EMATEA abaixo</p>
            </div>
          </div>

          {/* INPUT CARD */}
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 ml-1">
                <Ticket size={20} weight="bold" className="text-green-500" />
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Código do Voucher
                </label>
              </div>
              
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="EMT-XXXX-XXXX"
                className="
                  w-full h-16 rounded-2xl
                  bg-[#0a0a0a]
                  border border-white/5
                  px-6 text-lg font-black tracking-[0.1em] text-white
                  placeholder:text-gray-800 placeholder:font-normal placeholder:tracking-normal
                  focus:border-green-500/40
                  focus:ring-4 focus:ring-green-500/5
                  outline-none
                  transition-all
                  text-center
                "
              />
            </div>

            <button
              onClick={redeem}
              disabled={!isCodeValid || loading}
              className={`
                w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all
                flex items-center justify-center gap-3 shadow-xl
                ${
                  !isCodeValid
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                    : 'bg-white text-black hover:bg-green-500 hover:text-white active:scale-[0.98]'
                }
              `}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Resgatar Agora
                  <CheckCircle size={22} weight="fill" />
                </>
              )}
            </button>
          </div>

          {/* DICAS DE SEGURANÇA */}
          <div className="bg-[#111]/50 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
            <WarningCircle size={28} weight="duotone" className="text-gray-600 flex-shrink-0" />
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Os códigos de presente EMATEA são de uso único. Nunca partilhe o seu código com terceiros. A nossa equipa nunca solicitará o seu código por telefone ou redes sociais.
            </p>
          </div>

        </div>
      </main>

      {/* RODAPÉ ESTATÍSTICO */}
      <footer className="fixed bottom-10 left-0 w-full text-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em]">Secure Reward Protocol v3.0</p>
      </footer>
    </div>
  )
}