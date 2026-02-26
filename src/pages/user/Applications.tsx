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
    <div className="min-h-screen px-6 pt-6 pb-8 space-y-8">

      <h1 className="text-2xl font-semibold">
        Meus Investimentos
      </h1>

      {/* CARD DE CRIAÇÃO */}
      <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-6 space-y-5">

        <div>
          <label className="text-sm text-[#848E9C]">Prazo</label>
          <select
            value={periodDays}
            onChange={e => setPeriodDays(Number(e.target.value))}
            className="mt-2 w-full bg-[#1E2329] border border-[#2B3139] rounded-lg px-4 py-3 text-sm text-[#EAECEF]"
          >
            <option value={15}>15 dias (1.5%)</option>
            <option value={90}>3 meses (1.8%)</option>
            <option value={180}>6 meses (1.8%)</option>
            <option value={365}>12 meses (1.8%)</option>
            <option value={730}>24 meses (1.8%)</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-[#848E9C]">Valor (Kz)</label>
          <input
            type="number"
            placeholder="Digite o valor"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mt-2 w-full bg-[#1E2329] border border-[#2B3139] rounded-lg px-4 py-3 text-sm text-[#EAECEF] placeholder-[#848E9C]"
          />
        </div>

        {amount && (
          <div className="bg-[#0B0E11] border border-[#2B3139] rounded-lg p-4">
            <p className="text-xs text-[#848E9C]">
              Retorno estimado
            </p>
            <p className="text-lg font-semibold text-[#FCD535]">
              {calculatePreview().toLocaleString()} Kz
            </p>
          </div>
        )}

        <button
          disabled={creating}
          onClick={create}
          className="w-full bg-[#FCD535] text-black font-medium rounded-lg py-3 hover:brightness-110 transition disabled:opacity-50"
        >
          {creating ? 'A investir...' : 'Investir'}
        </button>

      </div>

      {/* LISTA */}
      <div className="space-y-4">

        {loading && (
          <div className="text-center text-[#848E9C]">
            Carregando...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-6 text-center text-[#848E9C]">
            Nenhum investimento encontrado
          </div>
        )}

        {items.map(app => (
          <div
            key={app.id}
            className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-5 space-y-3"
          >
            <div className="flex justify-between text-sm">
              <span className="text-[#848E9C]">Valor</span>
              <span>{Number(app.amount).toLocaleString()} Kz</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[#848E9C]">Retorno</span>
              <span className="text-[#FCD535]">
                {Number(app.totalReturn).toLocaleString()} Kz
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[#848E9C]">Prazo</span>
              <span>{app.periodDays} dias</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[#848E9C]">Vencimento</span>
              <span>
                {new Date(app.maturityDate).toLocaleDateString('pt-AO')}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[#848E9C]">Status</span>
              <span className="font-medium">
                {app.status}
              </span>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}