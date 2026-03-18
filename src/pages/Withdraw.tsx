// src/pages/Withdraw.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { api } from '../services/api'
import { UserService } from '../services/user.service'

export default function Withdraw() {

  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const FEE_PERCENT = 0.03

  useEffect(() => {
    UserService.me()
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(0))
  }, [])

  const numericAmount = Number(amount)
  const fee = numericAmount * FEE_PERCENT
  const netAmount = numericAmount - fee

  function handleError(error: any) {

    const errorCode = error?.error

    switch (errorCode) {

      case 'LIMIT_PER_TRANSACTION_EXCEEDED':
        return 'Valor excede o limite máximo por retirada.'

      case 'DAILY_LIMIT_EXCEEDED':
        return 'Limite diário de retiradas atingido.'

      case 'MONTHLY_LIMIT_EXCEEDED':
        return 'Limite mensal de retiradas atingido.'

      case 'INSUFFICIENT_BALANCE':
        return 'Saldo insuficiente.'

      case 'USER_BLOCKED':
        return 'Conta bloqueada. Entre em contato com suporte.'

      default:
        return 'Erro ao solicitar retirada.'
    }
  }

  async function handleWithdraw() {

    setMessage(null)

    if (!numericAmount || numericAmount <= 0) {
      setMessage('Informe um valor válido')
      return
    }

    if (numericAmount > balance) {
      setMessage('Saldo insuficiente')
      return
    }

    try {

      setLoading(true)

      await api.post('/withdrawals', {
        amount: numericAmount,
      })

      setMessage('Pedido enviado com sucesso')
      setAmount('')

      const me = await UserService.me()
      setBalance(me.data.balance)

    } catch (error: any) {

      const formattedMessage = handleError(error)
      setMessage(formattedMessage)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 pb-24 max-w-xl mx-auto space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#EAECEF]">
          Retirada
        </h1>

        <button
          onClick={() => navigate('/withdraw-history')}
          className="
            bg-[#1E2329] border border-[#2B3139]
            text-[#EAECEF] px-4 py-2 rounded-xl
            hover:bg-[#2B3139] transition
          "
        >
          <FileText size={18} />
        </button>
      </div>

      <div className="
        bg-[#1E2329] border border-[#2B3139]
        rounded-3xl p-6 text-center
      ">
        <p className="text-sm text-[#848E9C]">
          Saldo disponível
        </p>

        <p className="text-3xl font-bold text-emerald-400 mt-2">
          {balance.toLocaleString()} Kz
        </p>
      </div>

      <div className="
        bg-[#1E2329] border border-[#2B3139]
        rounded-3xl p-6 space-y-6
      ">

        <div>
          <label className="text-sm text-[#848E9C]">
            Montante
          </label>

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="
              w-full h-12 mt-2 px-4
              bg-[#0B0E11]
              border border-[#2B3139]
              rounded-xl text-[#EAECEF]
              focus:border-[#FCD535] outline-none
            "
          />
        </div>

        {numericAmount > 0 && (
          <div className="
            bg-[#0B0E11]
            border border-[#2B3139]
            rounded-xl p-4 text-sm space-y-2
          ">
            <div className="flex justify-between text-[#848E9C]">
              <span>Taxa (0.3%)</span>
              <span className="text-red-400 font-medium">
                {fee.toFixed(2)} Kz
              </span>
            </div>

            <div className="flex justify-between text-[#848E9C]">
              <span>Valor líquido</span>
              <span className="font-semibold text-[#EAECEF]">
                {netAmount.toFixed(2)} Kz
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="
            w-full h-12 rounded-xl
            bg-[#FCD535] text-black font-semibold
            hover:brightness-110 transition
            active:scale-[0.98]
            disabled:opacity-50
          "
        >
          {loading ? 'Processando…' : 'Confirmar'}
        </button>

        {message && (
          <div className="
            text-center text-sm
            bg-[#0B0E11]
            border border-[#2B3139]
            rounded-xl py-3
            text-[#848E9C]
          ">
            {message}
          </div>
        )}

      </div>

    </div>
  )
}