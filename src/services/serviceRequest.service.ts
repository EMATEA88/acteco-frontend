
import { api } from "./api";

export interface ServicePaymentPayload {
  planId: number;
  customerReference: string;
  customerName?: string;
}

export type ServiceRequestStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | "PROVIDER_TIMEOUT";

export interface ServiceRequest {
  id: number;
  userId: number;
  sellerId?: number | null;
  sellerRole?: string | null;

  planId: number;
  serviceId?: number | null;
  serviceGroupId?: number | null;
  providerId?: number | null;

  serviceName?: string | null;
  serviceGroupName?: string | null;
  planName?: string | null;

  amount: number;
  cost?: number;
  profit?: number;

  status: ServiceRequestStatus;

  customerReference?: string | null;
  customerName?: string | null;

  transactionId?: number | null;
  externalTransactionId?: string | null;
  externalProviderRef?: string | null;

  lastProviderStatus?: string | null;
  lastProviderCode?: string | number | null;
  lastProviderMessage?: string | null;

  createdAt: string;
  updatedAt?: string;
  completedAt?: string | null;
}

export const serviceRequestService = {
  async pay(payload: ServicePaymentPayload) {
    const { data } = await api.post("/services/pay", payload);
    return data;
  },

  async myRequests(): Promise<ServiceRequest[]> {
    const { data } = await api.get("/services/my-requests");
    return data as ServiceRequest[];
  },

  async getStatusLabel(id: number): Promise<ServiceRequest> {
    const { data } = await api.get(`/services/requests/${id}`);
    return data as ServiceRequest;
  },
};
