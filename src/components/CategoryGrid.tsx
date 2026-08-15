import type { CatalogCategory } from "../types/catalog";
import {
  Smartphone,
  Tv,
  Trophy,
  Users,
  Globe,
  Layers,
  ChevronRight
} from "lucide-react";

interface CategoryGridProps {
  categories: CatalogCategory[];
  onSelect: (category: CatalogCategory) => void;
}

export default function CategoryGrid({
  categories,
  onSelect
}: CategoryGridProps) {
  const getCategoryIcon = (categoryName: string) => {
    if (!categoryName) {
      return <Layers className="w-5 h-5 text-cyan-400" />;
    }

    const normalized = categoryName
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("TELECOM") || normalized.includes("MOVEL")) {
      return <Smartphone className="w-5 h-5 text-cyan-400" />;
    }

    if (normalized.includes("TELEVISAO") || normalized.includes("TV")) {
      return <Tv className="w-5 h-5 text-cyan-400" />;
    }

    if (normalized.includes("JOGOS") || normalized.includes("APOSTA")) {
      return <Trophy className="w-5 h-5 text-cyan-400" />;
    }

    if (normalized.includes("PARCEIRO")) {
      return <Users className="w-5 h-5 text-cyan-400" />;
    }

    if (
      normalized.includes("INTERNACIONAL") ||
      normalized.includes("PAGAMENTOS INTERNACIONAIS")
    ) {
      return <Globe className="w-5 h-5 text-cyan-400" />;
    }

    return <Layers className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-[#071d28] text-[#e0f2fe] flex flex-col items-center px-4 sm:px-5 font-sans antialiased selection:bg-cyan-500/25 z-50">
      <div className="max-w-4xl w-full h-full flex flex-col justify-center py-5 sm:py-7">

        {/* CABEÇALHO — SOMENTE RECARGAS */}
        <div className="text-center mb-5 sm:mb-6 shrink-0">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Recargas
          </h1>
        </div>

        {/* LISTA VERTICAL — SEM SCROLL INTERNO */}
        <div className="flex flex-col gap-3 sm:gap-4 w-full">
          {categories.map((category) => {
            const iconComponent = getCategoryIcon(category.name);

            return (
              <button
                key={category.id}
                onClick={() => onSelect(category)}
                className="
                  group
                  relative
                  min-h-[72px] sm:min-h-[82px]
                  bg-[#0c2d3d]
                  hover:bg-[#103a4f]
                  border
                  border-cyan-500/20
                  hover:border-cyan-400/40
                  rounded-xl
                  px-3 py-3 sm:px-4 sm:py-4
                  transition-colors
                  duration-200
                  flex
                  items-center
                  justify-between
                  gap-2
                  cursor-pointer
                "
              >
                {/* ÍCONE */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#071d28] border border-cyan-500/25 flex items-center justify-center shrink-0">
                    {iconComponent}
                  </div>

                  {/* NOME DA CATEGORIA */}
                  <div className="text-left min-w-0">
                    <h2 className="text-white font-semibold text-xs sm:text-sm leading-tight truncate">
                      {category.name}
                    </h2>
                  </div>
                </div>

                {/* SETA */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}