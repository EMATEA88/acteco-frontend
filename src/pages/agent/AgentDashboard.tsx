import { useEffect, useState } from "react";
import {
  Wallet,
  BadgeDollarSign,
  Users,
  BarChart3,
  TrendingUp,
  UserCheck,
  UserX,
  RefreshCw,
  Activity,
} from "lucide-react";
import { UserService } from "../../services/user.service";
import { AgentService } from "../../services/agent.service";

interface DashboardData {
  currentBalance?: number;
  commissionBalance?: number;
  totalSales?: number;
  totalSubAgents?: number;
  activeSubAgents?: number;
  inactiveSubAgents?: number;
  totalTransactions?: number;
  totalCommission?: number;
  totalTeamBalance?: number;
  profile?: {
    currentBalance?: number;
    totalSales?: number;
    totalCommission?: number;
    commissionBalance?: number;
  };
  team?: {
    total?: number;
    active?: number;
    inactive?: number;
  };
  sales?: {
    today?: number;
    month?: number;
  };
}

const currency = (value: unknown) =>
  new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export default function AgentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadDashboard() {
  try {
    setLoading(true);
    setError(false);

    const [dashboardResult, userResult] = await Promise.all([
      AgentService.dashboard(),
      UserService.me(),
    ]);

    const dashboard = dashboardResult as DashboardData;
    const user = userResult as { balance?: number };

    setData({
      ...dashboard,
      currentBalance: Number(user.balance ?? 0),
    });
  } catch (err) {
    console.error("Erro ao carregar dashboard:", err);
    setError(true);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    void loadDashboard();
  }, []);

  const balance = data?.currentBalance ?? data?.profile?.currentBalance ?? 0;
  const commission =
    data?.commissionBalance ?? data?.profile?.commissionBalance ?? 0;
  const totalSales = data?.totalSales ?? data?.profile?.totalSales ?? 0;
  const totalCommission =
    data?.totalCommission ?? data?.profile?.totalCommission ?? 0;
  const teamTotal = data?.totalSubAgents ?? data?.team?.total ?? 0;
  const teamActive = data?.activeSubAgents ?? data?.team?.active ?? 0;
  const teamInactive =
    data?.inactiveSubAgents ?? data?.team?.inactive ?? 0;

  return (
    <main className="mx-auto max-w-7xl space-y-7 p-4 text-[#EAECEF] md:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            EMATEA · Área do agente
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Resumo financeiro e desempenho da sua rede.
          </p>
        </div>

        <button
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-200 hover:bg-white/[0.08] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Atualizar dados
        </button>
      </header>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4 text-sm text-rose-300">
          Não foi possível carregar os dados do dashboard.
          <button
            onClick={() => void loadDashboard()}
            className="font-bold underline underline-offset-4"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/[0.12] via-[#151A1F] to-[#151A1F] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-emerald-400/[0.06] blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <Wallet size={19} />
              Saldo disponível
            </div>

            {loading ? (
              <div className="mt-4 h-10 w-56 animate-pulse rounded-lg bg-white/10" />
            ) : (
              <p className="mt-3 break-words text-3xl font-bold tracking-tight text-white md:text-4xl">
                {currency(balance)}
              </p>
            )}

          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300 sm:self-center">
            <Wallet size={30} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Comissão disponível"
          value={currency(commission)}
          detail="Saldo de comissões"
          icon={<BadgeDollarSign size={21} />}
          color="cyan"
          loading={loading}
        />
        <MetricCard
          title="Vendas totais"
          value={currency(totalSales)}
          detail="Volume de vendas registado"
          icon={<BarChart3 size={21} />}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Comissão acumulada"
          value={currency(totalCommission)}
          detail="Total registado em comissões"
          icon={<TrendingUp size={21} />}
          color="purple"
          loading={loading}
        />
        <MetricCard
          title="Total de subagentes"
          value={String(teamTotal)}
          detail="Subagentes da sua rede"
          icon={<Users size={21} />}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Subagentes ativos"
          value={String(teamActive)}
          detail="Contas ativas"
          icon={<UserCheck size={21} />}
          color="emerald"
          loading={loading}
        />
        <MetricCard
          title="Subagentes inativos"
          value={String(teamInactive)}
          detail="Contas inativas"
          icon={<UserX size={21} />}
          color="amber"
          loading={loading}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-[#15191E] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-400">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white">Atividade da rede</h2>
              <p className="text-xs text-gray-500">
                Resumo dos subagentes
              </p>
            </div>
          </div>

          <InfoRow label="Subagentes ativos" value={teamActive} />
          <InfoRow label="Subagentes inativos" value={teamInactive} />
          <InfoRow
            label="Total de transações"
            value={data?.totalTransactions ?? 0}
          />
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#15191E] p-5 md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.08] text-cyan-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white">Resumo financeiro</h2>
              <p className="text-xs text-gray-500">
                Indicadores das operações
              </p>
            </div>
          </div>

          <InfoRow
            label="Vendas de hoje"
            value={currency(data?.sales?.today ?? 0)}
          />
          <InfoRow
            label="Vendas deste mês"
            value={currency(data?.sales?.month ?? 0)}
          />
          <InfoRow
            label="Saldo total da equipa"
            value={currency(data?.totalTeamBalance ?? 0)}
          />
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon,
  color,
  loading,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: "cyan" | "blue" | "purple" | "emerald" | "amber";
  loading: boolean;
}) {
  const styles = {
    cyan: "bg-cyan-400/[0.08] text-cyan-300 border-cyan-400/15",
    blue: "bg-blue-400/[0.08] text-blue-300 border-blue-400/15",
    purple: "bg-purple-400/[0.08] text-purple-300 border-purple-400/15",
    emerald: "bg-emerald-400/[0.08] text-emerald-300 border-emerald-400/15",
    amber: "bg-amber-400/[0.08] text-amber-300 border-amber-400/15",
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#15191E] p-5 transition hover:border-white/[0.14]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles[color]}`}>
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="mt-5 h-7 w-36 animate-pulse rounded bg-white/[0.07]" />
      ) : (
        <p className="mt-5 break-words text-xl font-bold text-white">{value}</p>
      )}
      <p className="mt-3 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] py-3 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}