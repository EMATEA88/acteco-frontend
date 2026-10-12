import { useCallback, useEffect, useState, type ReactNode } from "react"
import { 
  BadgeDollarSign, 
  Clock3, 
  CheckCircle2,  
  TrendingUp, 
  ArrowClockwise, 
  Users 
} from "lucide-react"
import { AgentService } from "../../services/agent.service"

// Componente Skeleton para carregamento fluido idêntico ao Admin
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
)

export default function AgentCommissions() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [summaryData, historyData] = await Promise.all([
        AgentService.getCommissionSummary(),
        AgentService.getCommissionHistory()
      ])
      setSummary(summaryData)
      setHistory(Array.isArray(historyData) ? historyData : [])
    } catch (err) {
      console.error("Erro ao carregar comissões:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        load()
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [load])

  const handleRefresh = async () => {
    await load()
  }

  return (
    <div className="p-4 md:p-8 bg-[#0B0E11] min-h-screen text-white space-y-8 font-sans antialiased overflow-x-hidden">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comissões</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe todas as comissões geradas pela sua equipa em tempo real.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 bg-[#161A1F] hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <ArrowClockwise size={18} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {/* CARDS SUMMARY (FAIXA DE RESUMO GERAL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading && !summary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#161A1F] rounded-2xl border border-white/5 p-6 space-y-3">
              <Skeleton className="w-24 h-3" />
              <Skeleton className="w-36 h-7" />
            </div>
          ))
        ) : (
          <>
            <Card 
              title="Disponível" 
              value={summary?.availableCommission} 
              icon={<BadgeDollarSign size={22} />} 
              status="available" 
            />
            <Card 
              title="Total Acumulado" 
              value={summary?.totalCommission} 
              icon={<TrendingUp size={22} />} 
              status="total" 
            />
            <Card 
              title="Pendentes" 
              value={summary?.pending?.amount} 
              subtitle={`${summary?.pending?.count || 0} registos`} 
              icon={<Clock3 size={22} />} 
              status="pending" 
            />
            <Card 
              title="Pagas" 
              value={summary?.paid?.amount} 
              subtitle={`${summary?.paid?.count || 0} registos`} 
              icon={<CheckCircle2 size={22} />} 
              status="paid" 
            />
          </>
        )}
      </div>

      {/* HISTÓRICO DA TABELA COM SCROLL HORIZONTAL FLUIDO E PADRÃO ADMIN */}
      <div className="bg-[#161A1F] rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-cyan-400" />
          <h2 className="text-lg font-bold">Histórico de Comissões</h2>
        </div>

        <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400 text-sm">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Serviço</th>
                <th className="py-3 px-4">Referência</th>
                <th className="py-3 px-4 text-right">Comissão</th>
                <th className="py-3 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading && history.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-4"><Skeleton className="w-28 h-4" /></td>
                    <td className="py-4 px-4"><Skeleton className="w-36 h-4" /></td>
                    <td className="py-4 px-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="py-4 px-4 text-right"><Skeleton className="w-24 h-4 ml-auto" /></td>
                    <td className="py-4 px-4 text-center"><Skeleton className="w-20 h-6 mx-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500 font-mono text-xs uppercase tracking-wider">
                    Nenhuma comissão encontrada.
                  </td>
                </tr>
              ) : (
                history.map((item: any) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-4 px-4 text-gray-300 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString("pt-AO")}
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {item.serviceRequest?.serviceName || "-"}
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-400">
                      {item.serviceRequest?.customerReference || "-"}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-emerald-400 whitespace-nowrap">
                      {formatMoney(item.amount)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* =======================================================
   COMPONENTES AUXILIARES
======================================================= */

interface CardProps {
  title: string
  value: number | undefined | null
  subtitle?: string
  icon: ReactNode
  status?: string
}

function Card({ title, value, subtitle, icon, status }: CardProps) {
  const getColors = () => {
    if (status === "available") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    if (status === "pending") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    if (status === "paid") return "text-blue-400 bg-blue-500/10 border-blue-500/20"
    return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
  }

  return (
    <div className="bg-[#161A1F] rounded-2xl p-6 border border-white/5 flex flex-col justify-between shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase text-gray-500 font-semibold">{title}</p>
          <h2 className="text-2xl font-bold mt-2 break-words">{formatMoney(value)}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl border ${getColors()}`}>{icon}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "PAID"
  const isPending = status === "PENDING"

  const style = isPaid
    ? "bg-green-500/20 text-green-400"
    : isPending
    ? "bg-yellow-500/20 text-yellow-400"
    : "bg-red-500/20 text-red-400"

  const label = isPaid ? "Paga" : isPending ? "Pendente" : "Cancelada"
  const icon = isPaid ? "🟢" : isPending ? "🟡" : "🔴"

  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap ${style}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}

function formatMoney(value: number | undefined | null) {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 2
  }).format(Number(value ?? 0))
}