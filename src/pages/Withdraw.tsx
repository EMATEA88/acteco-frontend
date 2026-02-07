// src/pages/Withdraw.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { api } from '../services/api'
import { UserService } from '../services/user.service'

export default function Withdraw() {
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const MIN_WITHDRAWAL = 100
  const FEE_PERCENT = 0.14

  /* 🔄 SALDO REAL */
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

    if (numericAmount < MIN_WITHDRAWAL) {
      setMessage('O valor mínimo de levantamento é 100 Kz')
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

      setMessage('Pedido de levantamento enviado com sucesso')
      setAmount('')

      // 🔄 atualiza saldo após pedido
      const me = await UserService.me()
      setBalance(me.data.balance)

    } catch (err: any) {
      const error = err?.response?.data?.error

      if (error === 'WITHDRAWAL_CLOSED') {
        setMessage('Levantamentos apenas de Segunda a Quinta, das 09h às 17:59')
      } else if (error === 'INSUFFICIENT_BALANCE') {
        setMessage('Saldo insuficiente')
      } else if (error === 'MIN_WITHDRAWAL_100') {
        setMessage('O valor mínimo de levantamento é 100 Kz')
      } else {
        setMessage('Erro ao solicitar levantamento')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>

        <h1 className="text-lg font-semibold">Retirada</h1>

        <button onClick={() => navigate('/withdraw-history')}>
          <FileText />
        </button>
      </div>

      {/* SALDO */}
      <div className="mx-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 text-center shadow">
        <p className="text-sm opacity-90">Saldo atual</p>
        <p className="text-3xl font-bold mt-1">
          {balance.toLocaleString()} Kz
        </p>
      </div>

      {/* FORM */}
      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium">
            Montante de retirada
          </label>

          <input
            type="number"
            inputMode="numeric"
            placeholder="Introduza o montante"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full h-12 mt-1 rounded-xl px-4 border border-gray-200
              appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        {numericAmount > 0 && (
          <div className="bg-white rounded-xl p-3 text-sm space-y-1">
            <p>Taxa (14%): <b>{fee.toFixed(2)} Kz</b></p>
            <p>Valor líquido: <b>{netAmount.toFixed(2)} Kz</b></p>
          </div>
        )}

        <div className="text-xs text-gray-600 space-y-1">
          <p>• Valor mínimo: 100 Kz</p>
          <p>• Taxa: 14%</p>
          <p>• Segunda a Quinta, 09:00 – 17:59</p>
        </div>

        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-green-600 text-white font-semibold
            hover:bg-green-700 active:scale-95 disabled:opacity-60"
        >
          {loading ? 'Processando…' : 'Confirmar'}
        </button>

        {message && (
          <div className="text-center text-sm bg-white rounded-xl py-2">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
