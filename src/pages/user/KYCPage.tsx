import { useEffect, useState } from "react"
import { KYCService } from "../../services/kyc"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  UserFocus,
  IdentificationCard,
  Camera
} from "@phosphor-icons/react"
import Toast from "../../components/ui/Toast"

export default function KYCPage() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  
  const [status, setStatus] = useState("LOADING")
  const [fullName, setFullName] = useState("")
  
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" as "success" | "error" })

  function showToast(message: string, type: "success" | "error") {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }

  async function loadStatus() {
    try {
      const res = await KYCService.status()
      const newStatus = res.data.status
      setStatus(newStatus)
      if (newStatus === "VERIFIED") await refreshUser()
    } catch {
      showToast("Erro ao sincronizar status de verificação", "error")
    }
  }

  async function submit() {
    if (!fullName || fullName.trim().length < 5) return showToast("Nome completo obrigatório", "error")
    if (!frontFile || !backFile || !selfieFile) return showToast("Selecione todos os documentos", "error")

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("fullName", fullName.trim())
      formData.append("frontImage", frontFile)
      formData.append("backImage", backFile)
      formData.append("selfieImage", selfieFile)

      await KYCService.submit(formData)
      showToast("Processo de auditoria iniciado", "success")
      loadStatus()
    } catch (err: any) {
      showToast(err.response?.data?.message || "Erro no envio", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStatus() }, [])

  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] font-sans selection:bg-cyan-500/30">
      
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a2533]/90 backdrop-blur-xl border-b border-cyan-500/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-[#0e364a] border border-cyan-500/20 rounded-full text-cyan-300 hover:bg-[#124158] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase font-mono text-white">KYC Protocol</h1>
        </div>
        <ShieldCheck size={26} weight="fill" className="text-cyan-400" />
      </header>

      <main className="px-6 py-8 space-y-8 max-w-xl mx-auto pb-32 relative">
        
        {/* LUZ DE FUNDO */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/[0.06] rounded-full filter blur-[100px] pointer-events-none"></div>

        {status !== "LOADING" && <StatusBadge status={status} />}

        {status !== "VERIFIED" && status !== "PENDING" && (
          <div className="bg-[#0e364a] border border-cyan-500/20 rounded-[2.5rem] p-8 space-y-8 shadow-2xl shadow-cyan-950/20 relative z-10">
            
            <div className="space-y-6">
              {/* INPUT NOME */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/70 ml-1 font-mono">
                  Nome Completo (Identidade)
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="João Manuel Silva"
                    className="w-full h-14 px-5 rounded-2xl bg-[#0a2533] border border-cyan-500/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none text-sm font-medium font-mono text-white placeholder:text-cyan-200/30"
                  />
                  <UserFocus size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-200/40 group-focus-within:text-cyan-400 transition-colors" />
                </div>
              </div>

              {/* UPLOADS */}
              <div className="grid grid-cols-1 gap-6">
                <UploadCard 
                  label="B.I Frontal" 
                  icon={<IdentificationCard size={28} weight="duotone" />} 
                  file={frontFile} 
                  setFile={setFrontFile} 
                  id="front"
                />
                <UploadCard 
                  label="B.I Traseiro" 
                  icon={<IdentificationCard size={28} weight="duotone" />} 
                  file={backFile} 
                  setFile={setBackFile} 
                  id="back"
                />
                <UploadCard 
                  label="Selfie Biométrica" 
                  icon={<Camera size={28} weight="duotone" />} 
                  file={selfieFile} 
                  setFile={setSelfieFile} 
                  id="selfie"
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full h-16 rounded-2xl font-black font-mono text-xs uppercase tracking-widest bg-cyan-600 text-white hover:bg-cyan-500 transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl shadow-cyan-950/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Finalizar Auditoria <CheckCircle size={22} weight="fill" /></>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

/* ================= STATUS BADGE PREMIUM ================= */

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    VERIFIED: {
      icon: <CheckCircle size={28} weight="fill" />,
      title: "Identidade Verificada",
      desc: "Acesso total aos serviços premium ativado.",
      style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/5"
    },
    PENDING: {
      icon: <Clock size={28} weight="fill" />,
      title: "Auditoria em Curso",
      desc: "Estamos a validar os seus documentos. Aguarde.",
      style: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 shadow-cyan-500/5"
    },
    REJECTED: {
      icon: <XCircle size={28} weight="fill" />,
      title: "Verificação Recusada",
      desc: "Documentos ilegíveis ou inválidos. Tente novamente.",
      style: "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5"
    }
  }

  const meta = map[status]
  if (!meta) return null

  return (
    <div className={`flex items-start gap-5 p-6 rounded-[2rem] border animate-in slide-in-from-top-4 font-mono ${meta.style}`}>
      <div className="shrink-0 mt-1">{meta.icon}</div>
      <div className="space-y-1">
        <h3 className="text-sm font-black uppercase tracking-widest">{meta.title}</h3>
        <p className="text-xs font-medium opacity-90 leading-relaxed">{meta.desc}</p>
      </div>
    </div>
  )
}

/* ================= UPLOAD CARD PREMIUM ================= */

function UploadCard({ label, icon, file, setFile, id }: any) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold font-mono uppercase tracking-widest text-cyan-200/70 ml-1">
        {label}
      </label>

      <div className={`relative min-h-[140px] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden ${
        preview ? 'border-cyan-400/50 bg-cyan-500/5' : 'border-cyan-500/20 bg-[#0a2533] hover:border-cyan-400/40'
      }`}>
        <input
          type="file"
          accept="image/*"
          id={id}
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        {preview ? (
          <div className="relative w-full h-full flex flex-col items-center gap-3">
            <img src={preview} alt="preview" className="h-24 w-full object-contain rounded-xl" />
            <span className="text-[9px] font-black font-mono uppercase tracking-widest text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              Ficheiro Carregado
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-cyan-200/50 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center transition-colors group-hover:text-cyan-400 group-hover:border-cyan-400/40">
              {icon}
            </div>
            <div className="text-center font-mono">
              <p className="text-[10px] font-bold uppercase tracking-tighter text-cyan-200/80">Toque para digitalizar</p>
              <p className="text-[8px] font-medium opacity-50 uppercase">JPEG ou PNG suportados</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}