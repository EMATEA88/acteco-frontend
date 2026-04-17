// src/pages/Withdraw.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ClockCounterClockwise, 
  Wallet, 
  Info, 
  CheckCircle, 
  WarningCircle,
  Bank
} from '@phosphor-icons/react'
import { api } from '../services/api'
import { UserService } from '../services/user.service'

export default function Withdraw() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  // ✅ ATUALIZADO
  const FEE_PERCENT = 0.10
  const MIN_WITHDRAW = 10

  useEffect(() => {
    UserService.me()
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(0))
  }, [])

  const numericAmount = Number(amount)

  // opcional profissional (sem quebrar nada)
  const fee = Math.floor(numericAmount * FEE_PERCENT)
  const netAmount = numericAmount - fee

  function handleError(error: any) {
    const errorCode = error?.response?.data?.error || error?.error
    switch (errorCode) {
      case 'LIMIT_PER_TRANSACTION_EXCEEDED': return 'O valor excede o limite por transação.'
      case 'DAILY_LIMIT_EXCEEDED': return 'Limite diário de levantamentos atingido.'
      case 'INSUFFICIENT_BALANCE': return 'Saldo insuficiente na carteira.'
      case 'USER_BLOCKED': return 'Conta restrita. Contacte o suporte técnico.'
      default: return 'Ocorreu um erro ao processar o levantamento.'
    }
  }

  async function handleWithdraw() {
    setMessage(null)

    if (!numericAmount || numericAmount <= 0) {
      setMessage({ type: 'error', text: 'Introduza um montante válido' })
      return
    }

    // ✅ NOVO: validação mínima
    if (numericAmount < MIN_WITHDRAW) {
      setMessage({ type: 'error', text: 'Valor mínimo de levantamento é 10 Kz' })
      return
    }

    if (numericAmount > balance) {
      setMessage({ type: 'error', text: 'Saldo insuficiente para esta operação' })
      return
    }

    try {
      setLoading(true)
      await api.post('/withdrawals', { amount: numericAmount })
      setMessage({ type: 'success', text: 'Pedido de levantamento enviado!' })
      setAmount('')
      const me = await UserService.me()
      setBalance(me.data.balance)
    } catch (error: any) {
      setMessage({ type: 'error', text: handleError(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-12 pb-32 font-sans selection:bg-green-500/30 overflow-x-hidden">
      
      {/* HEADER PREMIUM */}
      <div className="flex items-center justify-between mb-10 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-[#111] border border-white/5 rounded-full hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Levantamento</h1>
        </div>

        <button
          onClick={() => navigate('/withdraw-history')}
          className="p-2.5 bg-[#111] border border-white/5 rounded-full hover:text-green-500 transition-all group"
        >
          <ClockCounterClockwise size={24} weight="duotone" className="group-hover:rotate-[-30deg] transition-transform" />
        </button>
      </div>

      <main className="max-w-xl mx-auto space-y-8">
        
        {/* CARD DE SALDO DISPONÍVEL */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Bank size={80} weight="thin" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Disponível para Saque</p>
            <p className="text-4xl font-black tracking-tighter italic text-white">
              {balance.toLocaleString()} <span className="text-sm not-italic font-bold opacity-30">Kz</span>
            </p>
          </div>
        </div>

        {/* FORMULÁRIO DE RETIRADA */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative">
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 ml-1">Montante a Retirar (AOA)</label>
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-16 bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 text-xl font-black text-white focus:border-green-500/40 outline-none transition-all text-center placeholder:text-gray-800"
              />
              <Wallet size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within:text-green-500 transition-colors" />
            </div>
          </div>

          {/* RESUMO DE TAXAS */}
          {numericAmount > 0 && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-3 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-500">Taxa de Operação (10%)</span>
                <span className="text-red-500/80">-{fee.toLocaleString()} Kz</span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Receberá na conta</span>
                <span className="text-xl font-black text-green-500 tracking-tighter italic">
                  {netAmount.toLocaleString()} Kz
                </span>
              </div>
            </div>
          )}

          {/* MENSAGENS DE FEEDBACK */}
          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider animate-in slide-in-from-top-2 ${
              message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} weight="fill" /> : <WarningCircle size={20} weight="fill" />}
              {message.text}
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={loading || !numericAmount}
            className="w-full h-16 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] disabled:opacity-20 hover:bg-green-500 hover:text-white"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : 'Confirmar Saque'}
          </button>
        </div>

        {/* NOTA DE COMPLIANCE */}
        <div className="bg-[#111]/50 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
          <Info size={28} weight="duotone" className="text-gray-600 flex-shrink-0" />
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            Os levantamentos são processados para a conta bancária associada ao seu perfil. O tempo de processamento pode variar entre 5 minutos a 24 horas úteis, dependendo da liquidez e compensação bancária.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 text-center opacity-20">
        <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Secure Funds Protocol • EMATEA 2026</p>
      </footer>
    </div>
  )
}