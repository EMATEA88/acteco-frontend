import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ClockCounterClockwise, 
  CheckCircle, 
  HourglassMedium, 
  XCircle, 
  Bank, 
  CurrencyCircleDollar,
  CalendarBlank
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import type { RechargeHistory } from '../services/recharge.service'

export default function RechargeHistory() {

  const [items, setItems] = useState<RechargeHistory[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const res = await RechargeService.myHistory()

        // Resposta já é array direto
        setItems(res as RechargeHistory[])

      } catch (error) {
        console.error("Erro ao carregar histórico:", error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function getStatusMeta(status: string) {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Sucesso',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: <CheckCircle size={16} weight="duotone" />
        }
      case 'PENDING':
        return {
          label: 'Em análise',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          icon: <HourglassMedium size={16} weight="duotone" />
        }
      case 'REJECTED':
        return {
          label: 'Rejeitado',
          color: 'text-red-400',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: <XCircle size={16} weight="duotone" />
        }
      default:
        return {
          label: status,
          color: 'text-cyan-200/70',
          bg: 'bg-cyan-500/5',
          border: 'border-cyan-500/10',
          icon: <ClockCounterClockwise size={16} />
        }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.06] rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-[#0a2533]/90 backdrop-blur-xl border-b border-cyan-500/10 px-6 py-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>

          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Depósitos</h1>
            <p className="text-[10px] font-mono text-cyan-200/70 uppercase tracking-[0.2em]">
              Histórico de Recargas
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 py-6 pb-28 max-w-2xl mx-auto relative z-10">

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="h-24 w-full bg-[#0e364a] rounded-[2rem] animate-pulse border border-cyan-500/10 shadow-xl" 
              />
            ))}
          </div>

        ) : items.length === 0 ? (

          <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-12 text-center shadow-xl">
            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-inner">
              <ClockCounterClockwise size={28} weight="duotone" />
            </div>

            <p className="text-xs font-mono text-cyan-200/70 uppercase tracking-[0.2em] leading-loose">
              Sem registros de recarga <br/> no momento
            </p>
          </div>

        ) : (

          <div className="space-y-4">
            {items.map((item) => {

              const meta = getStatusMeta(item.status)
              const isCrypto = item.currency === 'USDT'

              return (
                <div 
                  key={item.id} 
                  className="bg-[#0e364a] hover:bg-[#124158] border border-cyan-500/20 hover:border-cyan-400/50 p-5 rounded-[2rem] flex items-center gap-4 transition-all duration-300 shadow-xl shadow-cyan-950/20"
                >

                  {/* ICON */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                    isCrypto 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isCrypto 
                      ? <CurrencyCircleDollar size={22} weight="duotone" /> 
                      : <Bank size={22} weight="duotone" />
                    }
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">

                      <div>
                        <p className={`text-base font-mono font-black tracking-tight ${
                          isCrypto ? 'text-white' : 'text-emerald-400'
                        }`}>
                          {Number(item.amount).toLocaleString()} {item.currency || (isCrypto ? 'USDT' : 'AOA')}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1 text-cyan-200/70">
                          <CalendarBlank size={13} weight="duotone" className="text-cyan-300/70" />
                          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">
                            {new Date(item.createdAt).toLocaleDateString('pt-AO')}
                          </span>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black font-mono uppercase tracking-wider border shadow-sm ${meta.bg} ${meta.color} ${meta.border}`}>
                        {meta.icon}
                        {meta.label}
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}