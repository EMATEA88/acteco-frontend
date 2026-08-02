import type { CatalogCategory } from "../types/catalog";

import { getLogo } from "../utils/getLogo";
import { categoryBranding } from "../config/recharge-branding";

interface CategoryGridProps {

  categories: CatalogCategory[];

  onSelect: (category: CatalogCategory) => void;

}

export default function CategoryGrid({

  categories,

  onSelect

}: CategoryGridProps) {

  return (

    <div className="max-w-6xl mx-auto px-4 pb-24">

      <div className="text-center mb-10">

        <h1 className="text-3xl font-bold text-white">

          Recargas

        </h1>

        <p className="mt-2 text-gray-400">

          Escolha uma categoria

        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

        {categories.map(category => {

          const branding =
            categoryBranding[
              category.name
                .toUpperCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "_") as keyof typeof categoryBranding
            ];

          const logo =
            getLogo(branding?.logo);

          return (

            <button
              key={category.id}
              onClick={() => onSelect(category)}
              className="
                group
                bg-[#12161C]
                border
                border-[#232A33]
                rounded-3xl
                p-6
                transition-all
                duration-300
                hover:border-emerald-500
                hover:bg-[#171C22]
                hover:-translate-y-1
              "
            >

              <div className="flex justify-center mb-5">

                <div
                  className="
                    w-20
                    h-20
                    rounded-2xl
                    bg-[#0B0E11]
                    border
                    border-[#30363d]
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                  "
                >

                  {logo ? (

                    <img
                      src={logo}
                      alt={category.name}
                      className="w-full h-full object-contain p-2"
                    />

                  ) : (

                    <span className="text-white text-xs">

                      {category.name}

                    </span>

                  )}

                </div>

              </div>

              <h2 className="text-center text-white font-semibold">

                {category.name}

              </h2>

              <p className="mt-2 text-center text-sm text-gray-500">

                {category.providers.length} operador(es)

              </p>

            </button>

          );

        })}

      </div>

    </div>

  );

}