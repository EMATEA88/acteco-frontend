import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Tag } from "lucide-react";
import toast from "react-hot-toast";

import { ServiceService } from "../../services/service.service";

interface Plan {
  id: number;
  name: string;
  price: number;
}

export default function RechargePlans() {
  const navigate = useNavigate();
  const { serviceId, categoryId } = useParams();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      loadPlans();
    }
  }, [categoryId]);

  async function loadPlans() {
    try {
      const data = await ServiceService.listPlans(Number(categoryId));
      setPlans(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar planos");
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
          <h1 className="text-xl font-black tracking-tight text-white">Planos Disponíveis</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Selecione o plano ideal para recarregar
          </p>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="p-6 space-y-4">

        {/* PROCESSAMENTO SKELETON EM CARDS */}
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 flex items-center justify-between animate-pulse h-[76px]"
            >
              <div className="flex items-center gap-3 w-1/2">
                <div className="w-5 h-5 rounded-full bg-gray-800" />
                <div className="h-4 bg-gray-800 rounded w-full" />
              </div>
              <div className="h-5 bg-gray-800 rounded w-20" />
            </div>
          ))
        ) : (
          <>
            {/* COMPORTAMENTO VAZIO */}
            {plans.length === 0 && (
              <div className="bg-[#161A1E] border border-white/[0.03] rounded-2xl p-8 text-center text-xs text-gray-400 font-mono font-bold tracking-wide shadow-xl">
                Nenhum plano disponível de momento.
              </div>
            )}

            {/* LISTAGEM DOS PLANOS REAIS */}
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() =>
                  navigate(
                    `/recharges/${serviceId}/categories/${categoryId}/plans/${plan.id}`
                  )
                }
                className="w-full bg-[#161A1E] border border-white/[0.03] rounded-2xl p-5 flex justify-between items-center hover:border-blue-500/30 hover:bg-[#1c2127] transition-all duration-200 text-left shadow-lg group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Tag size={16} className="text-gray-500 group-hover:text-blue-400 shrink-0 transition-colors" />
                  <span className="font-bold text-sm text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                    {plan.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                    {Number(plan.price).toLocaleString()} Kz
                  </span>
                  <ChevronRight size={14} className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all stroke-[3px]" />
                </div>
              </button>
            ))}
          </>
        )}

      </div>
    </div>
  );
}