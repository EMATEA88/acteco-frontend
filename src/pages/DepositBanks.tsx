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
      <div className="min-h-screen bg-[#0B0E11] text-white flex flex-col items-center justify-center px-10 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-xl font-bold mb-2">Envio Concluído!</h2>
        <p className="text-sm text-gray-400 mb-8">
          O seu comprovativo foi recebido e está em validação.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full py-4 bg-white text-black font-bold rounded-2xl text-sm"
        >
          VOLTAR AO INÍCIO
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white px-5 py-6 flex flex-col">
      <Toaster position="top-center" />
      
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full">
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-sm font-semibold">Finalizar Depósito</h1>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold ml-1">Dados para Transferência</p>
        
        {banks.map(b => (
          <div key={b.id} className="bg-[#111318] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            {/* Header do Banco */}
            <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex justify-between items-center">
              <span className="text-xs font-black text-emerald-500 uppercase tracking-tighter">{b.bank}</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-bold">ATIVA</span>
            </div>

            {/* Conteúdo Detalhado */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Campo Empresa */}
                <div>
                  <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Empresa:</label>
                  <p className="text-sm font-medium text-gray-200">{b.name || "EMATEA GESTÃO"}</p>
                </div>

                {/* Campo IBAN com Cópia */}
                <div>
                  <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">IBAN:</label>
                  <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-xl px-4 py-3 group active:bg-black/60 transition-colors">
                    <span className="text-xs font-mono text-cyan-400 break-all leading-relaxed">
                      {b.iban}
                    </span>
                    <button 
                      onClick={() => { 
                        navigator.clipboard.writeText(b.iban)
                        setCopied(b.id)
                        setTimeout(() => setCopied(null), 2000)
                      }}
                      className="ml-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all shrink-0"
                    >
                      {copied === b.id 
                        ? <CheckCircle size={18} className="text-emerald-500" /> 
                        : <Copy size={18} className="text-gray-400" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111318] border-2 border-dashed border-white/10 rounded-2xl p-5 mb-4 text-center">
        <input 
          type="file" 
          id="bank-proof" 
          hidden 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
        />
        
        <label htmlFor="bank-proof" className="flex flex-col items-center gap-2 cursor-pointer py-4">
          <div className={`p-4 rounded-full transition-all ${file ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
            <CloudArrowUp size={32} className={file ? "text-emerald-500" : "text-gray-500"} />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">
            {file ? `Selecionado: ${file.name}` : "Toque para anexar o comprovativo"}
          </p>
        </label>

        {file && !uploading && (
          <button 
            onClick={handleDirectUpload} 
            className="w-full mt-4 h-12 bg-emerald-500 hover:bg-emerald-600 text-[#0B0E11] font-black rounded-xl text-[11px] uppercase tracking-wider transition-all"
          >
            CONFIRMAR DEPÓSITO
          </button>
        )}

        {uploading && (
          <div className="w-full mt-4 h-12 bg-white/5 text-gray-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full" />
            PROCESSANDO...
          </div>
        )}
      </div>

      <button 
        onClick={handleWhatsAppSupport} 
        className="w-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-xs hover:bg-[#25D366]/20 transition-all"
      >
        <WhatsappLogo weight="fill" size={20} /> SUPORTE VIA WHATSAPP
      </button>
    </div>
  )
}