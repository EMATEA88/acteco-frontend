import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicationService } from '../../services/application.service'
import { UserService } from '../../services/user.service' // Importado para o saldo
import { formatCurrencyAOA } from "../../utils/formatCurrency"
import { ArrowLeft, Calendar, TrendUp, Info } from '@phosphor-icons/react'
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
  const [balance, setBalance] = useState<number>(0) // Estado para o saldo
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [periodDays, setPeriodDays] = useState(15)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      // Carrega investimentos e dados do user (saldo) em paralelo
      const [appData, userData] = await Promise.all([
        ApplicationService.list(),
        UserService.me()
      ])
      setItems(appData)
      setBalance(userData.balance)
    } catch {
      toast.error('Erro ao sincronizar dados')
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
    if (Number(amount) > balance) {
      toast.error('Saldo insuficiente para esta aplicação')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 space-y-6 animate-pulse font-normal">
        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-[#161A1F] rounded-xl"/><div className="w-40 h-4 bg-[#161A1F] rounded"/></div>
        <div className="bg-[#161A1F] h-64 rounded-3xl" />
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-[#161A1F] h-24 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-10 pb-32 font-normal">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-[#161A1F] border border-white/5 text-gray-400"
          >
            <ArrowLeft size={18} weight="bold" />
          </button>
          <h1 className="text-lg font-medium uppercase tracking-tight">Investimentos</h1>
        </div>

        {/* SALDO DISPONÍVEL NO TOPO */}
        <div className="text-right">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Saldo disponível</p>
          <p className="text-sm font-medium text-emerald-500">{formatCurrencyAOA(balance)}</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-[#161A1F] p-6 rounded-[2rem] border border-white/5 shadow-2xl space-y-6">
        
        <div className="flex items-center gap-2 mb-2 text-emerald-500">
           <TrendUp size={20} weight="bold" />
           <span className="text-[10px] font-bold uppercase tracking-widest">Nova Aplicação</span>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Prazo de Aplicação</p>
          <select
            value={periodDays}
            onChange={(e) => setPeriodDays(Number(e.target.value))}
            className="w-full h-12 bg-[#0B0E11] border border-white/5 rounded-2xl px-4 text-sm font-medium outline-none focus:border-emerald-500/50 transition-colors"
          >
            <option value={15}>15 dias (1.5% Yield)</option>
            <option value={90}>3 meses (1.8% Yield)</option>
            <option value={180}>6 meses (1.8% Yield)</option>
            <option value={365}>12 meses (1.8% Yield)</option>
          </select>
        </div>

        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Valor do Depósito (Kz)</p>
          <input
            type="number"
            placeholder="Introduza o montante"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-12 bg-[#0B0E11] border border-white/5 rounded-2xl px-4 text-sm font-medium outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-800"
          />
        </div>

        {Number(amount) > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Estimativa de Lucro</span>
              <span className="text-emerald-500 font-medium">
                + {preview.profit.toLocaleString()} Kz
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Retorno Total</span>
              <span className="text-lg font-medium text-emerald-500">
                {preview.total.toLocaleString()} Kz
              </span>
            </div>
          </div>
        )}

        <button
          disabled={!isValid}
          onClick={create}
          className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all active:scale-95
            ${isValid
              ? "bg-white text-black shadow-lg"
              : "bg-white/5 text-gray-600 border border-white/5"
            }
          `}
        >
          {creating ? 'Processando...' : 'Confirmar Aplicação'}
        </button>
      </div>

      {/* LISTA DE INVESTIMENTOS */}
      <div className="mt-10 space-y-4">
        <div className="flex items-center gap-2 ml-2 mb-4">
           <Info size={14} className="text-gray-600" />
           <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] font-mono">
             Portfólio Ativo
           </h3>
        </div>

        {items.length === 0 && (
          <div className="bg-[#161A1F] p-8 rounded-3xl border border-white/5 text-center">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Nenhuma aplicação em curso</p>
          </div>
        )}

        {items.map(app => {
          const maturity = new Date(app.maturityDate)
          const isMature = new Date() >= maturity
          const profit = Number(app.totalReturn) - Number(app.amount)

          return (
            <div key={app.id} className="bg-[#161A1F] p-5 rounded-3xl border border-white/5 shadow-lg space-y-4 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${isMature ? 'bg-gray-800' : 'bg-emerald-500'}`} />

              <div className="flex justify-between items-start">
                <div>
                   <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Montante Aplicado</p>
                   <p className="text-base font-medium text-white">{Number(app.amount).toLocaleString()} Kz</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Rendimento</p>
                   <p className="text-base font-medium text-emerald-500">+{profit.toLocaleString()} Kz</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <span className="text-[9px] font-bold text-gray-600 uppercase block">Ciclo</span>
                  <span className="text-xs font-medium text-gray-300">{app.periodDays} Dias</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-600 uppercase block">Vencimento</span>
                  <span className="text-xs font-medium text-gray-300 flex items-center gap-1">
                    <Calendar size={14} className="text-emerald-500" />
                    {maturity.toLocaleDateString('pt-AO')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                 <div className={`px-3 py-1 rounded-full text-[8px] font-bold tracking-widest uppercase border ${
                   isMature 
                   ? "bg-white/5 border-white/10 text-gray-500" 
                   : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                 }`}>
                    {isMature ? 'Finalizado' : 'Em Rendimento'}
                 </div>
                 <span className="text-[10px] font-medium text-emerald-500">
                    Total: {Number(app.totalReturn).toLocaleString()} Kz
                 </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}