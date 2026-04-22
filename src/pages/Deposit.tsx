import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  ArrowLeft,
  Bank,
  CurrencyCircleDollar,
  Copy,
  ShieldCheck,
  WhatsappLogo,
  Info,
  CheckCircle
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

const QUICK = [6000, 15000, 30000, 50000]

type Method = 'AOA' | 'USDT' | null

export default function Deposit() {
  const [method, setMethod] = useState<Method>(null)

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: { background: '#111318', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }
        }} 
      />
      
      {!method && <SelectMethod onSelect={setMethod} />}
      {method === 'AOA' && <DepositAOA onBack={() => setMethod(null)} />}
      {method === 'USDT' && <DepositUSDT onBack={() => setMethod(null)} />}
    </>
  )
}

/* ================= COMPONENTES DE SUPORTE ================= */

function Header({ onBack, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
        <ArrowLeft size={16} />
      </button>
      <h1 className="text-sm font-semibold">{title}</h1>
    </div>
  )
}

function PrimaryButton({ children, onClick, loading }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full h-11 rounded-xl bg-white text-black text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
    >
      {loading ? 'A processar...' : children}
    </button>
  )
}

/* ================= SELEÇÃO DE MÉTODO ================= */

function SelectMethod({ onSelect }: { onSelect: (m: Method) => void }) {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">
      <h1 className="text-lg font-bold mb-6">Método de Depósito</h1>
      <div className="space-y-4">
        <MethodCard 
          title="Transferência Bancária (AOA)" 
          desc="Iban e Contas Nacionais"
          icon={<Bank size={24} weight="fill" />} 
          onClick={() => onSelect('AOA')} 
        />
        <MethodCard 
          title="Criptomoeda USDT (TRC20)" 
          desc="Rede Tron (Blockchain)"
          icon={<CurrencyCircleDollar size={24} weight="fill" />} 
          onClick={() => onSelect('USDT')} 
        />
      </div>
    </div>
  )
}

function MethodCard({ title, desc, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#111318] border border-white/5 rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all text-left"
    >
      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">{icon}</div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{desc}</p>
      </div>
    </button>
  )
}

/* ================= DEPÓSITO AOA ================= */

function DepositAOA({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    UserService.me().then(r => setBalance(r.data.balance)).catch(() => {})
  }, [])

  async function submit() {
    if (!amount) return toast.error("Introduza um valor válido")
    setLoading(true)
    try {
      const res = await RechargeService.create(Number(amount))
      toast.success("Solicitação criada!")
      navigate(`/deposit/banks/${res.id}`)
    } catch (error) {
      toast.error("Erro ao processar depósito")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6">
      <Header onBack={onBack} title="Depósito AOA" />
      <div className="bg-[#111318] border border-white/5 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500">Saldo Atual</p>
        <p className="text-lg text-emerald-500">{balance.toLocaleString()} Kz</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {QUICK.map(v => (
          <button key={v} onClick={() => setAmount(v)} className="h-10 bg-[#111318] border border-white/5 rounded-lg text-xs">
            {v.toLocaleString()} Kz
          </button>
        ))}
      </div>
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(Number(e.target.value) || '')}
        placeholder="Introduza o valor"
        className="w-full h-11 bg-[#111318] border border-white/5 rounded-xl px-4 mb-4 outline-none focus:border-emerald-500 transition"
      />
      <PrimaryButton onClick={submit} loading={loading}>Confirmar Depósito</PrimaryButton>
    </div>
  )
}

/* ================= DEPÓSITO USDT ================= */

