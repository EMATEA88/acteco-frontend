import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import {
  ArrowLeft,
  Bank,
  CurrencyCircleDollar,
  ClockCounterClockwise,
  Copy,
  CheckCircle,
  WhatsappLogo,
  CloudArrowUp,
  Check
} from '@phosphor-icons/react'
import { RechargeService } from '../services/recharge.service'
import { UserService } from '../services/user.service'
import { RedotPayService } from "../services/redotpay.service"
import { api } from '../services/api'

type BankType = { id: number; name: string; bank: string; iban: string }

export default function DepositCoordinator() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] font-sans antialiased selection:bg-cyan-500/20 pb-28">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<SelectMethod />} />
        <Route path="/aoa" element={<DepositAOA />} />
        <Route path="/redotpay" element={<DepositRedotPay />} />
        <Route path="/banks/:id" element={<DepositBanks />} />
      </Routes>
    </div>
  )
}

/* ================= COMPONENTES BASE ================= */

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-[#0B0E11]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack} 
          className="h-10 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-gray-300 text-xs font-semibold flex items-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} className="text-gray-400" />
          <span>Voltar</span>
        </button>
      </div>
      <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-mono">
        {title}
      </h1>
      <div className="w-16"></div>
    </div>
  )
}

function PrimaryButton({ children, onClick, loading, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#0B0E11] font-mono font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 active:scale-[0.98] flex items-center justify-center cursor-pointer"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
          <span>Processando...</span>
        </div>
      ) : children}
    </button>
  )
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />
}

/* ================= SELEÇÃO DE MÉTODO ================= */

function SelectMethod() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] bg-[#0B0E11]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div>
            <h1 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Depositar</h1>
            <p className="text-[10px] text-gray-400 font-mono">Escolha o canal de pagamento</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/recharge-history')}
          className="h-10 px-3.5 bg-[#161A1F] hover:bg-[#1C2128] border border-white/10 rounded-xl transition-all flex items-center gap-2 text-xs font-mono text-gray-300 shadow-sm cursor-pointer"
        >
          <ClockCounterClockwise size={16} className="text-cyan-400" />
          <span>Histórico</span>
        </button>
      </div>

      <div className="px-6 py-8 max-w-lg mx-auto">
        <p className="text-xs text-gray-400 font-mono mb-6 uppercase tracking-wider">Selecione o método de recarga</p>

        <div className="grid gap-4">
          <button 
            onClick={() => navigate('/deposit/aoa')} 
            className="group relative overflow-hidden flex items-center justify-between w-full p-5 bg-[#161A1F] border border-white/[0.08] rounded-2xl hover:border-cyan-500/60 hover:bg-[#1C2128] transition-all duration-300 shadow-xl cursor-pointer"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/[0.03] rounded-full blur-xl group-hover:bg-cyan-500/[0.08] transition-all" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                <Bank size={24} weight="duotone" />
              </div>
              <div className="text-left">
                <p className="font-bold font-mono text-sm text-white">Kwanza (AOA)</p>
                <p className="text-xs text-gray-400">Transferência bancária local (Multicaixa)</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/deposit/redotpay')}
            className="group relative overflow-hidden flex items-center justify-between w-full p-5 bg-[#161A1F] border border-white/[0.08] rounded-2xl hover:border-blue-500/60 hover:bg-[#1C2128] transition-all duration-300 shadow-xl cursor-pointer"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/[0.03] rounded-full blur-xl group-hover:bg-blue-500/[0.08] transition-all" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                <CurrencyCircleDollar size={24} weight="duotone" />
              </div>
              <div className="text-left">
                <p className="font-bold font-mono text-sm text-white">Cartão / Crypto</p>
                <p className="text-xs text-gray-400">Checkout automatizado RedotPay</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= FLUXO AOA ================= */

function DepositAOA() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | ''>('')
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    UserService.me().then(r => setBalance(r.balance)).catch(() => {})
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
    <div>
      <Header onBack={() => navigate('/deposit')} title="Depósito Bancário (AOA)" />
      
      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        <div className="bg-[#161A1F] p-4 rounded-2xl flex justify-between items-center border border-white/[0.08] shadow-lg">
          <span className="text-xs font-mono text-gray-400 uppercase">Saldo Atual</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {balance !== null ? `${balance.toLocaleString("pt-PT")} Kz` : <Skeleton className="w-24 h-5" />}
          </span>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 uppercase font-bold mb-2 ml-1">Valor a depositar (Kz)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Number(e.target.value) || '')}
            className="w-full h-14 bg-[#161A1F] border border-white/10 rounded-2xl px-4 text-lg font-mono font-bold focus:border-cyan-500 outline-none transition-all text-white shadow-inner"
            placeholder="0.00"
          />
        </div>

        <PrimaryButton onClick={submit} loading={loading}>
          Continuar para Dados Bancários
        </PrimaryButton>
      </div>
    </div>
  )
}

