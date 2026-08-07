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

  const openTransaction = (id: number) => {
    navigate(`/transactions/${id}`);
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: loading ? null : `${Number(stats?.balance || 0).toLocaleString("pt-PT")} Kz`,
      icon: Wallet,
      badgeColor: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      valueColor: "text-cyan-400"
    },
    {
      title: "Total Gasto",
      value: loading ? null : `${Number(stats?.totalSpent || 0).toLocaleString("pt-PT")} Kz`,
      icon: TrendingDown,
      badgeColor: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      valueColor: "text-white"
    },
    {
      title: "Total Recargas",
      value: loading ? null : String(stats?.totalRequests || 0),
      icon: Activity,
      badgeColor: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      valueColor: "text-white"
    },
    {
      title: "Mais Vendidos",
      value: loading ? null : dynamicOperator,
      icon: Award,
      badgeColor: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      valueColor: "text-sky-300 font-extrabold"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28 font-sans antialiased selection:bg-cyan-500/20">
      
      {/* HEADER SUPERIOR FINTECH */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.06] bg-[#0B0E11]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Visão Geral</h1>
            <p className="text-[10px] text-gray-400 font-mono">Ambiente Seguro & Criptografado</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#161A1F] border border-white/10 px-3 py-1.5 rounded-full shadow-inner">
          <div className={`h-2 w-2 rounded-full bg-cyan-400 ${loading ? 'animate-ping' : 'animate-pulse'}`} />
          <span className="text-[10px] font-mono font-bold uppercase text-gray-300 tracking-wider">Online</span>
        </div>
      </div>

      {/* CARDS ESTILO CORPORATIVO / FINTECH AZUL */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title || idx}
              className="group relative overflow-hidden bg-[#161A1F] border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Detalhe de fundo com brilho azulado sutil */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/[0.03] rounded-full blur-xl group-hover:bg-cyan-500/[0.08] transition-all" />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] text-gray-400 uppercase font-mono font-bold tracking-wider">
                  {item.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${item.badgeColor} shadow-md`}>
                  <Icon size={16} />
                </div>
              </div>

              <div className="mt-6 relative z-10">
                {loading ? (
                  <div className="h-5 bg-white/[0.06] rounded-md w-3/4 animate-pulse mb-1" />
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
        <div className="bg-[#161A1F] border border-white/[0.08] rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              Últimas Transações
            </h2>
            <span className="text-[10px] text-gray-400 font-mono">Tempo real</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-3.5 rounded-2xl animate-pulse border border-white/[0.04]">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/[0.06] rounded-md w-2/5" />
                      <div className="h-2.5 bg-white/[0.04] rounded-md w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-white/[0.06] rounded-md w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 font-mono font-bold tracking-wide">
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
                      flex justify-between items-center bg-[#0B0E11]/60 border border-white/[0.04] p-3.5 rounded-2xl 
                      cursor-pointer transition-all duration-200 
                      hover:border-cyan-500/40 hover:bg-[#1C2128] active:scale-[0.98] shadow-md
                    "
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-xl border shadow-inner ${isOut ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
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
                    <div className={`text-xs font-mono font-bold ${isOut ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {isOut ? '-' : '+'}{Number(tx.amount).toLocaleString("pt-PT")} <span className="text-[10px] font-sans font-bold text-gray-500">Kz</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RESUMO DETALHADO */}
        <div className="bg-[#161A1F] border border-white/[0.08] rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2 font-mono">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              Resumo Detalhado
            </h2>
            <span className="text-[10px] text-gray-400 font-mono">Consolidado</span>
          </div>

          <div className="space-y-3.5 text-xs font-mono font-bold">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-gray-400 font-sans font-medium">Saldo Atual Disponível</span>
              {loading ? (
                <div className="h-3.5 bg-white/[0.06] rounded w-20 animate-pulse" />
              ) : (
                <span className="text-cyan-400 font-black text-sm">
                  {Number(stats?.balance || 0).toLocaleString("pt-PT")} Kz
                </span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-gray-400 font-sans font-medium">Total Movimentado</span>
              {loading ? (
                <div className="h-3.5 bg-white/[0.06] rounded w-24 animate-pulse" />
              ) : (
                <span className="text-white">
                  {Number(stats?.totalSpent || 0).toLocaleString("pt-PT")} Kz
                </span>
              )}
            </div>

            <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
              <span className="text-gray-400 font-sans font-medium">Total de Requisições</span>
              {loading ? (
                <div className="h-4 bg-white/[0.06] rounded w-8 animate-pulse" />
              ) : (
                <span className="text-white font-black bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                  {stats?.totalRequests || 0}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-400 font-sans font-medium">Serviço Mais Vendido</span>
              {loading ? (
                <div className="h-5 bg-white/[0.06] rounded w-28 animate-pulse" />
              ) : (
                <span className="text-cyan-400 font-sans font-black text-[11px] bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl shadow-sm">
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