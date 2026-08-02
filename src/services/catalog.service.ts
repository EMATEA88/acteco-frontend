import { api } from "./api";

export const catalogService = {
  async getCatalog() {
    const { data } = await api.get("/services/catalog");
    return data;
  },
};