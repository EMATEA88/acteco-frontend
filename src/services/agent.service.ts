import { api } from "./api";

/* =====================================================
   TYPES
===================================================== */

export interface PremiumStats {
  overview: {
    totalVolume: number;
    totalCommission: number;
    activeAgentsCount: number;
  };
  timeline: any[];
  teamPerformance: any[];
}


export interface AgentDashboard {
  profile: {
    currentBalance: number;
    totalSales: number;
    totalCommission: number;
    commissionBalance: number;
  };

  team: {
    total: number;
    active: number;
    inactive: number;
  };

  commissions: {
    pending: number;
    available: number;
  };

  sales: {
    today: number;
    month: number;
  };

  recentSales: any[];

  recentCommissions: any[];
}

export interface AgentStatistics {
  totalSales: number;
  totalSubAgents: number;
  activeSubAgents: number;
  inactiveSubAgents: number;
  totalCommission: number;
  commissionBalance: number;
}

export interface SubAgent {

  id: number;

  userId: number;

  employeeCode: string;

  workstation?: string;

  position?: string;

  department?: string;

  address?: string;

  hiredAt?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  user: {

    id: number;

    fullName: string;

    phone: string;

    email?: string;

    publicId: string;

    balance: number;

    isBlocked: boolean;

    createdAt: string;

  };

}

export interface CreateSubAgentDTO {

  fullName: string;

  phone: string;

  email?: string;

  password: string;

  workstation?: string;

  position?: string;

  department?: string;

  address?: string;

}

export interface UpdateSubAgentDTO {

  fullName?: string;

  phone?: string;

  email?: string;

  workstation?: string;

  position?: string;

  department?: string;

  address?: string;

}

export interface CommissionSummary {

  availableCommission: number;

  totalCommission: number;

  totalSales: number;

  pending: {

    amount: number;

    count: number;

  };

  paid: {

    amount: number;

    count: number;

  };

  cancelled: {

    amount: number;

    count: number;

  };

}


/* =====================================================
   SERVICE
===================================================== */

export const AgentService = {

  /* ================= DASHBOARD ================= */

  async dashboard(): Promise<AgentDashboard> {

    const { data } =
      await api.get("/api/agent/dashboard");

    return data;

  },

  /* ================= STATISTICS ================= */

  async statistics(): Promise<AgentStatistics> {

    const { data } =
      await api.get("/api/agent/statistics");

    return data;

  },

  /* ================= LIST SUB AGENTS ================= */

  async listSubAgents(): Promise<SubAgent[]> {

    const { data } =
      await api.get("/api/agent/sub-agents");

    return data;

  },

  /* ================= DETAILS ================= */

  async getSubAgent(
    id: number
  ): Promise<SubAgent> {

    const { data } =
      await api.get(
        `/api/agent/sub-agents/${id}`
      );

    return data;

  },

  /* ================= CREATE ================= */

  async createSubAgent(
    payload: CreateSubAgentDTO
  ) {

    const { data } =
      await api.post(
        "/api/agent/sub-agents",
        payload
      );

    return data;

  },

  /* ================= UPDATE ================= */

  async updateSubAgent(

    id: number,

    payload: UpdateSubAgentDTO

  ) {

    const { data } =
      await api.put(

        `/api/agent/sub-agents/${id}`,

        payload

      );

    return data;

  },

  /* ================= BLOCK ================= */

  async blockSubAgent(
    id: number
  ) {

    const { data } =
      await api.patch(

        `/api/agent/sub-agents/${id}/block`

      );

    return data;

  },

  /* ================= UNBLOCK ================= */

  async unblockSubAgent(
    id: number
  ) {

    const { data } =
      await api.patch(

        `/api/agent/sub-agents/${id}/unblock`

      );

    return data;

  },

  /* ================= BALANCE ================= */

  async getSubAgentBalance(
    id: number
  ) {

    const { data } =
      await api.get(

        `/api/agent/sub-agents/${id}/balance`

      );

    return data;

  },

  /* ================= HISTORY ================= */

  async getSubAgentHistory(
    id: number
  ) {

    const { data } =
      await api.get(

        `/api/agent/sub-agents/${id}/history`

      );

    return data;

  },

  /* ================= TEAM SALES ================= */

  async getTeamSales() {

    const { data } =
      await api.get(

        "/api/agent/team-sales"

      );

    return data;

  },

  /* ================= COMMISSIONS ================= */

  async getCommissionSummary(): Promise<CommissionSummary> {

    const { data } =
      await api.get(

        "/api/agent/commissions/summary"

      );

    return data;

  },

  async getCommissionHistory(

    page = 1,

    limit = 20

  ) {

    const { data } =
      await api.get(

        "/api/agent/commissions/history",

        {

          params: {

            page,

            limit

          }

        }

      );

    return data;

  },

  async getPendingCommissions() {

    const { data } =
      await api.get(

        "/api/agent/commissions/pending"

      );

    return data;

  },

  async getPaidCommissions() {

    const { data } =
      await api.get(

        "/api/agent/commissions/paid"

      );

    return data;

  },

  async getLatestCommissions() {

    const { data } =
      await api.get(

        "/api/agent/commissions/latest"

      );

    return data;

  },

  async getPremiumStatistics() {

  const { data } =
    await api.get(
      "/api/agent/statistics/premium"
    )

  return data

}
}