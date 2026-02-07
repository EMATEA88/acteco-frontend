import { api } from './api'

export const NotificationService = {
  async list(params?: { limit?: number; offset?: number }) {
    try {
      const res = await api.get('/notifications', { params })

      return {
        items: res.data?.items ?? [],
        unread: res.data?.unread ?? 0,
      }
    } catch {
      return {
        items: [],
        unread: 0,
      }
    }
  },

  async markAsRead(id: number) {
    try {
      await api.patch(`/notifications/${id}/read`)
    } catch {}
  },

  async markAllAsRead() {
    try {
      await api.patch('/notifications/read-all')
    } catch {}
  },
}
