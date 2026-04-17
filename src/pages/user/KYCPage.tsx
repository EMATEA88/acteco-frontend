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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30">
      
      <Toast message={toast.message} visible={toast.visible} type={toast.type} />

      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-xl font-black tracking-tighter uppercase">KYC Protocol</h1>
        </div>
        <ShieldCheck size={26} weight="fill" className="text-green-500" />
      </header>

      <main className="px-6 py-8 space-y-8 max-w-xl mx-auto pb-32 relative">
        
        {/* LUZ DE FUNDO */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>

        {status !== "LOADING" && <StatusBadge status={status} />}

        {status !== "VERIFIED" && status !== "PENDING" && (
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative z-10">
            
            <div className="space-y-6">
              {/* INPUT NOME */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                  Nome Completo (Identidade)
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="João Manuel Silva"
                    className="w-full h-14 px-5 rounded-2xl bg-[#0a0a0a] border border-white/5 focus:border-green-500/40 focus:ring-4 focus:ring-green-500/5 transition-all outline-none text-sm font-medium"
                  />
                  <UserFocus size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-green-500 transition-colors" />
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
              className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest bg-white text-black hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl flex items-center justify-center gap-2"
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
      style: "bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/5"
    },
    PENDING: {
      icon: <Clock size={28} weight="fill" />,
      title: "Auditoria em Curso",
      desc: "Estamos a validar os seus documentos. Aguarde.",
      style: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5"
    },
    REJECTED: {
      icon: <XCircle size={28} weight="fill" />,
      title: "Verificação Recusada",
      desc: "Documentos ilegíveis ou inválidos. Tente novamente.",
      style: "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5"
    }
  }

  const meta = map[status]
  if (!meta) return null

  return (
    <div className={`flex items-start gap-5 p-6 rounded-[2rem] border animate-in slide-in-from-top-4 ${meta.style}`}>
      <div className="shrink-0 mt-1">{meta.icon}</div>
      <div className="space-y-1">
        <h3 className="text-sm font-black uppercase tracking-widest">{meta.title}</h3>
        <p className="text-xs font-medium opacity-80 leading-relaxed">{meta.desc}</p>
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
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 ml-1">
        {label}
      </label>

      <div className={`relative min-h-[140px] rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 cursor-pointer overflow-hidden ${
        preview ? 'border-green-500/40 bg-green-500/5' : 'border-white/5 bg-[#0a0a0a] hover:border-green-500/20'
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
            <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Ficheiro Carregado
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-700 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:text-green-500">
              {icon}
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-tighter">Toque para digitalizar</p>
              <p className="text-[8px] font-medium opacity-40 uppercase">JPEG ou PNG suportados</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}