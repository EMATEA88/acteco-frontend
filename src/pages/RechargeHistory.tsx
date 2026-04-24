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

type Recharge = {
  id: number
  amount: number
  currency: string
  method: 'BANK' | 'CRYPTO'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function RechargeHistory() {
  const [items, setItems] = useState<Recharge[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const res = await RechargeService.myHistory()
        
        // 🟢 CORREÇÃO CRÍTICA: Verifica todas as camadas possíveis do Axios
        const rawData = res.data?.data || res.data || []
        
        // Garante que só salvamos se for um Array
        setItems(Array.isArray(rawData) ? rawData : [])
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function getStatusMeta(status: string) {
    switch (status) {
      case 'APPROVED':
        return { label: 'Sucesso', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <CheckCircle size={16} weight="duotone" /> }
      case 'PENDING':
        return { label: 'Em análise', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: <HourglassMedium size={16} weight="duotone" /> }
      case 'REJECTED':
        return { label: 'Rejeitado', color: 'text-red-400', bg: 'bg-red-500/10', icon: <XCircle size={16} weight="duotone" /> }
      default:
        return { label: status, color: 'text-gray-400', bg: 'bg-white/5', icon: <ClockCounterClockwise size={16} /> }
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <div className="sticky top-0 z-20 bg-[#0B0E11]/80 backdrop-blur-xl border-b border-white/5 px-5 py-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/5">
            <ArrowLeft size={18} weight="bold" />
          </button>
          <div>
            <h1 className="text-base font-bold">Depósitos</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[2px]">Histórico de Recargas</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 pb-28 max-w-2xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#111318] border border-white/5 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
              <ClockCounterClockwise size={24} />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">
              Sem registros de recarga <br/> no momento
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const meta = getStatusMeta(item.status);
              const isCrypto = item.method === 'CRYPTO' || item.currency === 'USDT';

              return (
                <div key={item.id} className="bg-[#161A1E] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCrypto ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {isCrypto ? <CurrencyCircleDollar size={20} weight="duotone" /> : <Bank size={20} weight="duotone" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-bold ${isCrypto ? 'text-white' : 'text-emerald-500'}`}>
                          {Number(item.amount).toLocaleString()} {item.currency || (isCrypto ? 'USDT' : 'AOA')}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 text-gray-500">
                          <CalendarBlank size={10} />
                          <span className="text-[10px] uppercase">
                            {new Date(item.createdAt).toLocaleDateString('pt-AO')}
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${meta.bg} ${meta.color}`}>
                        {meta.icon}
                        {meta.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}