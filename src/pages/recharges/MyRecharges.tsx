import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Hash, Receipt } from "lucide-react";
import toast from "react-hot-toast";

import {
  serviceRequestService,
  type ServiceRequest
} from "../../services/serviceRequest.service";

export default function MyRecharges() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await serviceRequestService.myRequests();
      setRequests(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  }

  // Estilos de status refinados para Dark Mode Premium
  function getStatusBadge(status: string) {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold";
      case "IN_PROGRESS":
        return "bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold";
      case "FAILED":
        return "bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold";
      default:
        return "bg-white/[0.04] border border-white/[0.05] text-gray-400 font-bold";
    }
  }

  function getStatusLabel(status: string) {
    if (status === "COMPLETED") return "Concluído";
    if (status === "IN_PROGRESS") return "Processando";
    if (status === "FAILED") return "Falhou";
    return status;
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] pb-28 antialiased">
      
      {/* HEADER FIXO - DARK MODE */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-white/[0.05] bg-[#0B0E11]/90 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-300 hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">Minhas Recargas</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Histórico completo de transações solicitadas
          </p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-6 space-y-4">

        {loading ? (
          /* SKELETON LOADER DAS SOLICITAÇÕES */
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2 w-1/3">
                  <div className="h-4 bg-gray-800 rounded w-full" />
                  <div className="h-3 bg-gray-800/50 rounded w-2/3" />
                </div>
                <div className="h-6 bg-gray-800 rounded-full w-20" />
              </div>
              <div className="pt-2 space-y-2 border-t border-white/[0.03]">
                <div className="h-3 bg-gray-800/50 rounded w-1/2" />
                <div className="h-3 bg-gray-800/50 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* ESTADO VAZIO */}
            {requests.length === 0 && (
              <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-8 text-center text-xs text-gray-400 font-mono font-bold tracking-wide shadow-xl">
                Nenhuma solicitação de recarga encontrada.
              </div>
            )}

            {/* LISTAGEM DOS CARDS REAIS */}
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 shadow-xl space-y-3.5 hover:border-white/[0.08] transition-colors"
              >
                {/* TOPO DO CARD: SERVIÇO E STATUS */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-white tracking-tight truncate">
                      {request.serviceName || "Serviço"}
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5 truncate">
                      {request.planName || "-"}
                    </p>
                  </div>

                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${getStatusBadge(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                {/* DETALHES TÉCNICOS */}
                <div className="pt-3 border-t border-white/[0.04] space-y-2 text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-500" />
                    <span>Número / Ref:</span>
                    <span className="font-mono font-black text-white ml-auto">{request.customerReference}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Receipt size={14} className="text-gray-500" />
                    <span>Categoria:</span>
                    <span className="font-bold text-gray-200 ml-auto">{request.serviceGroupName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-500" />
                    <span>Data e Hora:</span>
                    <span className="text-gray-400 font-semibold ml-auto">
                      {new Date(request.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* RODAPÉ DO CARD: VALOR EM DESTAQUE */}
                <div className="flex justify-between items-center pt-2 border-t border-white/[0.02] bg-white/[0.01] -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Valor Pago</span>
                  <span className="font-mono font-black text-sm text-emerald-400">
                    {Number(request.amount).toLocaleString()} Kz
                  </span>
                </div>

              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}