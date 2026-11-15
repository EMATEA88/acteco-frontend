
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
  ChartLine,
  Users,
  Coins,
  ChartBar,
} from "@phosphor-icons/react";

interface StatisticsOverview {
  totalVolume: number | string;
  totalCommission: number | string;
  activeAgentsCount: number | string;
}

interface TimelineItem {
  date: string;
  valor: number;
}

interface PremiumStatisticsProps {
  data: {
    overview: StatisticsOverview;
    timeline: TimelineItem[];
  };
}

const formatNumber = (value: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value ?? "0");
  }

  return numericValue.toLocaleString("pt-AO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatCurrency = (value: number | string) => {
  return `${formatNumber(value)} Kz`;
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "short",
  });
};

export default function PremiumStatistics({
  data,
}: PremiumStatisticsProps) {
  const overview = data?.overview;
  const timeline = Array.isArray(data?.timeline)
    ? data.timeline
    : [];

  const statistics = [
    {
      title: "Volume total",
      value: formatCurrency(overview?.totalVolume ?? 0),
      description: "Volume movimentado",
      icon: ChartBar,
    },
    {
      title: "Comissões geradas",
      value: formatCurrency(overview?.totalCommission ?? 0),
      description: "Total de comissões registadas",
      icon: Coins,
    },
    {
      title: "Agentes ativos",
      value: formatNumber(overview?.activeAgentsCount ?? 0),
      description: "Agentes em atividade",
      icon: Users,
    },
  ];

  return (
    <div className="w-full space-y-5">

      {/* INDICADORES */}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">

        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                bg-[#0e364a]
                border border-cyan-500/15
                rounded-2xl
                p-5
                shadow-sm
                transition-colors
                hover:border-cyan-500/30
              "
            >
              <div className="flex items-center justify-between">

                <p className="text-xs font-medium text-[#a9c4cf]">
                  {item.title}
                </p>

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-cyan-500/10
                  border border-cyan-500/20
                  flex items-center justify-center
                  text-[#19c5ce]
                ">
                  <Icon size={21} weight="duotone" />
                </div>

              </div>

              <h2 className="mt-4 text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
                {item.value}
              </h2>

              <p className="mt-1 text-[11px] text-[#7897a7]">
                {item.description}
              </p>

            </div>
          );
        })}

      </section>

      {/* EVOLUÇÃO DO VOLUME */}

      <section className="
        bg-[#0e364a]
        border border-cyan-500/15
        rounded-2xl
        p-4 sm:p-5
        shadow-sm
      ">

        {/* CABEÇALHO */}

        <div className="flex items-center gap-3 mb-6">

          <div className="
            w-10 h-10
            rounded-xl
            bg-cyan-500/10
            border border-cyan-500/20
            flex items-center justify-center
            text-[#19c5ce]
          ">
            <ChartLine size={21} weight="duotone" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">
              Evolução do volume
            </h3>

            <p className="text-[11px] text-[#7897a7] mt-0.5">
              Movimentação durante o mês atual
            </p>
          </div>

        </div>

        {/* GRÁFICO */}

        {timeline.length === 0 ? (

          <div className="
            h-[280px]
            flex flex-col items-center justify-center
            text-center
          ">

            <ChartLine
              size={34}
              weight="thin"
              className="text-[#7897a7] mb-3"
            />

            <p className="text-sm text-[#a9c4cf]">
              Sem dados disponíveis
            </p>

            <p className="text-xs text-[#7897a7] mt-1">
              O gráfico será apresentado quando existirem registos.
            </p>

          </div>

        ) : (

          <div className="w-full h-[280px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={timeline}
                margin={{
                  top: 10,
                  right: 8,
                  left: -15,
                  bottom: 0,
                }}
              >

                <defs>
                  <linearGradient
                    id="emateVolumeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#19c5ce"
                      stopOpacity={0.28}
                    />

                    <stop
                      offset="95%"
                      stopColor="#19c5ce"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#24566A"
                  strokeOpacity={0.45}
                  vertical={false}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#7897a7"
                  tick={{
                    fill: "#7897a7",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />

                <YAxis
                  stroke="#7897a7"
                  tick={{
                    fill: "#7897a7",
                    fontSize: 10,
                  }}
                  tickFormatter={(value) =>
                    Number(value).toLocaleString("pt-AO")
                  }
                  axisLine={false}
                  tickLine={false}
                  width={55}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a2533",
                    border: "1px solid #24566A",
                    borderRadius: "12px",
                    padding: "10px 14px",
                  }}
                  labelStyle={{
                    color: "#a9c4cf",
                    fontSize: "11px",
                    marginBottom: "5px",
                  }}
                  itemStyle={{
                    color: "#19c5ce",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  formatter={(value) => [
                    `${formatNumber(Number(value))} Kz`,
                    "Volume",
                  ]}
                  labelFormatter={(label) =>
                    formatDate(String(label))
                  }
                />

                <Area
                  type="monotone"
                  dataKey="valor"
                  name="Volume"
                  stroke="#19c5ce"
                  strokeWidth={2.5}
                  fill="url(#emateVolumeGradient)"
                  activeDot={{
                    r: 5,
                    fill: "#19c5ce",
                    stroke: "#0a2533",
                    strokeWidth: 2,
                  }}
                  dot={false}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        )}

      </section>

    </div>
  );
}
