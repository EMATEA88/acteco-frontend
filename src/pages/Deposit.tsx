import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  ArrowLeft,
  Bank,
  CurrencyCircleDollar,
  CheckCircle,
  Copy,
  Info,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'

type Method = 'AOA' | 'USDT' | null

export default function Deposit() {
  const [method, setMethod] = useState<Method>(null)

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Toaster position="top-center" />
      {!method && <SelectMethod onSelect={setMethod} />}
      {method === 'AOA' && <DepositAOA onBack={() => setMethod(null)} />}
      {method === 'USDT' && <DepositUSDT onBack={() => setMethod(null)} />}
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
            onClick={() => onSelect('USDT')} 
            className="flex items-center justify-between w-full p-5 bg-[#161A1E] border border-white/5 rounded-2xl hover:bg-[#1C2127] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-xl group-hover:scale-110 transition-transform">
                <CurrencyCircleDollar size={24} weight="duotone" />
              </div>
              <div className="text-left">
                <p className="font-bold">USDT (TRC20)</p>
                <p className="text-xs text-gray-500">Recarga via Blockchain</p>
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
    if (!amount || amount <= 0) return toast.error("Insira um valor válido")
    setLoading(true)
    try {
      const res = await RechargeService.create({ amount: Number(amount), currency: 'AOA', method: 'BANK' })
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

/* ================= FLUXO USDT (CORRIGIDO: AUTOMÁTICO) ================= */

function DepositUSDT({ onBack }: any) {
  const [address, setAddress] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Busca o endereço da carteira do usuário
    RechargeService.getUserWallet().then(address => setAddress(address))
  }, [])

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success("Endereço copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Header onBack={onBack} title="Recarga USDT (TRC20)" />
      
      <div className="px-5 py-6 max-w-md mx-auto">
        {/* Banner de Aviso */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-2xl mb-8 flex gap-3 text-yellow-500/90 leading-tight">
          <Info size={20} weight="fill" className="shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium italic">
            Atenção: Use apenas a rede **TRON (TRC20)**. O sistema identifica seu depósito automaticamente. Assim que a transação for confirmada na rede, seu saldo será atualizado.
          </p>
        </div>

        <div className="space-y-8">
          {/* Card do Endereço */}
          <div className="bg-[#161A1E] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
            
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-5 text-center">
              Endereço de Destino (Rede Tron)
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <div className="w-full py-4 px-4 bg-black/30 rounded-xl border border-white/5">
                <div className="text-sm font-mono break-all text-center text-cyan-400 leading-relaxed tracking-tight min-h-[20px] flex items-center justify-center">
                  {address ? address : <Skeleton className="w-48 h-4 mx-auto" />}
                </div>
              </div>
              
              <button 
                onClick={handleCopy}
                disabled={!address}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl text-[11px] font-black transition-all active:scale-95
                  ${copied 
                    ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                    : 'bg-white text-black hover:bg-cyan-50'
                  }
                  disabled:opacity-20
                `}
              >
                {copied ? <CheckCircle size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
                {copied ? 'COPIADO COM SUCESSO' : 'COPIAR ENDEREÇO TRON'}
              </button>
            </div>
          </div>

          {/* Status de Varredura */}
          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-3 bg-white/5 p-4 rounded-2xl w-full">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-green-500 uppercase">Aguardando Transação</span>
               </div>
               <p className="text-[10px] text-gray-400 text-center px-4">
                 Não é necessário enviar comprovante. O saldo cairá em sua conta em até 5 minutos após a confirmação na rede.
               </p>
            </div>
            
            <div className="flex items-center gap-2 opacity-40">
              <span className="text-[10px] font-medium tracking-wide">VARREDURA BLOCKCHAIN ATIVA</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}