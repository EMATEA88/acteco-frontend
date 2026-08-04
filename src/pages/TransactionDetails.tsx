import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Copy,
  Check,
  ShareNetwork
} from "@phosphor-icons/react"
import {
  TransactionService,
  type TransactionDetails as BaseTransactionDetails
} from "../services/transaction.service"

// Mapeamento exato de branding correspondente às imagens em src/assets/recharges/
const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: "UNITEL.PNG" },
  MOVICEL: { logo: "MOVICEL.PNG" },
  AFRICELL: { logo: "AFRICELL.PNG" },
  NETONE: { logo: "NETONE.PNG" },
  DSTV: { logo: "DSTV.PNG" },
  ZAP: { logo: "ZAP1.PNG" },
  ZAP_SAT: { logo: "ZAP1.PNG" },
  "ZAP FIBRA": { logo: "ZAP2.PNG" },
  ZAP_MEDIA: { logo: "ZAP2.PNG" },
  ZAP2: { logo: "ZAP2.PNG" },
  ENDE: { logo: "ENDE.PNG" },
  EPAL: { logo: "EPAL.PNG" },
  STAS: { logo: "STAS.PNG" },
  INT_VCH2: { logo: "AMAZON.PNG" },
  AMAZON: { logo: "AMAZON.PNG" },
  APPLE: { logo: "APPLE.PNG" },
  "GOOGLE PLAY": { logo: "GOOGLEPLAY.PNG" },
  GOOGLE: { logo: "GOOGLEPLAY.PNG" },
  NETFLIX: { logo: "NETFLIX.PNG" },
  SPOTIFY: { logo: "SPOTIFY.PNG" },
  PLAYSTATION: { logo: "TEAM.PNG" },
  TEAM: { logo: "TEAM.PNG" },
  XBOX: { logo: "XBOX.PNG" },
  BOLT: { logo: "BOLT.PNG" },
  FLIXBUS: { logo: "FLIXBUS.PNG" },
  PREMIERBET: { logo: "Premiebet.png" },
  PBET: { logo: "Premiebet.png" },
  BANTUBET: { logo: "BantuBet.png" },
  BBET: { logo: "BantuBet.png" },
  ELEPHANTBET: { logo: "Elephantbet.png" },
  EBET: { logo: "Elephantbet.png" },
  AFRIBET: { logo: "AfriBet.png" },
  ABET: { logo: "AfriBet.png" },
  MOBET: { logo: "Mobet.png" },
  MELBET: { logo: "MelBet.png" },
  MGMBET: { logo: "MelBet.png" },
  KWANZABET: { logo: "Kwanzabet.png" },
  "888BETS": { logo: "888Bets.png" },
  "888BET": { logo: "888Bets.png" },
  "888": { logo: "888Bets.png" }
}

// Carregamento glob estático do Vite para os assets de recargas
const rechargeImages = import.meta.glob<string>(
  "../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
)

// Tipagem aprimorada para incluir o metadata customizado
export interface TransactionDetails extends BaseTransactionDetails {
  metadata?: {
    categoryName?: string
    providerName?: string
    partnerName?: string
    planName?: string
    customerReference?: string
    amount?: number
    cost?: number
    profit?: number
    aki?: any
  }
}

