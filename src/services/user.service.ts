import { api } from './api'

export const UserService = {
  me: () => api.get('/users/me'),
}
