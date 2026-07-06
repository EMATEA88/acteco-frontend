import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Wallet,
  UserCircle,
  History,
} from "lucide-react";

import { AgentService } from "../../services/agent.service";
import { formatCurrencyAOA } from "../../utils/formatCurrency";

export default function SubAgentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [subAgent, setSubAgent] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const details = await AgentService.getSubAgent(Number(id));
      const sales = await AgentService.getSubAgentHistory(Number(id));
      setSubAgent(details);
      setHistory(sales || []);
    } catch (err) {
      console.error("Erro ao carregar detalhes", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus() {
    try {
      if (subAgent.user.isBlocked) {
        await AgentService.unblockSubAgent(subAgent.id);
      } else {
        await AgentService.blockSubAgent(subAgent.id);
      }
      load();
    } catch (err) {
      console.error("Erro ao alterar estado do operador", err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto font-sans text-[#EAECEF] space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 bg-[#161A1E] w-24 rounded-xl" />
          <div className="h-10 bg-[#161A1E] w-48 rounded-xl" />
        </div>
        <div className="h-28 bg-[#161A1E] rounded-[2rem] border border-white/[0.04]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-24 bg-[#161A1E] rounded-2xl border border-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-sans antialiased text-[#EAECEF] space-y-6">
      
      {/* BARRA DE AÇÕES SUPERIOR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-gray-400 hover:text-white rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          Voltar
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/agent/sub-agents/${subAgent.id}/edit`)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-gray-300 hover:text-cyan-400 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all"
          >
            <Pencil size={14} />
            Editar Conta
          </button>

          <button
            onClick={toggleStatus}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
              subAgent.user.isBlocked
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
            }`}
          >
            {subAgent.user.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
            {subAgent.user.isBlocked ? "Desbloquear" : "Bloquear Conta"}
          </button>
        </div>
      </div>

      {/* BLOCO DE PERFIL RESUMIDO */}
      <div className="bg-[#161A1E] rounded-[2rem] border border-white/[0.04] p-6 shadow-2xl flex flex-col sm:flex-row gap-5 items-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
          <UserCircle size={36} strokeWidth={1.5} />
        </div>
        <div className="text-center sm:text-left min-w-0">
          <h1 className="text-base font-black text-white capitalize truncate">
            {subAgent.user.fullName?.toLowerCase()}
          </h1>
          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[9px] font-mono bg-white/[0.03] border border-white/[0.05] text-gray-500 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
              ID OPERADOR: {subAgent.employeeCode}
            </span>
            {subAgent.user.isBlocked ? (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Bloqueado
              </span>
            ) : (
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Ativo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* GRID DE INFORMAÇÕES DETALHADAS (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card icon={<Phone size={16} />} title="Telefone Registado" value={subAgent.user.phone} isMono />
        <Card icon={<Mail size={16} />} title="Email de Contacto" value={subAgent.user.email || "Não associado"} />
        <Card
          icon={<Wallet size={16} />}
          title="Saldo em Carteira"
          value={formatCurrencyAOA(Number(subAgent.user.balance || 0))}
          isMono
          highlight
        />
        <Card icon={<Briefcase size={16} />} title="Cargo / Função" value={subAgent.position || "Sem cargo fixo"} />
        <Card icon={<Building2 size={16} />} title="Departamento" value={subAgent.department || "Geral"} />
        <Card icon={<MapPin size={16} />} title="Localização / Endereço" value={subAgent.address || "Não definido"} />
      </div>

      {/* HISTÓRICO DE VENDAS DENTRO DO SUB-AGENTE */}
      <div className="bg-[#161A1E] rounded-[2rem] border border-white/[0.04] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/[0.03] flex items-center gap-3">
          <History size={16} className="text-gray-500" />
          <h2 className="text-xs font-black uppercase tracking-widest text-white font-mono">
            Histórico de Vendas Individual
          </h2>
        </div>

        <div className="p-4 md:p-6 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-mono text-[11px] uppercase tracking-wider">
              Nenhum registo de venda associado a este operador.
            </div>
          ) : (
            history.map((item: any) => (
              <div
                key={item.id}
                className="bg-[#0B0E11]/40 border border-white/[0.03] p-4 rounded-xl flex items-center justify-between gap-4 transition-all hover:border-white/[0.06]"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs font-black text-white block truncate uppercase font-mono tracking-wide">
                    {item.serviceName}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono block">
                    REF: {item.customerReference || "-"}
                  </span>
                </div>

                <div className="text-right flex-shrink-0 space-y-0.5">
                  <span className="text-sm font-black text-cyan-400 font-mono block">
                    {formatCurrencyAOA(Number(item.amount || 0))}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono block">
                    {new Date(item.createdAt).toLocaleDateString("pt-AO", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

// COMPONENTE AUXILIAR INTERNO (REORGANIZADO)
interface CardProps {
  icon: any;
  title: string;
  value: any;
  isMono?: boolean;
  highlight?: boolean;
}

function Card({ icon, title, value, isMono, highlight }: CardProps) {
  return (
    <div className="bg-[#161A1E] rounded-2xl border border-white/[0.04] p-5 flex flex-col justify-between gap-3 shadow-md hover:border-white/[0.08] transition-all">
      <div className="flex items-center gap-2.5 text-gray-500">
        <div className={`p-1.5 rounded-lg bg-white/[0.01] border border-white/[0.04] ${highlight ? "text-cyan-400 bg-cyan-500/5" : ""}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
          {title}
        </span>
      </div>
      <div className={`text-sm font-bold tracking-wide truncate ${highlight ? "text-cyan-400 text-base" : "text-white"} ${isMono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}