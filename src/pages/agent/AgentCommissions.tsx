import { useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Search,
  RefreshCw,
  Coins,
  ReceiptText,
  CalendarDays,
} from "lucide-react";
import { AgentService } from "../../services/agent.service";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/[0.06] ${className}`} />
);

const formatCurrency = (value: unknown) =>
  `${Number(value || 0).toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Kz`;

const formatDate = (value: string) =>
  new Date(value).toLocaleString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AgentCommissions() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loadError, setLoadError] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setLoadError(false);

      const [summaryData, historyData] = await Promise.all([
        AgentService.getCommissionSummary(),
        AgentService.getCommissionHistory(),
      ]);

      setSummary(summaryData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (error) {
      console.error("Erro ao carregar comissões:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredHistory = useMemo(() => {
    const term = search.trim().toLowerCase();

    return history.filter((item) => {
      const service = item.serviceRequest?.serviceName || "";
      const reference = item.serviceRequest?.customerReference || "";
      const matchesSearch =
        !term ||
        String(service).toLowerCase().includes(term) ||
        String(reference).toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [history, search, statusFilter]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-7 p-4 text-[#EAECEF] md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <Coins size={19} />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
              Gestão financeira
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Comissões
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Consulte as comissões geradas pela sua rede, acompanhe os pagamentos
            e verifique o histórico de cada operação.
          </p>
        </div>

        <button
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.08] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </header>

      {loadError && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-rose-300">
            <XCircle size={19} />
            Não foi possível carregar as comissões.
          </div>
          <button
            onClick={() => void load()}
            className="text-left text-sm font-bold text-white underline underline-offset-4"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.07] bg-[#15191E] p-5"
            >
              <Skeleton className="mb-5 h-10 w-10" />
              <Skeleton className="mb-3 h-3 w-24" />
              <Skeleton className="mb-3 h-7 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : (
          <>
            <SummaryCard
              title="Disponível"
              value={summary?.availableCommission}
              subtitle="Comissão disponível"
              icon={<BadgeDollarSign size={21} />}
              accent="emerald"
            />
            <SummaryCard
              title="Total acumulado"
              value={summary?.totalCommission}
              subtitle="Total registado"
              icon={<TrendingUp size={21} />}
              accent="cyan"
            />
            <SummaryCard
              title="Pendentes"
              value={summary?.pending?.amount}
              subtitle={`${summary?.pending?.count || 0} registos`}
              icon={<Clock3 size={21} />}
              accent="amber"
            />
            <SummaryCard
              title="Pagas"
              value={summary?.paid?.amount}
              subtitle={`${summary?.paid?.count || 0} registos`}
              icon={<CheckCircle2 size={21} />}
              accent="blue"
            />
          </>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#15191E]">
        <div className="border-b border-white/[0.07] p-5 md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ReceiptText size={19} className="text-emerald-400" />
                <h2 className="text-lg font-bold text-white">
                  Histórico de comissões
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Consulte os valores, referências, estados e datas.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:min-w-[240px]">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar serviço ou referência"
                  className="h-10 w-full rounded-xl border border-white/10 bg-[#0E1115] pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-emerald-500/50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-[#0E1115] px-3 text-sm text-gray-200 outline-none focus:border-emerald-500/50"
              >
                <option value="ALL">Todos os estados</option>
                <option value="PAID">Pagas</option>
                <option value="PENDING">Pendentes</option>
                <option value="CANCELLED">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.05] px-5 py-3 text-xs text-gray-500 md:px-6">
          <span>
            {loading
              ? "A carregar registos..."
              : `${filteredHistory.length} registo(s) encontrado(s)`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} />
            Histórico de operações
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-5 py-4 md:px-6">Serviço</th>
                <th className="px-4 py-4">Referência</th>
                <th className="px-4 py-4 text-right">Comissão</th>
                <th className="px-4 py-4 text-center">Estado</th>
                <th className="px-5 py-4 text-right md:px-6">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 5 }).map((__, cell) => (
                      <td key={cell} className="px-5 py-5">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-gray-500">
                      <ReceiptText size={22} />
                    </div>
                    <p className="mt-4 font-semibold text-gray-300">
                      Nenhuma comissão encontrada
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Altere a pesquisa ou selecione outro estado.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item: any) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4 md:px-6">
                      <span className="font-semibold text-white">
                        {item.serviceRequest?.serviceName || "Serviço"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-gray-400">
                      {item.serviceRequest?.customerReference || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-emerald-400">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-xs text-gray-400 md:px-6">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: unknown;
  subtitle: string;
  icon: React.ReactNode;
  accent: "emerald" | "cyan" | "amber" | "blue";
}) {
  const colors = {
    emerald: {
      icon: "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-400",
      glow: "from-emerald-400/[0.08]",
      dot: "bg-emerald-400",
    },
    cyan: {
      icon: "border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-400",
      glow: "from-cyan-400/[0.08]",
      dot: "bg-cyan-400",
    },
    amber: {
      icon: "border-amber-400/15 bg-amber-400/[0.08] text-amber-400",
      glow: "from-amber-400/[0.08]",
      dot: "bg-amber-400",
    },
    blue: {
      icon: "border-blue-400/15 bg-blue-400/[0.08] text-blue-400",
      glow: "from-blue-400/[0.08]",
      dot: "bg-blue-400",
    },
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#15191E] p-5 transition duration-200 hover:border-white/[0.14]">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${colors.glow} to-transparent`}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-medium text-gray-400">{title}</div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.icon}`}>
            {icon}
          </div>
        </div>
        <div className="mt-5 break-words text-2xl font-bold tracking-tight text-white">
          {formatCurrency(value)}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config =
    status === "PENDING"
      ? {
          style: "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
          icon: <Clock3 size={12} />,
          label: "Pendente",
        }
      : status === "PAID"
      ? {
          style: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
          icon: <CheckCircle2 size={12} />,
          label: "Paga",
        }
      : {
          style: "border-rose-400/20 bg-rose-400/[0.08] text-rose-300",
          icon: <XCircle size={12} />,
          label: status === "CANCELLED" ? "Cancelada" : status,
        };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.style}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}