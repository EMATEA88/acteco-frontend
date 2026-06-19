import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Layers } from "lucide-react";
import toast from "react-hot-toast";

import { ServiceService } from "../../services/service.service";

interface ServiceGroup {
  id: number;
  name: string;
}

export default function RechargeCategories() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (serviceId) {
      loadGroups();
    }
  }, [serviceId]);

  async function loadGroups() {
    try {
      const data = await ServiceService.listGroups(Number(serviceId));
      setGroups(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-xl font-black tracking-tight text-gray-950">Categorias</h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Escolha uma categoria de plano
          </p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-6 space-y-4">

        {/* PROCESSAMENTO SKELETON INTEGRADO */}
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 flex items-center justify-between animate-pulse h-[76px]"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-6 h-6 rounded bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded" />
            </div>
          ))
        ) : (
          <>
            {/* COMPORTAMENTO VAZIO */}
            {groups.length === 0 && (
              <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-8 text-center text-xs text-gray-600 font-mono font-bold tracking-wide shadow-sm">
                Nenhuma categoria encontrada para este serviço.
              </div>
            )}

            {/* LISTAGEM DOS CARDS REAIS */}
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() =>
                  navigate(`/recharges/${serviceId}/categories/${group.id}`)
                }
                className="w-full bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 flex items-center justify-between hover:border-emerald-300 hover:bg-gray-50/50 transition-all duration-200 text-left shadow-sm group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 shrink-0 group-hover:text-emerald-700 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                    <Layers size={18} />
                  </div>
                  <h3 className="font-black text-sm text-gray-950 tracking-tight truncate">
                    {group.name}
                  </h3>
                </div>
                
                <div className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
                  <ChevronRight size={16} className="stroke-[3px]" />
                </div>
              </button>
            ))}
          </>
        )}

      </div>
    </div>
  );
}