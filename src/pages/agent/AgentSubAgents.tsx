import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Lock,
  Unlock,
  Users,
  UserCheck,
  UserX
} from "lucide-react";

import { AgentService } from "../../services/agent.service";
import { formatCurrencyAOA } from "../../utils/formatCurrency";

export default function AgentSubAgents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subAgents, setSubAgents] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await AgentService.listSubAgents();
      setSubAgents(data || []);
    } catch (err) {
      console.error("Erro ao carregar sub-agentes", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(item: any) {
    try {
      if (item.user.isBlocked) {
        await AgentService.unblockSubAgent(item.id);
      } else {
        await AgentService.blockSubAgent(item.id);
      }
      load();
    } catch (err) {
      console.error("Erro ao alterar estado do sub-agente", err);
    }
  }

  const filtered = useMemo(() => {
    return subAgents.filter((item) => {
      const value = `${item?.user?.fullName} ${item?.user?.phone} ${item?.employeeCode}`.toLowerCase();
      return value.includes(search.toLowerCase());
    });
  }, [search, subAgents]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0B0E11] text-[#EAECEF] p-6 md:p-8 font-sans space-y-6">
        <div className="h-10 bg-[#161A1E] rounded-xl w-48 animate-pulse" />
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="h-11 bg-[#161A1E] rounded-2xl w-full md:w-96 animate-pulse" />
          <div className="h-11 bg-[#161A1E] rounded-2xl w-full md:w-44 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-[#161A1E] h-32 rounded-3xl border border-white/[0.04] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0B0E11] text-[#EAECEF] p-6 md:p-8 font-sans antialiased flex flex-col">
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col justify-start">
        
        {/* HEADER DA PÁGINA */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-white uppercase font-mono">
              SUB-AGENTES
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Gestão de Equipa e Balanços
            </p>
          </div>
        </div>

        {/* ÁREA DE FILTROS E AÇÕES */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          
          {/* INPUT DE PESQUISA */}
          <div className="relative w-full md:w-96 bg-[#161A1E] rounded-2xl border border-white/[0.04] focus-within:border-cyan-500/40 transition-all duration-200">
            <Search
              size={16}
              className="absolute left-4 top-3.5 text-gray-600"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome, telefone ou código..."
              className="w-full bg-transparent pl-11 pr-4 py-3 text-sm outline-none text-white placeholder:text-gray-600"
            />
          </div>

          {/* BOTÃO NOVO SUB-AGENTE */}
          <button
            onClick={() => navigate("/agent/sub-agents/new")}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] active:scale-[0.98]"
          >
            <Plus size={16} strokeWidth={3} />
            Novo Sub-agente
          </button>
        </div>

        {/* LISTAGEM EM FORMATO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#161A1E] p-5 rounded-3xl border border-white/[0.04] shadow-xl hover:border-white/[0.08] transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between">
                
                {/* INFO PRINCIPAL */}
                <div className="space-y-1 min-w-0">
                  <h2 className="text-sm font-bold text-white truncate capitalize">
                    {item.user?.fullName?.toLowerCase()}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">{item.user?.phone}</p>
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-[9px] font-mono bg-white/[0.03] border border-white/[0.05] text-gray-500 px-2 py-0.5 rounded font-bold tracking-wider">
                      CÓD: {item.employeeCode}
                    </span>
                    
                    {item.user?.isBlocked ? (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                        <UserX size={10} /> Bloqueado
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <UserCheck size={10} /> Ativo
                      </span>
                    )}
                  </div>
                </div>

                {/* DISPLAY DE SALDO INDIVIDUAL */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">
                    Saldo Alocado
                  </p>
                  <p className="text-base font-black tracking-tight text-cyan-400 font-mono mt-0.5">
                    {formatCurrencyAOA(Number(item.user?.balance || 0))}
                  </p>
                </div>
              </div>

              {/* BARRA DE AÇÕES INFERIOR */}
              <div className="pt-3 border-t border-white/[0.03] flex items-center justify-end gap-2">
                <button
                  onClick={() => navigate(`/agent/sub-agents/${item.id}`)}
                  title="Visualizar Detalhes"
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all active:scale-95"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => navigate(`/agent/sub-agents/${item.id}/edit`)}
                  title="Editar dados"
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all active:scale-95"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => toggleStatus(item)}
                  title={item.user.isBlocked ? "Desbloquear Conta" : "Bloquear Conta"}
                  className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                    item.user.isBlocked
                      ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10"
                      : "bg-rose-500/5 border-rose-500/10 text-rose-400 hover:bg-rose-500/10"
                  }`}
                >
                  {item.user.isBlocked ? <Unlock size={16} /> : <Lock size={16} />}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* FEEDBACK CASO NÃO EXISTAM SUB-AGENTES */}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-[#161A1E] rounded-3xl border border-white/[0.03] text-gray-500 font-medium text-sm w-full flex-1 flex items-center justify-center">
            Nenhum sub-agente encontrado no sistema.
          </div>
        )}
      </div>
    </div>
  );
}