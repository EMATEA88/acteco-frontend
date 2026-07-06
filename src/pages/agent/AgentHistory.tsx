import { useEffect, useMemo, useState } from "react";
import { Search, History, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";

import { AgentService } from "../../services/agent.service";
import { formatCurrencyAOA } from "../../utils/formatCurrency";

export default function AgentHistory() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await AgentService.getTeamSales();
      setHistory(data || []);
    } catch (err) {
      console.error("Erro ao carregar vendas da equipa", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const value = `
        ${item.user?.fullName || ""}
        ${item.serviceName || ""}
        ${item.customerReference || ""}
      `.toLowerCase();
      return value.includes(search.toLowerCase());
    });
  }, [history, search]);

  // SKELETON LOADING CONSISTENTE
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto font-sans text-[#EAECEF] space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-7 bg-[#161A1E] w-48 rounded-lg" />
          <div className="h-4 bg-[#161A1E] w-80 rounded-lg" />
        </div>
        <div className="h-12 bg-[#161A1E] rounded-2xl w-full max-w-md" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-20 bg-[#161A1E] rounded-2xl border border-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-sans antialiased text-[#EAECEF] space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
          <History size={18} />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-wider text-white uppercase font-mono">
            Histórico da Equipa
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
            Fluxo de vendas e operações dos sub-agentes
          </p>
        </div>
      </div>

      {/* FILTRO DE PESQUISA */}
      <div className="relative w-full max-w-md bg-[#161A1E] rounded-2xl border border-white/[0.04] focus-within:border-cyan-500/40 transition-all duration-200">
        <Search size={16} className="absolute left-4 top-3.5 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrar por agente, serviço ou referência..."
          className="w-full bg-transparent pl-11 pr-4 py-3 text-sm outline-none text-white placeholder:text-gray-600"
        />
      </div>

      {/* LISTA DE TRANSAÇÕES RESPONSIVA (ANTI-QUEBRA) */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#161A1E] rounded-[2rem] border border-white/[0.03] text-gray-500 text-sm flex flex-col items-center justify-center gap-3 shadow-xl">
            <History size={36} className="text-gray-700" />
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              Nenhum registo de operação detetado
            </span>
          </div>
        ) : (
          filtered.map((item: any) => (
            <div
              key={item.id}
              className="bg-[#161A1E] p-4 md:p-5 rounded-2xl border border-white/[0.04] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-white/[0.08]"
            >
              {/* BLOCO ESQUERDO: SUB-AGENTE E SERVIÇO */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-[#0B0E11] border border-white/[0.04] items-center justify-center text-gray-400 flex-shrink-0">
                  <History size={16} />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-sm font-bold text-white truncate capitalize">
                    {item.user?.fullName?.toLowerCase() || "Operador Desconhecido"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
                    <span className="font-mono text-cyan-400/90 font-bold bg-cyan-500/5 px-1.5 py-0.5 rounded border border-cyan-500/10">
                      {item.serviceName || "Serviço Geral"}
                    </span>
                    <span className="text-gray-600 font-mono text-[11px]">
                      REF: {item.customerReference || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* BLOCO DIREITO: PREÇO, ESTADO E DATA */}
              <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.03]">
                
                {/* VALOR FORMATADO EM KWANZAS */}
                <span className="text-sm md:text-base font-black text-white font-mono tracking-tight">
                  {formatCurrencyAOA(Number(item.amount || 0))}
                </span>

                <div className="flex items-center gap-3">
                  {/* BADGE DE ESTADO PREMIUM */}
                  <Status status={item.status} />

                  {/* DATA MOLDADA */}
                  <span className="text-[10px] text-gray-500 font-mono font-medium">
                    {new Date(item.createdAt).toLocaleDateString("pt-AO", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

// SUB-COMPONENTE: BADGES DE ESTADO EXCLUSIVOS
function Status({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
          <CheckCircle2 size={12} /> Concluído
        </span>
      );
    case "PENDING":
      return (
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
          <Clock size={12} /> Pendente
        </span>
      );
    case "FAILED":
      return (
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
          <XCircle size={12} /> Falhou
        </span>
      );
    default:
      return (
        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-gray-500/10 text-gray-400 border border-gray-500/20 flex items-center gap-1">
          <AlertTriangle size={12} /> {status}
        </span>
      );
  }
}