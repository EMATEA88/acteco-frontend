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
    // O terminal confirmou que esta rota funciona, mas precisamos garantir que o 
    // Axios retorne a resposta corretamente para o componente parar de mostrar "Erro"
    const { data } = await api.post('/recharges/upload-proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  // Busca o endereço da carteira Tron
  static async getCompanyWallet() {
    const { data } = await api.get('/recharges/company-wallet')
    return data 
  }

  /**
   * 🟢 CORREÇÃO CRÍTICA DO ERRO 404
   * Suas imagens mostram o navegador tentando acessar '/wallet/history' (que não existe).
   * Esta função garante que o frontend use a rota correta: '/recharges/my'.
   */
  static async myHistory() {
    const { data } = await api.get('/recharges/my')
    
    // Ajuste no formato de retorno: o componente RechargeHistory espera res.data.data ou res.data
    // Se o backend retorna o array direto, enviamos assim:
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