/* ================= FLUXO REDOTPAY ================= */

function DepositRedotPay() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number | "">("")
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    UserService.me()
      .then(user => setBalance(user.balance))
      .catch(() => {})
  }, [])

  async function submit() {
    if (!amount || Number(amount) <= 0) {
      toast.error("Informe um valor válido")
      return
    }

    try {
      setLoading(true)
      const response = await RedotPayService.createDeposit({ amount: Number(amount) })
      const gateway = response.gateway

      if (!gateway) throw new Error("Resposta inválida da RedotPay.")

      const checkoutUrl = gateway.data?.checkoutUrl ?? gateway.data?.cashierUrl ?? gateway.data?.payUrl

      if (!checkoutUrl) {
        toast.error("A RedotPay não retornou a URL de pagamento.")
        return
      }

      window.location.href = checkoutUrl
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar pagamento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header onBack={() => navigate('/deposit')} title="RedotPay Checkout" />

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        <div className="bg-[#161A1F] p-4 rounded-2xl flex justify-between items-center border border-white/[0.08] shadow-lg">
          <span className="text-xs font-mono text-gray-400 uppercase">Saldo Atual</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {balance !== null ? `${balance.toLocaleString("pt-PT")} Kz` : <Skeleton className="w-24 h-5" />}
          </span>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-400 uppercase font-bold mb-2 ml-1">Valor do depósito</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || "")}
            placeholder="0.00"
            className="w-full h-14 bg-[#161A1F] border border-white/10 rounded-2xl px-4 text-lg font-mono font-bold focus:border-cyan-500 outline-none transition-all text-white shadow-inner"
          />
        </div>

        <PrimaryButton onClick={submit} loading={loading}>
          Pagar com RedotPay
        </PrimaryButton>
      </div>
    </div>
  )
}

/* ================= TELA DE DADOS BANCÁRIOS ================= */

