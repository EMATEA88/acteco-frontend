import { useEffect, useState } from "react";
import { Wallet, BadgeDollarSign, Users, BarChart3, } from "lucide-react";
import { AgentService } from "../../services/agent.service";

interface DashboardData {
  currentBalance: number;
  commissionBalance: number;
  totalSales: number;
  totalSubAgents: number;
  activeSubAgents: number;
  inactiveSubAgents: number;
  totalTransactions: number;
  totalCommission: number;
  totalTeamBalance: number;
}

export default function AgentDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Corrigido: tipagem explícita na resposta da API
    AgentService.dashboard()
      .then((res: any) => setData(res as DashboardData))
      .catch((err: Error) => console.error("Erro ao carregar dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val || 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Saldo Disponível" value={formatCurrency(data?.currentBalance || 0)} icon={<Wallet size={20} />} color="text-emerald-400" />
            <StatCard title="Comissões" value={formatCurrency(data?.commissionBalance || 0)} icon={<BadgeDollarSign size={20} />} color="text-cyan-400" />
            <StatCard title="Vendas Totais" value={formatCurrency(data?.totalSales || 0)} icon={<BarChart3 size={20} />} color="text-blue-400" />
            <StatCard title="Sub-Agentes" value={data?.totalSubAgents || 0} icon={<Users size={20} />} color="text-purple-400" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <SectionSkeleton title="Resumo da Rede" />
            <SectionSkeleton title="Financeiro" />
          </>
        ) : (
          <>
            <section className="bg-[#161A1E] rounded-3xl border border-white/[0.05] p-6 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Resumo da Rede</h2>
              <div className="space-y-4">
                <Row label="Ativos" value={data?.activeSubAgents || 0} />
                <Row label="Inativos" value={data?.inactiveSubAgents || 0} />
                <Row label="Total Transações" value={data?.totalTransactions || 0} />
              </div>
            </section>
            <section className="bg-[#161A1E] rounded-3xl border border-white/[0.05] p-6 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6">Financeiro</h2>
              <div className="space-y-4">
                <Row label="Comissão Acumulada" value={formatCurrency(data?.totalCommission || 0)} />
                <Row label="Saldo da Equipa" value={formatCurrency(data?.totalTeamBalance || 0)} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatSkeleton() {
  return <div className="bg-[#161A1E] p-6 rounded-3xl border border-white/[0.05] animate-pulse h-32" />;
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-[#161A1E] rounded-3xl border border-white/[0.05] p-6 animate-pulse">
      {/* Corrigido: título agora é exibido */}
      <div className="text-sm font-black uppercase tracking-widest text-gray-700 mb-6">{title}</div>
      <div className="space-y-4">
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-full" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-[#161A1E] p-6 rounded-3xl border border-white/[0.05]">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-[10px] uppercase tracking-widest font-black text-gray-500">{title}</p>
      <h2 className="text-xl font-bold text-white mt-1">{value}</h2>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}