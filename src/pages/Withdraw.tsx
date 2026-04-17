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
  Bank,
  PlusCircle,
  CircleNotch
} from '@phosphor-icons/react'
import { UserService } from '../services/user.service'
import { WithdrawalService } from '../services/withdrawal.service'

export default function Withdraw() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [hasBank, setHasBank] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  // 🟢 CONFIGURAÇÕES ALINHADAS COM O BACKEND
  const FEE_PERCENT = 0.10 // 10%
  const MIN_WITHDRAW = 10   // 10 Kz

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const res = await UserService.me()
        if (isMounted) {
          setBalance(res.data.balance)
          // Verifica se o objeto bank existe e tem dados reais
          const bankData = res.data.bank
          const isValidBank = bankData && (bankData.accountNumber || bankData.id)
          setHasBank(!!isValidBank)
        }
      } catch (err) {
        if (isMounted) setBalance(0)
      }
    }
    loadData()
    return () => { isMounted = false }
  }, [])

  const numericAmount = Number(amount)
  const fee = numericAmount * FEE_PERCENT
  const netAmount = numericAmount - fee

  // 🟢 TRADUTOR DE ERROS ATUALIZADO
  function handleError(err: any) {
    const errorCode = err.error || err.response?.data?.error

    switch (errorCode) {
      case 'BANK_REQUIRED': return 'Vínculo bancário obrigatório para levantamentos.'
      case 'MIN_WITHDRAW_NOT_MET': return `O valor mínimo é de ${MIN_WITHDRAW} Kz.`
      case 'WITHDRAW_PENDING_EXISTS': return 'Já possui um pedido em espera. Aguarde a aprovação.'
      case 'INSUFFICIENT_BALANCE': return 'Saldo insuficiente na conta.'
      case 'USER_BLOCKED': return 'Conta restrita. Contacte o suporte.'
      default: return err.message || 'Erro ao processar levantamento.'
    }
  }

  async function handleWithdraw() {
    setMessage(null)

    if (!hasBank) {
      setMessage({ type: 'error', text: 'Vínculo bancário necessário para continuar' })
      return
    }

    if (!numericAmount || numericAmount <= 0) {
      setMessage({ type: 'error', text: 'Introduza um montante válido' })
      return
    }

    if (numericAmount < MIN_WITHDRAW) {
      setMessage({ type: 'error', text: `Valor mínimo permitido: ${MIN_WITHDRAW} Kz` })
      return
    }

    if (numericAmount > balance) {
      setMessage({ type: 'error', text: 'Saldo insuficiente para esta operação' })
      return
    }

    try {
      setLoading(true)
      // 🟢 CHAMA O SERVICE PADRONIZADO
      await WithdrawalService.create(numericAmount)
      
      setMessage({ type: 'success', text: 'Pedido enviado com sucesso!' })
      setAmount('')
      
      // Atualiza o saldo após o sucesso
      const me = await UserService.me()
      setBalance(me.data.balance)
    } catch (err: any) {
      setMessage({ type: 'error', text: handleError(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 pt-12 pb-32 font-sans overflow-y-auto no-scrollbar">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-[#111] border border-white/5 rounded-full active:scale-90 transition-all"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Levantamento</h1>
        </div>

        <button
          onClick={() => navigate('/withdraw-history')}
          className="p-2.5 bg-[#111] border border-white/5 rounded-full hover:text-green-500 active:scale-90 transition-all"
        >
          <ClockCounterClockwise size={24} weight="duotone" />
        </button>
      </div>

      <main className="max-w-xl mx-auto space-y-6">
        
        {/* ALERTA DE BANCO FALTANDO */}
        {!hasBank && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in">
            <div className="flex items-start gap-4">
              <WarningCircle size={28} weight="fill" className="text-red-500 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-500">Atenção Requerida</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 leading-relaxed">
                  Não detectamos nenhuma conta bancária vinculada ao seu protocolo.
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/bank')}
              className="w-full h-12 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 active:scale-95 transition-all"
            >
              <PlusCircle size={18} weight="bold" />
              Vincular Conta Bancária
            </button>
          </div>
        )}

        {/* CARD DE SALDO */}
        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Bank size={80} weight="thin" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-1 italic">Capital Disponível</p>
            <p className="text-4xl font-black tracking-tighter italic text-white">
              {balance.toLocaleString()} <span className="text-sm not-italic font-bold opacity-30">Kz</span>
            </p>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <div className={`bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl transition-all ${!hasBank ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700 ml-1">Montante a Retirar (AOA)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-16 bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 text-xl font-black text-white focus:border-green-500/40 outline-none transition-all text-center placeholder:text-gray-900"
              />
              <Wallet size={24} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-800" />
            </div>
          </div>

          {/* RESUMO DE TAXAS (10%) */}
          {numericAmount > 0 && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-3 animate-in fade-in zoom-in">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-600">Taxa de Operação (10%)</span>
                <span className="text-red-500/60">-{fee.toLocaleString()} Kz</span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Valor Líquido</span>
                <span className="text-xl font-black text-green-500 tracking-tighter italic">
                  {netAmount.toLocaleString()} Kz
                </span>
              </div>
            </div>
          )}

          {message && (
            <div className={`flex items-center gap-3 p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 ${
              message.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} weight="fill" /> : <WarningCircle size={20} weight="fill" />}
              {message.text}
            </div>
          )}

          <button
            onClick={handleWithdraw}
            disabled={loading || !numericAmount || !hasBank}
            className="w-full h-16 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 disabled:opacity-10 hover:bg-green-500 hover:text-white flex items-center justify-center"
          >
            {loading ? (
              <CircleNotch size={24} className="animate-spin" />
            ) : 'Confirmar Saque'}
          </button>
        </div>

        {/* INFO */}
        <div className="bg-[#111]/30 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
          <Info size={28} weight="duotone" className="text-gray-700 flex-shrink-0" />
          <p className="text-[10px] text-gray-600 leading-relaxed font-bold uppercase">
            Os levantamentos são processados para a conta associada ao protocolo. Prazo estimado: 5 min a 24 horas úteis.
          </p>
        </div>
      </main>

      <footer className="mt-12 text-center opacity-10">
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">Secure Ledger System • 2026</p>
      </footer>
    </div>
  )
}