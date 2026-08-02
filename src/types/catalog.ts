export interface CatalogPlan {

  id: number;

  name: string;

  slug: string;

  price: number;

  cost: number;

  externalId: string | null;

  providerCode: string | null;

  providerDescription: string | null;

  providerCommission: number;

  valueVariable: boolean;

  valueVariableMin: number | null;

  valueVariableMax: number | null;

  notificationType: string | null;

  type: string;

}

export interface CatalogGroup {

  id: number;

  name: string;

  slug: string;

  providerCode: string | null;

  plans: CatalogPlan[];

}

export interface CatalogProvider {

  id: number;

  name: string;

  slug: string;

  code: string | null;

  groups: CatalogGroup[];

}

export interface CatalogCategory {

  id: number;

  name: string;

  slug: string;

  category: string | null;

  providers: CatalogProvider[];

}

export interface CatalogResponse {

  success: boolean;

  data: CatalogCategory[];

}