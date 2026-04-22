import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ClockCounterClockwise } from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'

type Recharge = {
  id: number
  amount: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function RechargeHistory() {
  const [items, setItems] = useState<Recharge[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await RechargeService.myHistory()
        // 🟢 Ajuste: Garante a extração correta independente se vem res.data ou res.data.data
        const historyData = res.data?.data || res.data || []
        
        if (isMounted) {
          setItems(Array.isArray(historyData) ? historyData : [])
        }
      } catch (error) {
        console.error('Erro no histórico:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold">Histórico de Recargas</h1>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-30">
          <ClockCounterClockwise size={32} className="animate-spin mb-2" />
          <p className="text-xs">Carregando...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="bg-[#111318] border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest">Sem registros</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-[#111318] border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-emerald-500">{Number(item.amount).toLocaleString()} Kz</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase">
                    {new Date(item.createdAt).toLocaleDateString('pt-AO')}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase ${
                  item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                  item.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {item.status === 'PENDING' ? 'Em análise' : item.status === 'APPROVED' ? 'Sucesso' : 'Rejeitado'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}