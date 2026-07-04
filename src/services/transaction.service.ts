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

// 1. Interface adicionada logo abaixo de Transaction
export interface TransactionDetails extends Transaction {
  externalId?: string;

  gatewayProvider?: string;

  gatewayStatus?: string;

  merchantTransactionId?: string;

  metadata?: any;
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
  },

  // 2. Método adicionado no final do objeto TransactionService
  /* ================= DETAILS ================= */

  async details(
    id: number
  ): Promise<TransactionDetails> {

    try {

      const { data } =
        await api.get(
          `/transactions/${id}`
        );

      return data;

    } catch (err: any) {

      throw new Error(
        err?.response?.data?.error ||
        "Erro ao carregar detalhes da transação"
      );
    }
  }

};