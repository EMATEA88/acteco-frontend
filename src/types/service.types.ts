export interface Partner {
  id: number;
  name: string;
}

export interface Service {
  id: number;

  name: string;

  description?: string;

  commission?: number;

  providerCode?: string;

  partnerId: number;
}

export interface ServiceGroup {
  id: number;

  serviceId: number;

  name: string;

  providerCode?: string;

  externalId?: string;

  isActive: boolean;
}

export interface ServicePlan {
  id: number;

  partnerId: number;

  serviceGroupId: number;

  name: string;

  price: number;

  externalId?: string;

  providerCode?: string;

  providerCommission?: number;

  isActive: boolean;
}

export interface ServiceRequest {
  id: number;

  userId: number;

  planId: number;

  serviceId?: number;

  serviceGroupId?: number;

  amount: number;

  cost?: number;

  profit?: number;

  customerReference?: string;

  customerName?: string;

  partnerName?: string;

  serviceName?: string;

  serviceGroupName?: string;

  planName?: string;

  status: string;

  createdAt: string;

  completedAt?: string;
}

export interface ServicePaymentPayload {
  planId: number;

  customerReference: string;

  customerName?: string;
}