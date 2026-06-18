import { useEffect, useState } from "react";
import {
  Wallet,
  Receipt,
  Trophy,
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardStats } from "../../services/dashboard.service";
import {
  TransactionService,
  type Transaction
} from "../../services/transaction.service";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Mapeamento dinâmico das métricas
  const cards = [
    {
      title: "Saldo Atual",
      value: loading ? null : `${Number(stats?.balance || 0).toLocaleString()} Kz`,
      icon: Wallet,
      color: "from-emerald-500/10 to-transparent",
      iconColor: "text-emerald-400",
      textColor: "text-emerald-400"
    },
    {
      title: "Total Gasto",
      value: loading ? null : `${Number(stats?.totalSpent || 0).toLocaleString()} Kz`,
      icon: Receipt,
      color: "from-rose-500/5 to-transparent",
      iconColor: "text-rose-400",
      textColor: "text-white"
    },
    {
      title: "Total Recargas",
      value: loading ? null : String(stats?.totalRequests || 0),
      icon: Activity,
      color: "from-blue-500/5 to-transparent",
      iconColor: "text-blue-400",
      textColor: "text-white"
    },
    {
      title: "Mais Utilizado",
      value: loading ? null : (stats?.mostUsedService ?? "Nenhum"),
      icon: Trophy,
      color: "from-yellow-500/5 to-transparent",
      iconColor: "text-yellow-400",
      textColor: "text-yellow-400 font-medium"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24 font-sans selection:bg-emerald-500/30 antialiased">
      
      {/* HEADER FIXO - SEMPRE VISÍVEL (ESTILO BINANCE) */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-white/[0.03] bg-[#0B0E11]/80 backdrop-blur-md sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" />
            Visão Geral
          </h1>
          <p className="text-[11px] text-gray-500 uppercase font-mono tracking-wider mt-0.5">
            Estatísticas em tempo real
          </p>
        </div>
        <div className={`h-2 w-2 rounded-full bg-emerald-500 ${loading ? 'animate-ping' : 'animate-pulse'}`} />
      </div>

      {/* METRICS GRID COM SKELETON INTEGRADO */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title || idx}
              className={`bg-gradient-to-br ${item.color} bg-[#161A1F] border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-white/10 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider">
                  {item.title}
                </span>
                <div className={`p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] ${item.iconColor}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-6">
                {loading ? (
                  /* Skeleton do Valor do Card */
                  <div className="h-5 bg-white/[0.05] rounded w-3/4 animate-pulse mb-1" />
                ) : (
                  <h3 className={`text-base font-mono font-bold tracking-tight ${item.textColor} truncate`}>
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
        
        {/* LAST TRANSACTIONS SECTON */}
        <div className="bg-[#161A1F] border border-white/[0.04] rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/[0.01] blur-xl rounded-full" />
          
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Últimas Transações
          </h2>

          {loading ? (
            /* Skeleton das Linhas de Transações */
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.01] border border-white/[0.01] p-3 rounded-xl animate-pulse">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.03]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/[0.05] rounded w-2/5" />
                      <div className="h-2.5 bg-white/[0.02] rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-white/[0.04] rounded w-16" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6 text-xs text-gray-500 font-mono tracking-wide">
              Nenhuma movimentação recente encontrada.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const isOut = tx.type?.toLowerCase().includes('spent') || tx.type?.toLowerCase().includes('out') || tx.type?.toLowerCase().includes('withdraw') || tx.type?.toLowerCase().includes('payment');
                
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] p-3 rounded-xl transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${isOut ? 'bg-rose-500/5 border-rose-500/10 text-rose-400' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'}`}>
                        {isOut ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-200 tracking-tight">
                          {tx.description || tx.type}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString('pt-AO')} às {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xs font-mono font-bold ${isOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isOut ? '-' : '+'}{Number(tx.amount).toLocaleString()} <span className="text-[10px] font-sans font-normal text-gray-500">Kz</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DETAILED SUMMARY */}
        <div className="bg-[#161A1F] border border-white/[0.04] rounded-3xl p-5 shadow-xl">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Resumo Detalhado
          </h2>

          <div className="space-y-3 text-xs font-mono">
            {/* Linha 1 */}
            <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
              <span className="text-gray-500 font-sans">Saldo Atual</span>
              {loading ? (
                <div className="h-3.5 bg-white/[0.05] rounded w-20 animate-pulse" />
              ) : (
                <span className="text-emerald-400 font-bold">
                  {Number(stats?.balance || 0).toLocaleString()} Kz
                </span>
              )}
            </div>

            {/* Linha 2 */}
            <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
              <span className="text-gray-500 font-sans">Total Movimentado</span>
              {loading ? (
                <div className="h-3.5 bg-white/[0.04] rounded w-24 animate-pulse" />
              ) : (
                <span className="text-gray-300">
                  {Number(stats?.totalSpent || 0).toLocaleString()} Kz
                </span>
              )}
            </div>

            {/* Linha 3 */}
            <div className="flex justify-between items-center border-b border-white/[0.02] pb-2">
              <span className="text-gray-500 font-sans">Total de Requisições</span>
              {loading ? (
                <div className="h-4 bg-white/[0.04] rounded w-8 animate-pulse" />
              ) : (
                <span className="text-gray-300 font-bold bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.05]">
                  {stats?.totalRequests || 0}
                </span>
              )}
            </div>

            {/* Linha 4 */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500 font-sans">Serviço mais Ativo</span>
              {loading ? (
                <div className="h-5 bg-white/[0.04] rounded w-28 animate-pulse" />
              ) : (
                <span className="text-yellow-400 font-sans font-semibold text-[11px] bg-yellow-500/5 border border-yellow-500/10 px-2 py-0.5 rounded-md">
                  {stats?.mostUsedService || "-"}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}