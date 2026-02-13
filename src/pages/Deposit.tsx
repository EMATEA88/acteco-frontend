import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, CheckCircle, Wallet } from 'lucide-react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

/* =========================
   CONFIG
========================= */

const ENTITY = '10116'
const REFERENCE = '934096717'
const USDT_ADDRESS = 'TVtMdPLsFtBbA89URvzose6ZLoFeL4uGAZ'

const QUICK_AMOUNTS = [6000, 15000, 30000, 50000, 100000, 250000]

type Method = 'AOA' | 'REFERENCE' | 'USDT' | null

export default function Deposit() {
  const [method, setMethod] = useState<Method>(null)

  if (!method) {
    return <SelectMethod onSelect={setMethod} />
  }

  if (method === 'AOA') return <DepositAOA onBack={() => setMethod(null)} />
  if (method === 'REFERENCE') return <DepositReference onBack={() => setMethod(null)} />
  return <DepositUSDT onBack={() => setMethod(null)} />
}

/* =========================
   SELECT METHOD
========================= */

function SelectMethod({ onSelect }: { onSelect: (m: Method) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d9f2ff] via-[#bfe9ff] to-[#a5e1ff] flex flex-col justify-center px-6 animate-fadeZoom">

      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-xl bg-white">
          <img src="/logo.png" alt="EMATEA" className="w-full h-full object-cover" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-center mb-2 text-blue-900">
        Depósito
      </h1>

      <div className="space-y-4">

        <MethodButton
          title="Depósito em AOA"
          subtitle="Transferência bancária"
          onClick={() => onSelect('AOA')}
        />

        <MethodButton
          title="Pagamento por Referência"
          subtitle="Multicaixa Express"
          onClick={() => onSelect('REFERENCE')}
        />

        <MethodButton
          title="Depósito em USDT"
          subtitle="TRON · TRC20"
          dark
          onClick={() => onSelect('USDT')}
        />

      </div>
    </div>
  )
}

function MethodButton({ title, subtitle, onClick, dark }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-3xl p-5 shadow-xl flex items-center gap-4 transition active:scale-95 ${
        dark ? 'bg-blue-900 text-white' : 'bg-white'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        dark ? 'bg-white/20' : 'bg-blue-100'
      }`}>
        <Wallet className={dark ? 'text-white' : 'text-blue-600'} />
      </div>
      <div className="text-left">
        <p className={`font-semibold text-lg ${dark ? '' : 'text-blue-900'}`}>
          {title}
        </p>
        <p className={`text-sm ${dark ? 'opacity-80' : 'text-blue-700'}`}>
          {subtitle}
        </p>
      </div>
    </button>
  )
}

/* =========================
   AOA (BACKEND)
========================= */

function DepositAOA({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    UserService.me()
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(0))
  }, [])

  async function submit() {
    if (!amount) return
    try {
      setLoading(true)
      const res = await RechargeService.create(Number(amount))
      navigate(`/deposit/banks/${res.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d9f2ff] via-[#bfe9ff] to-[#a5e1ff] p-6 pb-24 animate-fadeZoom">
      <Header title="Depósito em AOA" onBack={onBack} />

      <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
        <p className="text-sm text-blue-700">Saldo atual</p>
        <p className="text-3xl font-bold text-blue-900 mt-1">
          Kz {balance.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {QUICK_AMOUNTS.map(v => (
          <button
            key={v}
            onClick={() => { setSelected(v); setAmount(v) }}
            className={`h-12 rounded-xl font-medium transition ${
              selected === v
                ? 'bg-blue-700 text-white'
                : 'bg-white'
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

      <button
        onClick={submit}
        disabled={!amount || loading}
        className="w-full h-12 rounded-xl bg-blue-700 text-white font-semibold transition active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Processando…' : 'Confirmar depósito'}
      </button>
    </div>
  )
}

/* =========================
   REFERÊNCIA (ESTÁTICO)
========================= */

function DepositReference({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false)

  async function copy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d9f2ff] via-[#bfe9ff] to-[#a5e1ff] p-6 animate-fadeZoom">
      <Header title="Pagamento por Referência" onBack={onBack} />

      <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-6">

        <Field label="Entidade" value={ENTITY} onCopy={() => copy(ENTITY)} />
        <Field label="Referência" value={REFERENCE} onCopy={() => copy(REFERENCE)} />

        <div className="bg-blue-100 p-4 rounded-xl text-sm text-blue-900">
          Utilize no Multicaixa Express ou ATM.
        </div>
      </div>

      {copied && <Toast message="Copiado com sucesso" />}
    </div>
  )
}

function Field({ label, value, onCopy }: any) {
  return (
    <div>
      <p className="text-sm text-blue-700 mb-1">{label}</p>
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl">
        <span className="text-xl font-bold text-blue-900">{value}</span>
        <button onClick={onCopy}>
          <Copy size={18} className="text-blue-600" />
        </button>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#d9f2ff] via-[#bfe9ff] to-[#a5e1ff] p-6 animate-fadeZoom">
      <Header title="Depósito em USDT" onBack={onBack} />

      <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="bg-blue-50 p-4 rounded-xl break-all font-mono">
          {USDT_ADDRESS}
        </div>

        <button
          onClick={copy}
          className="w-full h-12 bg-blue-700 text-white rounded-xl font-semibold"
        >
          Copiar endereço
        </button>
      </div>

      {copied && <Toast message="Endereço copiado" />}
    </div>
  )
}

/* ========================= */

function Header({ title, onBack }: any) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack}>
        <ArrowLeft className="text-blue-900" />
      </button>
      <h1 className="text-lg font-semibold text-blue-900">{title}</h1>
    </div>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 z-50">
      <CheckCircle size={18} />
      {message}
    </div>
  )
}
