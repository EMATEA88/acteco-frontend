import { api } from "./api";

export interface DashboardStats {
  balance: number;
  totalSpent: number;
  totalRequests: number;
  mostUsedService: string;
}

export const dashboardService = {

  async getStats(): Promise<DashboardStats> {

    const { data } = await api.get(
      "/dashboard/stats"
    );

    return data;
  }

};