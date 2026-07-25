import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  ArrowLeft,
  Bank,
  CurrencyCircleDollar,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'
import { RedotPayService } from "../services/redotpay.service"

type Method =
  | "AOA"
  | "REDOTPAY"
  | null

export default function Deposit() {
  const [method, setMethod] = useState<Method>(null)

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Toaster position="top-center" />
      {!method && <SelectMethod onSelect={setMethod} />}
      {method === 'AOA' && <DepositAOA onBack={() => setMethod(null)} />}
      {method === "REDOTPAY" &&
        <DepositRedotPay
          onBack={() => setMethod(null)}
        />
      }
    </div>
  )
}

/* ================= COMPONENTES BASE ================= */

function Header({ onBack, title, rightAction }: any) {
  return (
    <div className="flex items-center justify-between px-5 py-6 border-b border-white/5 bg-[#0B0E11]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={18} weight="bold" />
        </button>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      {rightAction && rightAction}
    </div>
  )
}

function PrimaryButton({ children, onClick, loading, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-[#0B0E11] font-bold text-sm transition-all disabled:opacity-50 active:scale-[0.98]"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
          Processando...
        </div>
      ) : children}
    </button>
  )
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />
}

/* ================= SELEÇÃO DE MÉTODO ================= */

function SelectMethod({ onSelect }: any) {
  const navigate = useNavigate()

  return (
    <>
      <div className="flex items-center justify-between px-5 py-6 border-b border-white/5">
        <h1 className="text-xl font-bold">Depositar</h1>
        <button 
          onClick={() => navigate('/recharge-history')}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90 border border-white/5 group"
        >
          <ClockCounterClockwise 
            size={20} 
            weight="bold" 
            className="text-gray-400 group-hover:text-cyan-400 transition-colors" 
          />
        </button>
      </div>

      <div className="px-5 py-8">
        <p className="text-gray-400 text-sm mb-8">Escolha como deseja recarregar sua conta</p>

        <div className="grid gap-4">
          <button 
            onClick={() => onSelect('AOA')} 
            className="flex items-center justify-between w-full p-5 bg-[#161A1E] border border-white/5 rounded-2xl hover:bg-[#1C2127] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                <Bank size={24} weight="duotone" />
              </div>
              <div className="text-left">
                <p className="font-bold">Kwanza (AOA)</p>
                <p className="text-xs text-gray-500">Transferência bancária local</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect("REDOTPAY")}
            className="flex items-center justify-between w-full p-5 bg-[#161A1E] border border-white/5 rounded-2xl hover:bg-[#1C2127] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
                <CurrencyCircleDollar
                  size={24}
                  weight="duotone"
                />
              </div>
              <div className="text-left">
                <p className="font-bold">
                  Cartão / Crypto
                </p>
                <p className="text-xs text-gray-500">
                  RedotPay Checkout
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

/* ================= FLUXO AOA ================= */

function DepositAOA({ onBack }: any) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    UserService.me().then(r => setBalance(r.balance))
  }, [])

  async function submit() {
    if (!amount || Number(amount) <= 0)
      return toast.error("Insira um valor válido")

    setLoading(true)

    try {
      const res = await RechargeService.create(Number(amount))
      navigate(`/deposit/banks/${res.id}`)
    } catch {
      toast.error("Erro ao iniciar depósito")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header onBack={onBack} title="Depósito Bancário" />
      <div className="px-5 py-6">
        <div className="bg-[#161A1E] p-4 rounded-2xl mb-6 flex justify-between items-center border border-white/5">
          <span className="text-gray-400 text-sm">Saldo Atual</span>
          <span className="font-mono font-bold text-cyan-400">
            {balance !== null ? `${balance.toLocaleString()} Kz` : <Skeleton className="w-20 h-5" />}
          </span>
        </div>

        <label className="block text-xs text-gray-500 uppercase font-bold mb-2 ml-1">Valor a depositar (AOA)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value) || '')}
          className="w-full h-14 bg-[#161A1E] border border-white/5 rounded-xl px-4 text-lg font-bold focus:border-cyan-500 outline-none transition-all mb-8 text-white"
          placeholder="0.00"
        />

        <PrimaryButton onClick={submit} loading={loading}>
          Continuar para Dados Bancários
        </PrimaryButton>
      </div>
    </>
  )
}

/* ================= FLUXO REDOTPAY ================= */

function DepositRedotPay({ onBack }: any) {
  const [amount, setAmount] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    UserService.me()
      .then(user => {
        setBalance(user.balance)
      })
  }, [])

  async function submit() {

  if (!amount || Number(amount) <= 0) {

    toast.error("Informe um valor válido")

    return

  }

  try {

    setLoading(true)

    const response =
      await RedotPayService.createDeposit({

        amount: Number(amount)

      })

    const gateway =

      response.gateway

    if (!gateway) {

      throw new Error(
        "Resposta inválida da RedotPay."
      )

    }

    const checkoutUrl =

      gateway.data?.checkoutUrl ??

      gateway.data?.cashierUrl ??

      gateway.data?.payUrl

    if (!checkoutUrl) {

      console.error(gateway)

      toast.error(
        "A RedotPay não retornou a URL de pagamento."
      )

      return

    }

    window.location.href = checkoutUrl

  } catch (error) {

    console.error(error)

    toast.error(
      "Erro ao criar pagamento."
    )

  } finally {

    setLoading(false)

  }

  }

  return (
    <>
      <Header
        onBack={onBack}
        title="RedotPay Checkout"
      />

      <div className="px-5 py-6 max-w-md mx-auto">
        <div className="bg-[#161A1E] p-4 rounded-2xl mb-6 flex justify-between items-center border border-white/5">
          <span className="text-gray-400 text-sm">
            Saldo Atual
          </span>

          <span className="font-mono font-bold text-cyan-400">
            {
              balance !== null
                ? `${balance.toLocaleString()} Kz`
                : <Skeleton className="w-20 h-5" />
            }
          </span>
        </div>

        <label className="block text-xs text-gray-500 uppercase font-bold mb-2 ml-1">
          Valor do depósito
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(
              Number(e.target.value) || ""
            )
          }
          placeholder="0.00"
          className="w-full h-14 bg-[#161A1E] border border-white/5 rounded-xl px-4 text-lg font-bold focus:border-cyan-500 outline-none transition-all mb-8 text-white"
        />

        <PrimaryButton
          onClick={submit}
          loading={loading}
        >
          Pagar com RedotPay
        </PrimaryButton>
      </div>
    </>
  )
}