function DepositUSDT({ onBack }: { onBack: () => void }) {
  const [amount, setAmount] = useState<number | ''>('')
  const [address, setAddress] = useState('Carregando...')
  const [copied, setCopied] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    RechargeService.getCompanyWallet()
      .then(res => setAddress(res.address))
      .catch(() => setAddress("Endereço indisponível no momento"))
  }, [])

  function copy() {
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success("Copiado!", { icon: '📋' })
    setTimeout(() => setCopied(false), 2000)
  }

  async function sendProof() {
    if (!amount || Number(amount) <= 0) return toast.error("Introduza o valor enviado")
    if (!file) return toast.error("Selecione o comprovativo")
    
    setLoading(true)
    try {
      // 1. Cria a recarga com o valor informado
      const recharge = await RechargeService.create(Number(amount))

      // 2. Prepara o upload com o ID gerado
      const formData = new FormData()
      formData.append('rechargeId', String(recharge.id))
      formData.append('file', file)

      await RechargeService.uploadProof(formData)
      
      toast.success("Comprovativo enviado com sucesso!", {
        duration: 4000,
        icon: <CheckCircle size={24} className="text-emerald-500" />
      })
      onBack()
    } catch (err: any) {
      console.error(err)
      toast.error("Falha ao enviar comprovativo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6 flex flex-col">
      <Header onBack={onBack} title="Depósito USDT (TRC20)" />

      <div className="mb-4">
        <p className="text-[10px] text-gray-500 mb-2 uppercase font-bold tracking-widest text-center">Quanto você enviou? (USDT)</p>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value) || '')}
          placeholder="Ex: 10"
          className="w-full h-11 bg-[#111318] border border-white/10 rounded-xl px-4 outline-none focus:border-cyan-500 transition text-center text-cyan-400 font-bold"
        />
      </div>

      <div className="bg-[#111318] border border-white/5 rounded-2xl p-6 mb-6 text-center">
        <div className="flex justify-center mb-4 text-cyan-400">
          <ShieldCheck size={48} weight="duotone" />
        </div>
        <p className="text-xs text-gray-400 mb-6 px-4 leading-relaxed">
          Envie apenas USDT pela rede **TRON (TRC20)**. O envio por outras redes resultará em perda permanente.
        </p>

        <div className="bg-[#0B0E11] border border-white/10 rounded-xl p-4 font-mono text-[10px] break-all text-cyan-400 mb-4">
          {address}
        </div>

        <button 
          onClick={copy}
          className="w-full h-11 bg-white text-black rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition active:scale-95"
        >
          <Copy size={16} /> {copied ? 'Copiado!' : 'Copiar Endereço Tron'}
        </button>
      </div>

      <div className="bg-[#111318] border border-white/5 rounded-2xl p-5 mb-6">
        <p className="text-[10px] text-gray-500 mb-4 uppercase font-bold tracking-widest text-center">
          Passo 2: Anexar Comprovativo
        </p>
        
        <input 
          type="file" 
          id="proof-input" 
          hidden 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
        />
        
        <label 
          htmlFor="proof-input"
          className={`w-full h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-cyan-500/30'
          }`}
        >
          <span className="text-[10px] text-gray-400 px-4 text-center">
            {file ? `Arquivo selecionado` : "Clique aqui para anexar o comprovativo"}
          </span>
          {file && <p className="text-[9px] text-emerald-500 font-bold uppercase">{file.name}</p>}
        </label>

        {file && (
          <button 
            onClick={sendProof}
            disabled={loading}
            className="w-full mt-4 h-11 bg-emerald-500 text-black font-bold rounded-xl text-xs active:scale-95 transition disabled:opacity-50 shadow-lg shadow-emerald-500/10"
          >
            {loading ? "ENVIANDO..." : "CONFIRMAR PAGAMENTO NO SISTEMA"}
          </button>
        )}
      </div>

      <div className="mt-auto">
        <div className="flex gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl mb-4">
          <Info size={24} className="text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-200/70">
            O seu saldo será creditado automaticamente após a nossa equipa validar o arquivo enviado acima.
          </p>
        </div>

        <button
          className="w-full bg-[#25D366] text-black font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2"
          onClick={() => window.open('https://wa.me/244928270636', '_blank')}
        >
          <WhatsappLogo weight="fill" size={24} />
          SUPORTE VIA WHATSAPP
        </button>
      </div>
    </div>
  )
}