import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApplicationService } from '../../services/application.service'
import { 
  ChartLineUp, 
  ArrowLeft, 
  Calendar, 
  TrendUp, 
  ShieldCheck, 
  CurrencyCircleDollar,
  HourglassMedium
} from '@phosphor-icons/react'
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
    if (!value) return 0
    const rate = periodDays === 15 ? 1.5 : 1.8
    return value + (value * rate / 100)
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase">Investimentos</h1>
        </div>
        <ChartLineUp size={24} weight="fill" className="text-green-500" />
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 pb-32 space-y-8 relative z-10">
        
        {/* CARD DE NOVA APLICAÇÃO */}
        <section className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendUp size={80} weight="thin" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500">
              <CurrencyCircleDollar size={28} weight="duotone" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Aplicar Capital</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Crescimento Sustentável</p>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {/* SELECT PRAZO */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1">Prazo de Aplicação</label>
              <select
                value={periodDays}
                onChange={e => setPeriodDays(Number(e.target.value))}
                className="w-full h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 text-sm font-bold text-white outline-none focus:border-green-500/40 transition-all appearance-none cursor-pointer"
              >
                <option value={15}>15 dias (1.5% Yield)</option>
                <option value={90}>3 meses (1.8% Yield)</option>
                <option value={180}>6 meses (1.8% Yield)</option>
                <option value={365}>12 meses (1.8% Yield)</option>
              </select>
            </div>

            {/* INPUT VALOR */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1">Valor do Depósito (Kz)</label>
              <input
                type="number"
                placeholder="Introduza o montante"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 text-sm font-bold text-white placeholder:text-gray-800 outline-none focus:border-green-500/40 transition-all"
              />
            </div>

            {/* PREVIEW BOX */}
            {Number(amount) > 0 && (
              <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-5 animate-in fade-in zoom-in duration-300">
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Retorno Estimado em {periodDays} dias</p>
                <p className="text-2xl font-black text-white italic tracking-tighter">
                  {calculatePreview().toLocaleString()} <span className="text-xs not-italic font-bold opacity-50">Kz</span>
                </p>
              </div>
            )}

            <button
              disabled={creating}
              onClick={create}
              className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-black hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
            >
              {creating ? 'A Processar...' : 'Confirmar Aplicação'}
            </button>
          </div>
        </section>

        {/* LISTA DE ATIVOS ATIVOS */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 ml-2">
            <HourglassMedium size={18} weight="bold" className="text-gray-600" />
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Portfólio Ativo</p>
          </div>

          {loading ? (
             <div className="text-center py-10 opacity-20 animate-pulse text-xs font-bold uppercase tracking-widest">Sincronizando Ativos...</div>
          ) : items.length === 0 ? (
            <div className="bg-[#111]/50 border border-white/5 rounded-[2rem] p-10 text-center text-gray-600 font-bold uppercase text-[10px] tracking-widest italic">
              Nenhuma aplicação em curso
            </div>
          ) : (
            items.map(app => (
              <div
                key={app.id}
                className="bg-[#111] border border-white/5 rounded-[2rem] p-6 space-y-4 hover:border-green-500/20 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Montante Aplicado</p>
                    <p className="text-lg font-black tracking-tight">{Number(app.amount).toLocaleString()} Kz</p>
                  </div>
                  <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-500/20">
                    {app.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <TrendUp size={16} weight="bold" className="text-green-500" />
                    <div>
                      <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Yield Estimado</p>
                      <p className="text-xs font-bold text-green-400">{Number(app.totalReturn).toLocaleString()} Kz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end text-right">
                    <div>
                      <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Vencimento</p>
                      <p className="text-xs font-bold text-gray-300">{new Date(app.maturityDate).toLocaleDateString('pt-AO')}</p>
                    </div>
                    <Calendar size={16} weight="bold" className="text-gray-500" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* FOOTER DE CONFORMIDADE */}
      <footer className="fixed bottom-10 left-0 w-full text-center opacity-20 pointer-events-none">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck size={14} weight="bold" />
          <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Equity Protection Enabled</p>
        </div>
      </footer>
    </div>
  )
}