function DepositBanks() {
  const params = useParams()
  const navigate = useNavigate()
  
  const rechargeId = Number(params.id)

  const [banks, setBanks] = useState<BankType[]>([])
  const [copied, setCopied] = useState<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    api.get('/bank').then(res => setBanks(res.data)).catch(() => {})
  }, [])

  async function handleDirectUpload() {
    if (!file) return toast.error("Selecione o comprovativo")
    if (!rechargeId || isNaN(rechargeId)) {
      return toast.error("ID de depósito inválido")
    }
    
    setUploading(true)

    const formData = new FormData()
    formData.append('rechargeId', String(rechargeId))
    formData.append('file', file)

    try {
      await RechargeService.uploadProof(formData)
      toast.success("Enviado com sucesso!")
      setIsDone(true)
    } catch (error: any) {
      console.error("Erro:", error.response?.data)
      toast.error("Erro ao enviar comprovativo")
    } finally {
      setUploading(false)
    }
  }

  const handleWhatsAppSupport = () => {
    const phoneNumber = "244928270636"
    const message = `Olá! Enviei o comprovativo para o Depósito ID: ${rechargeId}`
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (isDone) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex flex-col items-center justify-center px-10 text-center">
        <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-6 border border-cyan-500/30 shadow-xl">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-xl font-mono font-bold mb-2">Envio Concluído!</h2>
        <p className="text-sm text-gray-400 mb-8 font-mono">
          O seu comprovativo foi recebido e está em validação.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full h-13 bg-cyan-500 text-[#0B0E11] font-mono font-black rounded-2xl text-xs uppercase tracking-wider cursor-pointer"
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    )
  }

  return (
    <div>
      <Header onBack={() => navigate('/deposit/aoa')} title="Finalizar Depósito" />

      <div className="px-6 py-6 max-w-lg mx-auto space-y-6">
        <div className="space-y-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold">Dados para Transferência (ID: #{rechargeId})</p>
          
          {banks.length === 0 ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            banks.map(b => (
              <div key={b.id} className="bg-[#161A1F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
                <div className="bg-white/[0.03] px-5 py-3 border-b border-white/[0.05] flex justify-between items-center">
                  {/* Nome do banco adicionado / corrigido aqui */}
                  <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-wider">
                    {b.bank || b.name || "Banco"}
                  </span>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-md font-mono font-bold border border-cyan-500/20">ATIVA</span>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-[9px] font-mono text-gray-500 uppercase font-bold block mb-1">Beneficiário / Empresa:</label>
                    <p className="text-xs font-bold text-gray-200 font-mono">{b.name || "EMATEA GESTÃO"}</p>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-gray-500 uppercase font-bold block mb-1">IBAN:</label>
                    <div className="flex items-center justify-between bg-[#0B0E11] border border-white/10 rounded-xl px-4 py-3 group">
                      <span className="text-xs font-mono text-cyan-400 break-all leading-relaxed">
                        {b.iban}
                      </span>
                      <button 
                        onClick={() => { 
                          navigator.clipboard.writeText(b.iban)
                          setCopied(b.id)
                          setTimeout(() => setCopied(null), 2000)
                        }}
                        className="ml-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all shrink-0 cursor-pointer"
                      >
                        {copied === b.id 
                          ? <CheckCircle size={18} className="text-cyan-400" /> 
                          : <Copy size={18} className="text-gray-400" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#161A1F] border-2 border-dashed border-white/10 rounded-2xl p-5 text-center shadow-xl">
          <input 
            type="file" 
            id="bank-proof" 
            hidden 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
          
          <label htmlFor="bank-proof" className="flex flex-col items-center gap-2 cursor-pointer py-3">
            <div className={`p-4 rounded-2xl transition-all border ${file ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/5 text-gray-400'}`}>
              <CloudArrowUp size={32} />
            </div>
            <p className="text-xs text-gray-300 font-mono font-bold mt-1">
              {file ? `Selecionado: ${file.name}` : "Toque para anexar o comprovativo"}
            </p>
            <p className="text-[10px] text-gray-500 font-mono">PNG, JPG ou JPEG</p>
          </label>

          {file && !uploading && (
            <button 
              onClick={handleDirectUpload} 
              className="w-full mt-4 h-12 bg-cyan-500 hover:bg-cyan-400 text-[#0B0E11] font-mono font-black rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              CONFIRMAR E ENVIAR COMPROVATIVO
            </button>
          )}

          {uploading && (
            <div className="w-full mt-4 h-12 bg-white/5 text-gray-300 font-mono font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-white/10">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent animate-spin rounded-full" />
              <span>ENVIANDO COMPROVATIVO...</span>
            </div>
          )}
        </div>

        <button 
          onClick={handleWhatsAppSupport} 
          className="w-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-mono font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-xs hover:bg-[#25D366]/20 transition-all shadow-lg cursor-pointer"
        >
          <WhatsappLogo weight="fill" size={20} />
          <span>SUPORTE VIA WHATSAPP</span>
        </button>
      </div>
    </div>
  )
}