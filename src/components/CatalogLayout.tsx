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

        setSelectedGroup({
            id: provider.id,
            name: provider.name,
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
      setCatalog(response.data);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ??
        "Erro ao carregar catálogo."
      );
    } finally {
      setLoading(false);
    }
  }

  // Ao selecionar um provedor, juntamos todos os planos de todos os seus grupos num único grupo virtual
  const handleSelectProvider = (provider: CatalogProvider) => {
    setSelectedProvider(provider);

    if (provider.groups && provider.groups.length > 0) {
      const allPlans = provider.groups.flatMap(g => g.plans || []);
      
      const unifiedGroup: CatalogGroup = {
        id: provider.id,
        name: provider.name,
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
      <div className="p-5 space-y-6 animate-pulse">
        {/* Skeleton para Categorias / Grid estilo Binance */}
        {[1, 2, 3].map((sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            {/* Título Skeleton */}
            <div className="w-32 h-3.5 bg-[#1E2329] rounded-md"></div>

            {/* Grelha de Provedores Skeleton */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((itemIndex) => (
                <div key={itemIndex} className="flex flex-col items-center space-y-2">
                  {/* Círculo do Logo Skeleton */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1E2329] border border-[#2B313A]"></div>
                  {/* Texto do Nome Skeleton */}
                  <div className="w-12 h-2.5 bg-[#1E2329] rounded-sm"></div>
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
      <div className="text-center py-20 text-red-500">
        {error}
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