import { useCallback, useEffect, useState } from "react";
import {
  BadgeDollarSign,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AgentService } from "../../services/agent.service";

type CommissionSummary = {
  availableCommission?: number;
  totalCommission?: number;
  pending?: {
    amount?: number;
    count?: number;
  };
  paid?: {
    amount?: number;
    count?: number;
  };
};

type CommissionItem = {
  id: string | number;
  amount: number | string;
  status: string;
  createdAt: string;
  serviceRequest?: {
    serviceName?: string | null;
    customerReference?: string | null;
  } | null;
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />
);

const formatCurrency = (value: number | string | null | undefined) =>
  `${Number(value || 0).toLocaleString("pt-AO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} Kz`;

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

export default function AgentCommissions() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [history, setHistory] = useState<CommissionItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [summaryData, historyData] = await Promise.all([
        AgentService.getCommissionSummary(),
        AgentService.getCommissionHistory(),
      ]);

      setSummary(summaryData as CommissionSummary);
      setHistory(historyData as CommissionItem[]);
    } catch (err) {
      console.error("Erro ao carregar comissões:", err);
      setError("Não foi possível carregar as comissões. Tente novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 font-sans text-gray-100 sm:p-6 lg:p-8">
      {/* CABEÇALHO */}
      <header className="flex flex-col justify-between gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
            EMATEA · Área do Agente
          </p>

          <h1 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
            Comissões
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Consulte as comissões geradas pela sua equipa e o respetivo estado.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void load(true)}
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

      {/* ERRO */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-amber-300">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>

          {!summary && (
            <button
              type="button"
              onClick={() => void load()}
              className="self-start rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 sm:self-auto"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}

      {/* RESUMO DAS COMISSÕES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-black uppercase tracking-wide text-white">
            Resumo financeiro
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Visão geral dos valores das suas comissões.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              <CommissionCard
                title="Disponível"
                value={formatCurrency(summary?.availableCommission)}
                icon={<BadgeDollarSign size={20} />}
                color="text-emerald-400"
                border="border-l-emerald-500"
                detail="Comissão disponível"
              />

              <CommissionCard
                title="Total acumulado"
                value={formatCurrency(summary?.totalCommission)}
                icon={<TrendingUp size={20} />}
                color="text-cyan-400"
                border="border-l-cyan-500"
                detail="Total registado"
              />

              <CommissionCard
                title="Pendentes"
                value={formatCurrency(summary?.pending?.amount)}
                icon={<Clock3 size={20} />}
                color="text-amber-400"
                border="border-l-amber-500"
                detail={`${summary?.pending?.count ?? 0} registos`}
              />

              <CommissionCard
                title="Pagas"
                value={formatCurrency(summary?.paid?.amount)}
                icon={<CheckCircle2 size={20} />}
                color="text-green-400"
                border="border-l-green-500"
                detail={`${summary?.paid?.count ?? 0} registos`}
              />
            </>
          )}
        </div>
      </section>

      {/* HISTÓRICO */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-black uppercase tracking-wide text-white">
            Histórico de comissões
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Consulte os serviços, referências, valores e estados das comissões.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F] shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 bg-[#0B0E11] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400">
                <BadgeDollarSign size={20} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Registos de comissões
                </h3>
                {!loading && (
                  <p className="mt-1 text-xs text-gray-500">
                    {history.length} registos carregados
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/5 bg-[#0B0E11] text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Serviço</th>
                  <th className="px-4 py-4">Referência</th>
                  <th className="px-4 py-4 text-right">Comissão</th>
                  <th className="px-4 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Data</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-5">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-5">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-5">
                        <Skeleton className="ml-auto h-4 w-24" />
                      </td>
                      <td className="px-4 py-5">
                        <Skeleton className="mx-auto h-6 w-20" />
                      </td>
                      <td className="px-6 py-5">
                        <Skeleton className="ml-auto h-4 w-28" />
                      </td>
                    </tr>
                  ))
                ) : history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-12 text-center sm:p-16"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-gray-500">
                          <BadgeDollarSign size={24} />
                        </div>
                        <p className="text-sm font-semibold text-gray-300">
                          Nenhuma comissão localizada
                        </p>
                        <p className="text-xs text-gray-500">
                          Quando existirem registos, serão apresentados aqui.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr
                      key={item.id}
                      className="text-gray-300 transition hover:bg-[#1C2128]"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">
                          {item.serviceRequest?.serviceName || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-gray-400">
                        {item.serviceRequest?.customerReference || "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-emerald-400">
                        {formatCurrency(item.amount)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function CommissionCard({
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
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          {title}
        </p>

        <div className={color}>{icon}</div>
      </div>

      <h3 className="break-words text-xl font-black tracking-tight text-white sm:text-2xl">
        {value}
      </h3>

      <p className="mt-2 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status?.toUpperCase();

  const config =
    normalizedStatus === "PENDING"
      ? {
          className:
            "border-amber-500/20 bg-amber-500/10 text-amber-400",
          icon: <Clock3 size={12} />,
          label: "Pendente",
        }
      : normalizedStatus === "PAID"
        ? {
            className:
              "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
            icon: <CheckCircle2 size={12} />,
            label: "Paga",
          }
        : {
            className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
            icon: <XCircle size={12} />,
            label: "Cancelada",
          };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}