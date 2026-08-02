import type {
  CatalogGroup,
  CatalogProvider
} from "../types/catalog";

interface ServiceGroupGridProps {

  provider: CatalogProvider;

  onBack: () => void;

  onSelect: (group: CatalogGroup) => void;

}

export default function ServiceGroupGrid({

  provider,

  onBack,

  onSelect

}: ServiceGroupGridProps) {

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

            {provider.name}

          </h1>

          <p className="text-gray-400 text-sm">

            Escolha o serviço

          </p>

        </div>

      </div>

      <div className="space-y-3">

        {provider.groups.map(group => (

          <button
            key={group.id}
            onClick={() => onSelect(group)}
            className="
              w-full
              flex
              items-center
              justify-between
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

            <div>

              <h2 className="text-white font-semibold">

                {group.name}

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                {group.plans.length} plano(s)

              </p>

            </div>

            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>

          </button>

        ))}

      </div>

    </div>

  );

}