import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  WalletCards,
  ArrowLeftRight,
  Zap,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardStats } from "../../services/dashboard.service";
import {
  TransactionService,
  type Transaction
} from "../../services/transaction.service";
import toast from "react-hot-toast";

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
      // Mantém apenas as 5 últimas transações para exibição na lista visual
      setTransactions(transactionsData.slice(0, 5));
      
      // Processa o histórico completo para descobrir o mais vendido real
      calculateMostSoldService(transactionsData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Função robusta que varre TODO o histórico real de transações
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

    // Se houver contagem válida, pega o primeiro, senão mantém Unitel como padrão
    if (entries[0][1] > 0) {
      setDynamicOperator(entries[0][0]);
    } else {
      setDynamicOperator("Unitel");
    }
  };

  const openTransaction = (id: number) => {
    navigate(`/transactions/${id}`);
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: loading ? null : `${Number(stats?.balance || 0).toLocaleString()} Kz`,
      icon: WalletCards,
      color: "from-emerald-500/[0.04] to-transparent",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      textColor: "text-emerald-400"
    },
    {
      title: "Total Gasto",
      value: loading ? null : `${Number(stats?.totalSpent || 0).toLocaleString()} Kz`,
      icon: ArrowLeftRight,
      color: "from-rose-500/[0.03] to-transparent",
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      textColor: "text-white"
    },
    {
      title: "Total Recargas",
      value: loading ? null : String(stats?.totalRequests || 0),
      icon: Zap,
      color: "from-blue-500/[0.03] to-transparent",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      textColor: "text-white"
    },
    {
      title: "Mais Vendidos",
      value: loading ? null : dynamicOperator,
      icon: ShieldCheck,
      color: "from-amber-500/[0.03] to-transparent",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      textColor: "text-amber-400 font-extrabold"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28 font-sans antialiased">
      
      {/* HEADER FIXO */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/[0.05] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full text-center">
          <p className="text-xs text-gray-400 uppercase font-mono font-bold tracking-widest">
            Estatísticas em tempo real
          </p>
        </div>
        <div className={`h-2 w-2 rounded-full bg-emerald-400 ${loading ? 'animate-ping' : 'animate-pulse'} absolute right-6`} />
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title || idx}
              className={`bg-gradient-to-br ${item.color} bg-[#161A1E] border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all hover:border-white/[0.08]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                  {item.title}
                </span>
                <div className={`p-2 rounded-xl border ${item.iconColor} shadow-inner`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-6">
                {loading ? (
                  <div className="h-5 bg-gray-800 rounded w-3/4 animate-pulse mb-1" />
                ) : (
                  <h3 className={`text-sm font-mono font-black tracking-tight ${item.textColor} truncate`}>
                    {item.value}
                  </h3>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TRANSACTIONS & SUMMARY CONTAINER */}
      <div className="px-6 space-y-6">
        
        {/* LAST TRANSACTIONS SECTION */}
        <div className="bg-[#161A1E] border border-white/[0.04] rounded-3xl p-5 shadow-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-300 mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Últimas Transações
          </h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl animate-pulse">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-gray-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-800 rounded w-2/5" />
                      <div className="h-2.5 bg-gray-800/60 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-800 rounded w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-400 font-mono font-bold tracking-wide">
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
                
                return (
                  <div
                    key={tx.id}
                    onClick={() => openTransaction(tx.id)}
                    className="
                      flex justify-between items-center bg-white/[0.01] border border-white/[0.02] p-3 rounded-xl 
                      cursor-pointer transition-all duration-200 
                      hover:scale-[1.01] hover:bg-white/[0.03] active:scale-[0.98]
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${isOut ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        {isOut ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white tracking-tight">
                          {tx.description || tx.type}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono font-medium mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('pt-AO')} às {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs font-mono font-bold ${isOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isOut ? '-' : '+'}{Number(tx.amount).toLocaleString()} <span className="text-[10px] font-sans font-bold text-gray-500">Kz</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DETAILED SUMMARY */}
        <div className="bg-[#161A1E] border border-white/[0.04] rounded-3xl p-5 shadow-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-300 mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Resumo Detalhado
          </h2>

          <div className="space-y-3 text-xs font-mono font-bold">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
              <span className="text-gray-400 font-sans font-medium">Saldo Atual</span>
              {loading ? (
                <div className="h-3.5 bg-gray-800 rounded w-20 animate-pulse" />
              ) : (
                <span className="text-emerald-400 font-black">
                  {Number(stats?.balance || 0).toLocaleString()} Kz
                </span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
              <span className="text-gray-400 font-sans font-medium">Total Movimentado</span>
              {loading ? (
                <div className="h-3.5 bg-gray-800 rounded w-24 animate-pulse" />
              ) : (
                <span className="text-white">
                  {Number(stats?.totalSpent || 0).toLocaleString()} Kz
                </span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
              <span className="text-gray-400 font-sans font-medium">Total de Requisições</span>
              {loading ? (
                <div className="h-4 bg-gray-800 rounded w-8 animate-pulse" />
              ) : (
                <span className="text-white font-black bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05]">
                  {stats?.totalRequests || 0}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-400 font-sans font-medium">Mais Vendidos</span>
              {loading ? (
                <div className="h-5 bg-gray-800 rounded w-28 animate-pulse" />
              ) : (
                <span className="text-amber-400 font-sans font-black text-[11px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                  {dynamicOperator}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}