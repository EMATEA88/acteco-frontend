export interface Partner {
  id: number;
  name: string;
  isActive?: boolean;
  isSandbox?: boolean;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  commission?: number;
  providerCode?: string;
  partnerId: number;
  category: string;
  isActive: boolean;
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
  type: string;
  serviceId?: number;
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
  sellerId?: number;
  sellerRole?: string;
  transactionId?: number;
  externalProviderRef?: string;
}

export interface ServicePaymentPayload {
  planId: number;
  customerReference: string;
  customerName?: string;
}

export interface AKIProduct {
  id: number;
  partnerId: number;
  serviceId?: number;
  serviceGroupId: number;
  name: string;
  price: number;
  externalId?: string;
  providerCode?: string;
  providerCommission?: number;
  isActive: boolean;
  Service?: Service;
  serviceGroup?: ServiceGroup;
}