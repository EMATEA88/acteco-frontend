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

  const FEE_PERCENT = 0.003 // 0.3%

  useEffect(() => {
    UserService.me()
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(0))
  }, [])

  const numericAmount = Number(amount)
  const fee = numericAmount * FEE_PERCENT
  const netAmount = numericAmount - fee

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

    } catch {
      setMessage('Erro ao solicitar retirada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 pb-24 max-w-xl mx-auto space-y-8 animate-fadeZoom">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">
          Retirada
        </h1>

        <button
          onClick={() => navigate('/withdraw-history')}
          className="
            bg-white/5 border border-white/10
            text-white px-4 py-2 rounded-xl
            hover:bg-white/10 transition
          "
        >
          <FileText size={18} />
        </button>
      </div>

      {/* SALDO */}
      <div className="
        bg-white/5 border border-white/10
        rounded-3xl p-6 text-center
      ">
        <p className="text-sm text-gray-400">
          Saldo disponível
        </p>

        <p className="text-3xl font-bold text-emerald-400 mt-2">
          {balance.toLocaleString()} Kz
        </p>
      </div>

      {/* FORM */}
      <div className="
        bg-white/5 border border-white/10
        rounded-3xl p-6 space-y-6
      ">

        <div>
          <label className="text-sm text-gray-400">
            Montante
          </label>

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="
              w-full h-12 mt-2 px-4
              bg-[#0F172A]
              border border-white/10
              rounded-xl text-white
              focus:border-emerald-500 outline-none
            "
          />
        </div>

        {numericAmount > 0 && (
          <div className="
            bg-[#0F172A]
            border border-white/10
            rounded-xl p-4 text-sm space-y-2
          ">
            <div className="flex justify-between text-gray-400">
              <span>Taxa (0.3%)</span>
              <span className="text-red-400 font-medium">
                {fee.toFixed(2)} Kz
              </span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Valor líquido</span>
              <span className="text-emerald-400 font-semibold">
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
            bg-emerald-600 hover:bg-emerald-700
            text-white font-semibold
            transition hover:scale-[1.02]
            disabled:opacity-50
          "
        >
          {loading ? 'Processando…' : 'Confirmar'}
        </button>

        {message && (
          <div className="
            text-center text-sm
            bg-[#0F172A]
            border border-white/10
            rounded-xl py-3
            text-gray-300
          ">
            {message}
          </div>
        )}

      </div>

    </div>
  )
}