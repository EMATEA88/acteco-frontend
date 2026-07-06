import { useEffect, useState } from "react";
import {
  TrendingUp,
  BadgeDollarSign,
  Users,
  UserCheck,
  UserX,
  Percent,
  BarChart3
} from "lucide-react";

import { AgentService } from "../../services/agent.service";
import { formatCurrencyAOA } from "../../utils/formatCurrency";

export default function AgentStatistics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await AgentService.statistics();
      setStats(data);
    } catch (err) {
      console.error("Erro ao carregar estatísticas", err);
    } finally {
      setLoading(false);
    }
  }

  // SKELETON LOADING TEMÁTICO
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto font-sans text-[#EAECEF] space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-7 bg-[#161A1E] w-48 rounded-lg" />
          <div className="h-4 bg-[#161A1E] w-80 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-28 bg-[#161A1E] rounded-3xl border border-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20 font-mono">
        <div className="bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs px-6 py-4 rounded-2xl uppercase tracking-widest font-black">
          Não foi possível processar os dados estatísticos.
        </div>
      </div>
    );
  }

  const totalSubAgents = stats.totalSubAgents || 0;
  const activeSubAgents = stats.activeSubAgents || 0;
  const inactiveSubAgents = stats.inactiveSubAgents || 0;
  
  const activePercent = totalSubAgents === 0 ? 0 : (activeSubAgents / totalSubAgents) * 100;

  // Renderização condicional inteligente para valores monetários vs numéricos primários
  const formatStatValue = (title: string, val: any) => {
    if (title.toLowerCase().includes("comissão") || title.toLowerCase().includes("vendido")) {
      return formatCurrencyAOA(Number(val || 0));
    }
    return Number(val || 0).toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto font-sans antialiased text-[#EAECEF] space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
          <BarChart3 size={20} />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-wider text-white uppercase font-mono">
            Estatísticas de Rede
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
            Desempenho geral do Agente e da sua equipa
          </p>
        </div>
      </div>

      {/* BLOCO DE METRICAS (CARDS PREMIUM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Total Vendido"
          value={formatStatValue("Total Vendido", stats.totalSales)}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Comissão Total"
          value={formatStatValue("Comissão Total", stats.totalCommission)}
          icon={<BadgeDollarSign size={20} />}
        />
        <StatCard
          title="Comissão Disponível"
          value={formatStatValue("Comissão Disponível", stats.commissionBalance)}
          icon={<BadgeDollarSign size={20} />}
          highlight
        />
        <StatCard
          title="Sub-agentes Registados"
          value={formatStatValue("Sub-agentes", totalSubAgents)}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Operadores Ativos"
          value={formatStatValue("Ativos", activeSubAgents)}
          icon={<UserCheck size={20} />}
          status="success"
        />
        <StatCard
          title="Operadores Inativos"
          value={formatStatValue("Inativos", inactiveSubAgents)}
          icon={<UserX size={20} />}
          status="danger"
        />
      </div>

      {/* SEÇÃO INFERIOR ANALÍTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LISTA DE INDICADORES DETALHADOS */}
        <div className="bg-[#161A1E] rounded-[2rem] border border-white/[0.04] p-6 lg:col-span-3 space-y-6 shadow-2xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-white font-mono border-b border-white/[0.03] pb-3">
            Indicadores de Performance
          </h2>
          <div className="space-y-1">
            <Indicator icon={<Users size={16} />} label="Total de Sub-agentes" value={totalSubAgents} />
            <Indicator icon={<UserCheck size={16} className="text-emerald-400" />} label="Sub-agentes ativos" value={activeSubAgents} />
            <Indicator icon={<UserX size={16} className="text-rose-400" />} label="Sub-agentes inativos" value={inactiveSubAgents} />
            <Indicator icon={<TrendingUp size={16} className="text-cyan-400" />} label="Volume de vendas" value={formatCurrencyAOA(Number(stats.totalSales || 0))} />
            <Indicator icon={<BadgeDollarSign size={16} className="text-cyan-400" />} label="Comissão acumulada" value={formatCurrencyAOA(Number(stats.totalCommission || 0))} />
          </div>
        </div>

        {/* ANÁLISE DE EFICIÊNCIA CIRCULAR */}
        <div className="bg-[#161A1E] rounded-[2rem] border border-white/[0.04] p-6 lg:col-span-2 flex flex-col items-center justify-between text-center shadow-2xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-white font-mono border-b border-white/[0.03] pb-3 w-full">
            Eficiência da Equipa
          </h2>
          
          <div className="my-6 relative w-40 h-40 rounded-full border-[6px] border-white/[0.02] border-t-cyan-500 border-r-cyan-500/80 flex items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
            <div className="text-center">
              <Percent size={20} className="mx-auto text-cyan-500/60" strokeWidth={2.5} />
              <div className="text-3xl font-black text-white tracking-tighter mt-1 font-mono">
                {activePercent.toFixed(0)}%
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider max-w-[200px]">
            Rácio de produtividade e atividade da rede
          </p>
        </div>

      </div>
    </div>
  );
}

// COMPONENTE: CARD ESTATÍSTICO VIBRANTE
function StatCard({ title, value, icon, highlight, status }: any) {
  let iconColor = "text-gray-400";
  let valueColor = "text-white";
  
  if (highlight) iconColor = "text-cyan-400";
  if (status === "success") iconColor = "text-emerald-400";
  if (status === "danger") iconColor = "text-rose-400";
  if (highlight) valueColor = "text-cyan-400";

  return (
    <div className="bg-[#161A1E] rounded-3xl border border-white/[0.04] p-6 shadow-xl flex flex-col justify-between gap-4 transition-all hover:border-white/[0.08]">
      <div className="flex justify-between items-start">
        <p className="text-[11px] font-black uppercase tracking-wider text-gray-500">
          {title}
        </p>
        <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div>
        <h2 className={`text-xl font-black tracking-tight font-mono ${valueColor}`}>
          {value}
        </h2>
      </div>
    </div>
  );
}

// COMPONENTE: SUB-INDICADOR DE LINHA
function Indicator({ icon, label, value }: any) {
  return (
    <div className="flex justify-between items-center py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] px-2 rounded-xl transition-all">
      <div className="flex items-center gap-3">
        <div className="text-gray-500">
          {icon}
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-xs font-black text-white font-mono bg-white/[0.02] px-3 py-1 rounded-lg border border-white/[0.03]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}