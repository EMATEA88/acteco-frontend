import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingDown,
  Activity,
  Award,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dynamicOperator, setDynamicOperator] = useState<string>("Unitel");

  useEffect(() => {
    loadStats();
  }, []);

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

  const calculateMostSoldService = (txs: Transaction[]) => {
    if (!txs || txs.length === 0) {
      setDynamicOperator("Unitel");
      return;
    }

    const counts: Record<string, number> = {
      "Unitel": 0,
      "Movicel": 0,
      "Bazza / Africell": 0,
      "ZAP / TV": 0
    };

    txs.forEach((tx) => {
      const text = `${tx.description || ""} ${tx.type || ""}`.toUpperCase();
      
      if (text.includes("UNITEL")) {
        counts["Unitel"] += 1;
      } else if (text.includes("MOVICEL")) {
        counts["Movicel"] += 1;
      } else if (text.includes("BAZZA") || text.includes("AFRICELL") || text.includes("AFRI")) {
        counts["Bazza / Africell"] += 1;
      } else if (text.includes("ZAP") || text.includes("TV")) {
        counts["ZAP / TV"] += 1;
      }
    });

    const entries = Object.entries(counts);
    entries.sort((a, b) => b[1] - a[1]);

    if (entries[0][1] > 0) {
      setDynamicOperator(entries[0][0]);
    } else {
      setDynamicOperator("Unitel");
    }
  };

  const getOperatorName = (tx: Transaction) => {
    const metadata = (tx as Transaction & {
      metadata?: {
        providerName?: string;
        partnerName?: string;
        serviceName?: string;
        serviceGroupName?: string;
        planName?: string;
        plan?: string;
      };
    }).metadata;

    const sources = [
      metadata?.providerName,
      metadata?.partnerName,
      metadata?.serviceName,
      metadata?.serviceGroupName,
      metadata?.planName,
      metadata?.plan,
      tx.description
    ];

    const rawName = sources
      .filter(Boolean)
      .join(" ")
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    if (
      rawName.includes("UNITEL") ||
      rawName.includes("BAZZA")
    ) return "UNITEL";

    if (rawName.includes("MOVICEL")) return "MOVICEL";

    if (
      rawName.includes("AFRICELL") ||
      rawName.includes("AFRIBET")
    ) {
      return rawName.includes("AFRIBET") ? "AFRIBET" : "AFRICELL";
    }

    if (rawName.includes("DSTV")) return "DSTV";

    if (
      rawName.includes("FAMILIA/7D") ||
      rawName.includes("FAMILIA 7D")
    ) {
      return "DSTV";
    }

    if (rawName.includes("ZAP")) {
      if (
        rawName.includes("FIBRA") ||
        rawName.includes("MEDIA")
      ) {
        return "ZAP2";
      }

      return "ZAP";
    }

    if (rawName.includes("ENDE")) return "ENDE";
    if (rawName.includes("EPAL")) return "EPAL";
    if (rawName.includes("STAS")) return "STAS";
    if (rawName.includes("NETONE")) return "NETONE";

    if (
      rawName.includes("PREMIERBET") ||
      rawName.includes("PBET")
    ) {
      return "PREMIERBET";
    }

    if (
      rawName.includes("BANTUBET") ||
      rawName.includes("BBET")
    ) {
      return "BANTUBET";
    }

    if (
      rawName.includes("ELEPHANTBET") ||
      rawName.includes("EBET")
    ) {
      return "ELEPHANTBET";
    }

    return (
      metadata?.providerName ??
      metadata?.partnerName ??
      null
    );
  };

  const getOperatorLogo = (operatorKey: string | null) => {
    if (!operatorKey) return null;

    const brand = providerBranding[
      operatorKey.toUpperCase().trim()
    ];

    if (!brand) return null;

    const targetFileName = brand.logo.toLowerCase();

    for (const path in rechargeImages) {
      if (path.toLowerCase().endsWith(targetFileName)) {
        return rechargeImages[path];
      }
    }

    return null;
  };

  const openTransaction = (id: number) => {
    navigate(`/transactions/${id}`);
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: loading ? null : `${Number(stats?.balance || 0).toLocaleString("pt-PT")} Kz`,
      icon: Wallet,
      badgeColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      valueColor: "text-cyan-300"
    },
    {
      title: "Total Gasto",
      value: loading ? null : `${Number(stats?.totalSpent || 0).toLocaleString("pt-PT")} Kz`,
      icon: TrendingDown,
      badgeColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      valueColor: "text-white"
    },
    {
      title: "Total Recargas",
      value: loading ? null : String(stats?.totalRequests || 0),
      icon: Activity,
      badgeColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      valueColor: "text-white"
    },
    {
      title: "Mais Vendidos",
      value: loading ? null : dynamicOperator,
      icon: Award,
      badgeColor: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
      valueColor: "text-cyan-300 font-extrabold"
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a2533] text-[#e0f2fe] flex flex-col fixed inset-0 font-sans antialiased selection:bg-cyan-500/30">
      
      {/* HEADER SUPERIOR FINTECH */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-cyan-500/20 bg-[#0a2533]/90 backdrop-blur-xl shrink-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#144863] border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-950/40">
            <Sparkles size={16} className="text-cyan-300" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Visão Geral</h1>
            <p className="text-[10px] text-cyan-200/70 font-mono">Ambiente Seguro & Criptografado</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#0e364a] border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-inner">
          <div className={`h-2 w-2 rounded-full bg-cyan-400 ${loading ? 'animate-ping' : 'animate-pulse'}`} />
          <span className="text-[10px] font-mono font-bold uppercase text-cyan-200 tracking-wider">Online</span>
        </div>
      </div>

      {/* ÁREA COM SCROLL REAL E ESTÁVEL */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32">
        
        {/* CARDS ESTILO CORPORATIVO / FINTECH AZUL PETRÓLEO */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {cards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title || idx}
                className="group relative overflow-hidden bg-[#0e364a] border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-4 flex flex-col justify-between shadow-xl shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Detalhe de fundo com brilho azulado sutil */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/[0.05] rounded-full blur-xl group-hover:bg-cyan-500/[0.12] transition-all" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] text-cyan-200/70 uppercase font-mono font-bold tracking-wider">
                    {item.title}
                  </span>
                  <div className={`p-2.5 rounded-xl border ${item.badgeColor} shadow-md bg-[#144863]`}>
                    <Icon size={16} />
                  </div>
                </div>

                <div className="mt-6 relative z-10">
                  {loading ? (
                    <div className="h-5 bg-[#144863] rounded-md w-3/4 animate-pulse mb-1" />
                  ) : (
                    <h3 className={`text-sm sm:text-base font-mono font-black tracking-tight ${item.valueColor} truncate`}>
                      {item.value}
                    </h3>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTAINER DE TRANSAÇÕES E RESUMO */}
        <div className="px-6 space-y-6">
          
          {/* ÚLTIMAS TRANSAÇÕES */}
          <div className="bg-[#0e364a] border border-cyan-500/20 rounded-3xl p-5 shadow-2xl shadow-cyan-950/30 relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 font-mono">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                Últimas Transações
              </h2>
              <span className="text-[10px] text-cyan-200/70 font-mono">Tempo real</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#144863]/40 p-3.5 rounded-2xl animate-pulse border border-cyan-500/10">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-9 h-9 rounded-xl bg-[#144863]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#144863] rounded-md w-2/5" />
                        <div className="h-2.5 bg-[#144863]/60 rounded-md w-1/4" />
                      </div>
                    </div>
                    <div className="h-3 bg-[#144863] rounded-md w-16" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-cyan-200/70 font-mono font-bold tracking-wide">
                Nenhuma movimentação recente encontrada.
              </div>
            ) : (
              <div className="space-y-3">
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
                    <div
                      key={tx.id}
                      onClick={() => openTransaction(tx.id)}
                      className="
                        flex justify-between items-center bg-[#071c26]/60 border border-cyan-500/15 p-3.5 rounded-2xl 
                        cursor-pointer transition-all duration-200 
                        hover:border-cyan-400/50 hover:bg-[#124158] active:scale-[0.98] shadow-md
                      "
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl border shadow-inner flex items-center justify-center overflow-hidden ${
                            logoSrc
                              ? "bg-white border-cyan-500/30"
                              : isOut
                                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                          }`}
                        >
                          {logoSrc ? (
                            <img
                              src={logoSrc}
                              alt={operatorKey ?? "Operadora"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              {isOut ? (
                                <ArrowUpRight size={16} />
                              ) : (
                                <ArrowDownLeft size={16} />
                              )}
                            </>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">
                            {tx.description || tx.type}
                          </p>
                          <p className="text-[10px] text-cyan-200/70 font-mono font-medium mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString('pt-AO')} às {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className={`text-xs font-mono font-bold ${isOut ? 'text-rose-400' : 'text-cyan-300'}`}>
                        {isOut ? '-' : '+'}{Number(tx.amount).toLocaleString("pt-PT")} <span className="text-[10px] font-sans font-bold text-cyan-200/50">Kz</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RESUMO DETALHADO */}
          <div className="bg-[#0e364a] border border-cyan-500/20 rounded-3xl p-5 shadow-2xl shadow-cyan-950/30">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 font-mono">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                Resumo Detalhado
              </h2>
              <span className="text-[10px] text-cyan-200/70 font-mono">Consolidado</span>
            </div>

            <div className="space-y-3.5 text-xs font-mono font-bold">
              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                <span className="text-cyan-200/70 font-sans font-medium">Saldo Atual Disponível</span>
                {loading ? (
                  <div className="h-3.5 bg-[#144863] rounded w-20 animate-pulse" />
                ) : (
                  <span className="text-cyan-300 font-black text-sm">
                    {Number(stats?.balance || 0).toLocaleString("pt-PT")} Kz
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                <span className="text-cyan-200/70 font-sans font-medium">Total Movimentado</span>
                {loading ? (
                  <div className="h-3.5 bg-[#144863] rounded w-24 animate-pulse" />
                ) : (
                  <span className="text-white">
                    {Number(stats?.totalSpent || 0).toLocaleString("pt-PT")} Kz
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
                <span className="text-cyan-200/70 font-sans font-medium">Total de Requisições</span>
                {loading ? (
                  <div className="h-4 bg-[#144863] rounded w-8 animate-pulse" />
                ) : (
                  <span className="text-white font-black bg-[#144863] px-2.5 py-1 rounded-lg border border-cyan-500/25">
                    {stats?.totalRequests || 0}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-cyan-200/70 font-sans font-medium">Serviço Mais Vendido</span>
                {loading ? (
                  <div className="h-5 bg-[#144863] rounded w-28 animate-pulse" />
                ) : (
                  <span className="text-cyan-300 font-sans font-black text-[11px] bg-[#144863] border border-cyan-500/30 px-3 py-1.5 rounded-xl shadow-sm">
                    {dynamicOperator}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}