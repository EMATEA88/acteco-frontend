import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Users, DollarSign, Activity, AlertCircle,
  TrendingUp, ShoppingCart, History
} from "lucide-react";
import { AgentService } from "../../services/agent.service";

type PeriodStats = {
  sales: number;
  profit: number;
  count: number;
};

interface StatsData {
  overview: {
    today: PeriodStats;
    yesterday: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
    year: PeriodStats;
    total: PeriodStats;
    totalCommission: number;
    activeAgentsCount: number;
  };
  teamPerformance: Array<{
    id: number;
    name: string;
    email: string;
    code: string;
    today: PeriodStats;
    yesterday: PeriodStats;
    week: PeriodStats;
    month: PeriodStats;
    year: PeriodStats;
    total: PeriodStats;
  }>;
  recentSales: Array<{
    date: string;
    sellerName: string;
    sellerRole: string;
    service: string;
    amount: number;
    profit: number;
    reference: string | null;
  }>;
}

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

export default function AgentStatistics() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<
    "today" | "yesterday" | "week" | "month" | "year" | "total"
  >("month");

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const stats = await AgentService.getPremiumStatistics();
        setData(stats as StatsData);
      } catch {
        setError("Não foi possível carregar os dados de performance.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (error) {
    return (
      <div className="p-10 text-center text-red-400 flex justify-center items-center gap-2">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  const overview = data?.overview;
  const selectedStats = overview?.[period];

  const chartData = (data?.recentSales ?? [])
    .slice()
    .reverse()
    .reduce<Array<{ date: string; vendas: number; lucro: number }>>(
      (result, sale) => {
        const date = new Date(sale.date).toLocaleDateString("pt-AO");
        const existing = result.find((item) => item.date === date);

        if (existing) {
          existing.vendas += sale.amount;
          existing.lucro += sale.profit;
        } else {
          result.push({
            date,
            vendas: sale.amount,
            lucro: sale.profit,
          });
        }

        return result;
      },
      []
    );

  const periodOptions = [
    { value: "today", label: "Hoje" },
    { value: "yesterday", label: "Ontem" },
    { value: "week", label: "7 dias" },
    { value: "month", label: "Este mês" },
    { value: "year", label: "Este ano" },
    { value: "total", label: "Total" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8 overflow-x-hidden">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Dashboard de Performance
        </h1>
        <p className="mt-2 text-gray-400">
          Acompanhe as vendas, os lucros e o desempenho da sua rede.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-2xl border border-white/5 bg-[#161A1E] p-6"
            >
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Vendas da Rede"
              value={formatCurrency(overview?.total.sales ?? 0)}
              detail={`${overview?.total.count ?? 0} operações concluídas`}
              icon={<ShoppingCart size={20} />}
              color="text-emerald-400"
            />
            <StatCard
              title="Lucro Total da Rede"
              value={formatCurrency(overview?.total.profit ?? 0)}
              detail="Vendas concluídas"
              icon={<TrendingUp size={20} />}
              color="text-green-400"
            />
            <StatCard
              title="Comissão Acumulada"
              value={formatCurrency(overview?.totalCommission ?? 0)}
              detail="Valor registado na conta do agente"
              icon={<Activity size={20} />}
              color="text-cyan-400"
            />
            <StatCard
              title="Subagentes"
              value={String(overview?.activeAgentsCount ?? 0)}
              detail="Subagentes associados à rede"
              icon={<Users size={20} />}
              color="text-purple-400"
            />
          </>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Resumo por período</h2>

        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                period === option.value
                  ? "bg-cyan-500 text-white"
                  : "border border-white/10 bg-[#161A1E] text-gray-400 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Volume de Vendas"
              value={formatCurrency(selectedStats?.sales ?? 0)}
              detail={periodOptions.find((p) => p.value === period)?.label ?? ""}
              icon={<DollarSign size={20} />}
              color="text-emerald-400"
            />
            <StatCard
              title="Lucro"
              value={formatCurrency(selectedStats?.profit ?? 0)}
              detail="Lucro das operações concluídas"
              icon={<TrendingUp size={20} />}
              color="text-green-400"
            />
            <StatCard
              title="Operações"
              value={String(selectedStats?.count ?? 0)}
              detail="Transações concluídas"
              icon={<Activity size={20} />}
              color="text-cyan-400"
            />
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#161A1E] p-5 md:p-8">
        <h2 className="mb-6 text-lg font-bold text-white">
          Evolução das vendas e do lucro
        </h2>

        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : chartData.length === 0 ? (
          <p className="py-16 text-center text-gray-400">
            Ainda não existem vendas concluídas para apresentar no gráfico.
          </p>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2e33" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  name="Vendas"
                  stroke="#06b6d4"
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="lucro"
                  name="Lucro"
                  stroke="#22c55e"
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Seção Desempenho dos Subagentes com scroll horizontal nativo otimizado */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Users size={22} className="text-purple-400" />
          Desempenho dos Subagentes
        </h2>

        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#161A1E] shadow-lg [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-gray-400">
              <tr>
                <th className="p-4">Subagente</th>
                <th className="p-4">Código</th>
                <th className="p-4">Vendas</th>
                <th className="p-4">Lucro</th>
                <th className="p-4">Operações</th>
              </tr>
            </thead>
            <tbody>
              {!loading && (data?.teamPerformance.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Não existem subagentes associados a esta rede.
                  </td>
                </tr>
              )}

              {(data?.teamPerformance ?? []).map((agent) => (
                <tr key={agent.id} className="border-b border-white/5 text-gray-300">
                  <td className="p-4">
                    <p className="font-semibold text-white">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.email}</p>
                  </td>
                  <td className="p-4">{agent.code}</td>
                  <td className="p-4">{formatCurrency(agent[period].sales)}</td>
                  <td className="p-4 text-emerald-400">
                    {formatCurrency(agent[period].profit)}
                  </td>
                  <td className="p-4">{agent[period].count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Seção Histórico de Vendas com scroll horizontal nativo otimizado */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <History size={22} className="text-cyan-400" />
          Histórico de Vendas
        </h2>

        <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-[#161A1E] shadow-lg [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-gray-400">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Vendedor</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Serviço</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Lucro</th>
                <th className="p-4">Referência</th>
              </tr>
            </thead>
            <tbody>
              {!loading && (data?.recentSales.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Ainda não existem vendas concluídas.
                  </td>
                </tr>
              )}

              {(data?.recentSales ?? []).map((sale, index) => (
                <tr
                  key={`${sale.date}-${index}`}
                  className="border-b border-white/5 text-gray-300"
                >
                  <td className="whitespace-nowrap p-4">{formatDate(sale.date)}</td>
                  <td className="p-4 font-medium text-white">{sale.sellerName}</td>
                  <td className="p-4">
                    {sale.sellerRole === "AGENT" ? "Agente" : "Subagente"}
                  </td>
                  <td className="p-4">{sale.service || "—"}</td>
                  <td className="whitespace-nowrap p-4">
                    {formatCurrency(sale.amount)}
                  </td>
                  <td className="whitespace-nowrap p-4 text-emerald-400">
                    {formatCurrency(sale.profit)}
                  </td>
                  <td className="p-4">{sale.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">
          O histórico apresenta até 100 vendas concluídas, conforme os dados enviados pelo backend.
        </p>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  detail,
  icon,
  color,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#161A1E] p-5 transition-colors hover:border-white/10">
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      <h3 className="mt-2 break-words text-xl font-bold text-white">{value}</h3>
      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}