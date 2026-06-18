import { api } from "./api";

/* ================= TYPES ================= */

export interface Transaction {
  id: number;

  type: string;

  amount: number;

  currency: string;

  method?: string;

  status: string;

  description?: string;

  reference?: string;

  relatedPublicId?: string;

  createdAt: string;

  processedAt?: string;
}

export interface TransactionFilter {
  type?: string;

  page?: number;

  limit?: number;
}

/* ================= SERVICE ================= */

export const TransactionService = {

  /* ================= LIST ================= */

  async list(): Promise<Transaction[]> {

    try {

      const { data } =
        await api.get("/transactions");

      return data;

    } catch (err: any) {

      throw new Error(
        err?.response?.data?.error ||
        "Erro ao carregar transações"
      );
    }
  },

  /* ================= FILTER ================= */

  async listFiltered(
    params?: TransactionFilter
  ): Promise<Transaction[]> {

    try {

      const { data } =
        await api.get(
          "/transactions",
          {
            params
          }
        );

      return data;

    } catch (err: any) {

      throw new Error(
        err?.response?.data?.error ||
        "Erro ao filtrar transações"
      );
    }
  },

  /* ================= PAGINATION ================= */

  async paginate(
    page = 1,
    limit = 20
  ): Promise<Transaction[]> {

    try {

      const { data } =
        await api.get(
          "/transactions",
          {
            params: {
              page,
              limit
            }
          }
        );

      return data;

    } catch (err: any) {

      throw new Error(
        err?.response?.data?.error ||
        "Erro ao carregar transações"
      );
    }
  }

};