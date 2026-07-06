import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { AgentService } from "../../services/agent.service";

// 1. Tipagem Clara dos Dados
interface StatsData {
  overview: {
    totalVolume: number;
    totalCommission: number;
    activeAgentsCount: number;
  };
  timeline: Array<{ date: string; valor: number }>;
}

// Componente para o efeito de carregamento estilo Binance
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

export default function AgentStatistics() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Formatter para moeda de Angola (Kwanza)
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const stats = await AgentService.getPremiumStatistics();
        setData(stats);
      } catch (err) {
        setError("Não foi possível carregar os dados de performance.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (error) return <div className="text-red-400 p-10 text-center flex justify-center items-center gap-2"><AlertCircle size={20}/> {error}</div>;

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-white">Dashboard de Performance</h1>
        <p className="text-gray-400">Análise executiva da sua rede de agentes em tempo real.</p>
      </header>

      {/* Cards de Resumo com Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#161A1E] p-6 rounded-3xl border border-white/5 space-y-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-40 h-8" />
            </div>
          ))
        ) : (
          <>
            <StatCard title="Volume Total" value={formatCurrency(data!.overview.totalVolume)} icon={<DollarSign size={20} />} color="text-emerald-400" />
            <StatCard title="Comissão Acumulada" value={formatCurrency(data!.overview.totalCommission)} icon={<Activity size={20} />} color="text-cyan-400" />
            <StatCard title="Agentes Ativos" value={data!.overview.activeAgentsCount.toString()} icon={<Users size={20} />} color="text-purple-400" />
          </>
        )}
      </section>

      {/* Gráfico Principal com Skeleton */}
      <section className="bg-[#161A1E] border border-white/10 p-8 rounded-3xl h-[400px]">
        <h3 className="text-white font-semibold mb-6">Tendência de Receita</h3>
        {loading ? (
          <div className="w-full h-full">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data!.timeline}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2e33" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#6b7280" fontSize={12} />
              <YAxis axisLine={false} tickLine={false} stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: 'transparent', borderRadius: '12px' }}
                formatter={(value: any) => [typeof value === 'number' ? formatCurrency(value) : "AOA 0,00", "Valor"]}
              />
              <Area type="monotone" dataKey="valor" stroke="#22c55e" fill="url(#colorVal)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}

// Componente de Card Reutilizável
function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-[#161A1E] p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">{title}</p>
      <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    </div>
  );
}