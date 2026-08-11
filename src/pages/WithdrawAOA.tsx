import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, Info, Receipt } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { WithdrawalService } from '../services/withdrawal.service'
import { UserService } from '../services/user.service'

/* ================= COMPONENTES DE APOIO ================= */

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-cyan-500/10 rounded ${className}`} />
}

export default function WithdrawAOA() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  // Configuração da Taxa
  const WITHDRAWAL_FEE_PERCENT = 0.03 // 3%

  useEffect(() => {
    async function load() {
      try {
        const res = await UserService.me()
        setBalance(res.balance || 0)
      } catch {
        toast.error("Erro ao carregar saldo")
      }
    }
    load()
  }, [])

  // CÁLCULOS EM TEMPO REAL
  const stats = useMemo(() => {
    const gross = Number(amount) || 0
    const fee = gross * WITHDRAWAL_FEE_PERCENT
    const net = gross - fee
    return { gross, fee, net }
  }, [amount])

  async function handleWithdraw() {
    if (!amount) return toast.error("Insira o valor do saque")
    if (stats.gross <= 0) return toast.error("Valor inválido")
    if (balance !== null && stats.gross > balance) return toast.error("Saldo insuficiente")

    try {
      setLoading(true)
      await WithdrawalService.create(stats.gross)
      toast.success("Levantamento solicitado com sucesso!")
      setAmount('')
      
      const me = await UserService.me()
      setBalance(me.balance || 0)
      navigate('/profile')
    } catch (err: any) {
      toast.error(err.message || "Erro ao solicitar saque")
    } finally {
      setLoading(false)
    }
  }

  const format = (v: number) => v.toLocaleString('pt-AO', { minimumFractionDigits: 2 })

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.06] rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-cyan-500/10 bg-[#0a2533]/90 backdrop-blur-xl sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 bg-[#0e364a] border border-cyan-500/25 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>
        <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">Levantamento AOA</h1>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto relative z-10">
        
        {/* CARD DE SALDO */}
        <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2rem] p-6 mb-8 flex items-center justify-between relative overflow-hidden shadow-xl shadow-cyan-950/20">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400" />
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl shadow-inner">
              <Wallet size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-[0.2em]">Saldo Disponível</p>
              <div className="text-xl font-mono font-black text-white tracking-tight mt-0.5">
                {balance !== null ? (
                  `${balance.toLocaleString('pt-AO')} Kz`
                ) : (
                  <Skeleton className="w-28 h-6 mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* INPUT */}
          <div>
            <label className="block text-[10px] text-cyan-200/70 uppercase font-black font-mono tracking-[0.2em] mb-3 ml-1">
              Quanto deseja levantar?
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-16 bg-[#0e364a] border border-cyan-500/20 focus:border-cyan-400 rounded-[2rem] px-6 text-2xl font-mono font-bold outline-none transition-all text-white placeholder:text-cyan-200/20 shadow-inner"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-300 font-bold font-mono text-xs uppercase">Kz</div>
            </div>
          </div>

          {/* DETALHAMENTO DE TAXAS (Só aparece se tiver valor) */}
          {stats.gross > 0 && (
            <div className="bg-[#0e364a]/70 border border-cyan-500/20 rounded-[2rem] p-6 space-y-4 shadow-xl shadow-cyan-950/20">
              <div className="flex items-center gap-2 mb-1">
                <Receipt size={18} weight="duotone" className="text-cyan-400" />
                <span className="text-[10px] font-black uppercase text-cyan-200/70 tracking-[0.2em] font-mono">Resumo do Saque</span>
              </div>
              
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-200/70">Valor Bruto</span>
                <span className="font-bold text-white">{format(stats.gross)} Kz</span>
              </div>

              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-200/70">Taxa Administrativa (3%)</span>
                <span className="font-bold text-orange-400">-{format(stats.fee)} Kz</span>
              </div>

              <div className="pt-3 border-t border-cyan-500/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-cyan-400 font-mono tracking-widest">Valor Líquido</span>
                <span className="text-lg font-mono font-black text-white">{format(stats.net)} Kz</span>
              </div>
            </div>
          )}

          {/* BOX DE INFORMAÇÕES */}
          <div className="bg-[#0e364a]/50 border border-cyan-500/10 rounded-[1.5rem] p-5 flex gap-4 items-center shadow-inner">
            <Info size={22} weight="duotone" className="text-cyan-400 shrink-0" />
            <div className="text-xs text-cyan-200/80 font-mono leading-relaxed">
              O valor líquido será o montante depositado na sua conta bancária após a dedução da taxa.
            </div>
          </div>

          {/* BOTÃO */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={loading || !amount || stats.gross <= 0}
              className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-black font-mono text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/30 hover:shadow-cyan-950/50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "CONFIRMAR LEVANTAMENTO"
              )}
            </button>
            <p className="text-[10px] text-cyan-200/50 font-mono text-center mt-6 uppercase tracking-[0.2em] font-medium">
              Pagamento via transferência bancária
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}