import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      const data = await ServiceService.listPlans(
        Number(categoryId)
      );

      setPlans(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Erro ao carregar planos"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center">
        Carregando planos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24">

      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold">
          Planos
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Escolha um plano
        </p>
      </div>

      <div className="p-4 space-y-4">

        {plans.length === 0 && (
          <div
            className="
              bg-[#1A1D23]
              border border-[#2B3139]
              rounded-2xl
              p-6
              text-center
              text-gray-400
            "
          >
            Nenhum plano encontrado
          </div>
        )}

        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() =>
              navigate(
                `/recharges/${serviceId}/categories/${categoryId}/plans/${plan.id}`
              )
            }
            className="
              w-full
              bg-[#1A1D23]
              border border-[#2B3139]
              rounded-2xl
              p-5
              flex
              justify-between
              items-center
              hover:border-green-500
              transition
            "
          >
            <span className="font-semibold">
              {plan.name}
            </span>

            <span className="text-green-400 font-bold">
              {Number(plan.price).toLocaleString()} Kz
            </span>
          </button>
        ))}

      </div>

    </div>
  );
}