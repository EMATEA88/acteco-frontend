export interface PurchaseRequest {
  planId: number;
  customerReference: string;
  customerName?: string;
  customerNotification: string;
  amount: number;
}

export interface AKIPurchaseResponse {
  Reference?: string;
  Order_ID?: string;
  ResultCode?: number;
  ResultMessage?: string;

  [key: string]: any;
}

export interface PurchaseResponse {
  success: boolean;

  walletType: "USER" | "COMPANY" | "AKI";

  walletOwnerId: number | null;

  serviceRequestId: number;

  akiResponse: AKIPurchaseResponse;
}