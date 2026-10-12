import { useCallback, useEffect, useState, type ReactNode } from "react";

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

  CalendarDays,

  Hash,

} from "lucide-react";

import { AgentService } from "../../services/agent.service";



type PeriodStats = {

  sales: number;

  profit: number;

  count: number;

};



type Period = "today" | "yesterday" | "week" | "month" | "year" | "total";



interface TeamAgent {

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

}



interface Sale {

  date: string;

  sellerName: string;

  sellerRole: string;

  service: string;

  amount: number;

  profit: number;

  reference: string | null;

}



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

  teamPerformance: TeamAgent[];

  recentSales: Sale[];

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

  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />

);



const formatCurrency = (value: number) =>

  new Intl.NumberFormat("pt-AO", {

    style: "currency",

    currency: "AOA",

    maximumFractionDigits: 2,

  }).format(value || 0);



const formatDate = (value: string) => {

  const date = new Date(value);



  if (Number.isNaN(date.getTime())) return "—";



  return date.toLocaleString("pt-AO", {

    day: "2-digit",

    month: "2-digit",

    year: "numeric",

    hour: "2-digit",

    minute: "2-digit",

  });

};



export default function AgentStatistics() {

  const [data, setData] = useState<StatsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<Period>("month");



  const loadStats = useCallback(async (isRefresh = false) => {

    try {

      if (isRefresh) {

        setRefreshing(true);

      } else {

        setLoading(true);

      }



      setError(null);



      const stats = await AgentService.getPremiumStatistics();

      setData(stats as StatsData);

    } catch (err) {

      console.error("Erro ao carregar estatísticas:", err);

      setError("Não foi possível carregar os dados de performance.");

    } finally {

      setLoading(false);

      setRefreshing(false);

    }

  }, []);



  useEffect(() => {

    void loadStats();



    const interval = setInterval(() => {

      if (document.visibilityState === "visible") {

        void loadStats(true);

      }

    }, 60000);



    return () => clearInterval(interval);

  }, [loadStats]);



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

      <div className="mx-auto flex min-h-[50vh] w-full max-w-7xl items-center justify-center p-4 sm:p-8">

        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-[#161A1F] p-6 text-center">

          <AlertCircle size={30} className="text-red-400" />



          <p className="text-sm text-gray-300">{error}</p>



          <button

            type="button"

            onClick={() => void loadStats()}

            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"

          >

            <RefreshCw size={16} />

            Tentar novamente

          </button>

        </div>

      </div>

    );

  }



  return (

    <div className="w-full max-w-none min-w-0 space-y-5 overflow-x-clip bg-[#0B0E11] p-2 font-sans text-white antialiased sm:space-y-7 sm:p-4 lg:space-y-8 lg:p-6">

      {/* CABEÇALHO */}

      <header className="flex min-w-0 flex-col justify-between gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center">

        <div className="min-w-0">

          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">

            EMATEA · Área do Agente

          </p>



          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">

            Estatísticas

          </h1>

        </div>



        <button

          type="button"

          onClick={() => void loadStats(true)}

          disabled={loading || refreshing}

          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#161A1F] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"

        >

          <RefreshCw

            size={17}

            className={refreshing ? "animate-spin" : ""}

          />

          Atualizar dados

        </button>

      </header>



      {error && data && (

        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">

          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <span>

            {error} Os últimos dados carregados continuam disponíveis.

          </span>

        </div>

      )}



      {/* INDICADORES PRINCIPAIS */}

      <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {loading && !data ? (

          Array.from({ length: 4 }).map((_, index) => (

            <div

              key={index}

              className="space-y-4 rounded-2xl border border-white/5 bg-[#161A1F] p-5 sm:p-6"

            >

              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-8 w-36 max-w-full" />

              <Skeleton className="h-3 w-24" />

            </div>

          ))

        ) : (

          <>

            <StatCard

              title="Vendas da Rede"

              value={formatCurrency(overview?.total.sales ?? 0)}

              detail={`${overview?.total.count ?? 0} operações concluídas`}

              icon={<ShoppingCart size={21} />}

              status="emerald"

            />



            <StatCard

              title="Lucro Total da Rede"

              value={formatCurrency(overview?.total.profit ?? 0)}

              detail="Vendas concluídas"

              icon={<TrendingUp size={21} />}

              status="green"

            />



            <StatCard

              title="Comissão Acumulada"

              value={formatCurrency(overview?.totalCommission ?? 0)}

              detail="Valor registado na conta do agente"

              icon={<Activity size={21} />}

              status="cyan"

            />



            <StatCard

              title="Subagentes"

              value={String(overview?.activeAgentsCount ?? 0)}

              detail="Subagentes associados à rede"

              icon={<Users size={21} />}

              status="purple"

            />

          </>

        )}

      </section>



      {/* RESUMO POR PERÍODO */}

      <section className="min-w-0 space-y-4">

        <div>

          <h2 className="text-base font-black uppercase tracking-wide text-white sm:text-lg">

            Resumo por período

          </h2>

          <p className="mt-1 text-xs text-gray-500">

            Seleciona o período que pretendes consultar.

          </p>

        </div>



        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">

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



        {loading && !data ? (

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {Array.from({ length: 3 }).map((_, index) => (

              <Skeleton key={index} className="h-32" />

            ))}

          </div>

        ) : (

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">

            <StatCard

              title="Volume de Vendas"

              value={formatCurrency(selectedStats?.sales ?? 0)}

              detail={periodOptions.find((p) => p.value === period)?.label ?? ""}

              icon={<DollarSign size={21} />}

              status="emerald"

            />



            <StatCard

              title="Lucro"

              value={formatCurrency(selectedStats?.profit ?? 0)}

              detail="Lucro das operações concluídas"

              icon={<TrendingUp size={21} />}

              status="green"

            />



            <StatCard

              title="Operações"

              value={String(selectedStats?.count ?? 0)}

              detail="Transações concluídas"

              icon={<Activity size={21} />}

              status="cyan"

            />

          </div>

        )}

      </section>



      {/* GRÁFICO */}

      <section className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F] p-3 shadow-xl sm:p-6">

        <div className="mb-5">

          <h2 className="text-sm font-black uppercase tracking-wide text-white sm:text-base">

            Evolução das vendas e do lucro

          </h2>

        </div>



        {loading && !data ? (

          <Skeleton className="h-64 w-full sm:h-80" />

        ) : chartData.length === 0 ? (

          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-12 text-center text-sm text-gray-500">

            Ainda não existem vendas concluídas para apresentar no gráfico.

          </div>

        ) : (

          <div className="h-64 w-full min-w-0 sm:h-80">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart

                data={chartData}

                margin={{ top: 8, right: 4, left: -22, bottom: 0 }}

              >

                <defs>

                  <linearGradient

                    id="agentSalesGradient"

                    x1="0"

                    y1="0"

                    x2="0"

                    y2="1"

                  >

                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />

                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />

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

                  minTickGap={20}

                />



                <YAxis

                  stroke="#9ca3af"

                  fontSize={10}

                  tickLine={false}

                  axisLine={false}

                  width={42}

                  tickFormatter={(value: number) =>

                    Math.abs(value) >= 1000

                      ? `${(value / 1000).toFixed(0)}k`

                      : String(value)

                  }

                />



                <Tooltip

                  contentStyle={{

                    backgroundColor: "#0B0E11",

                    border: "1px solid #2B3139",

                    borderRadius: "12px",

                    color: "#fff",

                    maxWidth: "90vw",

                  }}

                  labelStyle={{ color: "#d1d5db" }}

                  formatter={(value) =>

                    formatCurrency(Number(value ?? 0))

                  }

                />



                <Area

                  type="monotone"

                  dataKey="vendas"

                  name="Vendas"

                  stroke="#06b6d4"

                  fill="url(#agentSalesGradient)"

                  strokeWidth={2}

                  activeDot={{ r: 4 }}

                />



                <Area

                  type="monotone"

                  dataKey="lucro"

                  name="Lucro"

                  stroke="#22c55e"

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

      <section className="min-w-0 space-y-4">

        <div>

          <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-white sm:text-lg">

            <Users size={21} className="shrink-0 text-purple-400" />

            Desempenho dos Subagentes

          </h2>

          <p className="mt-1 text-xs text-gray-500">

            Resultados da equipa no período selecionado.

          </p>

        </div>



        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F] shadow-xl">

          {/* TELEMÓVEL: CARTÕES */}

          <div className="space-y-3 p-3 md:hidden">

            {loading && !data ? (

              Array.from({ length: 3 }).map((_, index) => (

                <div

                  key={index}

                  className="space-y-4 rounded-xl border border-white/5 bg-[#0F1318] p-4"

                >

                  <Skeleton className="h-5 w-36" />

                  <Skeleton className="h-3 w-48 max-w-full" />

                  <Skeleton className="h-4 w-full" />

                  <Skeleton className="h-4 w-2/3" />

                </div>

              ))

            ) : (data?.teamPerformance.length ?? 0) === 0 ? (

              <EmptyState message="Não existem subagentes associados a esta rede." />

            ) : (

              (data?.teamPerformance ?? []).map((agent) => (

                <article

                  key={agent.id}

                  className="min-w-0 rounded-xl border border-white/5 bg-[#0F1318] p-4"

                >

                  <div className="flex min-w-0 items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">

                      <Users size={19} />

                    </div>



                    <div className="min-w-0 flex-1">

                      <p className="break-words text-sm font-bold text-white">

                        {agent.name}

                      </p>

                      <p className="mt-1 break-all text-xs text-gray-500">

                        {agent.email}

                      </p>

                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-gray-400">

                        <Hash size={11} />

                        {agent.code || "Sem código"}

                      </p>

                    </div>

                  </div>



                  <div className="my-4 border-t border-white/5" />



                  <div className="grid grid-cols-2 gap-3">

                    <Metric

                      label="Vendas"

                      value={formatCurrency(agent[period].sales)}

                    />

                    <Metric

                      label="Lucro"

                      value={formatCurrency(agent[period].profit)}

                      valueClass="text-emerald-400"

                    />

                    <div className="col-span-2 flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5">

                      <span className="text-xs text-gray-400">

                        Operações concluídas

                      </span>

                      <span className="font-mono text-sm font-bold text-white">

                        {agent[period].count}

                      </span>

                    </div>

                  </div>

                </article>

              ))

            )}

          </div>



          {/* COMPUTADOR: TABELA */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[750px] border-collapse text-left">

              <thead className="border-b border-white/5 bg-[#0B0E11] text-[10px] uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-4 py-4">Subagente</th>

                  <th className="px-4 py-4">Código</th>

                  <th className="px-4 py-4">Vendas</th>

                  <th className="px-4 py-4">Lucro</th>

                  <th className="px-4 py-4 text-center">Operações</th>

                </tr>

              </thead>



              <tbody className="divide-y divide-white/5 text-sm">

                {!loading &&

                  (data?.teamPerformance.length ?? 0) === 0 && (

                    <tr>

                      <td

                        colSpan={5}

                        className="p-10 text-center text-gray-500"

                      >

                        Não existem subagentes associados a esta rede.

                      </td>

                    </tr>

                  )}



                {(data?.teamPerformance ?? []).map((agent) => (

                  <tr

                    key={agent.id}

                    className="text-gray-300 transition hover:bg-[#1C2128]"

                  >

                    <td className="px-4 py-4">

                      <p className="font-semibold text-white">{agent.name}</p>

                      <p className="mt-1 text-xs text-gray-500">

                        {agent.email}

                      </p>

                    </td>



                    <td className="px-4 py-4 font-mono text-xs text-gray-400">

                      {agent.code}

                    </td>



                    <td className="whitespace-nowrap px-4 py-4 font-medium text-white">

                      {formatCurrency(agent[period].sales)}

                    </td>



                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-emerald-400">

                      {formatCurrency(agent[period].profit)}

                    </td>



                    <td className="px-4 py-4 text-center font-mono text-gray-300">

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

      <section className="min-w-0 space-y-4">

        <div>

          <h2 className="flex items-center gap-2 text-base font-black uppercase tracking-wide text-white sm:text-lg">

            <History size={21} className="shrink-0 text-cyan-400" />

            Histórico de Vendas

          </h2>

        </div>



        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F] shadow-xl">

          {/* TELEMÓVEL: CARTÕES */}

          <div className="space-y-3 p-3 md:hidden">

            {loading && !data ? (

              Array.from({ length: 4 }).map((_, index) => (

                <div

                  key={index}

                  className="space-y-4 rounded-xl border border-white/5 bg-[#0F1318] p-4"

                >

                  <Skeleton className="h-4 w-32" />

                  <Skeleton className="h-5 w-44 max-w-full" />

                  <Skeleton className="h-4 w-full" />

                  <Skeleton className="h-4 w-2/3" />

                </div>

              ))

            ) : (data?.recentSales.length ?? 0) === 0 ? (

              <EmptyState message="Ainda não existem vendas concluídas." />

            ) : (

              (data?.recentSales ?? []).map((sale, index) => (

                <article

                  key={`${sale.date}-${index}`}

                  className="min-w-0 rounded-xl border border-white/5 bg-[#0F1318] p-4"

                >

                  <div className="flex min-w-0 items-start justify-between gap-3">

                    <div className="min-w-0">

                      <p className="break-words text-sm font-bold text-white">

                        {sale.sellerName}

                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">

                        <CalendarDays size={13} className="shrink-0" />

                        {formatDate(sale.date)}

                      </p>

                    </div>



                    <span

                      className={`shrink-0 rounded-lg border px-2 py-1 text-[10px] font-bold ${

                        sale.sellerRole === "AGENT"

                          ? "border-blue-500/20 bg-blue-500/10 text-blue-400"

                          : "border-purple-500/20 bg-purple-500/10 text-purple-400"

                      }`}

                    >

                      {sale.sellerRole === "AGENT" ? "Agente" : "Subagente"}

                    </span>

                  </div>



                  <div className="my-4 border-t border-white/5" />



                  <div className="space-y-3">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">

                        Serviço

                      </p>

                      <p className="mt-1 break-words text-sm text-gray-200">

                        {sale.service || "—"}

                      </p>

                    </div>



                    <div className="grid grid-cols-2 gap-3">

                      <Metric

                        label="Valor da venda"

                        value={formatCurrency(sale.amount)}

                      />

                      <Metric

                        label="Lucro"

                        value={formatCurrency(sale.profit)}

                        valueClass="text-emerald-400"

                      />

                    </div>



                    <div className="rounded-lg bg-white/[0.03] p-3">

                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">

                        Referência

                      </p>

                      <p className="break-all font-mono text-xs text-gray-400">

                        {sale.reference || "—"}

                      </p>

                    </div>

                  </div>

                </article>

              ))

            )}

          </div>



          {/* COMPUTADOR: TABELA */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full min-w-[850px] border-collapse text-left">

              <thead className="border-b border-white/5 bg-[#0B0E11] text-[10px] uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-4 py-4">Data</th>

                  <th className="px-4 py-4">Vendedor</th>

                  <th className="px-4 py-4">Tipo</th>

                  <th className="px-4 py-4">Serviço</th>

                  <th className="px-4 py-4 text-right">Valor</th>

                  <th className="px-4 py-4 text-right">Lucro</th>

                  <th className="px-4 py-4">Referência</th>

                </tr>

              </thead>



              <tbody className="divide-y divide-white/5 text-sm">

                {!loading &&

                  (data?.recentSales.length ?? 0) === 0 && (

                    <tr>

                      <td

                        colSpan={7}

                        className="p-10 text-center text-gray-500"

                      >

                        Ainda não existem vendas concluídas.

                      </td>

                    </tr>

                  )}



                {(data?.recentSales ?? []).map((sale, index) => (

                  <tr

                    key={`${sale.date}-${index}`}

                    className="text-gray-300 transition hover:bg-[#1C2128]"

                  >

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-400">

                      {formatDate(sale.date)}

                    </td>



                    <td className="px-4 py-4 font-semibold text-white">

                      {sale.sellerName}

                    </td>



                    <td className="px-4 py-4">

                      <span

                        className={`whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-bold ${

                          sale.sellerRole === "AGENT"

                            ? "border-blue-500/20 bg-blue-500/10 text-blue-400"

                            : "border-purple-500/20 bg-purple-500/10 text-purple-400"

                        }`}

                      >

                        {sale.sellerRole === "AGENT" ? "Agente" : "Subagente"}

                      </span>

                    </td>



                    <td className="px-4 py-4 text-gray-300">

                      {sale.service || "—"}

                    </td>



                    <td className="whitespace-nowrap px-4 py-4 text-right font-medium text-white">

                      {formatCurrency(sale.amount)}

                    </td>



                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-emerald-400">

                      {formatCurrency(sale.profit)}

                    </td>



                    <td className="px-4 py-4 font-mono text-xs text-gray-400">

                      {sale.reference || "—"}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>

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

  const colors = {

    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",

    green: "text-green-400 border-green-500/20 bg-green-500/10",

    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",

    purple: "text-purple-400 border-purple-500/20 bg-purple-500/10",

  };



  return (

    <div className="min-w-0 rounded-2xl border border-white/5 bg-[#161A1F] p-4 shadow-lg transition hover:bg-[#191E24] sm:p-6">

      <div className="flex min-w-0 items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">

            {title}

          </p>



          <h3 className="mt-2 break-words text-xl font-black tracking-tight text-white sm:text-2xl">

            {value}

          </h3>



          <p className="mt-2 break-words text-xs leading-relaxed text-gray-500">

            {detail}

          </p>

        </div>



        <div

          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 ${colors[status]}`}

        >

          {icon}

        </div>

      </div>

    </div>

  );

}



function Metric({

  label,

  value,

  valueClass = "text-white",

}: {

  label: string;

  value: string;

  valueClass?: string;

}) {

  return (

    <div className="min-w-0">

      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">

        {label}

      </p>

      <p className={`break-words text-sm font-bold ${valueClass}`}>

        {value}

      </p>

    </div>

  );

}



function EmptyState({ message }: { message: string }) {

  return (

    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-gray-500">

        <History size={22} />

      </div>

      <p className="text-sm text-gray-400">{message}</p>

    </div>

  );

}