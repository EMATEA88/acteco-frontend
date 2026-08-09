import { api } from "./api";

import type {
  CatalogResponse,
} from "../types/catalog";

import type {
  PurchaseRequest,
  PurchaseResponse,
} from "../types/purchase";

export interface CustomerInfoRequest {
  providerCode: string;
  customerId: string;
}

export interface CustomerInfoQueryRequest {
  orderId: string;
  providerCode: string;
  customerId: string;
}

export interface CustomerInfoData {
  Transaction_ID?: string | number | null;

  Provider_Code?: string | null;

  Provider_ClientInfo?:
    | string
    | Record<string, any>
    | null;

  Status?: string | null;

  Response?: {
    Code?: number | null;
    Description?: string | null;
    Runtime?: string | null;
  } | null;
}

export interface CustomerInfoResponse {
  success: boolean;

  status: string | null;

  orderId: string;

  transactionId?: string | number | null;

  providerCode?: string | null;

  client?:
    | Record<string, any>
    | string
    | null;

  response?: {
    Code?: number | null;
    Description?: string | null;
    Runtime?: string | null;
  } | null;

  data?: CustomerInfoData | null;
}

export const purchaseService = {

  /**
   * =====================================================
   * CATÁLOGO
   * =====================================================
   *
   * Frontend
   *    ↓
   * /services/catalog
   *    ↓
   * Backend
   */

  async getCatalog(): Promise<CatalogResponse> {

    const { data } =
      await api.get<CatalogResponse>(
        "/services/catalog"
      );

    return data;
  },

  /**
   * =====================================================
   * CONSULTA DE CLIENTE
   * =====================================================
   *
   * Frontend
   *    ↓
   * /aki/customer-info
   *    ↓
   * AKI
   *    ↓
   * Dados do cliente
   */

  async customerInfo(
    payload: CustomerInfoRequest
  ): Promise<CustomerInfoResponse> {

    const { data } =
      await api.post<CustomerInfoResponse>(
        "/aki/customer-info",
        payload
      );

    return data;
  },

  /**
   * =====================================================
   * CONSULTA DE OPERAÇÃO
   * =====================================================
   *
   * Utilizado quando a consulta AKI
   * retorna uma operação em execução.
   */

  async customerInfoQuery(
    payload: CustomerInfoQueryRequest
  ): Promise<CustomerInfoResponse> {

    const { data } =
      await api.post<CustomerInfoResponse>(
        "/aki/customer-info/query",
        payload
      );

    return data;
  },

  /**
   * =====================================================
   * COMPRA AKI
   * =====================================================
   *
   * Frontend
   *    ↓
   * /aki/purchase
   *    ↓
   * Backend EMATEA
   *    ↓
   * AKI
   */

  async purchase(
    payload: PurchaseRequest
  ): Promise<PurchaseResponse> {

    const { data } =
      await api.post<PurchaseResponse>(
        "/aki/purchase",
        payload
      );

    return data;
  },

};