import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { ServiceService } from "../../services/service.service";
import { serviceRequestService } from "../../services/serviceRequest.service";

interface Plan {
  id: number;
  name: string;
  price: number;

  serviceGroup: {
    name: string;

    service: {
      name: string;
    };
  };
}

export default function RechargeCheckout() {
  const { planId } = useParams();

  const [plan, setPlan] =
    useState<Plan | null>(null);

  const [loadingPlan, setLoadingPlan] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [customerReference, setCustomerReference] =
    useState("");

  useEffect(() => {
    loadPlan();
  }, [planId]);

  async function loadPlan() {
    try {
      if (!planId) return;

      const data =
        await ServiceService.getPlan(
          Number(planId)
        );

      setPlan(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Erro ao carregar plano"
      );
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleSubmit() {
    if (!customerReference.trim()) {
      toast.error(
        "Informe o número do cliente"
      );
      return;
    }

    try {
      setLoading(true);

      await serviceRequestService.pay({
        planId: Number(planId),
        customerReference
      });

      toast.success(
        "Serviço solicitado com sucesso"
      );

      setCustomerReference("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
        "Erro ao processar serviço"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingPlan) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center">
        Carregando plano...
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center">
        Plano não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white pb-24">

      <div className="px-4 pt-6">

        <h1 className="text-2xl font-bold">
          {plan.serviceGroup.service.name}
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Confirmar recarga
        </p>

      </div>

      <div className="p-4 space-y-4">

        <div
          className="
            bg-[#1A1D23]
            border border-[#2B3139]
            rounded-2xl
            p-4
          "
        >
          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-gray-400">
                Categoria
              </span>

              <span>
                {plan.serviceGroup.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                Plano
              </span>

              <span>
                {plan.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                Valor
              </span>

              <span className="text-green-400 font-bold">
                {Number(
                  plan.price
                ).toLocaleString()} Kz
              </span>
            </div>

          </div>
        </div>

        <div
          className="
            bg-[#1A1D23]
            border border-[#2B3139]
            rounded-2xl
            p-4
          "
        >
          <label className="text-sm text-gray-400">
            Número do Cliente
          </label>

          <input
            type="text"
            value={customerReference}
            onChange={(e) =>
              setCustomerReference(
                e.target.value
              )
            }
            placeholder="9XXXXXXXX"
            className="
              w-full
              mt-2
              bg-[#0B0E11]
              border border-[#2B3139]
              rounded-xl
              p-3
              outline-none
            "
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full
              mt-4
              bg-green-600
              hover:bg-green-500
              rounded-xl
              p-3
              font-semibold
              disabled:opacity-50
            "
          >
            {loading
              ? "Processando..."
              : "Confirmar Compra"}
          </button>

        </div>

      </div>

    </div>
  );
}