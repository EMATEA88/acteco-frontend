import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Users, DollarSign, Activity, AlertCircle,
  TrendingUp, ShoppingCart, History, RefreshCw
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

  const loadStats = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadStats();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [loadStats]);

  const handleRefresh = async () => {
    await loadStats();
  };

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
    <div className="p-4 md:p-8 bg-[#0B0E11] min-h-screen text-white space-y-8 font-sans antialiased overflow-x-hidden">
      {/* HEADER IDÊNTICO AO ADMIN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Dashboard de Performance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe as vendas, os lucros e o desempenho da sua rede.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className={`flex items-center gap-2 bg-[#161A1F] hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {/* FAIXA DE RESUMO GERAL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading && !data ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 rounded-2xl border border-white/5 bg-[#161A1F] p-6"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Vendas da Rede"
              value={formatCurrency(overview?.total.sales ?? 0)}
              detail={`${overview?.total.count ?? 0} operações concluídas`}
              icon={<ShoppingCart size={22} />}
              status="emerald"
            />
            <StatCard
              title="Lucro Total da Rede"
              value={formatCurrency(overview?.total.profit ?? 0)}
              detail="Vendas concluídas"
              icon={<TrendingUp size={22} />}
              status="green"
            />
            <StatCard
              title="Comissão Acumulada"
              value={formatCurrency(overview?.totalCommission ?? 0)}
              detail="Valor registado na conta do agente"
              icon={<Activity size={22} />}
              status="cyan"
            />
            <StatCard
              title="Subagentes"
              value={String(overview?.activeAgentsCount ?? 0)}
              detail="Subagentes associados à rede"
              icon={<Users size={22} />}
              status="purple"
            />
          </>
        )}
      </div>

      {/* RESUMO POR PERÍODO */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Resumo por período</h2>

        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                period === option.value
                  ? "bg-cyan-500 text-white"
                  : "border border-white/10 bg-[#161A1F] text-gray-400 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard
              title="Volume de Vendas"
              value={formatCurrency(selectedStats?.sales ?? 0)}
              detail={periodOptions.find((p) => p.value === period)?.label ?? ""}
              icon={<DollarSign size={22} />}
              status="emerald"
            />
            <StatCard
              title="Lucro"
              value={formatCurrency(selectedStats?.profit ?? 0)}
              detail="Lucro das operações concluídas"
              icon={<TrendingUp size={22} />}
              status="green"
            />
            <StatCard
              title="Operações"
              value={String(selectedStats?.count ?? 0)}
              detail="Transações concluídas"
              icon={<Activity size={22} />}
              status="cyan"
            />
          </div>
        )}
      </div>

      {/* GRÁFICO RECHARTS COM ESTILO DO ADMIN */}
      <div className="rounded-2xl border border-white/5 bg-[#161A1F] p-6 shadow-xl">
        <h2 className="mb-6 text-base font-bold text-white">
          Evolução das vendas e do lucro
        </h2>

        {loading && !data ? (
          <Skeleton className="h-72 w-full" />
        ) : chartData.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500 border border-white/5 bg-white/[0.01] rounded-xl">
            Ainda não existem vendas concluídas para apresentar no gráfico.
          </div>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                <YAxis
                  stroke="#6B7280"
                  fontSize={11}
                  tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161A1F",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), ""]}
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
      </div>

      {/* DESEMPENHO DOS SUBAGENTES - COM SCROLL HORIZONTAL FLUIDO */}
      <div className="bg-[#161A1F] rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Users size={22} className="text-purple-400" />
          <h2 className="text-lg font-bold">Desempenho dos Subagentes</h2>
        </div>

        <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400 text-sm">
                <th className="py-3 px-4">Subagente</th>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Vendas</th>
                <th className="py-3 px-4">Lucro</th>
                <th className="py-3 px-4 text-center">Operações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {!loading && (data?.teamPerformance.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500 font-mono text-xs uppercase tracking-wider">
                    Não existem subagentes associados a esta rede.
                  </td>
                </tr>
              )}

              {(data?.teamPerformance ?? []).map((agent) => (
                <tr key={agent.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="font-semibold text-white">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.email}</p>
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-400 whitespace-nowrap">{agent.code}</td>
                  <td className="py-4 px-4 text-white font-medium whitespace-nowrap">{formatCurrency(agent[period].sales)}</td>
                  <td className="py-4 px-4 text-emerald-400 font-semibold whitespace-nowrap">
                    {formatCurrency(agent[period].profit)}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-300 font-mono whitespace-nowrap">{agent[period].count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTÓRICO DE VENDAS - COM SCROLL HORIZONTAL FLUIDO */}
      <div className="bg-[#161A1F] rounded-2xl p-6 border border-white/5 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <History size={22} className="text-cyan-400" />
          <h2 className="text-lg font-bold">Histórico de Vendas</h2>
        </div>

        <div className="w-full overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400 text-sm">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Vendedor</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Serviço</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-right">Lucro</th>
                <th className="py-3 px-4">Referência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {!loading && (data?.recentSales.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-mono text-xs uppercase tracking-wider">
                    Ainda não existem vendas concluídas.
                  </td>
                </tr>
              )}

              {(data?.recentSales ?? []).map((sale, index) => (
                <tr
                  key={`${sale.date}-${index}`}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4 px-4 text-gray-300 whitespace-nowrap">{formatDate(sale.date)}</td>
                  <td className="py-4 px-4 font-medium text-white whitespace-nowrap">{sale.sellerName}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${sale.sellerRole === "AGENT" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                      {sale.sellerRole === "AGENT" ? "Agente" : "Subagente"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300 whitespace-nowrap">{sale.service || "—"}</td>
                  <td className="py-4 px-4 text-right font-medium text-white whitespace-nowrap">
                    {formatCurrency(sale.amount)}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-emerald-400 whitespace-nowrap">
                    {formatCurrency(sale.profit)}
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-400 whitespace-nowrap">{sale.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">
          O histórico apresenta até 100 vendas concluídas, conforme os dados enviados pelo backend.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  detail,
  icon,
  status,
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  status: "emerald" | "green" | "cyan" | "purple";
}) {
  const getColorStyle = () => {
    switch (status) {
      case "emerald":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "green":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "cyan":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "purple":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    }
  };

  return (
    <div className="bg-[#161A1F] rounded-2xl p-6 border border-white/5 flex flex-col justify-between shadow-lg">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">{title}</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-2 truncate text-white">{value}</h2>
          <p className="text-xs text-gray-500 mt-1 truncate">{detail}</p>
        </div>
        <div className={`p-3 rounded-xl border shrink-0 ${getColorStyle()}`}>{icon}</div>
      </div>
    </div>
  );
}