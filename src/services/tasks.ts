import { api } from './api'

// =============================
// TYPES
// =============================
export interface Task {
  id: number
  title: string
  description: string
  reward: number
  type: string
  url?: string

  minSeconds?: number
  instructions?: string

  // 🔥 NOVO (PROGRESSO)
  totalLimit?: number
  completed?: number
}

// =============================
// GET TASKS
// =============================
export async function getTasks(): Promise<Task[]> {
  try {
    const { data } = await api.get('/tasks')

    // 🔥 NORMALIZAÇÃO (EVITA BUG UI)
    return data.map((task: Task) => ({
      ...task,
      totalLimit: task.totalLimit ?? 0,
      completed: task.completed ?? 0
    }))

  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Erro ao buscar tasks'
    )
  }
}

// =============================
// START TASK
// =============================
export async function startTask(taskId: number, fingerprint: string) {
  try {
    const { data } = await api.post(`/tasks/start/${taskId}`, {
      fingerprint
    })
    return data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Erro ao iniciar tarefa'
    )
  }
}

// =============================
// COMPLETE TASK
// =============================
export async function completeTask(
  taskId: number,
  proof: string,
  fingerprint: string
) {
  try {
    const { data } = await api.post(`/tasks/complete/${taskId}`, {
      proof,
      fingerprint
    })
    return data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Erro ao completar task'
    )
  }
}