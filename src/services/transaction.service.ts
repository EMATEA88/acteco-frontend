import { api } from "./api";

/* ================= TYPES ================= */

export interface Transaction {
  id: number;

  type: string;

  amount: number;

  currency: string;

  method?: string | null;

  status: string;

  description?: string | null;

  reference?: string | null;

  relatedPublicId?: string | null;

  createdAt: string;

  processedAt?: string | null;
}

/* ================= SERVICE REQUEST ================= */

export interface TransactionServiceRequest {
  id: number;

  planId: number;

  serviceId?: number | null;

  serviceGroupId?: number | null;

  providerId?: number | null;

  providerName?: string | null;

  amount: number;

  cost?: number | null;

  profit?: number | null;

  customerReference?: string | null;

  customerName?: string | null;

  partnerName?: string | null;

  partnerId?: number | null;

  serviceName?: string | null;

  serviceGroupName?: string | null;

  planName?: string | null;

  status: string;

  transactionId?: number | null;

  externalProviderRef?: string | null;

  externalTransactionId?: string | null;

  providerResponse?: Record<string, any> | string | null;

  completedAt?: string | null;

  providerFinalBalance?: number | null;

  providerConfirmedAt?: string | null;

  providerReconciledAt?: string | null;

  providerOperationStatus?: string | null;

  providerOperationCode?: number | null;

  createdAt: string;

  updatedAt: string;
}

/* ================= DETAILS ================= */

export interface TransactionDetails
  extends Transaction {

  externalId?: string | null;

  gatewayProvider?: string | null;

  gatewayStatus?: string | null;

  merchantTransactionId?: string | null;

  providerOrderSn?: string | null;

  metadata?: Record<string, any> | null;

  serviceRequest?: TransactionServiceRequest | null;
}

/* ================= FILTER ================= */

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
        await api.get<Transaction[]>(
          "/transactions"
        );

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
        await api.get<Transaction[]>(
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
        await api.get<Transaction[]>(
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

  /* ================= DETAILS ================= */

  async details(
  id: number
): Promise<TransactionDetails> {

  try {

    const { data } =
      await api.get<TransactionDetails>(
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