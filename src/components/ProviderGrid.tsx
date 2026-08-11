import type { CatalogCategory, CatalogProvider } from "../types/catalog";
import { ArrowLeft } from "lucide-react";
import { getLogo } from "../utils/getLogo";
import { providerBranding } from "../config/recharge-branding";

interface ProviderGridProps {
  category: CatalogCategory;
  onBack: () => void;
  onSelect: (provider: CatalogProvider) => void;
}

// Função auxiliar inteligente para encontrar o logo independentemente do formato da chave
const getProviderLogoPath = (provider: CatalogProvider) => {
  // 1. Tenta buscar pelo código do provedor (ex: "PBET", "ZAP_SAT")
  if (provider.code) {
    const cleanCode = provider.code.toUpperCase().replace(/\s+/g, "");
    if (providerBranding[cleanCode]) {
      return providerBranding[cleanCode].logo;
    }
  }

  // 2. Tenta buscar pelo nome limpo (sem espaços e em maiúsculas)
  if (provider.name) {
    const cleanName = provider.name.toUpperCase().replace(/\s+/g, "");
    if (providerBranding[cleanName]) {
      return providerBranding[cleanName].logo;
    }

    // 3. Tenta buscar pelo nome exato atual
    if (providerBranding[provider.name]) {
      return providerBranding[provider.name].logo;
    }
  }

  return undefined;
};

export default function ProviderGrid({ category, onBack, onSelect }: ProviderGridProps) {
  return (
    <div className="min-h-screen bg-[#0a2533] text-[#e0f2fe] px-5 pt-4 pb-28 antialiased selection:bg-cyan-500/20">
      
      {/* HEADER PROFISSIONAL E EQUILIBRADO */}
      <div className="pt-2 pb-4 flex items-center justify-between border-b border-cyan-500/10 sticky top-0 bg-[#0a2533]/90 backdrop-blur-md z-40">
        
        {/* Botão Voltar */}
        <button
          onClick={onBack}
          className="
            h-9 px-3.5 rounded-xl
            bg-[#0e364a] border border-cyan-500/20
            text-cyan-300 text-xs font-semibold
            flex items-center gap-2
            hover:bg-[#124158] hover:text-white
            transition-all duration-200
            cursor-pointer
            shadow-sm
          "
        >
          <ArrowLeft size={16} className="text-cyan-400" />
          Voltar
        </button>

        {/* Título da Categoria Centralizado */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-mono">
            {category.name}
          </h1>
        </div>

        {/* Elemento vazio apenas para equilibrar o layout Flexbox */}
        <div className="w-16"></div>
      </div>

      {/* GRELHA DE PROVEDORES */}
      <div className="mt-8 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {category.providers && category.providers.map((provider) => {
            const logoFilename = getProviderLogoPath(provider);
            const logo = getLogo(logoFilename);

            return (
              <div 
                key={provider.id}
                onClick={() => onSelect(provider)}
                className="flex flex-col items-center group cursor-pointer"
              >
                {/* Círculo do Logótipo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0e364a] border border-cyan-500/20 p-1 flex items-center justify-center shadow-lg group-hover:border-cyan-400/50 group-hover:bg-[#124158] group-hover:scale-105 transition-all duration-200">
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#144863] p-1.5 shadow-sm">
                    {logo ? (
                      <img 
                        src={logo} 
                        alt={provider.name}
                        className="w-full h-full object-cover rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-white uppercase text-center px-1">
                        {provider.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Nome do Provedor */}
                <span className="text-[11px] sm:text-xs font-medium text-cyan-200/80 mt-2 text-center tracking-wide group-hover:text-white transition-colors truncate w-full">
                  {provider.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}