import { api } from "../services/api";

export const ServiceService = {

  async listServices() {
    const { data } = await api.get("/services");
    return data;
  },

  async listGroups(serviceId: number) {
    const { data } = await api.get(
      `/services/${serviceId}/groups`
    );

    return data;
  },

  async listPlans(groupId: number) {
    const { data } = await api.get(
      `/services/groups/${groupId}/plans`
    );

    return data;
  },

  async getPlan(
  planId: number
) {
  const { data } = await api.get(
    `/services/plans/${planId}`
  )

  return data
},

  async buy(planId: number) {
    const { data } = await api.post(
      "/services/pay",
      { planId }
    );

    return data;
  },

  async myRequests() {
    const { data } = await api.get(
      "/services/my-requests"
    );

    return data;
  }

};