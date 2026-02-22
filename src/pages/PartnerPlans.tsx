import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ServiceService } from '../services/service.service'
import { toast } from 'sonner'

export default function PartnerPlans() {

  const { id } = useParams()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)

  useEffect(() => {
    if (id) load(Number(id))
  }, [id])

  async function load(partnerId: number) {
    try {
      const data = await ServiceService.listPlans(partnerId)
      setPlans(data)
    } catch {
      toast.error('Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  async function handleBuy(planId: number) {
    try {
      setProcessing(planId)
      await ServiceService.buy(planId)
      toast.success('Compra realizada com sucesso')
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Erro na compra')
    } finally {
      setProcessing(null)
    }
  }

  if (loading)
    return <div className="p-6">Carregando...</div>

  return (
    <div className="p-6 space-y-4 animate-fadeZoom">

      <h1 className="text-xl font-bold">
        Planos disponíveis
      </h1>

      {plans.map(plan => (
        <div
          key={plan.id}
          className="bg-white rounded-2xl shadow p-4 flex justify-between items-center"
        >
          <div>
            <div className="font-semibold">
              {plan.name}
            </div>
            <div className="text-sm text-gray-500">
              {plan.price} Kz
            </div>
          </div>

          <button
            onClick={() => handleBuy(plan.id)}
            disabled={processing === plan.id}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
          >
            {processing === plan.id ? 'Processando...' : 'Comprar'}
          </button>
        </div>
      ))}

    </div>
  )
}
