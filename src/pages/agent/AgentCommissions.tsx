import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  BadgeDollarSign,
  Clock3,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  XCircle,
  CalendarDays,
  ReceiptText,
} from "lucide-react";
import { AgentService } from "../../services/agent.service";

type CommissionItem = {
  id: string | number;
  createdAt?: string;
  amount?: number | string | null;
  status?: string;
  serviceRequest?: {
    serviceName?: string | null;
    customerReference?: string | null;
  } | null;
};

type CommissionSummary = {
  availableCommission?: number | null;
  totalCommission?: number | null;
  pending?: { amount?: number | null; count?: number | null };
  paid?: { amount?: number | null; count?: number | null };
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
);

const formatMoney = (value: number | string | undefined | null) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatDate = (value?: string) => {
  if (!value) return "—";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = useCallback(async (manual = false) => {
    try {
      if (manual) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const [summaryData, historyData] = await Promise.all([
        AgentService.getCommissionSummary(),
        AgentService.getCommissionHistory(),
      ]);

      setSummary(summaryData as CommissionSummary);
      setHistory(Array.isArray(historyData) ? historyData : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Erro ao carregar comissões:", err);
      setError("Não foi possível carregar as comissões. Verifica a ligação e tenta novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, 60000);

    return () => window.clearInterval(interval);
  }, [load]);

  const handleRefresh = () => void load(true);

  const totalItems = history.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedHistory = history.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  if (error && !summary && history.length === 0 && !loading) {
    return (
      <div className="w-full min-w-0 bg-[#0B0E11] px-3 py-5 text-white sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-[#161A1F] p-6 text-center">
          <AlertCircle size={30} className="text-red-400" />
          <p className="text-sm leading-relaxed text-gray-300">{error}</p>
          <button
            type="button"
            onClick={() => void load()}
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
    <div className="w-full min-w-0 space-y-5 overflow-x-hidden bg-[#0B0E11] px-2 py-4 font-sans text-white antialiased sm:mx-auto sm:max-w-[1600px] sm:space-y-8 sm:px-6 sm:py-6 lg:p-8">
      {/* CABEÇALHO */}
      <header className="flex min-w-0 flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
        <div className="min-w-0">
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
            EMATEA · Área do Agente
          </p>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Comissões
          </h1>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#161A1F] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "A atualizar..." : "Atualizar dados"}
        </button>
      </header>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-300 sm:p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RESUMO FINANCEIRO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-white sm:text-base">
            Resumo financeiro
          </h2>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
          {loading && !summary ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 rounded-2xl border border-white/5 bg-[#161A1F] p-4 sm:p-6"
              >
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-36 max-w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          ) : (
            <>
              <SummaryCard
                title="Disponível"
                value={summary?.availableCommission}
                icon={<BadgeDollarSign size={21} />}
                status="available"
                detail="Comissão disponível"
              />
              <SummaryCard
                title="Total acumulado"
                value={summary?.totalCommission}
                icon={<TrendingUp size={21} />}
                status="total"
                detail="Comissão acumulada"
              />
              <SummaryCard
                title="Pendentes"
                value={summary?.pending?.amount}
                subtitle={`${summary?.pending?.count ?? 0} registos`}
                icon={<Clock3 size={21} />}
                status="pending"
                detail="A aguardar processamento"
              />
              <SummaryCard
                title="Pagas"
                value={summary?.paid?.amount}
                subtitle={`${summary?.paid?.count ?? 0} registos`}
                icon={<CheckCircle2 size={21} />}
                status="paid"
                detail="Comissões pagas"
              />
            </>
          )}
        </div>
      </section>

      {/* HISTÓRICO */}
      <section className="min-w-0 space-y-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
            <ReceiptText size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-black uppercase tracking-wide text-white sm:text-lg">
              Histórico de comissões
            </h2>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#161A1F] shadow-xl">
          {/* TELEMÓVEL: REGISTOS EM CARTÕES LARGOS */}
          <div className="space-y-3 p-2 sm:p-3 md:hidden">
            {loading && history.length === 0 ? (
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
            ) : history.length === 0 ? (
              <EmptyState />
            ) : (
              paginatedHistory.map((item) => (
                <article
                  key={item.id}
                  className="w-full min-w-0 rounded-xl border border-white/5 bg-[#0F1318] p-4 sm:p-5"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-bold text-white">
                        {item.serviceRequest?.serviceName || "Serviço não identificado"}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <CalendarDays size={13} className="shrink-0" />
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={item.status || ""} />
                  </div>

                  <div className="my-4 border-t border-white/5" />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Comissão
                      </p>
                      <p className="break-words text-lg font-black text-emerald-400">
                        {formatMoney(item.amount)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Referência
                      </p>
                      <p className="break-all font-mono text-xs text-gray-300">
                        {item.serviceRequest?.customerReference || "—"}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* COMPUTADOR: TABELA COMPLETA */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead className="border-b border-white/5 bg-[#0B0E11] text-[10px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-4 py-4 lg:px-5">Data</th>
                  <th className="px-4 py-4 lg:px-5">Serviço</th>
                  <th className="px-4 py-4 lg:px-5">Referência</th>
                  <th className="px-4 py-4 text-right lg:px-5">Comissão</th>
                  <th className="px-4 py-4 text-center lg:px-5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading && history.length === 0 ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-4"><Skeleton className="ml-auto h-4 w-24" /></td>
                      <td className="px-4 py-4"><Skeleton className="mx-auto h-6 w-20" /></td>
                    </tr>
                  ))
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-500">
                      Nenhuma comissão encontrada.
                    </td>
                  </tr>
                ) : (
                  paginatedHistory.map((item) => (
                    <tr key={item.id} className="text-gray-300 transition hover:bg-white/[0.03]">
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-400 lg:px-5">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 font-semibold text-white lg:px-5">
                        {item.serviceRequest?.serviceName || "—"}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-gray-400 lg:px-5">
                        {item.serviceRequest?.customerReference || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-emerald-400 lg:px-5">
                        {formatMoney(item.amount)}
                      </td>
                      <td className="px-4 py-4 text-center lg:px-5">
                        <StatusBadge status={item.status || ""} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO */}
          {!loading && history.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-white/5 bg-[#0F1318] px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                <span>
                  A mostrar{" "}
                  <strong className="text-white">
                    {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, totalItems)}
                  </strong>{" "}
                  de <strong className="text-white">{totalItems}</strong> comissões
                </span>
                <label className="flex items-center gap-2">
                  Registos por página
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-white/10 bg-[#161A1F] px-2 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                  disabled={safePage <= 1}
                  className="rounded-lg border border-white/10 bg-[#161A1F] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="whitespace-nowrap px-2 text-xs text-gray-400">
                  Página <strong className="text-white">{safePage}</strong> de{" "}
                  <strong className="text-white">{totalPages}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                  disabled={safePage >= totalPages}
                  className="rounded-lg border border-white/10 bg-[#161A1F] px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-emerald-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Seguinte
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  detail,
  icon,
  status,
}: {
  title: string;
  value: number | string | null | undefined;
  subtitle?: string;
  detail: string;
  icon: ReactNode;
  status: "available" | "total" | "pending" | "paid";
}) {
  const colors = {
    available: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    total: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    pending: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    paid: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  };

  return (
    <div className="min-w-0 rounded-2xl border border-white/5 bg-[#161A1F] p-4 shadow-lg transition hover:border-white/10 sm:p-5 lg:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {title}
          </p>
          <h3 className="mt-2 break-words text-xl font-black tracking-tight text-white sm:text-2xl">
            {formatMoney(value)}
          </h3>
          <p className="mt-2 text-xs text-gray-500">{subtitle || detail}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 ${colors[status]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPaid = status === "PAID";
  const isPending = status === "PENDING";

  const style = isPaid
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
    : isPending
    ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
    : "border-rose-500/20 bg-rose-500/10 text-rose-400";

  const label = isPaid ? "Paga" : isPending ? "Pendente" : "Cancelada";
  const icon = isPaid ? <CheckCircle2 size={12} /> : isPending ? <Clock3 size={12} /> : <XCircle size={12} />;

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[10px] font-bold ${style}`}>
      {icon}
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-gray-500">
        <ReceiptText size={22} />
      </div>
      <p className="text-sm text-gray-400">Nenhuma comissão encontrada.</p>
    </div>
  );
}
