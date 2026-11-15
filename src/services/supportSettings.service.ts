
import { api } from "./api";

export interface SupportSettings {
  whatsappNumber: string;
  whatsappGroupUrl: string;
  updatedAt: string;
}

export interface SupportSettingsResponse {
  success: boolean;
  settings: SupportSettings;
}

export const supportSettingsService = {
  async getSettings(): Promise<SupportSettingsResponse> {
    const response = await api.get("/support-settings");

    return response.data;
  },
};
