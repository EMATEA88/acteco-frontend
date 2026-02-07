import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Wallet,
} from 'lucide-react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

const QUICK_AMOUNTS = [
  6000, 15000, 30000, 50000, 100000, 250000,
]

const USDT_ADDRESS =
  'TVtMdPLsFtBbA89URvzose6ZLoFeL4uGAZ'

type Method = 'AOA' | 'USDT' | null

export default function Deposit() {
  const [method, setMethod] = useState<Method>(null)

  if (!method) {
    return <SelectMethod onSelect={setMethod} />
  }

  return method === 'USDT'
    ? <DepositUSDT onBack={() => setMethod(null)} />
    : <DepositAOA onBack={() => setMethod(null)} />
}

/* =========================
   SELECT METHOD
========================= */

function SelectMethod({ onSelect }: { onSelect: (m: Method) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 flex flex-col justify-center">
      {/* LOGO */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl ring-4 ring-emerald-500/30 bg-white">
          <img src="/logo.png" alt="ACTECO" className="w-full h-full object-cover" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-center mb-2">
        Depósito de Fundos
      </h1>
      <p className="text-sm text-gray-600 text-center mb-8">
        Escolha como deseja adicionar saldo à sua conta.
      </p>

      <div className="space-y-4">
        <MethodCard
          title="Depósito em AOA"
          description="Transferência bancária nacional"
          color="emerald"
          icon={<Wallet />}
          onClick={() => onSelect('AOA')}
        />

        <MethodCard
          title="Depósito em USDT"
          description="Criptomoeda · Rede TRON (TRC20)"
          color="dark"
          icon={<Copy />}
          onClick={() => onSelect('USDT')}
        />
      </div>
    </div>
  )
}

function MethodCard({
  title,
  description,
  icon,
  color,
  onClick,
}: any) {
  const styles =
    color === 'emerald'
      ? 'bg-emerald-600 hover:bg-emerald-700'
      : 'bg-gray-900 hover:bg-black'

  return (
    <button
      onClick={onClick}
      className={`${styles} w-full rounded-3xl p-5 text-white flex items-center gap-4 shadow-lg transition active:scale-95`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-left">
        <p className="font-semibold text-lg">{title}</p>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </button>
  )
}

/* =========================
   AOA
========================= */

function DepositAOA({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    UserService.me()
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(0))
  }, [])

  async function submit() {
    if (!amount || amount <= 0) return
    try {
      setLoading(true)
      setError(null)
      const res = await RechargeService.create(Number(amount))
      navigate(`/deposit/banks/${res.id}`)
    } catch {
      setError('Não foi possível criar o pedido de depósito.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5 pb-24">
      <Header title="Depósito em AOA" onBack={onBack} />

      <BalanceCard balance={balance} />

      <p className="text-sm text-gray-600 mb-4">
        Selecione um valor rápido ou introduza o montante desejado.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {QUICK_AMOUNTS.map(v => (
          <button
            key={v}
            onClick={() => { setSelected(v); setAmount(v) }}
            className={`h-12 rounded-xl text-sm font-medium transition ${
              selected === v
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="Digite o valor"
        value={amount}
        onChange={e => { setAmount(Number(e.target.value) || ''); setSelected(null) }}
        className="w-full h-12 rounded-xl border px-4 mb-4"
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        disabled={!amount || loading}
        onClick={submit}
        className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold transition active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Processando…' : 'Confirmar depósito'}
      </button>

      <InfoBox />
    </div>
  )
}

/* =========================
   USDT
========================= */

function DepositUSDT({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(USDT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <Header title="Depósito em USDT" onBack={onBack} />

      <div className="bg-gray-900 text-white rounded-3xl p-6 mb-6 shadow-lg">
        <p className="text-sm text-emerald-400 font-medium">Rede obrigatória</p>
        <p className="text-2xl font-bold">TRON · TRC20</p>
        <p className="text-sm opacity-80 mt-2">
          Utilize apenas esta rede. Outras redes causam perda irreversível.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-card space-y-4">
        <div className="bg-gray-100 rounded-xl p-4 text-sm font-mono break-all">
          {USDT_ADDRESS}
        </div>

        <button
          onClick={copy}
          className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition"
        >
          <Copy size={16} />
          Copiar endereço
        </button>
      </div>

      {copied && (
        <Toast message="Endereço USDT copiado com sucesso" />
      )}
    </div>
  )
}

/* =========================
   UI PARTS
========================= */

function Header({ title, onBack }: any) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack}>
        <ArrowLeft />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  )
}

function BalanceCard({ balance }: { balance: number }) {
  return (
    <div className="bg-emerald-600 text-white rounded-3xl p-6 mb-6 shadow-lg">
      <p className="text-sm opacity-90">Saldo atual</p>
      <p className="text-3xl font-bold mt-1">
        Kz {balance.toLocaleString()}
      </p>
    </div>
  )
}

function InfoBox() {
  return (
    <div className="mt-6 bg-white rounded-2xl p-5 shadow-card text-sm space-y-2">
      <p className="font-medium text-gray-900">Informações importantes</p>
      <p>• Processamento: 10h00 às 22h00</p>
      <p>• Envie comprovativo apenas para canais oficiais</p>
      <p className="text-red-600 font-medium">
        A ACTECO não se responsabiliza por envios fora do horário.
      </p>
    </div>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-toastIn z-50">
      <CheckCircle size={18} />
      {message}
    </div>
  )
}
