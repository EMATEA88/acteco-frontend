import { useState } from "react";
import type { CatalogPlan } from "../types/catalog";
import { purchaseService } from "../services/purchase.service";

interface PurchaseModalProps {
  plan: CatalogPlan;
  onClose: () => void;
}

export default function PurchaseModal({
  plan,
  onClose
}: PurchaseModalProps) {

  const [customerReference, setCustomerReference] = useState("");

  const [amount, setAmount] = useState(
    plan.valueVariable
      ? ""
      : String(plan.price)
  );

  const [loading, setLoading] = useState(false);

  async function handlePurchase() {

    try {

      setLoading(true);

      await purchaseService.purchase({

        planId: plan.id,

        customerReference,

        amount: Number(amount)

      });

      alert("Compra realizada com sucesso.");

      onClose();

    } catch (error: any) {

      alert(

        error?.response?.data?.message ??

        "Erro ao efetuar compra."

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="w-full max-w-md rounded-3xl bg-[#161b22] border border-[#30363d] overflow-hidden">

        <div className="px-6 py-5 border-b border-[#30363d]">

          <h2 className="text-xl font-bold text-white">

            Confirmar Compra

          </h2>

          <p className="text-sm text-gray-400 mt-1">

            {plan.name}

          </p>

        </div>

        <div className="p-6 space-y-5">

          <div>

            <label className="block text-sm text-gray-400 mb-2">

              Referência

            </label>

            <input
              className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] px-4 py-3 text-white"
              placeholder="Telefone, contador ou referência"
              value={customerReference}
              onChange={(e) =>
                setCustomerReference(e.target.value)
              }
            />

          </div>

          {plan.valueVariable ? (

            <div>

              <label className="block text-sm text-gray-400 mb-2">

                Valor

              </label>

              <input
                type="number"
                className="w-full rounded-xl bg-[#0d1117] border border-[#30363d] px-4 py-3 text-white"
                placeholder="Introduza o valor"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />

              <p className="text-xs text-gray-500 mt-2">

                Mínimo: {plan.valueVariableMin?.toLocaleString("pt-PT")} Kz

                {" • "}

                Máximo: {plan.valueVariableMax?.toLocaleString("pt-PT")} Kz

              </p>

            </div>

          ) : (

            <div className="rounded-2xl bg-[#0d1117] border border-[#30363d] p-4">

              <span className="text-sm text-gray-400">

                Valor da Recarga

              </span>

              <p className="mt-2 text-3xl font-bold text-emerald-400">

                {plan.price.toLocaleString("pt-PT")} Kz

              </p>

            </div>

          )}

          <div className="rounded-2xl bg-[#0d1117] border border-[#30363d] p-4 space-y-2 text-sm">

            <div className="flex justify-between">

              <span className="text-gray-400">

                Produto

              </span>

              <span className="text-white">

                {plan.name}

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-400">

                Tipo

              </span>

              <span className="text-white">

                {plan.valueVariable ? "Valor variável" : "Valor fixo"}

              </span>

            </div>

          </div>

        </div>

        <div className="border-t border-[#30363d] p-6 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#30363d] py-3 text-white hover:bg-[#20252c]"
          >

            Cancelar

          </button>

          <button
            disabled={loading}
            onClick={handlePurchase}
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-white font-semibold"
          >

            {loading
              ? "Processando..."
              : "Comprar"}

          </button>

        </div>

      </div>

    </div>

  );

}