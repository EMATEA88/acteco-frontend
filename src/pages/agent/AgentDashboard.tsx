import { useEffect, useState } from "react";
import {
  Wallet,
  BadgeDollarSign,
  Users,
  BarChart3,
  Calendar,
  Activity,
  PieChart,
} from "lucide-react";

import { AgentService } from "../../services/agent.service";

export default function AgentDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      setLoading(true);
      // Chamada paralela para garantir que ambos os endpoints retornam dados
      const [dashData, statsData] = await Promise.all([
        AgentService.dashboard(),
        AgentService.statistics()
      ]);

      // Unificamos os dados: mantemos o financeiro do dashboard 
      // e usamos a estatística para garantir que os dados de equipa estejam corretos
      setDashboard({
        ...dashData,
        team: statsData.team // Sobrescreve com os dados precisos da estatística
      });
    } catch (error) {
      console.error("Erro ao carregar dados do painel:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-gray-400">Carregando painel...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-red-500 text-center py-20">
        Não foi possível carregar o dashboard.
      </div>
    );
  }

  const formatKz = (value: any) => 
    Number(value || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2 }) + " Kz";

  return (
    <div className="space-y-8 p-6 text-gray-200">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card title="Saldo" value={formatKz(dashboard.currentBalance)} icon={<Wallet size={24} />} />
        <Card title="Comissão" value={formatKz(dashboard.commissionBalance)} icon={<BadgeDollarSign size={24} />} />
        <Card title="Total Vendido" value={formatKz(dashboard.totalSales)} icon={<BarChart3 size={24} />} />
        <Card title="Sub-agentes" value={dashboard.team?.total || 0} icon={<Users size={24} />} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1c1f] rounded-xl border border-gray-800 p-6">
          <h2 className="font-semibold text-lg mb-5 text-white">Vendas</h2>
          <div className="space-y-4">
            <Item icon={<Calendar size={18}/>} label="Hoje" value={formatKz(dashboard.sales?.today)} />
            <Item icon={<BarChart3 size={18}/>} label="Este mês" value={formatKz(dashboard.sales?.month)} />
            <Item icon={<Users size={18}/>} label="Sub-agentes ativos" value={dashboard.team?.active || 0} />
            <Item icon={<Users size={18}/>} label="Sub-agentes inativos" value={dashboard.team?.inactive || 0} />
          </div>
        </div>

        <div className="bg-[#1a1c1f] rounded-xl border border-gray-800 p-6">
          <h2 className="font-semibold text-lg mb-5 text-white">Comissões</h2>
          <div className="space-y-4">
            <Item icon={<BadgeDollarSign size={18}/>} label="Disponível" value={formatKz(dashboard.commissions?.available)} />
            <Item icon={<Activity size={18}/>} label="Pendentes" value={formatKz(dashboard.commissions?.pending)} />
            <Item icon={<PieChart size={18}/>} label="Total Acumulado" value={formatKz(dashboard.totalCommission)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon }: any) {
  return (
    <div className="bg-[#1a1c1f] rounded-xl border border-gray-800 p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{title}</p>
          <h2 className="text-2xl font-bold mt-1 text-white">{value}</h2>
        </div>
        <div className="text-cyan-500/80">{icon}</div>
      </div>
    </div>
  );
}

function Item({ icon, label, value }: any) {
  return (
    <div className="flex justify-between border-b border-gray-800/50 pb-3">
      <div className="flex gap-3 items-center text-gray-400">
        <span className="opacity-70">{icon}</span> 
        <span className="text-sm">{label}</span>
      </div>
      <strong className="text-white font-medium">{value}</strong>
    </div>
  );
}