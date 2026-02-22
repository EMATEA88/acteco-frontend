import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ApplicationService } from '../../services/application.service'

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
      toast.error('Erro ao carregar investimentos')
    } finally {
      setLoading(false)
    }
  }

  function calculatePreview() {
    const value = Number(amount)
    if (!value) return 0
    const rate = periodDays === 15 ? 1.5 : 1.8
    return value + (value * rate / 100)
  }

  async function create() {
    if (!amount || Number(amount) <= 0) {
      toast.error('Valor inválido')
      return
    }

    try {
      setCreating(true)
      await ApplicationService.create(Number(amount), periodDays)
      toast.success('Investimento criado')
      setAmount('')
      await load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Erro ao investir')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white px-6 pt-6 pb-8 space-y-8">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold tracking-wide">
        Meus Investimentos
      </h1>

      {/* CARD DE CRIAÇÃO */}
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">

        <div>
          <label className="text-sm text-gray-400">Prazo</label>
          <select
            value={periodDays}
            onChange={e => setPeriodDays(Number(e.target.value))}
            className="mt-2 w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 text-sm"
          >
            <option value={15}>15 dias (1.5%)</option>
            <option value={90}>3 meses (1.8%)</option>
            <option value={180}>6 meses (1.8%)</option>
            <option value={365}>12 meses (1.8%)</option>
            <option value={730}>24 meses (1.8%)</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400">Valor (Kz)</label>
          <input
            type="number"
            placeholder="Digite o valor"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mt-2 w-full bg-[#1F2937] border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
        </div>

        {amount && (
          <div className="bg-[#0F172A] border border-emerald-500/20 rounded-xl p-4">
            <p className="text-xs text-gray-400">
              Retorno estimado
            </p>
            <p className="text-lg font-semibold text-emerald-400">
              {calculatePreview().toLocaleString()} Kz
            </p>
          </div>
        )}

        <button
          disabled={creating}
          onClick={create}
          className="w-full bg-emerald-600 hover:bg-emerald-700 transition rounded-xl py-3 font-medium disabled:opacity-50"
        >
          {creating ? 'A investir...' : 'Investir'}
        </button>

      </div>

      {/* LISTA */}
      <div className="space-y-4">

        {loading && (
          <div className="text-center text-gray-400">
            Carregando...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 text-center text-gray-400">
            Nenhum investimento encontrado
          </div>
        )}

        {items.map(app => (
          <div
            key={app.id}
            className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-3"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Valor</span>
              <span>{Number(app.amount).toLocaleString()} Kz</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Retorno</span>
              <span className="text-emerald-400">
                {Number(app.totalReturn).toLocaleString()} Kz
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Prazo</span>
              <span>{app.periodDays} dias</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vencimento</span>
              <span>
                {new Date(app.maturityDate)
                  .toLocaleDateString('pt-AO')}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className={`
                font-medium
                ${app.status === 'ACTIVE' && 'text-emerald-400'}
                ${app.status === 'MATURED' && 'text-blue-400'}
                ${app.status === 'CANCELLED' && 'text-red-400'}
              `}>
                {app.status}
              </span>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}