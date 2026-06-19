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
          <h1 className="text-xl font-black tracking-tight text-gray-950">Planos Disponíveis</h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
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
              className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 flex items-center justify-between animate-pulse h-[76px]"
            >
              <div className="flex items-center gap-3 w-1/2">
                <div className="w-5 h-5 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-20" />
            </div>
          ))
        ) : (
          <>
            {/* COMPORTAMENTO VAZIO */}
            {plans.length === 0 && (
              <div className="bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-8 text-center text-xs text-gray-600 font-mono font-bold tracking-wide shadow-sm">
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
                className="w-full bg-[#FCFCFD] border border-[#E4E7EB] rounded-2xl p-5 flex justify-between items-center hover:border-emerald-300 hover:bg-gray-50/50 transition-all duration-200 text-left shadow-sm group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Tag size={16} className="text-gray-400 group-hover:text-emerald-600 shrink-0 transition-colors" />
                  <span className="font-black text-sm text-gray-950 tracking-tight truncate">
                    {plan.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-xl">
                    {Number(plan.price).toLocaleString()} Kz
                  </span>
                  <ChevronRight size={14} className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all stroke-[3px]" />
                </div>
              </button>
            ))}
          </>
        )}

      </div>
    </div>
  );
}