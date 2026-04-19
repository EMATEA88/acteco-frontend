import { api } from './api' // Certifique-se de que este é o caminho para sua instância do Axios

export interface TransferResponse {
  message: string
  amount: number
  recipient: string
}

export const TransferService = {
  /**
   * Realiza uma transferência interna de fundos entre usuários da plataforma.
   * @param recipientPublicId ID público do destinatário (exibido no perfil).
   * @param amount Valor da transferência em Kz.
   */
  internal: async (recipientPublicId: string, amount: number): Promise<TransferResponse> => {
    const res = await api.post('/transfer/internal', {
      recipientPublicId,
      amount
    })
    
    return res.data
  }
}