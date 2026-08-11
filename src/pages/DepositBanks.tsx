import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { Copy, CheckCircle, ArrowLeft, WhatsappLogo, CloudArrowUp, Check } from '@phosphor-icons/react'
import { api } from '../services/api'
import { RechargeService } from '../services/recharge.service'

type BankType = { id: number; name: string; bank: string; iban: string }

export default function DepositBanks() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const rawId = params.id || location.pathname.split('/').pop()
  const rechargeId = Number(rawId)

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
      <div className="min-h-screen bg-[#0a2533] text-white flex flex-col items-center justify-center px-10 text-center">
        <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-6 border border-cyan-500/30">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-xl font-bold mb-2 font-mono uppercase tracking-wider">Envio Concluído!</h2>
        <p className="text-sm text-cyan-200/70 mb-8 font-mono">
          O seu comprovativo foi recebido e está em validação.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-sm cursor-pointer shadow-lg shadow-cyan-950/20 font-mono uppercase tracking-wider transition-all"
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] px-5 py-6 flex flex-col pb-28 max-w-xl mx-auto w-full">
      <Toaster position="top-center" />
      
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-[#0e364a] border border-cyan-500/20 rounded-full cursor-pointer hover:bg-[#124158] hover:text-white text-cyan-300 transition-all shadow-sm">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Finalizar Depósito</h1>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-[10px] text-cyan-200/60 uppercase tracking-widest font-bold ml-1 font-mono">Dados para Transferência</p>
        
        {banks.map(b => (
          <div key={b.id} className="bg-[#0e364a] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-lg shadow-cyan-950/20">
            {/* Header do Banco */}
            <div className="bg-[#0a2533]/50 px-4 py-3 border-b border-cyan-500/10 flex justify-between items-center">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-tighter font-mono">
                {b.bank || b.name || "Banco"}
              </span>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-bold font-mono">ATIVA</span>
            </div>

            {/* Conteúdo Detalhado */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Campo Banco */}
                <div>
                  <label className="text-[9px] text-cyan-200/60 uppercase font-bold block mb-1 font-mono">Banco:</label>
                  <p className="text-sm font-medium text-cyan-300 uppercase font-mono">{b.bank || "Não especificado"}</p>
                </div>

                {/* Campo Empresa */}
                <div>
                  <label className="text-[9px] text-cyan-200/60 uppercase font-bold block mb-1 font-mono">Empresa:</label>
                  <p className="text-sm font-medium text-white">{b.name || "EMATEA GESTÃO"}</p>
                </div>

                {/* Campo IBAN com Cópia */}
                <div>
                  <label className="text-[9px] text-cyan-200/60 uppercase font-bold block mb-1 font-mono">IBAN:</label>
                  <div className="flex items-center justify-between bg-[#0a2533] border border-cyan-500/20 rounded-xl px-4 py-3 group active:bg-[#0a2533]/80 transition-colors">
                    <span className="text-xs font-mono text-cyan-300 break-all leading-relaxed">
                      {b.iban}
                    </span>
                    <button 
                      onClick={() => { 
                        navigator.clipboard.writeText(b.iban)
                        setCopied(b.id)
                        setTimeout(() => setCopied(null), 2000)
                      }}
                      className="ml-3 p-2 bg-[#0e364a] border border-cyan-500/20 rounded-lg hover:bg-[#124158] transition-all shrink-0 cursor-pointer text-cyan-300"
                    >
                      {copied === b.id 
                        ? <CheckCircle size={18} className="text-cyan-400" /> 
                        : <Copy size={18} className="text-cyan-200/70" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0e364a] border-2 border-dashed border-cyan-500/30 rounded-2xl p-5 mb-4 text-center shadow-lg shadow-cyan-950/20">
        <input 
          type="file" 
          id="bank-proof" 
          hidden 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
        />
        
        <label htmlFor="bank-proof" className="flex flex-col items-center gap-2 cursor-pointer py-4">
          <div className={`p-4 rounded-full transition-all border ${file ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400' : 'bg-[#0a2533] border-cyan-500/20 text-cyan-200/60'}`}>
            <CloudArrowUp size={32} />
          </div>
          <p className="text-[10px] text-cyan-200/80 mt-2 font-medium font-mono">
            {file ? `Selecionado: ${file.name}` : "Toque para anexar o comprovativo"}
          </p>
        </label>

        {file && !uploading && (
          <button 
            onClick={handleDirectUpload} 
            className="w-full mt-4 h-14 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-950/20 cursor-pointer font-mono"
          >
            CONFIRMAR DEPÓSITO
          </button>
        )}

        {uploading && (
          <div className="w-full mt-4 h-14 bg-[#0a2533] border border-cyan-500/20 text-cyan-300 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 font-mono">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent animate-spin rounded-full" />
            PROCESSANDO...
          </div>
        )}
      </div>

      <button 
        onClick={handleWhatsAppSupport} 
        className="w-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-bold h-14 rounded-2xl flex items-center justify-center gap-2 text-xs hover:bg-[#25D366]/20 transition-all cursor-pointer font-mono shadow-md"
      >
        <WhatsappLogo weight="fill" size={20} /> SUPORTE VIA WHATSAPP
      </button>
    </div>
  )
}