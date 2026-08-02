import type {
  CatalogGroup,
  CatalogPlan
} from "../types/catalog";

interface PlanGridProps {

  group: CatalogGroup;

  onBack: () => void;

  onSelect: (plan: CatalogPlan) => void;

}

export default function PlanGrid({

  group,

  onBack,

  onSelect

}: PlanGridProps) {

  return (

    <div className="max-w-5xl mx-auto px-4 pb-24">

      <div className="flex items-center justify-between mb-8">

        <button
          onClick={onBack}
          className="
            px-4
            py-2
            rounded-xl
            bg-[#161b22]
            border
            border-[#30363d]
            text-sm
            text-emerald-400
            hover:border-emerald-500
          "
        >
          ← Voltar
        </button>

        <div className="text-right">

          <h1 className="text-2xl font-bold text-white">

            {group.name}

          </h1>

          <p className="text-gray-400 text-sm">

            Escolha um plano

          </p>

        </div>

      </div>

      <div className="space-y-3">

        {group.plans.map(plan => (

          <button

            key={plan.id}

            onClick={() => onSelect(plan)}

            className="
              w-full
              rounded-2xl
              border
              border-[#30363d]
              bg-[#161b22]
              px-5
              py-4
              hover:border-emerald-500
              hover:bg-[#1b2129]
              transition-all
            "

          >

            <div className="flex justify-between items-center">

              <div className="text-left">

                <h2 className="text-white font-semibold">

                  {plan.name}

                </h2>

                {plan.valueVariable && (

                  <p className="text-xs text-gray-500 mt-1">

                    {plan.valueVariableMin &&
                    plan.valueVariableMax

                      ? `${plan.valueVariableMin.toLocaleString("pt-PT")} Kz até ${plan.valueVariableMax.toLocaleString("pt-PT")} Kz`

                      : "Valor variável"}

                  </p>

                )}

              </div>

              <div className="text-right">

                {plan.valueVariable ? (

                  <span className="text-yellow-400 font-semibold">

                    Variável

                  </span>

                ) : (

                  <span className="text-emerald-400 text-xl font-bold">

                    {plan.price.toLocaleString("pt-PT")} Kz

                  </span>

                )}

              </div>

            </div>

          </button>

        ))}

      </div>

    </div>

  );

}