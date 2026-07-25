import { api } from './api';

export const akiService = {
  async getProducts() {
    const response = await api.get('/aki/products');
    return response.data;
  },

  async makePurchase(data: {
    userId: number;
    productCode: string;
    destination: string;
    value: number;
    merchantTransactionId: string;
  }) {
    // CORRIGIDO AQUI: Deve apontar para '/aki/purchase' para corresponder ao backend
    const response = await api.post('/aki/purchase', data);
    return response.data;
  }
};