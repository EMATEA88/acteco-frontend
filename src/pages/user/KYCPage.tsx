import { useEffect, useState } from "react"
import { KYCService } from "../../services/kyc"
import Toast from "../../components/ui/Toast"
import { useAuth } from "../../contexts/AuthContext"
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react"

export default function KYCPage() {

  const [status, setStatus] = useState("LOADING")

  // ✅ ADICIONADO
  const [fullName, setFullName] = useState("")
  const { refreshUser } = useAuth()

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
      const newStatus = res.data.status

      setStatus(newStatus)

      // ✅ Atualiza usuário automaticamente após aprovação
      if (newStatus === "VERIFIED") {
        await refreshUser()
      }

    } catch {
      showToast("Erro ao carregar status", "error")
    }
  }

  async function submit() {

    // ✅ Validação adicionada
    if (!fullName || fullName.trim().length < 5) {
      showToast("Nome completo obrigatório", "error")
      return
    }

    if (!frontFile || !backFile || !selfieFile) {
      showToast("Selecione todas as imagens", "error")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      // ✅ Enviando nome completo
      formData.append("fullName", fullName.trim())

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
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF]">

      <Toast
        message={toastMessage}
        visible={toastVisible}
        type={toastType}
      />

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#1E2329] border-b border-[#2B3139] px-6 py-4 flex items-center gap-3">
        <ShieldCheck size={20} className="text-[#FCD535]" />
        <h1 className="text-lg font-semibold tracking-wide">
          Verificação de Conta
        </h1>
      </div>

      <div className="px-6 py-8 space-y-8 max-w-xl mx-auto pb-28">

        {status !== "LOADING" && (
          <StatusBadge status={status} />
        )}

        {status !== "VERIFIED" && (
          <div className="
            bg-[#1E2329]
            border border-[#2B3139]
            rounded-3xl
            p-8
            space-y-8
          ">

            {/* ✅ INPUT ADICIONADO */}
            <div className="space-y-2">
              <label className="text-sm text-[#848E9C] font-medium">
                Nome Completo (igual ao documento)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: João Manuel Silva"
                className="
                  w-full h-12 px-4 rounded-xl
                  bg-[#0B0E11]
                  border border-[#2B3139]
                  focus:outline-none focus:border-[#FCD535]
                "
              />
            </div>

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
                bg-[#FCD535] text-black
                hover:brightness-110 transition
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

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: string }) {

  const map: any = {
    VERIFIED: {
      icon: <CheckCircle size={18} />,
      text: "Conta verificada com sucesso",
      style: "bg-[#1E2329] text-[#FCD535] border border-[#FCD535]/40"
    },
    PENDING: {
      icon: <Clock size={18} />,
      text: "Documentos em análise",
      style: "bg-[#1E2329] text-[#FCD535] border border-[#FCD535]/40"
    },
    REJECTED: {
      icon: <XCircle size={18} />,
      text: "Documentos rejeitados. Envie novamente.",
      style: "bg-[#1E2329] text-[#EF4444] border border-[#EF4444]/40"
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

/* ================= UPLOAD CARD ================= */

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

      <label className="text-sm text-[#848E9C] font-medium">
        {label}
      </label>

      <div className="
        border-2 border-dashed border-[#2B3139]
        rounded-2xl
        p-6
        text-center
        transition
        cursor-pointer
        bg-[#1E2329]
      ">

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="mx-auto h-32 object-contain rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#848E9C]">
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
          className="block mt-4 text-[#FCD535] font-medium cursor-pointer"
        >
          Selecionar Imagem
        </label>

      </div>

    </div>
  )
}