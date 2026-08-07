import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { CatalogGroup, CatalogPlan } from "../types/catalog";
import { ArrowLeft } from "lucide-react";
import { getLogo } from "../utils/getLogo";

interface PlanGridProps {
  group: CatalogGroup;
  onBack: () => void;
  onSelect: (plan: CatalogPlan) => void;
}

const planBrandingMap: Record<string, string> = {
  UNITEL: "UNITEL.PNG",
  MOVICEL: "MOVICEL.PNG",
  AFRICELL: "AFRICELL.PNG",
  NETONE: "NETONE.PNG",
  DSTV: "DSTV.PNG",
  ZAP: "ZAP1.PNG",
  "ZAP FIBRA": "ZAP2.PNG",
  ENDE: "ENDE.PNG",
  EPAL: "EPAL.PNG",
  STAS: "STAS.PNG",
  "5LINHAS": "CINCO.PNG",
  "5 LINHAS": "CINCO.PNG",
  CINCO: "CINCO.PNG",
  AMAZON: "AMAZON.PNG",
  APPLE: "APPLE.PNG",
  "GOOGLE PLAY": "GOOGLEPLAY.PNG",
  NETFLIX: "NETFLIX.PNG",
  SPOTIFY: "SPOTIFY.PNG",
  PLAYSTATION: "TEAM.PNG",
  TEAM: "TEAM.PNG",
  XBOX: "XBOX.PNG",
  BOLT: "BOLT.PNG",
  FLIXBUS: "FLIXBUS.PNG",
  PREMIERBET: "Premiebet.png",
  PBET: "Premiebet.png",
  BANTUBET: "BantuBet.png",
  BBET: "BantuBet.png",
  ELEPHANTBET: "Elephantbet.png",
  EBET: "Elephantbet.png",
  AFRIBET: "AfriBet.png",
  ABET: "AfriBet.png",
  MOBET: "Mobet.png",
  MELBET: "MelBet.png",
  MGMBET: "MelBet.png",
  KWANZABET: "Kwanzabet.png",
  "888BETS": "888Bets.png",
  "888BET": "888Bets.png",
};

