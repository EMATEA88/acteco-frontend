import { api } from "./api";

export interface ServicePaymentPayload {
  planId: number;
  customerReference: string;
  customerName?: string;
}

export interface ServiceRequest {
  id: number;
  userId: number;

  planId: number;

  serviceName?: string;
  serviceGroupName?: string;
  planName?: string;

  amount: number;

  status: string;

  customerReference?: string;
  customerName?: string;

  createdAt: string;
}

export const serviceRequestService = {
  async pay(
    payload: ServicePaymentPayload
  ) {
    const { data } = await api.post(
      "/services/pay",
      payload
    );

    return data;
  },

  async myRequests() {
    const { data } = await api.get(
      "/services/my-requests"
    );

    return data as ServiceRequest[];
  },
};