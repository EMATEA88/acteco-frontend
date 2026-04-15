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
  minSeconds?: number // Adicionado: para o timer saber quanto tempo esperar
  instructions?: string // Adicionado: para mostrar o passo a passo
}

// =============================
// GET TASKS (MANTIDO)
// =============================
export async function getTasks(): Promise<Task[]> {
  try {
    const { data } = await api.get('/tasks')
    return data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error || 'Erro ao buscar tasks'
    )
  }
}

// =============================
// START TASK (NOVO GATILHO)
// =============================
// Esta função deve ser chamada assim que o usuário clicar no botão "Fazer"
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
// COMPLETE TASK (ATUALIZADO)
// =============================
export async function completeTask(
  taskId: number,
  proof: string,
  fingerprint: string // Agora o fingerprint é obrigatório aqui também
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