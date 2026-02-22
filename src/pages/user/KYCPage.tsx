import { useEffect, useState } from "react"
import { KYCService } from "../../services/kyc"
import Toast from "../../components/ui/Toast"
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"

export default function KYCPage() {

  const [status, setStatus] = useState("LOADING")

  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const [toastMessage, setToastMessage] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState<"success" | "error">("error")

  function showToast(message: string, type: "success" | "error") {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  async function loadStatus() {
    try {
      const res = await KYCService.status()
      setStatus(res.data.status)
    } catch {
      showToast("Erro ao carregar status", "error")
    }
  }

  async function submit() {

    if (!frontFile || !backFile || !selfieFile) {
      showToast("Selecione todas as imagens", "error")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("frontImage", frontFile)
      formData.append("backImage", backFile)
      formData.append("selfieImage", selfieFile)

      await KYCService.submit(formData)

      showToast("Documentos enviados com sucesso", "success")
      loadStatus()

    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Erro ao enviar documentos",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] to-[#0F172A] text-white">

      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
      />

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-6 py-4 flex items-center gap-3">
        <ShieldCheck size={20} className="text-emerald-400" />
        <h1 className="text-lg font-semibold tracking-wide">
          Verificação de Conta
        </h1>
      </div>

      <div className="px-6 py-8 space-y-8 max-w-xl mx-auto pb-28">

        {/* STATUS VISUAL */}
        {status !== "LOADING" && (
          <StatusBadge status={status} />
        )}

        {/* FORM */}
        {status !== "VERIFIED" && (
          <div className="
            bg-white/5
            backdrop-blur-xl
            border border-white/10
            rounded-3xl
            p-8
            shadow-2xl
            space-y-8
          ">

            <UploadCard
              label="B.I Frontal"
              file={frontFile}
              setFile={setFrontFile}
            />

            <UploadCard
              label="B.I Traseiro"
              file={backFile}
              setFile={setBackFile}
            />

            <UploadCard
              label="Selfie com Documento"
              file={selfieFile}
              setFile={setSelfieFile}
            />

            <button
              onClick={submit}
              disabled={loading}
              className="
                w-full h-12 rounded-xl font-semibold
                bg-emerald-600 text-white
                hover:bg-emerald-700 transition
                active:scale-95 disabled:opacity-50
              "
            >
              {loading ? "Enviando..." : "Enviar Documentos"}
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

/* ============================= */
/* STATUS BADGE PROFISSIONAL */
/* ============================= */

function StatusBadge({ status }: { status: string }) {

  const map: any = {
    VERIFIED: {
      icon: <CheckCircle size={18} />,
      text: "Conta verificada com sucesso",
      style: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
    },
    PENDING: {
      icon: <Clock size={18} />,
      text: "Documentos em análise",
      style: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
    },
    REJECTED: {
      icon: <XCircle size={18} />,
      text: "Documentos rejeitados. Envie novamente.",
      style: "bg-red-500/15 text-red-400 border border-red-500/20"
    }
  }

  if (!map[status]) return null

  return (
    <div className={`
      flex items-center gap-3
      p-4 rounded-2xl text-sm
      ${map[status].style}
    `}>
      {map[status].icon}
      {map[status].text}
    </div>
  )
}

/* ============================= */
/* UPLOAD CARD PROFISSIONAL */
/* ============================= */

function UploadCard({
  label,
  file,
  setFile
}: {
  label: string
  file: File | null
  setFile: (file: File | null) => void
}) {

  const preview = file ? URL.createObjectURL(file) : null

  return (
    <div className="space-y-3">

      <label className="text-sm text-gray-300 font-medium">
        {label}
      </label>

      <div className="
        border-2 border-dashed border-white/20
        rounded-2xl
        p-6
        text-center
        hover:border-emerald-500
        transition
        cursor-pointer
        bg-white/5
      ">

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="mx-auto h-32 object-contain rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Upload size={24} />
            <p className="text-sm">
              Clique para selecionar imagem
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0])
            }
          }}
          className="hidden"
          id={label}
        />

        <label
          htmlFor={label}
          className="block mt-4 text-emerald-400 font-medium cursor-pointer"
        >
          Selecionar Imagem
        </label>

      </div>

    </div>
  )
}