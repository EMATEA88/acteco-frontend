import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type {
  CatalogCategory,
  CatalogProvider,
  CatalogGroup,
  CatalogPlan
} from "../types/catalog";

import { purchaseService } from "../services/purchase.service";

import CategoryGrid from "./CategoryGrid";
import ProviderGrid from "./ProviderGrid";
import PlanGrid from "./PlanGrid";
import PurchaseModal from "./PurchaseModal";

// Mapa global com os nomes completos oficiais para todas as casas de apostas e provedores
const providerFullNameMap: Record<string, string> = {
  PBET: "Premier Bet",
  PREMIERBET: "Premier Bet",
  BBET: "Bantu Bet",
  BANTUBET: "Bantu Bet",
  EBET: "Elephant Bet",
  ELEPHANTBET: "Elephant Bet",
  ABET: "Afri Bet",
  AFRIBET: "Afri Bet",
  MOBET: "Mobet",
  MELBET: "Melbet",
  MGMBET: "Melbet",
  KWANZABET: "Kwanza Bet",
  "888BETS": "888Bets",
  "888BET": "888Bets",
  "888": "888Bets",
};

export const getDisplayProviderName = (codeOrName: string) => {
  const upper = (codeOrName || "").toUpperCase().trim();
  return providerFullNameMap[upper] || codeOrName;
};

export default function CatalogLayout() {
  const { providerCode } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CatalogProvider | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CatalogGroup | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CatalogPlan | null>(null);

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (!providerCode || catalog.length === 0) {
        return;
    }

    for (const category of catalog) {
        const provider = category.providers.find(
            p => p.code?.toLowerCase() === providerCode.toLowerCase()
        );

        if (!provider) {
            continue;
        }

        setSelectedCategory(category);

        const allPlans = provider.groups.flatMap(
            group => group.plans
        );

        setSelectedProvider(provider);

        // Substitui pelo nome completo se existir no mapa
        const fullName = getDisplayProviderName(provider.code || provider.name);

        setSelectedGroup({
            id: provider.id,
            name: fullName,
            slug: provider.code?.toLowerCase() || '',
            providerCode: provider.code || '',
            plans: allPlans
        });

        break;
    }
  }, [catalog, providerCode]);

  async function loadCatalog() {
    try {
      setLoading(true);
      setError("");

      const response = await purchaseService.getCatalog();
      
      // Mapeia os dados da API para injetar os nomes completos logo na origem do catálogo
      const formattedData = (response.data || []).map((category: CatalogCategory) => ({
        ...category,
        providers: (category.providers || []).map((provider: CatalogProvider) => ({
          ...provider,
          name: getDisplayProviderName(provider.code || provider.name)
        }))
      }));

      setCatalog(formattedData);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
        "Erro ao carregar catálogo."
      );
    } finally {
      setLoading(false);
    }
  }

  // Ao selecionar um provedor, juntamos todos os planos e aplicamos o nome completo amigável
  const handleSelectProvider = (provider: CatalogProvider) => {
    setSelectedProvider(provider);

    if (provider.groups && provider.groups.length > 0) {
      const allPlans = provider.groups.flatMap(g => g.plans || []);
      const fullName = getDisplayProviderName(provider.code || provider.name);
      
      const unifiedGroup: CatalogGroup = {
        id: provider.id,
        name: fullName,
        slug: provider.code?.toLowerCase() || String(provider.id),
        providerCode: provider.code || '',
        plans: allPlans
      };

      setSelectedGroup(unifiedGroup);
    } else {
      setSelectedGroup(null);
    }
  };

  if (loading) {
    return (
      <div className="p-5 space-y-6 animate-pulse min-h-screen bg-[#0a2533]">
        {/* Skeleton para Categorias / Grid */}
        {[1, 2, 3].map((sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            {/* Título Skeleton */}
            <div className="w-32 h-3.5 bg-[#0e364a] rounded-md border border-cyan-500/10"></div>

            {/* Grelha de Provedores Skeleton */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((itemIndex) => (
                <div key={itemIndex} className="flex flex-col items-center space-y-2">
                  {/* Círculo do Logo Skeleton */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0e364a] border border-cyan-500/20 shadow-md"></div>
                  {/* Texto do Nome Skeleton */}
                  <div className="w-12 h-2.5 bg-[#0e364a] rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a2533] flex items-center justify-center p-5">
        <div className="text-center py-10 px-6 bg-[#0e364a] border border-red-500/30 rounded-2xl text-xs text-red-400 font-medium shadow-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <CategoryGrid
        categories={catalog}
        onSelect={setSelectedCategory}
      />
    );
  }

  if (!selectedProvider) {
    return (
      <ProviderGrid
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onSelect={handleSelectProvider}
      />
    );
  }

  if (!selectedPlan) {
    return (
      <PlanGrid
        group={selectedGroup!}
        onBack={() => {
          setSelectedProvider(null);
          setSelectedGroup(null);
        }}
        onSelect={setSelectedPlan}
      />
    );
  }

  return (
    <PurchaseModal
      plan={selectedPlan}
      onClose={() => setSelectedPlan(null)}
    />
  );
}