import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import serviceService from "../../services/service.service";
import type { ServicePlan } from "../../services/service.service";

export default function ServiceDetail() {

  const navigate = useNavigate();

  const { serviceId } = useParams();

  const [plans, setPlans] =
    useState<ServicePlan[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (serviceId) {
      loadPlans(Number(serviceId));
    }

  }, [serviceId]);

  async function loadPlans(id: number) {

    try {

      const data =
        await serviceService.listPlans(id);

      setPlans(data);

    } catch {

      toast.error(
        "Erro ao carregar planos."
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe]">

      <div className="px-6 py-5 flex items-center gap-4 border-b border-cyan-500/10 bg-[#0a2533]">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-[#0e364a] border border-cyan-500/20 text-cyan-300 hover:bg-[#124158] hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-xl font-bold text-white">
          Planos
        </h1>

      </div>

      <div className="p-6 space-y-4 max-w-2xl mx-auto w-full">

        {loading ? (

          <div className="space-y-3 animate-pulse w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full bg-[#0e364a] border border-cyan-500/20 rounded-2xl p-5 flex items-center justify-between shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#144863] border border-cyan-500/30"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-3.5 bg-[#144863] rounded-md"></div>
                    <div className="w-20 h-3 bg-[#144863] rounded-md"></div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-md bg-[#144863]"></div>
              </div>
            ))}
          </div>

        ) : plans.length === 0 ? (

          <div className="text-center py-12 text-cyan-200/70 text-xs font-mono">
            Nenhum plano disponível no momento.
          </div>

        ) : (

          plans.map(plan => (

            <button
              key={plan.id}
              onClick={() =>
                navigate(
                  `/recharges/plans/${plan.id}`
                )
              }
              className="w-full bg-[#0e364a] rounded-2xl p-5 flex justify-between items-center hover:bg-[#124158] border border-cyan-500/20 hover:border-cyan-400/50 transition shadow-lg shadow-cyan-950/20 cursor-pointer group text-left"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#144863] border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-sm">

                  <Zap
                    className="text-cyan-300"
                    size={20}
                  />

                </div>

                <div className="text-left">

                  <div className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    {plan.name}
                  </div>

                  <div className="text-cyan-400 font-bold mt-0.5">

                    {Number(plan.price).toLocaleString()}
                    {" "}
                    Kz

                  </div>

                </div>

              </div>

              <ChevronRight
                className="text-cyan-300/60 group-hover:text-white transition-colors shrink-0"
                size={18}
              />

            </button>

          ))

        )}

      </div>

    </div>

  );

}