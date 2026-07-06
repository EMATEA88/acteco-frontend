import { useEffect, useState } from "react"
import { BadgeDollarSign, Clock3, CheckCircle2, XCircle, TrendingUp } from "lucide-react"
import { AgentService } from "../../services/agent.service"

// Componente Skeleton para carregamento fluido
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
)

export default function AgentCommissions() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setLoading(true)
      const [summaryData, historyData] = await Promise.all([
        AgentService.getCommissionSummary(),
        AgentService.getCommissionHistory()
      ])
      setSummary(summaryData)
      setHistory(historyData)
    } catch (err) {
      console.error("Erro ao carregar comissões:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans antialiased text-[#EAECEF]">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-black tracking-wider text-white uppercase font-mono">Comissões</h1>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
          Acompanhe todas as comissões geradas pela sua equipa em tempo real.
        </p>
      </div>

      {/* CARDS SUMMARY COM SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#161A1E] rounded-2xl border border-white/[0.04] p-5 space-y-2">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-32 h-6" />
            </div>
          ))
        ) : (
          <>
            <Card title="Disponível" value={summary?.availableCommission} icon={<BadgeDollarSign size={18} />} status="available" />
            <Card title="Total Acumulado" value={summary?.totalCommission} icon={<TrendingUp size={18} />} />
            <Card title="Pendentes" value={summary?.pending?.amount} subtitle={`${summary?.pending?.count || 0} registos`} icon={<Clock3 size={18} />} status="pending" />
            <Card title="Pagas" value={summary?.paid?.amount} subtitle={`${summary?.paid?.count || 0} registos`} icon={<CheckCircle2 size={18} />} status="paid" />
          </>
        )}
      </div>

      {/* HISTÓRICO DA TABELA COM SKELETON */}
      <div className="bg-[#161A1E] rounded-[2rem] border border-white/[0.04] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/[0.03] bg-[#111418]/40">
          <h2 className="text-sm font-black text-white font-mono uppercase tracking-wider">Histórico de Comissões</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.03] bg-[#111418]/60 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4.5">Serviço</th>
                <th className="px-4 py-4.5">Referência</th>
                <th className="px-4 py-4.5 text-right font-mono">Comissão</th>
                <th className="px-4 py-4.5 text-center">Estado</th>
                <th className="px-6 py-4.5 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium divide-y divide-white/[0.02]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-4 py-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-4 py-4 text-right"><Skeleton className="w-20 h-4 ml-auto" /></td>
                    <td className="px-4 py-4"><Skeleton className="w-20 h-6 mx-auto" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="w-24 h-4 ml-auto" /></td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-gray-600 font-mono text-[11px] uppercase tracking-wider">
                    Nenhuma comissão localizada.
                  </td>
                </tr>
              ) : (
                history.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-white font-bold">{item.serviceRequest?.serviceName || "-"}</td>
                    <td className="px-4 py-4 font-mono text-gray-400">{item.serviceRequest?.customerReference || "-"}</td>
                    <td className="px-4 py-4 text-right font-mono font-black text-emerald-400">
                      {Number(item.amount || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2 })} Kz
                    </td>
                    <td className="px-4 py-4 text-center"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 text-right font-mono text-gray-500">{new Date(item.createdAt).toLocaleString("pt-AO")}</td>
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

function Card({ title, value, subtitle, icon, status }: any) {
  const getColors = () => {
    if (status === "available") return "text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
    if (status === "pending") return "text-amber-400 bg-amber-500/5 border-amber-500/10"
    if (status === "paid") return "text-blue-400 bg-blue-500/5 border-blue-500/10"
    return "text-cyan-400 bg-cyan-500/5 border-cyan-500/10"
  }
  return (
    <div className="bg-[#161A1E] rounded-2xl border border-white/[0.04] p-5 flex items-center justify-between shadow-lg">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">{title}</span>
        <h2 className="text-xl font-black text-white font-mono leading-none">
          {Number(value || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2 })} Kz
        </h2>
        {subtitle && <span className="text-[9px] font-mono text-gray-600 block">{subtitle}</span>}
      </div>
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getColors()}`}>{icon}</div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    PAID: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    DEFAULT: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }
  const config = status === "PENDING" ? { style: styles.PENDING, icon: <Clock3 size={10} />, label: "Pendente" } : 
                 status === "PAID" ? { style: styles.PAID, icon: <CheckCircle2 size={10} />, label: "Paga" } : 
                 { style: styles.DEFAULT, icon: <XCircle size={10} />, label: "Cancelada" }
  
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${config.style}`}>
      {config.icon} {config.label}
    </span>
  )
}