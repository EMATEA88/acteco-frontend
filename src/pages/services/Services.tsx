import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServiceService } from '../../services/service.service'
import { toast } from 'sonner'
import { ArrowRight } from 'lucide-react'

export default function Services() {

  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await ServiceService.listPartners()
      setPartners(data)
    } catch {
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="p-6 text-gray-400">
        Carregando...
      </div>
    )

  return (
    <div className="p-6 space-y-6 animate-fadeZoom">

      <h1 className="text-2xl font-semibold text-white">
        Serviços
      </h1>

      <div className="grid grid-cols-2 gap-5">
        {partners.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/services/${p.id}`)}
            className="
              group
              bg-white/5 border border-white/10
              rounded-2xl p-6
              cursor-pointer
              transition-all duration-300
              hover:scale-[1.04]
              hover:bg-white/10
              hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]
            "
          >
            <div className="flex justify-between items-center">

              <div className="text-lg font-semibold text-white">
                {p.name}
              </div>

              <ArrowRight
                size={18}
                className="text-emerald-400 opacity-0 group-hover:opacity-100 transition"
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Ver planos disponíveis
            </p>

          </div>
        ))}
      </div>

    </div>
  )
}