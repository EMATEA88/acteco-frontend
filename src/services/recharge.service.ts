import { api } from './api'

export class RechargeService {
  // Cria uma intenção de depósito (Bancário ou USDT)
  static async create(amount: number, description?: string) {
    const { data } = await api.post('/recharges', { 
      amount, 
      description 
    })
    return data
  }

  static async uploadProof(formData: FormData) {
    const { data } = await api.post('/recharges/upload-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  /**
   * 🟢 CORREÇÃO DO ERRO 404 (Endereço Indisponível)
   * Em vez de chamar uma rota que não existe no backend, 
   * usamos a variável de ambiente definida no Render.
   */
  static async getCompanyWallet() {
    try {
      // Tenta buscar da API primeiro (caso você a crie no futuro)
      const { data } = await api.get('/recharges/company-wallet')
      return data 
    } catch (error) {
      // Se der 404, retorna o endereço configurado no ambiente
      const fallbackAddress = import.meta.env.VITE_TRON_PUBLIC_ADDRESS;
      return { address: fallbackAddress || "Endereço não configurado" }
    }
  }

  /**
   * 🟢 CORREÇÃO CRÍTICA DO ERRO 404
   * Garante que o frontend use a rota correta: '/recharges/my'.
   */
  static async myHistory() {
    const { data } = await api.get('/recharges/my')
    return { data } 
  }

  static async listAll() {
    const { data } = await api.get('/recharges')
    return data
  }

  static async approve(id: number) {
    const { data } = await api.post(`/recharges/${id}/approve`)
    return data
  }

  static async reject(id: number) {
    const { data } = await api.post(`/recharges/${id}/reject`)
    return data
  }
}