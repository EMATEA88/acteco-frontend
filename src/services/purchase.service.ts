import { api } from "./api";

import type {
  CatalogResponse
} from "../types/catalog";

import type {
  PurchaseRequest,
  PurchaseResponse
} from "../types/purchase";

export const purchaseService = {

  async getCatalog(): Promise<CatalogResponse> {

    const { data } =
      await api.get<CatalogResponse>(
        "/services/catalog"
      );

    return data;

  },

  async purchase(
    payload: PurchaseRequest
  ): Promise<PurchaseResponse> {

    const { data } =
      await api.post<PurchaseResponse>(
        "/purchase",
        payload
      );

    return data;

  }

};