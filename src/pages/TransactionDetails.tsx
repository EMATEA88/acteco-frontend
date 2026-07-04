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
  type TransactionDetails
} from "../services/transaction.service"

export default function TransactionDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
  if (!id) return

  TransactionService.details(Number(id))
    .then((data) => {

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
          
          {/* LOGÓTIPO PROFISSIONAL: PREENCHIMENTO COMPLETO SEM BORDAS SOBRANDO */}
          <div className="w-16 h-16 rounded-full bg-white shadow-lg mb-6 overflow-hidden flex items-center justify-center border border-white/[0.1]">
            <img
              src="/logo.png"
              alt="EMATEA"
              className="w-full h-full object-cover"
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
                Telecomunicações
              </span>
            </div>

            {/* CLIENTE: EXIBE O NÚMERO USADO NO CARREGAMENTO */}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Cliente:
              </span>
              <span className="font-mono font-bold text-white tracking-wide">
                {transaction.reference || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-semibold">
                Operadora:
              </span>
              <span className="font-bold text-white uppercase">
                {transaction.gatewayProvider || "UNITEL"}
              </span>
            </div>

            <div className="flex justify-between items-start gap-3">
              <span className="text-gray-400 font-semibold whitespace-nowrap">
                Serviço/Plano:
              </span>
              <span className="text-right font-bold text-white break-words max-w-[180px]">
                {transaction.description}
              </span>
            </div>

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