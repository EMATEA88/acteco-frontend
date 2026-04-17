import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Copy, 
  CheckCircle,  
  Bank, 
  QrCode, 
  CurrencyCircleDollar,
  ShieldCheck
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

/* =========================
   CONFIG E CONSTANTES
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
   SELECT METHOD (LAYOUT PREMIUM)
========================= */
function SelectMethod({ onSelect }: { onSelect: (m: Method) => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col px-6 py-12 animate-fadeZoom selection:bg-green-500/30">
      
      {/* LOGO CIRCULADO PADRÃO */}
      <div className="flex justify-center mb-10">
        <div className="w-20 h-20 rounded-full border-2 border-white/5 overflow-hidden bg-[#111] shadow-2xl p-1">
          <img src="/logo.png" alt="EMATEA" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          Recarregar Conta
        </h1>
        <p className="text-gray-500 text-sm font-medium mt-2">Selecione o seu método de preferência</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto w-full">
        <MethodButton
          title="Depósito em AOA"
          subtitle="Transferência bancária direta"
          icon={<Bank size={28} weight="duotone" />}
          onClick={() => onSelect('AOA')}
        />

        <MethodButton
          title="Pagamento por Referência"
          subtitle="Multicaixa Express / ATM"
          icon={<QrCode size={28} weight="duotone" />}
          onClick={() => onSelect('REFERENCE')}
        />

        <MethodButton
          title="Ativos Digitais (USDT)"
          subtitle="Rede TRON · TRC20"
          highlight
          icon={<CurrencyCircleDollar size={28} weight="duotone" />}
          onClick={() => onSelect('USDT')}
        />
      </div>

      <div className="mt-auto text-center opacity-20">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Transações Seguras EMATEA</p>
      </div>
    </div>
  )
}

function MethodButton({ title, subtitle, onClick, highlight, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[2rem] p-6 border transition-all active:scale-95 flex items-center gap-5 group ${
        highlight 
        ? 'bg-white text-black border-transparent' 
        : 'bg-[#111] border-white/5 text-white hover:border-green-500/30'
      }`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
        highlight ? 'bg-black text-white' : 'bg-[#0a0a0a] text-green-500 group-hover:bg-green-500/10'
      }`}>
        {icon}
      </div>
      <div className="text-left">
        <p className="font-bold text-lg tracking-tight leading-tight">{title}</p>
        <p className={`text-xs font-medium opacity-60`}>{subtitle}</p>
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
    UserService.me().then(res => setBalance(res.data.balance)).catch(() => setBalance(0))
  }, [])

  async function submit() {
    if (!amount) return
    try {
      setLoading(true)
      const res = await RechargeService.create(Number(amount))
      navigate(`/deposit/banks/${res.id}`)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 pb-24 animate-fadeZoom">
      <Header title="Depósito Bancário" onBack={onBack} />

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Bank size={60} weight="thin" /></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">Saldo em Carteira</p>
        <p className="text-3xl font-black tracking-tighter italic">Kz {balance.toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {QUICK_AMOUNTS.map(v => (
          <button
            key={v}
            onClick={() => { setSelected(v); setAmount(v) }}
            className={`h-14 rounded-2xl text-[11px] font-black transition-all border ${
              selected === v ? 'bg-white text-black border-transparent' : 'bg-[#111] border-white/5 text-gray-400'
            }`}
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1">Montante Personalizado</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => { setAmount(Number(e.target.value) || ''); setSelected(null) }}
            className="w-full h-16 bg-[#111] border border-white/5 rounded-2xl px-6 text-xl font-black text-white focus:border-green-500/40 outline-none transition-all text-center"
          />
        </div>

        <button
          onClick={submit}
          disabled={!amount || loading}
          className="w-full h-16 rounded-2xl bg-green-600 text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-green-900/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Confirmar Intenção'}
        </button>
      </div>
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 animate-fadeZoom">
      <Header title="Recarga por Referência" onBack={onBack} />

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><QrCode size={60} weight="thin" /></div>
        
        <div className="space-y-6 relative z-10">
          <Field label="Entidade EMATEA" value={ENTITY} onCopy={() => copy(ENTITY)} />
          <Field label="Referência de Cliente" value={REFERENCE} onCopy={() => copy(REFERENCE)} />
        </div>

        <div className="bg-green-500/5 border border-green-500/10 p-5 rounded-2xl flex items-start gap-4">
          <ShieldCheck size={28} weight="duotone" className="text-green-500 flex-shrink-0" />
          <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
            Válido para Multicaixa Express ou qualquer ATM. O saldo é creditado instantaneamente após a confirmação do sistema.
          </p>
        </div>
      </div>

      {copied && <Toast message="Código copiado para a área de transferência" />}
    </div>
  )
}

function Field({ label, value, onCopy }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">{label}</p>
      <div className="flex justify-between items-center bg-[#0a0a0a] p-5 rounded-2xl border border-white/5">
        <span className="text-2xl font-black tracking-widest text-white">{value}</span>
        <button onClick={onCopy} className="p-2 bg-white/5 rounded-xl hover:text-green-500 transition-colors">
          <Copy size={20} weight="bold" />
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 animate-fadeZoom">
      <Header title="Depósito Cripto" onBack={onBack} />

      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <CurrencyCircleDollar size={40} weight="duotone" className="text-green-500" />
        </div>
        
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Endereço TRC20 (USDT)</p>
          <div className="bg-[#0a0a0a] p-5 rounded-2xl break-all font-mono text-sm text-green-400 border border-white/5">
            {USDT_ADDRESS}
          </div>
        </div>

        <button
          onClick={copy}
          className="w-full h-16 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all active:scale-95"
        >
          Copiar Endereço USDT
        </button>

        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">
          Certifique-se de usar a rede TRON (TRC20).
        </p>
      </div>

      {copied && <Toast message="Endereço copiado com sucesso" />}
    </div>
  )
}

/* ========================= */

function Header({ title, onBack }: any) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <button onClick={onBack} className="p-2.5 bg-[#111] border border-white/5 rounded-full hover:bg-white/5 transition-colors">
        <ArrowLeft size={20} weight="bold" />
      </button>
      <h1 className="text-xl font-black tracking-tighter uppercase">{title}</h1>
    </div>
  )
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-in slide-in-from-top-10">
      <CheckCircle size={22} weight="fill" className="text-green-500" />
      <span className="text-sm font-bold tracking-tight text-white">{message}</span>
    </div>
  )
}