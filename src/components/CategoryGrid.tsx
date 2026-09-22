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
      return <Layers className="h-5 w-5 text-cyan-400" />;
    }

    const normalized = categoryName
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (normalized.includes("TELECOM") || normalized.includes("MOVEL")) {
      return <Smartphone className="h-5 w-5 text-cyan-400" />;
    }

    if (normalized.includes("TELEVISAO") || normalized.includes("TV")) {
      return <Tv className="h-5 w-5 text-cyan-400" />;
    }

    if (normalized.includes("JOGOS") || normalized.includes("APOSTA")) {
      return <Trophy className="h-5 w-5 text-cyan-400" />;
    }

    if (normalized.includes("PARCEIRO")) {
      return <Users className="h-5 w-5 text-cyan-400" />;
    }

    if (
      normalized.includes("INTERNACIONAL") ||
      normalized.includes("PAGAMENTOS INTERNACIONAIS")
    ) {
      return <Globe className="h-5 w-5 text-cyan-400" />;
    }

    return <Layers className="h-5 w-5 text-cyan-400" />;
  };

  return (
    <main
      className="recargas-page min-h-screen w-full overflow-y-auto bg-[#0a2533] text-[#e0f2fe] font-sans antialiased selection:bg-cyan-500/25"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}
    >
      <style>{`
        .recargas-page::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-full px-4 pb-24 pt-5 sm:px-5 sm:pt-7">
        {/* CABEÇALHO */}
        <header className="mb-4">
          <h1 className="text-center text-lg font-bold tracking-tight text-white sm:text-xl">
            Recargas
          </h1>
        </header>

        {/* LISTA DE CATEGORIAS — ESTRUTURA DE PÁGINA, SEM CARDS */}
        <div className="w-full">
          {categories.map((category) => {
            const iconComponent = getCategoryIcon(category.name);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelect(category)}
                className="
                  group
                  flex
                  min-h-[64px]
                  w-full
                  cursor-pointer
                  items-center
                  justify-between
                  border-b
                  border-cyan-900/70
                  px-0
                  py-3
                  text-left
                  transition-colors
                  duration-200
                  hover:bg-cyan-950/30
                  focus:outline-none
                  focus-visible:bg-cyan-950/40
                  sm:min-h-[70px]
                  sm:py-3.5
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-800/70 bg-cyan-950/50 sm:h-11 sm:w-11">
                    {iconComponent}
                  </div>

                  <span className="truncate text-sm font-semibold text-white">
                    {category.name}
                  </span>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center text-cyan-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-300">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
