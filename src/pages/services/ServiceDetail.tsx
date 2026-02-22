import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { toast } from 'sonner'

interface Plan {
  id: number
  name: string
  price: number
}

export default function ServiceDetail() {

  const { id } = useParams()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] =
    useState<number | null>(null)

  useEffect(() => {
    if (id) loadPlans(Number(id))
  }, [id])

  async function loadPlans(partnerId: number) {
    try {
      const { data } =
        await api.get(
          `/services/partners/${partnerId}/plans`
        )
      setPlans(data)
    } catch {
      toast.error('Erro ao carregar planos')
    } finally {
      setLoading(false)
    }
  }

  async function handlePurchase(planId: number) {
    try {
      setProcessingId(planId)

      await api.post('/services/pay', {
        planId
      })

      toast.success('Compra realizada com sucesso')

    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
        'Erro ao processar pagamento'
      )
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Carregando planos...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-fadeZoom">

      <h1 className="text-2xl font-semibold text-white">
        Planos Disponíveis
      </h1>

      <div className="space-y-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="
              bg-white/5 border border-white/10
              rounded-2xl p-5
              flex justify-between items-center
              transition-all duration-300
              hover:bg-white/10
              hover:scale-[1.02]
            "
          >
            <div>
              <div className="font-semibold text-white">
                {plan.name}
              </div>

              <div className="text-sm text-emerald-400 mt-1">
                {plan.price.toLocaleString()} Kz
              </div>
            </div>

            <button
              disabled={processingId === plan.id}
              onClick={() =>
                handlePurchase(plan.id)
              }
              className={`
                px-5 py-2 rounded-xl font-medium
                transition-all duration-200
                ${
                  processingId === plan.id
                    ? 'bg-gray-500'
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
                }
                text-white
              `}
            >
              {processingId === plan.id
                ? 'Processando...'
                : 'Comprar'}
            </button>

          </div>
        ))}
      </div>
    </div>
  )
}