export default function PlanGrid({ group, onBack, onSelect }: PlanGridProps) {
  const { providerCode } = useParams<{ providerCode: string }>();
  const [providerLogo, setProviderLogo] = useState<string | null>(null);

  useEffect(() => {
    if (providerCode) {
      const logoUrl = getLogo(providerCode.toLowerCase());
      setProviderLogo(logoUrl);
    }
  }, [providerCode]);

  const getPlanSpecificLogo = (planName: string) => {
    const upperName = planName.toUpperCase();
    
    for (const [key, fileName] of Object.entries(planBrandingMap)) {
      if (upperName.includes(key)) {
        const cleanName = fileName.toLowerCase().replace(/\.[^/.]+$/, "");
        const logo = getLogo(cleanName);
        if (logo) return logo;
      }
    }
    
    return providerLogo;
  };

  void getPlanSpecificLogo;

  const isBettingProvider = useMemo(() => {
    const code = (providerCode || "").toUpperCase();
    const name = group.name.toUpperCase();
    const bettingKeywords = ["BET", "PREMIER", "BANTU", "ELEPHANT", "AFRI", "MOBET", "MEL", "KWANZA", "888"];
    return bettingKeywords.some(keyword => code.includes(keyword) || name.includes(keyword));
  }, [providerCode, group.name]);

  const groupedPlans = useMemo(() => {
    if (!group.plans || group.plans.length === 0) return {};

    const categories: Record<string, CatalogPlan[]> = {};

    group.plans.forEach((plan) => {
      // Filtrar e remover planos de 100 Kz se for casa de jogos/apostas
      if (isBettingProvider && Number(plan.price) === 100) {
        return;
      }

      const nameUpper = plan.name.toUpperCase();
      let subCategory = "Planos Principais";

      const currentProvider = (providerCode || "").toUpperCase();
      const groupNameUpper = group.name.toUpperCase();

      if (currentProvider.includes("UNITEL") || groupNameUpper.includes("UNITEL")) {
        if (nameUpper.includes("MAIS")) {
          subCategory = "Planos Mais";
        } else if (nameUpper.includes("DADOS") || nameUpper.includes("INTERNET") || nameUpper.includes("NET") || nameUpper.includes("MB") || nameUpper.includes("GB")) {
          subCategory = "Planos de Dados";
        } else if (nameUpper.includes("CASA") || nameUpper.includes("NETCASA")) {
          subCategory = "Planos NetCasa";
        } else if (nameUpper.includes("VOZ") || nameUpper.includes("FALA") || nameUpper.includes("MIN")) {
          subCategory = "Planos de Voz";
        } else {
          subCategory = "Outros Planos Unitel";
        }
      } else if (currentProvider.includes("AFRICELL") || groupNameUpper.includes("AFRICELL")) {
        if (nameUpper.includes("SOCIALIZA")) {
          subCategory = "Africell Socializa";
        } else if (nameUpper.includes("KONEKTA")) {
          subCategory = "Africell Konekta Pré-pago";
        } else if (nameUpper.includes("DADOS") || nameUpper.includes("AFRIMIX") || nameUpper.includes("AFRINET") || nameUpper.includes("MB") || nameUpper.includes("GB")) {
          subCategory = "Africell Dados";
        } else if (nameUpper.includes("VOZ") || nameUpper.includes("FALA")) {
          subCategory = "Africell Voz";
        } else if (nameUpper.includes("PROMOCIONAL") || nameUpper.includes("MIN")) {
          subCategory = "Africell Promocional";
        } else {
          subCategory = "Outros Planos Africell";
        }
      } else if (currentProvider.includes("MOVICEL") || groupNameUpper.includes("MOVICEL")) {
        if (nameUpper.includes("VOZ")) {
          subCategory = "Movicel Recarga Voz";
        } else if (nameUpper.includes("Dados") || nameUpper.includes("MB") || nameUpper.includes("GB")) {
          subCategory = "Movicel Dados";
        } else {
          subCategory = "Movicel Planos";
        }
      } else {
        if (nameUpper.includes("BAZZA")) {
          subCategory = "Planos Bazza";
        } else if (nameUpper.includes("DSTV")) {
          subCategory = "DStv Recargas";
        } else if (nameUpper.includes("ZAP")) {
          subCategory = "ZAP & ZAP Fibra";
        } else if (nameUpper.includes("ENDE") || nameUpper.includes("LIPOR") || nameUpper.includes("EPAL")) {
          subCategory = "Serviços e Utilidades";
        }
      }

      if (!categories[subCategory]) {
        categories[subCategory] = [];
      }
      categories[subCategory].push(plan);
    });

    return categories;
  }, [group.plans, providerCode, group.name, isBettingProvider]);

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] px-4 sm:px-6 pt-4 pb-28 antialiased selection:bg-cyan-500/20">
      
      <div className="pt-3 pb-4 flex items-center justify-between border-b border-white/[0.06] sticky top-0 bg-[#0B0E11]/90 backdrop-blur-xl z-40">
        <button
          onClick={onBack}
          className="h-10 px-4 rounded-xl bg-white/[0.03] border border-white/10 text-gray-300 text-xs font-semibold flex items-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} className="text-gray-400" />
          <span>Voltar</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none flex items-center gap-2.5">
          {providerLogo && (
            <img src={providerLogo} alt={group.name} className="w-8 h-8 rounded-full object-contain bg-[#161A1F] p-0.5 border border-white/10 shadow-md" />
          )}
          <h1 className="text-sm sm:text-base font-black tracking-wider text-white uppercase font-mono">
            {group.name}
          </h1>
        </div>

        <div className="w-16"></div>
      </div>

      {/* Sugestões Rápidas de Valores para Casas de Apostas (Removido 100kz, ajustado para começar em 200/300kz) */}
      {isBettingProvider && (
        <div className="mt-6 mb-8 p-4 rounded-2xl bg-[#161A1F] border border-white/[0.08] shadow-lg">
          <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-3">
            Carregamento Rápido — Selecione o Valor
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[200, 300, 500, 1000, 3000, 5000, 10000].map((quickVal) => (
              <button
                key={quickVal}
                onClick={() => {
                  const syntheticPlan = {
                    id: quickVal,
                    name: `Recarga ${quickVal.toLocaleString("pt-PT")} Kz`,
                    price: quickVal,
                    valueVariable: false
                  } as unknown as CatalogPlan;
                  onSelect(syntheticPlan);
                }}
                className="h-11 rounded-xl bg-[#0B0E11] border border-white/10 hover:border-cyan-500 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {quickVal.toLocaleString("pt-PT")} Kz
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8 mt-6">
        {Object.keys(groupedPlans).length > 0 ? (
          Object.entries(groupedPlans).map(([categoryTitle, plansList]) => (
            <div key={categoryTitle} className="space-y-3">
              
              <div className="flex items-center gap-2.5 px-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                  {categoryTitle}
                </h3>
                <span className="text-[10px] bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-md font-mono border border-white/[0.05]">
                  {plansList.length} {plansList.length === 1 ? 'opção' : 'opções'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {plansList.map((plan) => {
                  const isVariable = plan.valueVariable;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => onSelect(plan)}
                      className="
                        group relative overflow-hidden
                        w-full rounded-2xl
                        border border-white/[0.08] bg-[#161A1F]
                        py-4 px-6 text-left
                        hover:border-cyan-500/60 hover:bg-[#1C2128]
                        transition-all duration-200
                        shadow-lg flex items-center justify-between
                        cursor-pointer
                      "
                    >
                      <div className="flex items-center gap-5 pr-4 flex-1">
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors tracking-wide leading-snug">
                            {plan.name}
                          </h4>
                          {isVariable && (
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                              <span className="text-gray-300 font-mono">
                                {plan.valueVariableMin && plan.valueVariableMax
                                  ? `De ${plan.valueVariableMin.toLocaleString("pt-PT")} Kz até ${plan.valueVariableMax.toLocaleString("pt-PT")} Kz`
                                  : "Montante flexível configurável"
                                }
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-4">
                        {isVariable ? (
                          <span className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-black uppercase font-mono tracking-wider bg-red-600 text-white shadow-md active:scale-95 transition-transform">
                            Variável
                          </span>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 uppercase font-mono">Preço</span>
                            <span className="text-base sm:text-lg font-black font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors">
                              {typeof plan.price === 'number' ? `${plan.price.toLocaleString("pt-PT")} Kz` : "Ativo"}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#161A1F] rounded-2xl border border-white/[0.06]">
            <p className="text-xs text-gray-400 font-mono">Nenhum plano disponível para este operador no momento.</p>
          </div>
        )}
      </div>

    </div>
  );
}