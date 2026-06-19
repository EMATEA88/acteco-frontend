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
          <h1 className="text-xl font-black tracking-tight text-white">Categorias</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
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
              className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 flex items-center justify-between animate-pulse h-[76px]"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-8 h-8 rounded-lg bg-gray-800" />
                <div className="h-4 bg-gray-800 rounded w-1/2" />
              </div>
              <div className="w-4 h-4 bg-gray-800 rounded" />
            </div>
          ))
        ) : (
          <>
            {/* COMPORTAMENTO VAZIO */}
            {groups.length === 0 && (
              <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-8 text-center text-xs text-gray-400 font-mono font-bold tracking-wide shadow-xl">
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
                className="w-full bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 flex items-center justify-between hover:border-blue-500/30 hover:bg-[#1c2127] transition-all duration-200 text-left shadow-lg group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-gray-400 shrink-0 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-200">
                    <Layers size={18} />
                  </div>
                  <h3 className="font-bold text-sm text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                    {group.name}
                  </h3>
                </div>
                
                <div className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0">
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