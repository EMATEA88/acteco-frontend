import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardStats } from "../../services/dashboard.service";
import {
  TransactionService,
  type Transaction
} from "../../services/transaction.service";
import toast from "react-hot-toast";

// =====================================================
// BRANDING DAS OPERADORAS / SERVIÇOS
// =====================================================

const providerBranding: Record<string, { logo: string }> = {
  UNITEL: { logo: "UNITEL.PNG" },
  MOVICEL: { logo: "MOVICEL.PNG" },
  AFRICELL: { logo: "AFRICELL.PNG" },
  NETONE: { logo: "NETONE.PNG" },

  DSTV: { logo: "DSTV.PNG" },
  ZAP: { logo: "ZAP1.PNG" },
  ZAP_SAT: { logo: "ZAP1.PNG" },
  "ZAP FIBRA": { logo: "ZAP2.PNG" },
  ZAP_MEDIA: { logo: "ZAP2.PNG" },
  ZAP2: { logo: "ZAP2.PNG" },

  ENDE: { logo: "ENDE.PNG" },
  EPAL: { logo: "EPAL.PNG" },
  STAS: { logo: "STAS.PNG" },
  "5LINHAS": { logo: "CINCO.PNG" },
  "5 LINHAS": { logo: "CINCO.PNG" },
  CINCO: { logo: "CINCO.PNG" },

  INT_VCH2: { logo: "AMAZON.PNG" },
  AMAZON: { logo: "AMAZON.PNG" },
  APPLE: { logo: "APPLE.PNG" },
  "GOOGLE PLAY": { logo: "GOOGLEPLAY.PNG" },
  GOOGLE: { logo: "GOOGLEPLAY.PNG" },
  NETFLIX: { logo: "NETFLIX.PNG" },
  SPOTIFY: { logo: "SPOTIFY.PNG" },
  PLAYSTATION: { logo: "TEAM.PNG" },
  TEAM: { logo: "TEAM.PNG" },
  XBOX: { logo: "XBOX.PNG" },
  BOLT: { logo: "BOLT.PNG" },
  FLIXBUS: { logo: "FLIXBUS.PNG" },

  PREMIERBET: { logo: "Premiebet.png" },
  PBET: { logo: "Premiebet.png" },
  BANTUBET: { logo: "BantuBet.png" },
  BBET: { logo: "BantuBet.png" },
  ELEPHANTBET: { logo: "Elephantbet.png" },
  EBET: { logo: "Elephantbet.png" },
  AFRIBET: { logo: "AfriBet.png" },
  ABET: { logo: "AfriBet.png" },
  MOBET: { logo: "Mobet.png" },
  MELBET: { logo: "MelBet.png" },
  MGMBET: { logo: "MelBet.png" },
  KWANZABET: { logo: "Kwanzabet.png" },
  "888BETS": { logo: "888Bets.png" },
  "888BET": { logo: "888Bets.png" },
  "888": { logo: "888Bets.png" }
};

const rechargeImages = import.meta.glob<string>(
  "../../assets/recharges/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP}",
  {
    eager: true,
    import: "default"
  }
);

