import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicationService } from '../../services/application.service'
import { ArrowLeft, Calendar } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Application {
  id: number
  amount: string
  interestRate: string
  periodDays: number
  totalReturn: string
  status: string
  maturityDate: string
}

export default function Applications() {
  const navigate = useNavigate()

  const [items, setItems] = useState<Application[]>([])
  const [amount, setAmount] = useState('')
  const [periodDays, setPeriodDays] = useState(15)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const data = await ApplicationService.list()
      setItems(data)
    } catch {
      toast.error('Erro ao sincronizar investimentos')
    } finally {
      setLoading(false)
    }
  }

  function calculatePreview() {
    const value = Number(amount)
    if (!value) return { total: 0, profit: 0 }

    const rate = periodDays === 15 ? 1.5 : 1.8
    const profit = value * (rate / 100)
    const total = value + profit

    return { total, profit }
  }

  async function create() {
    if (!amount || Number(amount) <= 0) {
      toast.error('Introduza um valor válido')
      return
    }

    try {
      setCreating(true)
      await ApplicationService.create(Number(amount), periodDays)
      toast.success('Capital aplicado com sucesso')
      setAmount('')
      await load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Falha na aplicação')
    } finally {
      setCreating(false)
    }
  }

  const isValid = Number(amount) > 0 && !creating
  const preview = calculatePreview()

  /* =========================
     LOADING BINANCE STYLE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl"/>
          <div className="w-40 h-4 bg-white/5 rounded"/>
        </div>

        <p className="text-xs text-gray-500">
          Carregando investimentos...
        </p>

        {/* FORM FAKE */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="h-10 bg-white/5 rounded-xl"/>
          <div className="h-10 bg-white/5 rounded-xl"/>
          <div className="h-12 bg-white/5 rounded-xl"/>
        </div>

        {/* LISTA FAKE */}
        {[1,2,3].map(i => (
          <div key={i} className="glass-card p-5 rounded-2xl space-y-3">
            <div className="h-3 w-24 bg-white/5 rounded"/>
            <div className="h-3 w-32 bg-white/5 rounded"/>
            <div className="h-3 w-20 bg-white/5 rounded"/>
          </div>
        ))}

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-white/5 border border-white/10"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-lg font-semibold">Investimentos</h1>
      </div>

      {/* FORM */}
      <div className="glass-card p-6 rounded-2xl space-y-6">

        <div>
          <p className="text-xs text-gray-400 mb-2">Prazo</p>
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="w-full h-11 bg-[#0B0E11] border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-emerald-500"
          >
            <option value={15}>15 dias (1.5%)</option>
            <option value={90}>3 meses (1.8%)</option>
            <option value={180}>6 meses (1.8%)</option>
            <option value={365}>12 meses (1.8%)</option>
          </select>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-2">Valor (Kz)</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-11 bg-[#0B0E11] border border-white/10 rounded-xl px-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        {Number(amount) > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Lucro</span>
              <span className="text-emerald-500 font-medium">
                {preview.profit.toLocaleString()} Kz
              </span>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Total</span>
              <span className="font-semibold">
                {preview.total.toLocaleString()} Kz
              </span>
            </div>
          </div>
        )}

        <button
          disabled={!isValid}
          onClick={create}
          className={`w-full h-11 rounded-xl text-sm transition
            ${isValid
              ? "bg-white text-black"
              : "bg-white/10 text-gray-500"
            }
          `}
        >
          {creating ? 'Processando...' : 'Investir'}
        </button>

      </div>

      {/* LISTA REAL */}
      <div className="mt-6 space-y-3">

        {items.length === 0 && (
          <div className="glass-card p-6 text-center text-gray-500 text-sm">
            Nenhum investimento encontrado
          </div>
        )}

        {items.map(app => {
          const maturity = new Date(app.maturityDate)
          const isMature = new Date() >= maturity

          return (
            <div key={app.id} className="glass-card p-4 rounded-xl space-y-2">

              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Valor</span>
                <span>{Number(app.amount).toLocaleString()} Kz</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Retorno</span>
                <span className="text-emerald-500">
                  {Number(app.totalReturn).toLocaleString()} Kz
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Prazo</span>
                <span>{app.periodDays} dias</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Vencimento</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12}/>
                  {maturity.toLocaleDateString('pt-AO')}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Status</span>
                <span className={isMature ? "text-gray-400" : "text-emerald-500"}>
                  {isMature ? 'MATURE' : 'ACTIVE'}
                </span>
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}