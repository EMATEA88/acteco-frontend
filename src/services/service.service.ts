import { api } from "./api";

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface ServiceOperator {
  id: number;
  name: string;
  providerCode: string;
  category: string;
  description?: string;
}

export interface ServiceItem {
  id: number;
  name: string;
  providerCode?: string;
}

export interface ServicePlan {
  id: number;
  name: string;
  price: number;
  externalId?: string;
  providerCode?: string;

  variableValue: boolean;
  minValue?: number;
  maxValue?: number;

  taxPercent?: number;
  notificationType?: string;
}

export interface PurchasePayload {
  planId: number;
  customerReference: string;
  customerName?: string;
}

class ServiceService {

  // ==========================================
  // CATEGORIAS
  // ==========================================

  async listCategories(): Promise<ServiceCategory[]> {

    const { data } =
      await api.get("/services/categories");

    return data;

  }

  // ==========================================
  // OPERADORES
  // ==========================================

  async listOperators(
    category: string
  ): Promise<ServiceOperator[]> {

    const { data } =
      await api.get(
        `/services/categories/${category}/operators`
      );

    return data;

  }

  // ==========================================
  // SERVIÇOS
  // ==========================================

  async listServices(
    operatorId: number
  ): Promise<ServiceItem[]> {

    const { data } =
      await api.get(
        `/services/operators/${operatorId}/services`
      );

    return data;

  }

  // ==========================================
  // PLANOS
  // ==========================================

  async listPlans(
    serviceId: number
  ): Promise<ServicePlan[]> {

    const { data } =
      await api.get(
        `/services/services/${serviceId}/plans`
      );

    return data;

  }

  // ==========================================
  // DETALHE DO PLANO
  // ==========================================

  async getPlan(
    planId: number
  ): Promise<ServicePlan> {

    const { data } =
      await api.get(
        `/services/plans/${planId}`
      );

    return data;

  }

  // ==========================================
  // COMPRAR
  // ==========================================

  async buy(
    payload: PurchasePayload
  ) {

    const { data } =
      await api.post(
        "/services/pay",
        payload
      );

    return data;

  }

  // ==========================================
  // HISTÓRICO
  // ==========================================

  async myRequests() {

    const { data } =
      await api.get(
        "/services/my-requests"
      );

    return data;

  }

}

export const serviceService =
  new ServiceService();

export default serviceService;