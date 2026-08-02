import { useEffect, useState } from "react";

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
      // Recolhe todos os planos de todos os grupos do provedor para evitar subpastas
      const allPlans = provider.groups.flatMap(g => g.plans || []);
      
      const unifiedGroup: CatalogGroup = {
        id: provider.id,
        name: provider.name,
        slug: provider.code ? provider.code.toLowerCase() : String(provider.id),
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
      <div className="text-center py-20 text-gray-400">
        Carregando catálogo...
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