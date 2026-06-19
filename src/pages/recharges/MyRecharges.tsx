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

  // Define os estilos do status de forma limpa e visível
  function getStatusBadge(status: string) {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 border border-emerald-200 text-emerald-700 font-black";
      case "IN_PROGRESS":
        return "bg-amber-50 border border-amber-200 text-amber-700 font-black";
      case "FAILED":
        return "bg-rose-50 border border-rose-200 text-rose-700 font-black";
      default:
        return "bg-gray-100 border border-gray-200 text-gray-700 font-bold";
    }
  }

  function getStatusLabel(status: string) {
    if (status === "COMPLETED") return "Concluído";
    if (status === "IN_PROGRESS") return "Processando";
    if (status === "FAILED") return "Falhou";
    return status;
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-[#111827] pb-28 antialiased">
      
      {/* HEADER FIXO - ALTO CONTRASTE */}
      <div className="px-6 pt-8 pb-5 flex items-center gap-4 border-b border-[#D1D5DB] bg-[#F2F4F7]/80 backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-[#FCFCFD] border border-[#E4E7EB] text-gray-800 hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-950">Minhas Recargas</h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
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
              className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2 w-1/3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20" />
              </div>
              <div className="pt-2 space-y-2 border-t border-gray-100">
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* ESTADO VAZIO */}
            {requests.length === 0 && (
              <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-8 text-center text-xs text-gray-600 font-mono font-bold tracking-wide shadow-sm">
                Nenhuma solicitação de recarga encontrada.
              </div>
            )}

            {/* LISTAGEM DOS CARDS REAIS */}
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-3.5 hover:border-gray-400 transition-colors"
              >
                {/* TOPO DO CARD: SERVIÇO E STATUS */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-black text-base text-gray-950 tracking-tight truncate">
                      {request.serviceName || "Serviço"}
                    </h3>
                    <p className="text-xs text-gray-600 font-semibold mt-0.5 truncate">
                      {request.planName || "-"}
                    </p>
                  </div>

                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${getStatusBadge(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>

                {/* DETALHES TÉCNICOS */}
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400" />
                    <span>Número / Ref:</span>
                    <span className="font-mono font-black text-gray-950 ml-auto">{request.customerReference}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Receipt size={14} className="text-gray-400" />
                    <span>Categoria:</span>
                    <span className="font-extrabold text-gray-900 ml-auto">{request.serviceGroupName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Data e Hora:</span>
                    <span className="text-gray-600 font-semibold ml-auto">
                      {new Date(request.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* RODAPÉ DO CARD: VALOR EM DESTAQUE */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-50 bg-gray-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <span className="text-[10px] font-black uppercase text-gray-600 tracking-wider">Valor Pago</span>
                  <span className="font-mono font-black text-sm text-emerald-700">
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