export type ServiceStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'

/* ========================
   PARTNER
======================== */

export interface Partner {
  id: number
  name: string
}

/* ========================
   SERVICE PLAN
======================== */

export interface ServicePlan {
  id: number
  name: string
  price: number
}

/* ========================
   SERVICE REQUEST
======================== */

export interface ServiceRequest {
  id: number
  amount: number
  status: ServiceStatus
  createdAt: string

  plan: {
    id: number
    name: string
    partner: {
      id: number
      name: string
    }
  }
}
