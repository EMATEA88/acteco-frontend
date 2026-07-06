import { useEffect, useState } from "react";
import { Wallet, BadgeDollarSign, Users, BarChart3 } from "lucide-react";
import { AgentService } from "../../services/agent.service";

export default function AgentDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await AgentService.dashboard();
      setDashboard(data);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatKz = (value: any) => 
    Number(value || 0).toLocaleString("pt-AO", { minimumFractionDigits: 2 }) + " Kz";

  if (loading) return <div className="text-center py-20 text-gray-400">Carregando painel...</div>;

  return (
    <div className="space-y-8 p-6 text-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card title="Saldo" value={formatKz(dashboard?.currentBalance)} icon={<Wallet size={24} />} />
        <Card title="Comissão" value={formatKz(dashboard?.commissionBalance)} icon={<BadgeDollarSign size={24} />} />
        <Card title="Total Vendido" value={formatKz(dashboard?.totalSales)} icon={<BarChart3 size={24} />} />
        <Card title="Sub-agentes" value={dashboard?.totalSubAgents || 0} icon={<Users size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1c1f] rounded-xl border border-gray-800 p-6">
          <h2 className="font-semibold text-lg mb-5 text-white">Resumo da Rede</h2>
          <div className="space-y-4">
            <Item label="Sub-agentes Ativos" value={dashboard?.activeSubAgents || 0} />
            <Item label="Sub-agentes Inativos" value={dashboard?.inactiveSubAgents || 0} />
            <Item label="Total de Transações" value={dashboard?.totalTransactions || 0} />
          </div>
        </div>
        <div className="bg-[#1a1c1f] rounded-xl border border-gray-800 p-6">
          <h2 className="font-semibold text-lg mb-5 text-white">Financeiro</h2>
          <div className="space-y-4">
            <Item label="Comissão Total Acumulada" value={formatKz(dashboard?.totalCommission)} />
            <Item label="Saldo Total da Equipa" value={formatKz(dashboard?.totalTeamBalance)} />
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
          <p className="text-xs uppercase text-gray-500 font-semibold">{title}</p>
          <h2 className="text-2xl font-bold mt-1 text-white">{value}</h2>
        </div>
        <div className="text-cyan-500/80">{icon}</div>
      </div>
    </div>
  );
}

function Item({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-gray-800/50 pb-3">
      <span className="text-sm text-gray-400">{label}</span>
      <strong className="text-white font-medium">{value}</strong>
    </div>
  );
}