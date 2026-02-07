// src/services/task.service.ts
import { api } from './api'

export const TaskService = {
  execute: () => api.post('/tasks/execute'),
}
