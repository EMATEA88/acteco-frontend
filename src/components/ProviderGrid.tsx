import type {
  CatalogCategory,
  CatalogProvider
} from "../types/catalog";

import { getLogo } from "../utils/getLogo";
import { providerBranding } from "../config/recharge-branding";

interface ProviderGridProps {
  category: CatalogCategory;
  onBack: () => void;
  onSelect: (provider: CatalogProvider) => void;
}

export default function ProviderGrid({
  category,
  onBack,
  onSelect
}: ProviderGridProps) {

  return (

    <div className="max-w-6xl mx-auto px-4 pb-24">

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

            {category.name}

          </h1>

          <p className="text-gray-400 text-sm">

            Escolha uma marca

          </p>

        </div>

      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-8 justify-items-center">

        {category.providers.map(provider => {

          const branding =
            providerBranding[
              provider.name.toUpperCase() as keyof typeof providerBranding
            ];

          const logo =
            getLogo(branding?.logo);

          return (

            <button
              key={provider.id}
              onClick={() => onSelect(provider)}
              className="
                group
                flex
                flex-col
                items-center
                transition-all
                hover:scale-105
              "
            >

              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  overflow-hidden
                  bg-[#12161C]
                  border-2
                  border-[#2D333B]
                  group-hover:border-emerald-500
                  shadow-lg
                  flex
                  items-center
                  justify-center
                "
              >

                {logo ? (

                  <img
                    src={logo}
                    alt={provider.name}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <span
                    className="
                      text-white
                      text-xs
                      font-semibold
                      text-center
                      px-2
                    "
                  >

                    {provider.name}

                  </span>

                )}

              </div>

              <span
                className="
                  mt-3
                  text-sm
                  text-gray-300
                  font-medium
                  text-center
                "
              >

                {provider.name}

              </span>

            </button>

          );

        })}

      </div>

    </div>

  );

}