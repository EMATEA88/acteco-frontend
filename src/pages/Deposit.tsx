import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bank,
  QrCode,
  CurrencyCircleDollar,
  Copy,
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

const ENTITY = '10116'
const REFERENCE = '934096717'
const USDT_ADDRESS = 'TVtMdPLsFtBbA89URvzose6ZLoFeL4uGAZ'
const QUICK = [6000, 15000, 30000, 50000]

type Method = 'AOA' | 'REFERENCE' | 'USDT' | null

export default function Deposit() {
  const [method, setMethod] = useState<Method>(null)

  if (!method) return <SelectMethod onSelect={setMethod} />

  if (method === 'AOA') return <DepositAOA onBack={() => setMethod(null)} />
  if (method === 'REFERENCE') return <DepositReference onBack={() => setMethod(null)} />
  return <DepositUSDT onBack={() => setMethod(null)} />
}

/* ================= SELECT ================= */

function SelectMethod({ onSelect }: any) {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">

      <h1 className="text-lg font-bold mb-6">Depósito</h1>

      <div className="space-y-3">

        <MethodCard title="Transferência Bancária" icon={<Bank size={18} />} onClick={() => onSelect('AOA')} />

        <MethodCard title="Referência Multicaixa" icon={<QrCode size={18} />} onClick={() => onSelect('REFERENCE')} />

        <MethodCard title="USDT (TRC20)" icon={<CurrencyCircleDollar size={18} />} onClick={() => onSelect('USDT')} />

      </div>
    </div>
  )
}

function MethodCard({ title, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full h-14 bg-[#111318] border border-white/5 rounded-xl px-4 flex items-center gap-3 text-sm"
    >
      <div className="text-emerald-500">{icon}</div>
      {title}
    </button>
  )
}

/* ================= AOA ================= */

function DepositAOA({ onBack }: any) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    UserService.me().then(r => setBalance(r.data.balance)).catch(() => {})
  }, [])

  async function submit() {
    if (!amount) return
    setLoading(true)
    const res = await RechargeService.create(Number(amount))
    navigate(`/deposit/banks/${res.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">

      <Header onBack={onBack} title="Depósito" />

      <div className="bg-[#111318] border border-white/5 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500">Saldo</p>
        <p className="text-lg text-emerald-500">{balance.toLocaleString()} Kz</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {QUICK.map(v => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            className="h-10 bg-[#111318] border border-white/5 rounded-lg text-xs"
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>

      <input
        value={amount}
        onChange={e => setAmount(Number(e.target.value) || '')}
        placeholder="Valor"
        className="w-full h-11 bg-[#111318] border border-white/5 rounded-xl px-4 mb-4"
      />

      <PrimaryButton onClick={submit} loading={loading}>
        Confirmar
      </PrimaryButton>
    </div>
  )
}

/* ================= REFERENCE ================= */

function DepositReference({ onBack }: any) {
  const [copied, setCopied] = useState(false)

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">

      <Header onBack={onBack} title="Referência" />

      <Field label="Entidade" value={ENTITY} onCopy={() => copy(ENTITY)} />
      <Field label="Referência" value={REFERENCE} onCopy={() => copy(REFERENCE)} />

      {copied && <Toast text="Copiado" />}
    </div>
  )
}

/* ================= USDT ================= */

function DepositUSDT({ onBack }: any) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(USDT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">

      <Header onBack={onBack} title="USDT" />

      <div className="bg-[#111318] border border-white/5 rounded-xl p-4 text-xs break-all mb-4">
        {USDT_ADDRESS}
      </div>

      <PrimaryButton onClick={copy}>
        Copiar
      </PrimaryButton>

      {copied && <Toast text="Copiado" />}
    </div>
  )
}

/* ================= COMPONENTS ================= */

function Header({ onBack, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="p-2 bg-white/5 rounded-full">
        <ArrowLeft size={16} />
      </button>
      <h1 className="text-sm font-semibold">{title}</h1>
    </div>
  )
}

function Field({ label, value, onCopy }: any) {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex justify-between items-center bg-[#111318] border border-white/5 rounded-xl px-4 h-11">
        <span className="text-sm">{value}</span>
        <button onClick={onCopy}>
          <Copy size={16} />
        </button>
      </div>
    </div>
  )
}

function PrimaryButton({ children, onClick, loading }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full h-11 rounded-xl bg-white text-black text-sm font-semibold hover:bg-emerald-500 hover:text-white transition"
    >
      {loading ? 'Processando...' : children}
    </button>
  )
}

function Toast({ text }: any) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 px-4 py-2 rounded-lg text-xs">
      {text}
    </div>
  )
}