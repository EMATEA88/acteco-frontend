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

    <div className="min-h-screen bg-[#0B0E11] text-white">

      <div className="px-6 py-5 flex items-center gap-4 border-b border-white/5">

        <button
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </button>

        <h1 className="text-xl font-bold">
          Planos
        </h1>

      </div>

      <div className="p-6 space-y-4">

        {loading ? (

          <div className="text-center">
            Carregando...
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
              className="w-full bg-[#161A1E] rounded-2xl p-5 flex justify-between items-center hover:bg-[#1D232A] transition"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                  <Zap
                    className="text-emerald-400"
                    size={20}
                  />

                </div>

                <div className="text-left">

                  <div className="font-semibold">
                    {plan.name}
                  </div>

                  <div className="text-emerald-400 font-bold">

                    {Number(plan.price).toLocaleString()}
                    {" "}
                    Kz

                  </div>

                </div>

              </div>

              <ChevronRight
                className="text-gray-500"
              />

            </button>

          ))

        )}

      </div>

    </div>

  );

}