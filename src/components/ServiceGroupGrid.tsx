import type {
  CatalogGroup,
  CatalogProvider
} from "../types/catalog";
import { ArrowLeft, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] px-4 sm:px-6 pt-4 pb-28 antialiased selection:bg-cyan-500/20">
      
      {/* HEADER FIXO NO TOPO */}
      <div className="pt-3 pb-4 flex items-center justify-between border-b border-cyan-500/10 sticky top-0 bg-[#0a2533]/90 backdrop-blur-xl z-40">
        <button
          onClick={onBack}
          className="h-10 px-4 rounded-xl bg-[#0e364a] border border-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-2 hover:bg-[#124158] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} className="text-cyan-400" />
          <span>Voltar</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-mono">
            {provider.name}
          </h1>
          <p className="text-[10px] text-cyan-200/70 tracking-wide font-mono">
            Escolha o serviço
          </p>
        </div>

        <div className="w-16"></div>
      </div>

      {/* CONTEÚDO */}
      <div className="space-y-3 mt-6 max-w-2xl mx-auto w-full">
        {provider.groups.map(group => (
          <button
            key={group.id}
            onClick={() => onSelect(group)}
            className="
              group
              w-full
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-cyan-500/20
              bg-[#0e364a]
              px-5
              py-4
              hover:border-cyan-400/50
              hover:bg-[#124158]
              transition-all
              duration-200
              shadow-lg
              shadow-cyan-950/20
              cursor-pointer
              text-left
            "
          >
            <div>
              <h2 className="text-white font-semibold text-sm sm:text-base group-hover:text-cyan-200 transition-colors">
                {group.name}
              </h2>

              <p className="text-xs text-cyan-200/70 font-mono mt-0.5">
                {group.plans.length} {group.plans.length === 1 ? 'plano' : 'planos'}
              </p>
            </div>

            <ChevronRight
              size={18}
              className="text-cyan-300/60 group-hover:text-white transition-colors shrink-0"
            />
          </button>
        ))}
      </div>

    </div>
  );
}