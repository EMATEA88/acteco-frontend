import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  History,
  RefreshCw,
} from "lucide-react";
import { AgentService } from "../../services/agent.service";

type PeriodStats = {
  sales: number;
  profit: number;
  count: number;
};

type Period = "today" | "yesterday" | "week" | "month" | "year" | "total";

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

const periodOptions: { value: Period; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "yesterday", label: "Ontem" },
  { value: "week", label: "7 dias" },
  { value: "month", label: "Este mês" },
  { value: "year", label: "Este ano" },
  { value: "total", label: "Total" },
];

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-white/5 ${className}`}
  />
);

export default function AgentStatistics() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("month");

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

  async function loadStats(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const stats = await AgentService.getPremiumStatistics();
      setData(stats as StatsData);
    } catch {
      setError("Não foi possível carregar os dados de performance.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadStats();
  }, []);

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

  if (error && !data) {
    return (
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-[#161A1F] p-8 text-center">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm text-gray-300">{error}</p>
          <button
            type="button"
            onClick={() => void loadStats()}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 font-sans text-gray-100 sm:p-6 lg:p-8">

      {/* CABEÇALHO */}
      <header className="flex flex-col justify-between gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
            EMATEA · Área do Agente
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
            Dashboard de Performance
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Acompanhe as vendas, os lucros e o desempenho da sua rede.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadStats(true)}
          disabled={loading || refreshing}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#161A1F] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Atualizar dados
        </button>
      </header>

      {error && data && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
          {error} Os últimos dados carregados continuam disponíveis.
        </div>
      )}

      {/* INDICADORES PRINCIPAIS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-2xl border border-white/5 border-l-4 border-l-white/10 bg-[#161A1F] p-5"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-24" />
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
              border="border-l-emerald-500"
            />

            <StatCard
              title="Lucro Total da Rede"
              value={formatCurrency(overview?.total.profit ?? 0)}
              detail="Vendas concluídas"
              icon={<TrendingUp size={20} />}
              color="text-green-400"
              border="border-l-green-500"
            />

            <StatCard
              title="Comissão Acumulada"
              value={formatCurrency(overview?.totalCommission ?? 0)}
              detail="Registada na conta do agente"
              icon={<Activity size={20} />}
              color="text-cyan-400"
              border="border-l-cyan-500"
            />

            <StatCard
              title="Subagentes"
              value={String(overview?.activeAgentsCount ?? 0)}
              detail="Associados à sua rede"
              icon={<Users size={20} />}
              color="text-purple-400"
              border="border-l-purple-500"
            />
          </>
        )}
      </section>

      {/* RESUMO POR PERÍODO */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-white">
            Resumo por período
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Seleciona o intervalo que pretendes consultar.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={`shrink-0 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                period === option.value
                  ? "border-emerald-500/30 bg-emerald-500 text-black"
                  : "border-white/5 bg-[#161A1F] text-gray-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Volume de Vendas"
              value={formatCurrency(selectedStats?.sales ?? 0)}
              detail={periodOptions.find((p) => p.value === period)?.label ?? ""}
              icon={<DollarSign size={20} />}
              color="text-emerald-400"
              border="border-l-emerald-500"
            />

            <StatCard
              title="Lucro"
              value={formatCurrency(selectedStats?.profit ?? 0)}
              detail="Lucro das operações concluídas"
              icon={<TrendingUp size={20} />}
              color="text-green-400"
              border="border-l-green-500"
            />

            <StatCard
              title="Operações"
              value={String(selectedStats?.count ?? 0)}
              detail="Transações concluídas"
              icon={<Activity size={20} />}
              color="text-cyan-400"
              border="border-l-cyan-500"
            />
          </div>
        )}
      </section>

      {/* GRÁFICO */}
      <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F] p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-base font-black uppercase tracking-wide text-white">
            Evolução das vendas e do lucro
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Histórico diário das operações apresentadas pelo backend.
          </p>
        </div>

        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : chartData.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            Ainda não existem vendas concluídas para apresentar no gráfico.
          </p>
        ) : (
          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="agentSalesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#2B3139"
                />

                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#9ca3af"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `${Math.round(value / 1000)}k`
                      : String(value)
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0E11",
                    border: "1px solid #2B3139",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#d1d5db" }}
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                />

                <Area
                  type="monotone"
                  dataKey="vendas"
                  name="Vendas"
                  stroke="#10b981"
                  fill="url(#agentSalesGradient)"
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                />

                <Area
                  type="monotone"
                  dataKey="lucro"
                  name="Lucro"
                  stroke="#06b6d4"
                  fill="transparent"
                  strokeWidth={2}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* DESEMPENHO DOS SUBAGENTES */}
      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-white">
            <Users size={20} className="text-purple-400" />
            Desempenho dos Subagentes
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Resultados da equipa no período selecionado.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-white/5 bg-[#0B0E11] text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="p-4">Subagente</th>
                  <th className="p-4">Código</th>
                  <th className="p-4">Vendas</th>
                  <th className="p-4">Lucro</th>
                  <th className="p-4">Operações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {!loading && (data?.teamPerformance.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Não existem subagentes associados a esta rede.
                    </td>
                  </tr>
                )}

                {(data?.teamPerformance ?? []).map((agent) => (
                  <tr
                    key={agent.id}
                    className="text-gray-300 transition hover:bg-[#1C2128]"
                  >
                    <td className="p-4">
                      <p className="font-bold text-white">{agent.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {agent.email}
                      </p>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {agent.code}
                    </td>
                    <td className="whitespace-nowrap p-4 font-semibold text-white">
                      {formatCurrency(agent[period].sales)}
                    </td>
                    <td className="whitespace-nowrap p-4 font-semibold text-emerald-400">
                      {formatCurrency(agent[period].profit)}
                    </td>
                    <td className="p-4 text-gray-300">
                      {agent[period].count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HISTÓRICO DE VENDAS */}
      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-white">
            <History size={20} className="text-cyan-400" />
            Histórico de Vendas
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Registo das vendas concluídas disponibilizadas pelo backend.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-white/5 bg-[#0B0E11] text-[10px] uppercase tracking-wider text-gray-500">
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

              <tbody className="divide-y divide-white/5">
                {!loading && (data?.recentSales.length ?? 0) === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Ainda não existem vendas concluídas.
                    </td>
                  </tr>
                )}

                {(data?.recentSales ?? []).map((sale, index) => (
                  <tr
                    key={`${sale.date}-${index}`}
                    className="text-gray-300 transition hover:bg-[#1C2128]"
                  >
                    <td className="whitespace-nowrap p-4 text-xs text-gray-400">
                      {formatDate(sale.date)}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {sale.sellerName}
                    </td>
                    <td className="p-4">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase">
                        {sale.sellerRole === "AGENT" ? "Agente" : "Subagente"}
                      </span>
                    </td>
                    <td className="p-4">{sale.service || "—"}</td>
                    <td className="whitespace-nowrap p-4 font-semibold text-white">
                      {formatCurrency(sale.amount)}
                    </td>
                    <td className="whitespace-nowrap p-4 font-semibold text-emerald-400">
                      {formatCurrency(sale.profit)}
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {sale.reference || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  border,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
  border: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-white/5 border-l-4 ${border} bg-[#161A1F] p-5 shadow-xl transition hover:bg-[#191E24]`}
    >
      <div className={`mb-3 ${color}`}>{icon}</div>

      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
        {title}
      </p>

      <h3 className="mt-2 break-words text-xl font-black tracking-tight text-white sm:text-2xl">
        {value}
      </h3>

      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}