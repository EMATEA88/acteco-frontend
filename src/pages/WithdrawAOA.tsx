import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, Info } from '@phosphor-icons/react'
import toast from 'react-hot-toast'
import { WithdrawalService } from '../services/withdrawal.service'
import { UserService } from '../services/user.service'

/* ================= COMPONENTES DE APOIO ================= */

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />
}

export default function WithdrawAOA() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await UserService.me()
        setBalance(res.data.balance || 0)
      } catch {
        toast.error("Erro ao carregar saldo")
      }
    }
    load()
  }, [])

  async function handleWithdraw() {
    if (!amount) return toast.error("Insira o valor do saque")
    const value = Number(amount)
    if (value <= 0) return toast.error("Valor inválido")
    if (balance !== null && value > balance) return toast.error("Saldo insuficiente")

    try {
      setLoading(true)
      await WithdrawalService.create(value)
      toast.success("Levantamento solicitado com sucesso!")
      setAmount('')
      
      const me = await UserService.me()
      setBalance(me.data.balance || 0)
      navigate('/profile')
    } catch (err: any) {
      toast.error(err.message || "Erro ao solicitar saque")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* HEADER PROFISSIONAL */}
      <div className="flex items-center gap-4 px-5 py-6 border-b border-white/5">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-lg font-bold text-white">Levantamento AOA</h1>
      </div>

      <div className="px-5 py-8 max-w-md mx-auto">
        
        {/* CARD DE SALDO */}
        <div className="bg-[#161A1E] border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Wallet size={24} weight="duotone" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Saldo Disponível</p>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">
                {balance !== null ? (
                  `${balance.toLocaleString('pt-AO')} Kz`
                ) : (
                  <Skeleton className="w-24 h-6 mt-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* CAMPO DE INPUT ESTILIZADO */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-1">
              Quanto deseja levantar?
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-16 bg-[#161A1E] border border-white/5 rounded-2xl px-5 text-2xl font-mono font-bold outline-none focus:border-emerald-500/50 focus:bg-[#1c2127] transition-all text-white placeholder:text-white/5"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs uppercase">Kz</div>
            </div>
          </div>

          {/* BOX DE INFORMAÇÕES */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex gap-3 items-center">
            <Info size={20} className="text-gray-400 shrink-0" />
            <div className="text-[11px] text-gray-400 leading-tight">
              Uma taxa administrativa de **3%** será aplicada ao valor bruto solicitado.
            </div>
          </div>

          {/* BOTÃO DE ACÇÃO BONITO */}
          <div className="pt-4">
            <button
              onClick={handleWithdraw}
              disabled={loading || !amount}
              className="w-full h-14 bg-white hover:bg-gray-100 text-[#0B0E11] font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  PROCESSANDO...
                </>
              ) : (
                "CONFIRMAR LEVANTAMENTO"
              )}
            </button>
            <p className="text-[10px] text-gray-600 text-center mt-6 uppercase tracking-widest font-medium">
              Pagamento via transferência bancária
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}