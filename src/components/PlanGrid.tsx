import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { CatalogGroup, CatalogPlan } from "../types/catalog";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getLogo } from "../utils/getLogo";

interface PlanGridProps {
  group: CatalogGroup;
  onBack: () => void;
  onSelect: (plan: CatalogPlan) => void;
}

export default function PlanGrid({ group, onBack, onSelect }: PlanGridProps) {
  const { providerCode } = useParams<{ providerCode: string }>();
  const [providerLogo, setProviderLogo] = useState<string | null>(null);

  useEffect(() => {
    if (providerCode) {
      const logoUrl = getLogo(providerCode.toLowerCase());
      setProviderLogo(logoUrl);
    }
  }, [providerCode]);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-5 pt-4 pb-28 antialiased selection:bg-[#02C076]/20">
      
      {/* HEADER PROFISSIONAL - ESTILO BANCO / FINANÇAS */}
      <div className="pt-2 pb-4 flex items-center justify-between border-b border-white/[0.05] sticky top-0 bg-[#0B0E11]/90 backdrop-blur-md z-40">
        <button
          onClick={onBack}
          className="h-9 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-300 text-xs font-semibold flex items-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
        >
          <ArrowLeft size={16} className="text-gray-400" />
          Voltar
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none flex items-center gap-2.5">
          {providerLogo && (
            <img src={providerLogo} alt={group.name} className="w-7 h-7 rounded-full object-contain bg-[#12161C] p-0.5 border border-white/[0.08]" />
          )}
          <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-mono">
            {group.name}
          </h1>
        </div>

        <div className="w-16"></div>
      </div>

      {/* LISTA DE PLANOS - ESTILO CARTÃO PROFISSIONAL */}
      <div className="mt-6 space-y-3.5">
        {group.plans && group.plans.length > 0 ? (
          group.plans.map((plan) => {
            const isVariable = plan.valueVariable;

            return (
              <button
                key={plan.id}
                onClick={() => onSelect(plan)}
                className="
                  group relative overflow-hidden
                  w-full rounded-2xl
                  border border-[#2D333B] bg-[#161b22]
                  p-4 text-left
                  hover:border-emerald-500 hover:bg-[#1b2129]
                  transition-all duration-200
                  shadow-sm flex items-center justify-between
                "
              >
                {/* Linha indicadora lateral no hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                <div className="flex items-center gap-4">
                  {/* Logótipo da operadora no lado esquerdo de cada plano */}
                  {providerLogo && (
                    <img src={providerLogo} alt={group.name} className="w-12 h-12 rounded-xl border border-[#2D333B] object-contain p-1.5 bg-[#0B0E11]" />
                  )}
                  
                  {/* Detalhes do plano */}
                  <div>
                    <h2 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {plan.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      {isVariable 
                        ? (plan.valueVariableMin && plan.valueVariableMax
                            ? `De ${plan.valueVariableMin.toLocaleString("pt-PT")} Kz até ${plan.valueVariableMax.toLocaleString("pt-PT")} Kz`
                            : "Montante flexível")
                        : "Recarga instantânea segura"
                      }
                    </p>
                  </div>
                </div>

                {/* Preço ou Badge de Variável no lado direito */}
                <div className="text-right">
                  {isVariable ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-black uppercase font-mono tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Variável
                    </span>
                  ) : (
                    <span className="text-base font-black font-mono text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      {typeof plan.price === 'number' ? `${plan.price.toLocaleString("pt-PT")} Kz` : "Ativo"}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center py-16 text-gray-500 text-xs font-mono">
            Nenhum plano disponível para este operador no momento.
          </div>
        )}
      </div>

      {/* RODAPÉ DE SEGURANÇA */}
      <div className="mt-8 flex items-center justify-center gap-1.5 text-gray-500 text-[11px]">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Transações processadas com segurança criptografada</span>
      </div>

    </div>
  );
}