export default function TransactionDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!id) return

    TransactionService.details(Number(id))
      .then((data: any) => {
        console.log(data)
        setTransaction(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleCopyId = () => {
    if (!transaction) return
    navigator.clipboard.writeText(String(transaction.id))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Função robusta para extrair o nome da operadora da transação
  const getOperatorName = () => {
    const rawName = (
      transaction?.metadata?.partnerName ?? 
      transaction?.metadata?.providerName ?? 
      transaction?.description ?? 
      ""
    ).toUpperCase()

    if (rawName.includes("UNITEL")) return "UNITEL"
    if (rawName.includes("MOVICEL")) return "MOVICEL"
    if (rawName.includes("AFRICELL")) return "AFRICELL"
    if (rawName.includes("BAZZA")) return "BAZZA"
    if (rawName.includes("DSTV")) return "DSTV"
    if (rawName.includes("ZAP")) return "ZAP"
    if (rawName.includes("ENDE")) return "ENDE"
    if (rawName.includes("EPAL")) return "EPAL"
    if (rawName.includes("PREMIERBET") || rawName.includes("PBET")) return "PREMIERBET"
    if (rawName.includes("BANTUBET") || rawName.includes("BBET")) return "BANTUBET"
    if (rawName.includes("ELEPHANTBET") || rawName.includes("EBET")) return "ELEPHANTBET"

    return transaction?.metadata?.partnerName ?? transaction?.metadata?.providerName ?? "EMATEA"
  }

  // Função para resolver o caminho exato da imagem a partir do import.meta.glob
  const getOperatorLogo = (operatorKey: string) => {
    const brand = providerBranding[operatorKey.toUpperCase().trim()]
    if (!brand) return "/logo.png"

    const targetFileName = brand.logo.toLowerCase()

    for (const path in rechargeImages) {
      if (path.toLowerCase().endsWith(targetFileName)) {
        return rechargeImages[path]
      }
    }

    return "/logo.png"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center">
        <p className="text-[10px] text-gray-400 font-mono font-black animate-pulse tracking-widest">
          GERANDO RECIBO...
        </p>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center text-sm font-bold text-gray-400">
        Transação não encontrada.
      </div>
    )
  }

  const formattedAmount = `${Number(transaction.amount).toLocaleString()} ${transaction.currency}`
  const operatorName = getOperatorName()
  const operatorLogoSrc = getOperatorLogo(operatorName)

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] antialiased flex flex-col">
      
      {/* HEADER DE NAVEGAÇÃO */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-white/[0.05] bg-[#0B0E11]">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/[0.03] border border-white/[0.05] text-gray-300 rounded-xl hover:bg-white/[0.08]"
        >
          <ArrowLeft size={16} weight="bold" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-wider text-white">Comprovativo de Venda</h1>
        <button onClick={handleCopyId} className="p-2 text-gray-400 hover:text-white relative">
          {copied ? <Check size={16} className="text-emerald-400" /> : <ShareNetwork size={16} />}
        </button>
      </div>

      {/* ÁREA DE CAPTURA DO SCREENSHOT */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0B0E11]">
        
        {/* CARD DO COMPROVATIVO */}
        <div className="w-full max-w-sm bg-[#161A1E] border border-white/[0.06] rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center relative">
          
          {/* LOGÓTIPO DA OPERADORA - Ajustado com w-20 h-20 (maior) e object-cover p-0 para preencher o espaço */}
          <div className="w-20 h-20 rounded-full bg-white shadow-lg mb-6 overflow-hidden flex items-center justify-center border border-white/[0.1]">
            <img
              src={operatorLogoSrc}
              alt={operatorName}
              className="w-full h-full object-cover p-0"
            />
          </div>

          {/* BLOCO CENTRAL REESTRUTURADO */}
          <div className="w-full space-y-5 border-t border-b border-white/[0.05] py-6">

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Id:
              </span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-2 font-mono font-bold text-white"
              >
                {transaction.id}
                {copied
                  ? <Check size={13} className="text-emerald-400" />
                  : <Copy size={13} className="text-gray-500" />
                }
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Tipo:
              </span>
              <span className="font-bold text-white">
                {transaction.metadata?.categoryName ?? "Telecomunicações"}
              </span>
            </div>

            {/* CLIENTE: EXIBE O NÚMERO DO DESTINATÁRIO */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Cliente:
              </span>
              <span className="font-mono font-bold text-white tracking-wide">
                {transaction.metadata?.customerReference ?? transaction.reference ?? "-"}
              </span>
            </div>

            {/* OPERADORA: LEITURA ROBUSTA E FLEXÍVEL */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Operadora:
              </span>
              <span className="font-bold text-white uppercase">
                {operatorName}
              </span>
            </div>

            {/* SERVIÇO/PLANO CONDICIONAL (Exibido apenas se existir planName) */}
            {transaction.metadata?.planName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">
                  Serviço/Plano:
                </span>
                <span className="font-bold text-white text-right max-w-[180px] truncate">
                  {transaction.metadata.planName}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Valor:
              </span>
              <span className="text-emerald-400 font-black text-lg">
                {formattedAmount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Data:
              </span>
              <span className="font-mono text-gray-200">
                {new Date(transaction.createdAt).toLocaleString("pt-AO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Status:
              </span>
              <span
                className={`font-black uppercase ${
                  transaction.status === "PAID"
                    ? "text-emerald-400"
                    : "text-yellow-400"
                }`}
              >
                {transaction.status === "PAID" ? "Pago" : "Processando"}
              </span>
            </div>

          </div>
          
          {/* RODAPÉ DO COMPROVATIVO */}
          <p className="text-[9px] text-gray-500 font-mono tracking-wider uppercase mt-5 text-center">
            Obrigado pela preferência
          </p>

        </div>
      </div>

    </div>
  )
}