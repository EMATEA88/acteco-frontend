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
  const [message, setMessage] = useState<any>(null)

  const FEE_PERCENT = 0.10
  const MIN_WITHDRAW = 10

  useEffect(() => {
    async function loadData() {
      try {
        const res = await UserService.me()
        setBalance(res.data.balance)
        const bankData = res.data.bank
        setHasBank(!!(bankData && (bankData.accountNumber || bankData.id)))
      } catch {
        setBalance(0)
      }
    }
    loadData()
  }, [])

  const numericAmount = Number(amount)
  const fee = numericAmount * FEE_PERCENT
  const netAmount = numericAmount - fee

  function handleError(err: any) {
    const errorCode = err.error || err.response?.data?.error

    switch (errorCode) {
      case 'BANK_REQUIRED': return 'Conta bancária obrigatória.'
      case 'MIN_WITHDRAW_NOT_MET': return `Mínimo: ${MIN_WITHDRAW} Kz`
      case 'WITHDRAW_PENDING_EXISTS': return 'Já existe um levantamento pendente.'
      case 'INSUFFICIENT_BALANCE': return 'Saldo insuficiente.'
      case 'USER_BLOCKED': return 'Conta bloqueada.'
      default: return 'Erro ao processar.'
    }
  }

  async function handleWithdraw() {
    setMessage(null)

    if (!hasBank) return setMessage({ type: 'error', text: 'Adicione conta bancária' })
    if (!numericAmount || numericAmount <= 0) return setMessage({ type: 'error', text: 'Valor inválido' })
    if (numericAmount < MIN_WITHDRAW) return setMessage({ type: 'error', text: `Mínimo ${MIN_WITHDRAW} Kz` })
    if (numericAmount > balance) return setMessage({ type: 'error', text: 'Saldo insuficiente' })

    try {
      setLoading(true)
      await WithdrawalService.create(numericAmount)
      setMessage({ type: 'success', text: 'Pedido enviado' })
      setAmount('')
      const me = await UserService.me()
      setBalance(me.data.balance)
    } catch (err: any) {
      setMessage({ type: 'error', text: handleError(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 pt-8 pb-28">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-semibold">Levantamento</h1>
        </div>

        <button
          onClick={() => navigate('/withdraw-history')}
          className="p-2 rounded-full bg-white/5 border border-white/10"
        >
          <ClockCounterClockwise size={18} />
        </button>
      </div>

      {/* SALDO + INPUT NA MESMA LINHA */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between mb-4">

        <div>
          <p className="text-xs text-gray-400">Saldo</p>
          <p className="text-lg font-semibold">{balance.toLocaleString()} Kz</p>
        </div>

        <div className="w-[140px] relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full h-10 bg-[#0A0D10] border border-white/10 rounded-xl px-3 text-sm outline-none"
          />
          <Wallet size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

      </div>

      {/* BANCO */}
      {!hasBank && (
        <div className="glass-card p-4 rounded-2xl mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <WarningCircle size={16} />
            Conta bancária não vinculada
          </div>

          <button
            onClick={() => navigate('/bank')}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
          >
            <PlusCircle size={14} />
            Adicionar
          </button>
        </div>
      )}

      {/* RESUMO */}
      {numericAmount > 0 && (
        <div className="glass-card p-4 rounded-2xl mb-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Taxa (10%)</span>
            <span>-{fee.toLocaleString()} Kz</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Recebe</span>
            <span className="text-emerald-400">{netAmount.toLocaleString()} Kz</span>
          </div>
        </div>
      )}

      {/* MENSAGEM */}
      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-red-500/10 text-red-400'
        }`}>
          {message.type === 'success'
            ? <CheckCircle size={16} />
            : <WarningCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* BOTÃO */}
      <button
        onClick={handleWithdraw}
        disabled={loading || !numericAmount || !hasBank}
        className="w-full h-11 rounded-full bg-emerald-500 text-black text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-40"
      >
        {loading ? <CircleNotch size={18} className="animate-spin" /> : 'Confirmar Saque'}
      </button>

      {/* INFO */}
      <div className="mt-6 text-xs text-gray-500 flex items-start gap-2">
        <Info size={14} />
        Processamento entre 5 min e 24h úteis.
      </div>

    </div>
  )
}