type DashboardTransaction = Transaction & {
  metadata?: {
    phone?: string;
    phoneNumber?: string;
    planName?: string;
    plan?: string;
    partnerName?: string;
    providerName?: string;
    serviceName?: string;
    serviceGroupName?: string;
    [key: string]: any;
  };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [dynamicOperator, setDynamicOperator] = useState<string>("Sem dados");

  useEffect(() => {
    loadStats();
  }, []);

  const normalizeBrandKey = (value: string = "") =>
    value
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const getOperatorName = (tx: DashboardTransaction) => {
    const directProvider =
      tx?.metadata?.providerName ??
      tx?.metadata?.partnerName ??
      null;

    if (directProvider) {
      const normalizedProvider = normalizeBrandKey(directProvider);

      const directMap: Record<string, string> = {
        UNITEL: "UNITEL",
        BAZZA: "UNITEL",
        MOVICEL: "MOVICEL",
        AFRICELL: "AFRICELL",
        NETONE: "NETONE",
        DSTV: "DSTV",
        ZAP: "ZAP",
        "ZAP SAT": "ZAP_SAT",
        "ZAP FIBRA": "ZAP FIBRA",
        "ZAP MEDIA": "ZAP_MEDIA",
        ENDE: "ENDE",
        EPAL: "EPAL",
        STAS: "STAS",
        "5LINHAS": "5LINHAS",
        "5 LINHAS": "5 LINHAS",
        CINCO: "CINCO",
        INT_VCH2: "INT_VCH2",
        AMAZON: "AMAZON",
        APPLE: "APPLE",
        "GOOGLE PLAY": "GOOGLE PLAY",
        GOOGLE: "GOOGLE",
        NETFLIX: "NETFLIX",
        SPOTIFY: "SPOTIFY",
        PLAYSTATION: "PLAYSTATION",
        TEAM: "TEAM",
        XBOX: "XBOX",
        BOLT: "BOLT",
        FLIXBUS: "FLIXBUS",
        PREMIERBET: "PREMIERBET",
        PBET: "PBET",
        BANTUBET: "BANTUBET",
        BBET: "BBET",
        ELEPHANTBET: "ELEPHANTBET",
        EBET: "EBET",
        AFRIBET: "AFRIBET",
        ABET: "ABET",
        MOBET: "MOBET",
        MELBET: "MELBET",
        MGMBET: "MGMBET",
        KWANZABET: "KWANZABET",
        "888BETS": "888BETS",
        "888BET": "888BET",
        "888": "888",
      };

      if (directMap[normalizedProvider]) {
        return directMap[normalizedProvider];
      }

      const brandingMatch = Object.keys(providerBranding).find(key => {
        const normalizedKey = normalizeBrandKey(key);
        return (
          normalizedKey === normalizedProvider ||
          normalizedProvider.includes(normalizedKey) ||
          normalizedKey.includes(normalizedProvider)
        );
      });

      if (brandingMatch) {
        return brandingMatch;
      }
    }

    const sources = [
      tx?.metadata?.serviceName,
      tx?.metadata?.serviceGroupName,
      tx?.metadata?.planName,
      tx?.metadata?.plan,
      tx?.description,
      tx?.metadata?.providerName,
      tx?.metadata?.partnerName,
    ];

    const rawName = sources
      .filter(Boolean)
      .join(" ")
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (rawName.includes("UNITEL") || rawName.includes("BAZZA")) return "UNITEL";
    if (rawName.includes("MOVICEL")) return "MOVICEL";
    if (rawName.includes("AFRICELL")) return "AFRICELL";
    if (rawName.includes("NETONE")) return "NETONE";
    if (rawName.includes("DSTV") || rawName.includes("FAMILIA")) return "DSTV";
    if (rawName.includes("ZAP FIBRA")) return "ZAP FIBRA";
    if (rawName.includes("ZAP SAT")) return "ZAP_SAT";
    if (rawName.includes("ZAP MEDIA")) return "ZAP_MEDIA";
    if (rawName.includes("ZAP")) return "ZAP";
    if (rawName.includes("ENDE")) return "ENDE";
    if (rawName.includes("EPAL")) return "EPAL";
    if (rawName.includes("STAS")) return "STAS";
    if (rawName.includes("5LINHAS") || rawName.includes("CINCO")) return "5LINHAS";
    if (rawName.includes("PREMIERBET") || rawName.includes("PBET")) return "PREMIERBET";
    if (rawName.includes("BANTUBET")) return "BANTUBET";
    if (rawName.includes("ELEPHANTBET")) return "ELEPHANTBET";
    if (rawName.includes("AFRIBET")) return "AFRIBET";
    if (rawName.includes("MOBET")) return "MOBET";
    if (rawName.includes("MELBET")) return "MELBET";
    if (rawName.includes("KWANZABET")) return "KWANZABET";
    if (rawName.includes("888")) return "888BETS";
    if (rawName.includes("AMAZON")) return "AMAZON";
    if (rawName.includes("APPLE")) return "APPLE";
    if (rawName.includes("GOOGLE")) return "GOOGLE PLAY";
    if (rawName.includes("NETFLIX")) return "NETFLIX";
    if (rawName.includes("SPOTIFY")) return "SPOTIFY";
    if (rawName.includes("PLAYSTATION")) return "PLAYSTATION";
    if (rawName.includes("XBOX")) return "XBOX";
    if (rawName.includes("BOLT")) return "BOLT";
    if (rawName.includes("FLIXBUS")) return "FLIXBUS";

    return directProvider ?? null;
  };

  const getOperatorLogo = (operatorKey: string | null) => {
    if (!operatorKey) return null;

    const normalizedOperator = normalizeBrandKey(operatorKey);
    let brand = providerBranding[operatorKey.toUpperCase().trim()];

    if (!brand) {
      const matchingKey = Object.keys(providerBranding).find(key => {
        const normalizedKey = normalizeBrandKey(key);
        return (
          normalizedKey === normalizedOperator ||
          normalizedOperator.includes(normalizedKey) ||
          normalizedKey.includes(normalizedOperator)
        );
      });

      if (matchingKey) {
        brand = providerBranding[matchingKey];
      }
    }

    if (!brand?.logo) return null;

    const targetFileName = brand.logo.toLowerCase().trim();

    for (const path in rechargeImages) {
      if (path.toLowerCase().endsWith(targetFileName)) {
        return rechargeImages[path];
      }
    }

    const targetWithoutExtension = targetFileName.replace(/\.[^/.]+$/, "");

    for (const path in rechargeImages) {
      const fileName = path
        .split("/")
        .pop()
        ?.toLowerCase()
        .replace(/\.[^/.]+$/, "");

      if (fileName === targetWithoutExtension) {
        return rechargeImages[path];
      }
    }

    return null;
  };

  /**
   * Função criada para calcular o serviço mais vendido e atualizar o estado.
   */
  const calculateMostSoldService = (txs: DashboardTransaction[]) => {
    if (!txs || txs.length === 0) {
      setDynamicOperator("Sem dados");
      return;
    }

    const counts: Record<string, number> = {};

    for (const tx of txs) {
      const operator = getOperatorName(tx);
      if (operator) {
        counts[operator] = (counts[operator] || 0) + 1;
      }
    }

    const entries = Object.entries(counts);
    if (entries.length === 0) {
      setDynamicOperator("Sem dados");
      return;
    }

    // Ordena para encontrar o mais frequente
    entries.sort((a, b) => b[1] - a[1]);
    setDynamicOperator(entries[0][0]);
  };

  async function loadStats() {
    try {
      const [statsData, transactionsData] = await Promise.all([
        dashboardService.getStats(),
        TransactionService.list()
      ]);

      setStats(statsData);
      setTransactions(transactionsData.slice(0, 5));
      calculateMostSoldService(transactionsData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  const openTransaction = (id: number) => {
    navigate(`/transactions/${id}`);
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: loading
        ? null
        : `${Number(stats?.balance || 0).toLocaleString("pt-PT")} Kz`,
      valueColor: "text-cyan-300"
    },
    {
      title: "Total Gasto",
      value: loading
        ? null
        : `${Number(stats?.totalSpent || 0).toLocaleString("pt-PT")} Kz`,
      valueColor: "text-white"
    },
    {
      title: "Total Recargas",
      value: loading
        ? null
        : String(stats?.totalRequests || 0),
      valueColor: "text-white"
    },
    {
      title: "Mais Vendido",
      value: loading ? null : dynamicOperator,
      valueColor: "text-cyan-300"
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#081d28] text-[#e0f2fe] flex flex-col fixed inset-0 font-sans antialiased selection:bg-cyan-500/20">
      {/* HEADER */}
      <header className="shrink-0 border-b border-white/[0.06] bg-[#081d28]">
        <div className="px-5 sm:px-7 pt-6 pb-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-400/80">
                Dashboard
              </p>
              <h1 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Visão geral da conta
              </h1>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                Conta EMATEA
              </p>
              <p className="mt-1 text-xs text-white/60">
                Operações e saldo
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-32">
        {/* INDICADORES PRINCIPAIS */}
        <section className="px-5 sm:px-7 pt-5">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07]">
            {cards.map((item) => (
              <div
                key={item.title}
                className="min-h-[118px] bg-[#0d3040] px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-between"
              >
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  {item.title}
                </p>

                {loading ? (
                  <div className="h-6 w-2/3 rounded-md bg-white/[0.07] animate-pulse" />
                ) : (
                  <p
                    className={`text-base sm:text-lg font-semibold tracking-tight truncate ${item.valueColor}`}
                    title={String(item.value ?? "")}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ÚLTIMAS TRANSAÇÕES */}
        <section className="px-5 sm:px-7 pt-6">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d3040]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Últimas transações
                </h2>
                <p className="mt-0.5 text-[10px] text-white/35">
                  Movimentos recentes da conta
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/transactions")}
                className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Ver tudo
              </button>
            </div>

            {loading ? (
              <div className="divide-y divide-white/[0.05]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-5 py-4 animate-pulse"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-white/[0.06]" />
                      <div className="space-y-2">
                        <div className="h-3 w-32 rounded bg-white/[0.07]" />
                        <div className="h-2.5 w-20 rounded bg-white/[0.05]" />
                      </div>
                    </div>
                    <div className="h-3 w-16 rounded bg-white/[0.07]" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-white/50">
                  Nenhuma movimentação recente encontrada.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {transactions.map((tx) => {
                  const descUpper = (tx.description || "").toUpperCase();
                  const typeUpper = (tx.type || "").toUpperCase();

                  const isOut =
                    descUpper.includes("COMPRA") ||
                    typeUpper.includes("SPENT") ||
                    typeUpper.includes("OUT") ||
                    typeUpper.includes("WITHDRAW") ||
                    typeUpper.includes("PAYMENT") ||
                    typeUpper.includes("DEBIT");

                  const operatorKey = getOperatorName(tx);
                  const logoSrc = getOperatorLogo(operatorKey);

                  return (
                    <button
                      type="button"
                      key={tx.id}
                      onClick={() => openTransaction(tx.id)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.025] active:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-white/[0.08] bg-[#0a2533] flex items-center justify-center">
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt={operatorKey ?? "Operadora"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-semibold uppercase text-white/35">
                              {operatorKey
                                ? operatorKey.slice(0, 3)
                                : "TX"}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">
                            {tx.description || tx.type}
                          </p>
                          <p className="mt-1 text-[10px] text-white/35">
                            {new Date(tx.createdAt).toLocaleDateString("pt-AO")}{" "}
                            às{" "}
                            {new Date(tx.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`shrink-0 text-xs sm:text-sm font-semibold ${
                          isOut ? "text-rose-400" : "text-cyan-300"
                        }`}
                      >
                        {isOut ? "-" : "+"}
                        {Number(tx.amount).toLocaleString("pt-PT")}{" "}
                        <span className="text-[9px] font-normal text-white/35">
                          Kz
                        </span>
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* RESUMO DA CONTA */}
        <section className="px-5 sm:px-7 pt-4">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0d3040] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">
                Resumo da conta
              </h2>
              <p className="mt-0.5 text-[10px] text-white/35">
                Indicadores consolidados
              </p>
            </div>

            <div className="divide-y divide-white/[0.05]">
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-xs text-white/55">
                  Saldo disponível
                </span>

                {loading ? (
                  <div className="h-4 w-24 rounded bg-white/[0.07] animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold text-cyan-300">
                    {Number(stats?.balance || 0).toLocaleString("pt-PT")} Kz
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-xs text-white/55">
                  Total movimentado
                </span>

                {loading ? (
                  <div className="h-4 w-28 rounded bg-white/[0.07] animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {Number(stats?.totalSpent || 0).toLocaleString("pt-PT")} Kz
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-xs text-white/55">
                  Total de requisições
                </span>

                {loading ? (
                  <div className="h-4 w-10 rounded bg-white/[0.07] animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {stats?.totalRequests || 0}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-xs text-white/55">
                  Serviço mais vendido
                </span>

                {loading ? (
                  <div className="h-4 w-28 rounded bg-white/[0.07] animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold text-cyan-300 truncate max-w-[55%]">
                    {dynamicOperator}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="h-8" />
      </main>
    </div>
  );
}